package com.hamzapaulpro.jobtracker.error;

public record ApiErrorResponse(
        String code,
        String message
) {
}
