package com.hamzapaulpro.jobtracker.ai.openai;

import com.hamzapaulpro.jobtracker.ai.dto.AiMessage;
import com.hamzapaulpro.jobtracker.ai.exception.AiGenerationException;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.*;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withStatus;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

public class OpenAiClientTests {

    @Test
    void sendsRequestAndReturnsGeneratedText() {
        RestClient.Builder builder = RestClient.builder()
                .baseUrl("https://api.openai.com/v1");

        MockRestServiceServer server =
                MockRestServiceServer.bindTo(builder).build();

        OpenAiClient client = new OpenAiClient(
                builder.build(),
                new OpenAiProperties("test-model")
        );

        server.expect(requestTo("https://api.openai.com/v1/responses"))
                .andExpect(method(HttpMethod.POST))
                .andExpect(header(
                        "Authorization",
                        "Bearer test-key-not-real"
                ))
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.model").value("test-model"))
                .andExpect(jsonPath("$.store").value(false))
                .andExpect(jsonPath("$.input[0].role").value("user"))
                .andExpect(jsonPath("$.input[0].content")
                        .value("Write a cover letter."))
                .andRespond(withSuccess("""
                        {
                            "status": "completed",
                            "output": [
                                {
                                    "type": "message",
                                    "content": [
                                        {
                                            "type": "output_text",
                                            "text": "  Dear hiring team,  "
                                        }
                                    ]
                                }
                            ]
                        }
                        """, MediaType.APPLICATION_JSON));

        String result = client.generate(
                List.of(new AiMessage("user", "Write a cover letter.")),
                "test-key-not-real"
        );

        assertEquals("Dear hiring team,", result);
        server.verify();
    }

    @Test
    void throwsAiGenerationExceptionWhenApiKeyIsRejected() {
        RestClient.Builder builder = RestClient.builder()
                .baseUrl("https://api.openai.com/v1");

        MockRestServiceServer server =
                MockRestServiceServer.bindTo(builder).build();

        OpenAiClient client = new OpenAiClient(
                builder.build(),
                new OpenAiProperties("test-model")
        );

        server.expect(requestTo("https://api.openai.com/v1/responses"))
                .andRespond(withStatus(HttpStatus.UNAUTHORIZED));

        AiGenerationException exception = assertThrows(
                AiGenerationException.class,
                () -> client.generate(
                        List.of(new AiMessage("user", "Write a cover letter.")),
                        "invalid-test-key"
                )
        );

        assertEquals(
                "OpenAI rejected your API key. Please check it and try again.",
                exception.getMessage()
        );
        assertInstanceOf(
                RestClientResponseException.class,
                exception.getCause()
        );

        server.verify();
    }
}
