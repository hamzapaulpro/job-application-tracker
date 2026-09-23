package com.hamzapaulpro.jobtracker.error;

import java.util.Map;

public record ValidationErrorResponse(
        String code,
        Map<String, String> fieldErrors
) {
}
