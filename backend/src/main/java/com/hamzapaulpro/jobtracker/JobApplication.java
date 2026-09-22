package com.hamzapaulpro.jobtracker;

public record JobApplication(
        Long id,
        String company,
        String position,
        String status
) {
}
