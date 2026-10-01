package com.hamzapaulpro.jobtracker.coverletter;

import com.hamzapaulpro.jobtracker.ai.AiClient;
import com.hamzapaulpro.jobtracker.ai.AiClientRegistry;
import com.hamzapaulpro.jobtracker.ai.dto.AiProvider;
import com.hamzapaulpro.jobtracker.coverletter.dto.CreateCoverLetterRequest;
import com.hamzapaulpro.jobtracker.ai.dto.AiMessage;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class CoverLetterServiceTests {

    @Mock
    private AiClientRegistry aiClientRegistry;

    @Mock
    private AiClient aiClient;

    @InjectMocks
    private CoverLetterService service;

    @Captor
    private ArgumentCaptor<List<AiMessage>> messagesCaptor;

    @Test
    void includesApplicantInformationAndReturnsGeneratedContent() {
        var request = new CreateCoverLetterRequest(
                "Student with Java skills.",
                "Working student Java developer.",
                "ENGLISH",
                "Mention that I can work 15 hours per week.",
                AiProvider.OLLAMA
        );

        when(aiClientRegistry.getClient(AiProvider.OLLAMA))
                .thenReturn(aiClient);

        when(aiClient.generate(anyList(), isNull()))
                .thenReturn("Generated cover letter.");

        var response = service.generate(request, null);
        verify(aiClient).generate(messagesCaptor.capture(), isNull());

        List<AiMessage> messages = messagesCaptor.getValue();

        assertThat(messages).hasSize(2);
        assertThat(messages.get(0).role()).isEqualTo("system");
        assertThat(messages.get(1).role()).isEqualTo("user");

        assertThat(messages.get(1).content()).contains(
                request.cvText(),
                request.jobDescription(),
                request.language(),
                request.instructions()
        );

        assertThat(response.content())
                .isEqualTo("Generated cover letter.");
    }

    @Test
    void handlesMissingInstructions() {
        var request = new CreateCoverLetterRequest(
                "Student with Java skills.",
                "Working student Java developer.",
                "ENGLISH",
                null,
                AiProvider.OLLAMA
        );

        when(aiClientRegistry.getClient(AiProvider.OLLAMA))
                .thenReturn(aiClient);

        when(aiClient.generate(anyList(), isNull()))
                .thenReturn("Generated cover letter.");

        var response = service.generate(request, null);

        verify(aiClient).generate(messagesCaptor.capture(), isNull());

        String userPrompt = messagesCaptor.getValue().get(1).content();

        assertThat(userPrompt)
                .contains(request.cvText(), request.jobDescription())
                .doesNotContain("null");

        assertThat(response.content())
                .isEqualTo("Generated cover letter.");
    }

    @Test
    void passesApiKeyToOpenAiClient() {
        CreateCoverLetterRequest request = new CreateCoverLetterRequest(
                "My CV",
                "Job description",
                "ENGLISH",
                "Keep it concise",
                AiProvider.OPENAI
        );

        String apiKey = "test-key-not-real";

        when(aiClientRegistry.getClient(AiProvider.OPENAI))
                .thenReturn(aiClient);

        when(aiClient.generate(anyList(), eq(apiKey)))
                .thenReturn("Generated cover letter");

        service.generate(request, apiKey);

        verify(aiClientRegistry).getClient(AiProvider.OPENAI);
        verify(aiClient).generate(anyList(), eq(apiKey));
    }
}
