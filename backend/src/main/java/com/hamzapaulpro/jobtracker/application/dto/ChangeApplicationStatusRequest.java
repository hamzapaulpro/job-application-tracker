package com.hamzapaulpro.jobtracker.application.dto;

import com.hamzapaulpro.jobtracker.application.ApplicationStatus;
import jakarta.validation.constraints.NotNull;

public record ChangeApplicationStatusRequest(
        @NotNull(message = "Status is required")
        ApplicationStatus status
) {
}
