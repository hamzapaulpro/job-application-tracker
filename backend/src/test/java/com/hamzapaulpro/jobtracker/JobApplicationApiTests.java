package com.hamzapaulpro.jobtracker;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Import(TestDatabaseConfiguration.class)
@Transactional
public class JobApplicationApiTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void createsApplicationAndIncludesItInList() throws Exception {
        mockMvc.perform(post("/api/applications")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "company": "Example Company",
                                  "position": "Java Developer"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.company").value("Example Company"))
                .andExpect(jsonPath("$.position").value("Java Developer"))
                .andExpect(jsonPath("$.status").value("APPLIED"));

        mockMvc.perform(get("/api/applications"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].company").value("Example Company"))
                .andExpect(jsonPath("$[0].position").value("Java Developer"))
                .andExpect(jsonPath("$[0].status").value("APPLIED"));
    }

    @Test
    void rejectsBlankFieldsWithoutSavingApplication() throws Exception {
        mockMvc.perform(post("/api/applications")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "company": "   ",
                                  "position": ""
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("VALIDATION_ERROR"))
                .andExpect(jsonPath("$.fieldErrors.company").value("Company is required"))
                .andExpect(jsonPath("$.fieldErrors.position").value("Position is required"));

        mockMvc.perform(get("/api/applications"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }
}
