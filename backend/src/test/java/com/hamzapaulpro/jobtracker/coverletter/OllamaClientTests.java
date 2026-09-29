package com.hamzapaulpro.jobtracker.coverletter;

import com.hamzapaulpro.jobtracker.coverletter.dto.OllamaMessage;
import com.hamzapaulpro.jobtracker.coverletter.exception.CoverLetterGenerationException;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.*;
import static org.springframework.test.web.client.response.MockRestResponseCreators.*;

public class OllamaClientTests {

    @Test
    void sendsChatRequestAndReadsGeneratedContent() {
        RestClient.Builder builder = RestClient.builder()
                .baseUrl("http://localhost:11434");

        MockRestServiceServer server =
                MockRestServiceServer.bindTo(builder).build();

        var properties = new OllamaProperties(
                "http://localhost:11434",
                "qwen3:1.7b"
        );

        var client = new OllamaClient(builder.build(), properties);

        server.expect(requestTo("http://localhost:11434/api/chat"))
                .andExpect(method(HttpMethod.POST))
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.model").value("qwen3:1.7b"))
                .andExpect(jsonPath("$.stream").value(false))
                .andExpect(jsonPath("$.think").value(false))
                .andExpect(jsonPath("$.messages[0].role").value("user"))
                .andExpect(jsonPath("$.messages[0].content")
                        .value("Write a short cover letter."))
                .andRespond(withSuccess("""
                        {
                            "model": "qwen3:1.7b",
                            "message": {
                                "role": "assistant",
                                "content": "  Dear Hiring Team, welcome.  "
                            },
                            "done": true
                        }
                        """, MediaType.APPLICATION_JSON));

        String result = client.generate(List.of(
                new OllamaMessage("user", "Write a short cover letter.")
        ));

        assertThat(result).isEqualTo("Dear Hiring Team, welcome.");
        server.verify();

    }

    @Test
    void wrapsOllamaHttpErrors() {
        RestClient.Builder builder = RestClient.builder()
                .baseUrl("http://localhost:11434");

        MockRestServiceServer server =
                MockRestServiceServer.bindTo(builder).build();

        var client = new OllamaClient(
                builder.build(),
                new OllamaProperties(
                        "http://localhost:11434",
                        "qwen3:1.7b"
                )
        );

        server.expect(requestTo("http://localhost:11434/api/chat"))
                .andRespond(withServerError());

        assertThatThrownBy(() -> client.generate(List.of(
                new OllamaMessage("user", "Write a cover letter.")
        )))
                .isInstanceOf(CoverLetterGenerationException.class)
                .hasMessage("Cover letter generation failed. Please try again.")
                .hasCauseInstanceOf(
                        org.springframework.web.client.RestClientResponseException.class
                );

        server.verify();
    }

    @Test
    void rejectsBlankGeneratedContent() {
        RestClient.Builder builder = RestClient.builder()
                .baseUrl("http://localhost:11434");

        MockRestServiceServer server =
                MockRestServiceServer.bindTo(builder).build();

        var client = new OllamaClient(
                builder.build(),
                new OllamaProperties(
                        "http://localhost:11434",
                        "qwen3:1.7b"
                )
        );

        server.expect(requestTo("http://localhost:11434/api/chat"))
                .andRespond(withSuccess("""
                    {
                        "message": {
                            "role": "assistant",
                            "content": "   "
                        },
                        "done": true
                    }
                    """, MediaType.APPLICATION_JSON));

        assertThatThrownBy(() -> client.generate(List.of(
                new OllamaMessage("user", "Write a cover letter.")
        )))
                .isInstanceOf(CoverLetterGenerationException.class)
                .hasMessage(
                        "The AI service returned an empty response. Please try again."
                );

        server.verify();
    }
}
