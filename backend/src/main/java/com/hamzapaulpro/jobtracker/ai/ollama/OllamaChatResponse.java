package com.hamzapaulpro.jobtracker.ai.ollama;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.hamzapaulpro.jobtracker.ai.dto.AiMessage;

@JsonIgnoreProperties(ignoreUnknown = true)
public record OllamaChatResponse(
        AiMessage message
) {
}
