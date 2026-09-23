package com.hamzapaulpro.jobtracker;

import java.time.Instant;

public record ApplicationStatusHistoryResponse(
        Long id,
        ApplicationStatus previousStatus,
        ApplicationStatus newStatus,
        Instant changedAt
) {
}
