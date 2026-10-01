package com.hamzapaulpro.jobtracker.coverletter;

import com.hamzapaulpro.jobtracker.ai.dto.AiProvider;
import com.hamzapaulpro.jobtracker.coverletter.dto.CoverLetterResponse;
import com.hamzapaulpro.jobtracker.coverletter.dto.CreateCoverLetterRequest;
import com.hamzapaulpro.jobtracker.coverletter.exception.CoverLetterGenerationException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CoverLetterController.class)
public class CoverLetterControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private CoverLetterService service;

    @Test
    void rejectsBlankCvWithoutCallingService() throws Exception {
        mockMvc.perform
                (
                    post("/api/cover-letters")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {
                                "cvText": "",
                                "jobDescription": "Working student Java developer.",
                                "language": "ENGLISH",
                                "provider": "OLLAMA"
                            }
                        """)
                )
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("VALIDATION_ERROR"))
                .andExpect(jsonPath("$.fieldErrors.cvText")
                        .value("CV information is required"));

        verifyNoInteractions(service);
    }

    @Test
    void returnsGeneratedLetterAndPassesInstructionsToService() throws Exception {
        var request = new CreateCoverLetterRequest(
                "Student with Java skills.",
                "Working student Java developer.",
                "ENGLISH",
                "Focus on my Java project.",
                AiProvider.OLLAMA
        );

        String letter = "Dear Hiring Team,\n\nI am applying for the role.";
        when(service.generate(request, null))
                .thenReturn(new CoverLetterResponse(letter));

        mockMvc.perform
                (
                    post("/api/cover-letters")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {
                                "cvText": "Student with Java skills.",
                                "jobDescription": "Working student Java developer.",
                                "language": "ENGLISH",
                                "instructions": "Focus on my Java project.",
                                "provider": "OLLAMA"
                            }
                            """)
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").value(letter));
        verify(service).generate(request, null);
    }

    @Test
    void returnsBadGatewayWhenGenerationFails() throws Exception {
        var request = new CreateCoverLetterRequest(
                "Student with Java skills.",
                "Working student Java developer.",
                "ENGLISH",
                null,
                AiProvider.OLLAMA
        );

        when(service.generate(request, null))
                .thenThrow(new CoverLetterGenerationException(
                        "Cover letter generation failed. Please try again."
                ));

        mockMvc.perform(post("/api/cover-letters")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {
                                "cvText": "Student with Java skills.",
                                "jobDescription": "Working student Java developer.",
                                "language": "ENGLISH",
                                "provider": "OLLAMA"
                            }
                            """))
                .andExpect(status().isBadGateway())
                .andExpect(jsonPath("$.code")
                        .value("COVER_LETTER_GENERATION_FAILED"))
                .andExpect(jsonPath("$.message")
                        .value("Cover letter generation failed. Please try again."));

        verify(service).generate(request, null);
    }

    @Test
    void passesApiKeyHeaderToService() throws Exception {
        CreateCoverLetterRequest expectedRequest =
                new CreateCoverLetterRequest(
                        "My CV",
                        "Job description",
                        "ENGLISH",
                        "Keep it concise",
                        AiProvider.OPENAI
                );

        String apiKey = "test-key-not-real";

        when(service.generate(expectedRequest, apiKey))
                .thenReturn(new CoverLetterResponse("Generated cover letter"));

        mockMvc.perform(post("/api/cover-letters")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("X-OpenAI-Api-Key", apiKey)
                        .content("""
                            {
                                "cvText": "My CV",
                                "jobDescription": "Job description",
                                "language": "ENGLISH",
                                "instructions": "Keep it concise",
                                "provider": "OPENAI"
                            }
                            """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content")
                        .value("Generated cover letter"));

        verify(service).generate(expectedRequest, apiKey);

    }
}
