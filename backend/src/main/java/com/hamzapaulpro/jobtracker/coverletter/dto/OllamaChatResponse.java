package com.hamzapaulpro.jobtracker.coverletter.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record OllamaChatResponse(
        OllamaMessage message
) {
}
