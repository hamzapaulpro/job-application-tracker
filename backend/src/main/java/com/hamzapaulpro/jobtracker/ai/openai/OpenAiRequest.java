package com.hamzapaulpro.jobtracker.ai.openai;

import com.hamzapaulpro.jobtracker.ai.dto.AiMessage;

import java.util.List;

public record OpenAiRequest(
        String model,
        List<AiMessage> input,
        boolean store
) {
}
