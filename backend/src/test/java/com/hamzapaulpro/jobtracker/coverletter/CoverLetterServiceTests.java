package com.hamzapaulpro.jobtracker.coverletter;

import com.hamzapaulpro.jobtracker.coverletter.dto.CreateCoverLetterRequest;
import com.hamzapaulpro.jobtracker.coverletter.dto.OllamaMessage;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class CoverLetterServiceTests {

    @Mock
    private OllamaClient ollamaClient;

    @InjectMocks
    private CoverLetterService service;

    @Captor
    private ArgumentCaptor<List<OllamaMessage>> messagesCaptor;

    @Test
    void includesApplicantInformationAndReturnsGeneratedContent() {
        var request = new CreateCoverLetterRequest(
                "Student with Java skills.",
                "Working student Java developer.",
                "ENGLISH",
                "Mention that I can work 15 hours per week."
        );

        when(ollamaClient.generate(anyList()))
                .thenReturn("Generated cover letter.");

        var response = service.generate(request);
        verify(ollamaClient).generate(messagesCaptor.capture());

        List<OllamaMessage> messages = messagesCaptor.getValue();

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
                null
        );

        when(ollamaClient.generate(anyList()))
                .thenReturn("Generated cover letter.");

        var response = service.generate(request);

        verify(ollamaClient).generate(messagesCaptor.capture());

        String userPrompt = messagesCaptor.getValue().get(1).content();

        assertThat(userPrompt)
                .contains(request.cvText(), request.jobDescription())
                .doesNotContain("null");

        assertThat(response.content())
                .isEqualTo("Generated cover letter.");
    }
}
