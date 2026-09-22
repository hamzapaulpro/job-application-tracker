package com.hamzapaulpro.jobtracker;

import java.util.Map;

public record ValidationErrorResponse(
        String code,
        Map<String, String> fieldErrors
) {
}
