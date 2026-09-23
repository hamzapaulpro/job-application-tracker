package com.hamzapaulpro.jobtracker;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doAnswer;

@SpringBootTest
@Import(TestDatabaseConfiguration.class)
class JobApplicationTransactionTests {

    @Autowired
    private JobApplicationService service;

    @Autowired
    private JobApplicationRepository applicationRepository;

    @MockitoBean
    private ApplicationStatusHistoryRepository historyRepository;

    @Test
    void rollsBackStatusWhenHistorySaveFails() {
        JobApplicationEntity application = applicationRepository.saveAndFlush(
                new JobApplicationEntity("Rollback Example", "Java Developer")
        );

        Long id = application.getId();

        doAnswer(invocation -> {
            // Send the status UPDATE to PostgreSQL before forcing failure.
            applicationRepository.flush();
            throw new IllegalStateException("Simulated history save failure");
        }).when(historyRepository)
                .save(any(ApplicationStatusHistoryEntity.class));

        assertThatThrownBy(() -> service.changeStatus(
                id,
                new ChangeApplicationStatusRequest(ApplicationStatus.INTERVIEW)
        ))
                .isInstanceOf(IllegalStateException.class)
                .hasMessage("Simulated history save failure");

        JobApplicationEntity reloaded = applicationRepository.findById(id)
                .orElseThrow();

        assertThat(reloaded.getStatus()).isEqualTo(ApplicationStatus.APPLIED);
    }
}