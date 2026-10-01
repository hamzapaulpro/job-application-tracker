package com.hamzapaulpro.jobtracker.ai.ollama;

import com.hamzapaulpro.jobtracker.ai.dto.AiMessage;

import java.util.List;

public record OllamaChatRequest(
        String model,
        List<AiMessage> messages,
        boolean stream,
        boolean think
) {
}
