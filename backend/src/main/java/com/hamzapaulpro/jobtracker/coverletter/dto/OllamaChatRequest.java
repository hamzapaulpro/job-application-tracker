package com.hamzapaulpro.jobtracker.coverletter.dto;

import java.util.List;

public record OllamaChatRequest(
        String model,
        List<OllamaMessage> messages,
        boolean stream,
        boolean think
) {
}
