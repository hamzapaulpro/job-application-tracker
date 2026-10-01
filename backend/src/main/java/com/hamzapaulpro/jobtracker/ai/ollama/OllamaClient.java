package com.hamzapaulpro.jobtracker.ai.ollama;

import com.hamzapaulpro.jobtracker.ai.AiClient;
import com.hamzapaulpro.jobtracker.ai.dto.AiProvider;
import com.hamzapaulpro.jobtracker.ai.dto.AiMessage;
import com.hamzapaulpro.jobtracker.ai.exception.AiGenerationException;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.util.List;

@Component
public class OllamaClient implements AiClient {

    private final RestClient restClient;
    private final OllamaProperties properties;

    public OllamaClient(
            @Qualifier("ollamaRestClient") RestClient restClient,
            OllamaProperties properties) {
        this.restClient = restClient;
        this.properties = properties;
    }

    @Override
    public String generate(List<AiMessage> messages, String apiKey) {
        var request = new OllamaChatRequest(
                properties.model(),
                messages,
                false,
                false
        );

        OllamaChatResponse response;

        try {
            response = restClient.post()
                    .uri("/api/chat")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .body(OllamaChatResponse.class);
        } catch (RestClientException exception) {
            throw new AiGenerationException(
                    "Cover letter generation failed. Please try again.",
                    exception
            );
        }

        if (response == null
                || response.message() == null
                || response.message().content() == null
                || response.message().content().isBlank()) {
            throw new AiGenerationException(
                    "The AI service returned an empty response. Please try again."
            );
        }

        return response.message().content().trim();
    }

    @Override
    public AiProvider provider() {
        return AiProvider.OLLAMA;
    }
}
