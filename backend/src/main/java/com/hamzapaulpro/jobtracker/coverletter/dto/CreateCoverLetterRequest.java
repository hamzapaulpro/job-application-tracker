package com.hamzapaulpro.jobtracker.coverletter.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateCoverLetterRequest(
        @NotBlank(message = "CV information is required")
        @Size(max = 6000, message = "CV information must be at most 6000 characters")
        String cvText,

        @NotBlank(message = "Job description is required")
        @Size(max = 6000, message = "Job description must be at most 6000 characters")
        String jobDescription,

        @NotBlank(message = "Language is required")
        @Pattern(
                regexp = "ENGLISH|GERMAN",
                message = "Language must be ENGLISH or GERMAN"
        )
        String language,

        @Size(max = 1000, message = "Instructions must be at most 1000 characters")
        String instructions
) {
}
