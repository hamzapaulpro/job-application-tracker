package com.hamzapaulpro.jobtracker.ai;

import com.hamzapaulpro.jobtracker.ai.dto.AiProvider;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class AiClientRegistry {

    private final Map<AiProvider, AiClient> clients;

    public AiClientRegistry(List<AiClient> clients) {
        this.clients = clients.stream()
                .collect(Collectors.toUnmodifiableMap(
                        AiClient::provider,
                        Function.identity()
                ));
    }

    public AiClient getClient(AiProvider provider) {
        AiClient client = clients.get(provider);

        if (client == null) {
            throw new IllegalArgumentException(
                    "Unsupported AI provider: " + provider
            );
        }

        return client;
    }
}
