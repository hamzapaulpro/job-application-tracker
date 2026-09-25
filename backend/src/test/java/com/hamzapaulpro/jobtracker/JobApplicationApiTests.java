package com.hamzapaulpro.jobtracker;

import com.hamzapaulpro.jobtracker.application.ApplicationStatus;
import com.hamzapaulpro.jobtracker.application.JobApplicationEntity;
import com.hamzapaulpro.jobtracker.application.JobApplicationRepository;
import com.hamzapaulpro.jobtracker.application.history.ApplicationStatusHistoryRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Import(TestDatabaseConfiguration.class)
@Transactional
public class JobApplicationApiTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JobApplicationRepository applicationRepository;

    @Autowired
    private ApplicationStatusHistoryRepository historyRepository;

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

    @Test
    void findsApplicationById() throws Exception {
        MvcResult created = mockMvc.perform(post("/api/applications")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {
                              "company": "Detail Example",
                              "position": "Backend Developer"
                            }
                            """))
                .andExpect(status().isCreated())
                .andReturn();

        String responseBody = created.getResponse().getContentAsString();

        Number id = com.jayway.jsonpath.JsonPath.read(responseBody, "$.id");

        mockMvc.perform(get("/api/applications/{id}", id.longValue()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id.longValue()))
                .andExpect(jsonPath("$.company").value("Detail Example"))
                .andExpect(jsonPath("$.position").value("Backend Developer"))
                .andExpect(jsonPath("$.status").value("APPLIED"));
    }

    @Test
    void returnsNotFoundForUnknownApplication() throws Exception {
        mockMvc.perform(get("/api/applications/{id}", Long.MAX_VALUE))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value("APPLICATION_NOT_FOUND"))
                .andExpect(jsonPath("$.message").value(
                        "Application with ID " + Long.MAX_VALUE + " was not found"
                ));
    }

    @Test
    void changesStatusAndDoesNotDuplicateHistory() throws Exception {
        JobApplicationEntity application = applicationRepository.saveAndFlush(
                new JobApplicationEntity("History Example", "Java Developer")
        );

        Long id = application.getId();

        mockMvc.perform(patch("/api/applications/{id}/status", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {"status": "INTERVIEW"}
                            """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("INTERVIEW"));

        // Force pending changes to the database before checking history.
        applicationRepository.flush();

        var history = historyRepository.findByApplication_IdOrderByChangedAtAscIdAsc(id);

        assertThat(history).hasSize(1);
        assertThat(history.getFirst().getPreviousStatus()).isEqualTo(ApplicationStatus.APPLIED);
        assertThat(history.getFirst().getNewStatus()).isEqualTo(ApplicationStatus.INTERVIEW);
        assertThat(history.getFirst().getChangedAt()).isNotNull();

        // Repeating the same request should not create another entry.
        mockMvc.perform(patch("/api/applications/{id}/status", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {"status": "INTERVIEW"}
                            """))
                .andExpect(status().isOk());

        applicationRepository.flush();

        assertThat(historyRepository.findByApplication_IdOrderByChangedAtAscIdAsc(id)).hasSize(1);
    }

    @Test
    void returnsHistoryAfterStatusChange() throws Exception {
        JobApplicationEntity application = applicationRepository.saveAndFlush(
                new JobApplicationEntity("Timeline Example", "Java Developer")
        );

        Long id = application.getId();

        mockMvc.perform(patch("/api/applications/{id}/status", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {"status": "INTERVIEW"}
                            """))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/applications/{id}/history", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].id").isNumber())
                .andExpect(jsonPath("$[0].previousStatus").value("APPLIED"))
                .andExpect(jsonPath("$[0].newStatus").value("INTERVIEW"))
                .andExpect(jsonPath("$[0].changedAt").isNotEmpty());
    }

    @Test
    void returnsEmptyHistoryForNewApplication() throws Exception {
        JobApplicationEntity application = applicationRepository.saveAndFlush(
                new JobApplicationEntity("New Example", "Java Developer")
        );

        mockMvc.perform(get(
                        "/api/applications/{id}/history",
                        application.getId()
                ))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void returnsNotFoundForHistoryOfUnknownApplication() throws Exception {
        mockMvc.perform(get(
                        "/api/applications/{id}/history",
                        Long.MAX_VALUE
                ))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value("APPLICATION_NOT_FOUND"));
    }

    @Test
    void updatesDetailsWithoutChangingStatus() throws Exception {
        JobApplicationEntity application =
                new JobApplicationEntity("Original Company", "Java Developer");

        application.changeStatus(ApplicationStatus.INTERVIEW);
        Long id = applicationRepository.saveAndFlush(application).getId();

        mockMvc.perform(put("/api/applications/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {
                              "company": "Updated Company",
                              "position": "Backend Developer"
                            }
                            """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.company").value("Updated Company"))
                .andExpect(jsonPath("$.position").value("Backend Developer"))
                .andExpect(jsonPath("$.status").value("INTERVIEW"));

        applicationRepository.flush();

        mockMvc.perform(get("/api/applications/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.company").value("Updated Company"))
                .andExpect(jsonPath("$.position").value("Backend Developer"))
                .andExpect(jsonPath("$.status").value("INTERVIEW"));

        assertThat(
                historyRepository.findByApplication_IdOrderByChangedAtAscIdAsc(id)
        ).isEmpty();
    }

    @Test
    void rejectsInvalidEditWithoutChangingDetails() throws Exception {
        JobApplicationEntity application = applicationRepository.saveAndFlush(
                new JobApplicationEntity("Original Company", "Java Developer")
        );

        Long id = application.getId();

        mockMvc.perform(put("/api/applications/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {
                              "company": "   ",
                              "position": "Backend Developer"
                            }
                            """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.company")
                        .value("Company is required"));

        mockMvc.perform(get("/api/applications/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.company").value("Original Company"))
                .andExpect(jsonPath("$.position").value("Java Developer"));
    }

    @Test
    void returnsNotFoundWhenUpdatingUnknownApplication() throws Exception {
        mockMvc.perform(put("/api/applications/{id}", Long.MAX_VALUE)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {
                              "company": "Example Company",
                              "position": "Java Developer"
                            }
                            """))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value("APPLICATION_NOT_FOUND"));
    }

}
