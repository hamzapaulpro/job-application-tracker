package com.hamzapaulpro.jobtracker.ai;

import com.hamzapaulpro.jobtracker.ai.dto.AiMessage;
import com.hamzapaulpro.jobtracker.ai.dto.AiProvider;

import java.util.List;

public interface AiClient {

    AiProvider provider();

    String generate(List<AiMessage> messages, String apiKey);
}
