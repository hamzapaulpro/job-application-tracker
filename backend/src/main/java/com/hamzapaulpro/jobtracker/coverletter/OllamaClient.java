package com.hamzapaulpro.jobtracker.coverletter;

import com.hamzapaulpro.jobtracker.coverletter.dto.OllamaChatRequest;
import com.hamzapaulpro.jobtracker.coverletter.dto.OllamaChatResponse;
import com.hamzapaulpro.jobtracker.coverletter.dto.OllamaMessage;
import com.hamzapaulpro.jobtracker.coverletter.exception.CoverLetterGenerationException;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.util.List;

@Component
public class OllamaClient {

    private final RestClient restClient;
    private final OllamaProperties properties;

    public OllamaClient(
            @Qualifier("ollamaRestClient") RestClient restClient,
            OllamaProperties properties) {
        this.restClient = restClient;
        this.properties = properties;
    }

    public String generate(List<OllamaMessage> messages) {
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
            throw new CoverLetterGenerationException(
                    "Cover letter generation failed. Please try again.",
                    exception
            );
        }

        if (response == null
                || response.message() == null
                || response.message().content() == null
                || response.message().content().isBlank()) {
            throw new CoverLetterGenerationException(
                    "The AI service returned an empty response. Please try again."
            );
        }

        return response.message().content().trim();
    }
}
