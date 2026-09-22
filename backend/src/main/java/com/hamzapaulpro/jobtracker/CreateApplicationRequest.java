package com.hamzapaulpro.jobtracker;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateApplicationRequest(

        @NotBlank(message = "Company is required")
        @Size(max = 150, message = "Company must be at most 150 characters")
        String company,

        @NotBlank(message = "Position is required")
        @Size(max = 150, message = "Position must be at most 150 characters")
        String position
) {
}
