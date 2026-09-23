package com.hamzapaulpro.jobtracker;

import jakarta.validation.constraints.NotNull;

public record ChangeApplicationStatusRequest(
        @NotNull(message = "Status is required")
        ApplicationStatus status
) {
}
