package com.hamzapaulpro.jobtracker;

public record ApiErrorResponse(
        String code,
        String message
) {
}
