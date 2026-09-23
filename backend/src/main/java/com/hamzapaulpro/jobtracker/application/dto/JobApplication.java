package com.hamzapaulpro.jobtracker.application.dto;

import com.hamzapaulpro.jobtracker.application.ApplicationStatus;

public record JobApplication(
        Long id,
        String company,
        String position,
        ApplicationStatus status
) {
}
