package com.hamzapaulpro.jobtracker.application.history;

import com.hamzapaulpro.jobtracker.application.ApplicationStatus;

import java.time.Instant;

public record ApplicationStatusHistoryResponse(
        Long id,
        ApplicationStatus previousStatus,
        ApplicationStatus newStatus,
        Instant changedAt
) {
}
