package com.hamzapaulpro.jobtracker.ai.openai;

import com.hamzapaulpro.jobtracker.ai.AiClient;
import com.hamzapaulpro.jobtracker.ai.dto.AiProvider;
import com.hamzapaulpro.jobtracker.ai.dto.AiMessage;
import com.hamzapaulpro.jobtracker.ai.exception.AiGenerationException;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;

import java.util.List;

@Component
public class OpenAiClient implements AiClient {

    private final RestClient restClient;
    private final OpenAiProperties properties;

    public OpenAiClient(@Qualifier("openAiRestClient") RestClient restClient,
                        OpenAiProperties properties) {
        this.restClient = restClient;
        this.properties = properties;
    }

    @Override
    public AiProvider provider() {
        return AiProvider.OPENAI;
    }

    @Override
    public String generate(List<AiMessage> messages, String apiKey) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new AiGenerationException(
                    "Please provide your OpenAI API key."
            );
        }

        if (properties.model() == null || properties.model().isBlank()) {
            throw new AiGenerationException(
                    "The OpenAI model has not been configured."
            );
        }

        OpenAiRequest request = new OpenAiRequest(
                properties.model().trim(),
                messages,
                false
        );

        OpenAiResponse response;

        try {
            response = restClient.post()
                    .uri("/responses")
                    .contentType(MediaType.APPLICATION_JSON)
                    .headers(headers ->
                            headers.setBearerAuth(apiKey.trim())
                    )
                    .body(request)
                    .retrieve()
                    .body(OpenAiResponse.class);
        } catch (RestClientResponseException exception) {
            String message = switch (exception.getStatusCode().value()) {
                case 401 ->
                        "OpenAI rejected your API key. Please check it and try again.";
                case 403 ->
                        "Your OpenAI project does not have permission for this request.";
                case 429 ->
                        "OpenAI reported a rate or quota limit. Check your API usage "
                                + "and billing before trying again.";
                default ->
                        "OpenAI generation failed. Please try again.";
            };

            throw new AiGenerationException(message, exception);
        } catch (RestClientException exception) {
            throw new AiGenerationException(
                    "Could not communicate with OpenAI. Please try again.",
                    exception
            );
        }

        if (response == null
                || !"completed".equals(response.status())
                || response.output() == null) {
            throw new AiGenerationException(
                    "OpenAI did not return a completed response. Please try again."
            );
        }

        StringBuilder generatedText = createGeneratedText(response);

        return generatedText.toString().trim();


    }

    private static @NonNull StringBuilder createGeneratedText(OpenAiResponse response) {
        StringBuilder generatedText = new StringBuilder();

        for (OpenAiResponse.OutputItem item : response.output()) {
            if (item == null
                    || !"message".equals(item.type())
                    || item.content() == null) {
                continue;
            }

            for (OpenAiResponse.ContentItem content : item.content()) {
                if (content == null) {
                    continue;
                }

                if ("refusal".equals(content.type())) {
                    throw new AiGenerationException(
                            "OpenAI declined this request. Please review your input."
                    );
                }

                if ("output_text".equals(content.type())
                        && content.text() != null
                        && !content.text().isBlank()) {
                    if (!generatedText.isEmpty()) {
                        generatedText.append("\n\n");
                    }

                    generatedText.append(content.text());
                }
            }
        }

        if (generatedText.isEmpty()) {
            throw new AiGenerationException(
                    "OpenAI returned an empty response. Please try again."
            );
        }
        return generatedText;
    }
}
