package com.hamzapaulpro.jobtracker.error;

import com.hamzapaulpro.jobtracker.ai.exception.AiGenerationException;
import com.hamzapaulpro.jobtracker.application.exception.ApplicationNotFoundException;
import com.hamzapaulpro.jobtracker.coverletter.exception.CoverLetterGenerationException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ValidationErrorResponse handleValidation(MethodArgumentNotValidException exception) {
        Map<String, String> fieldErrors = new LinkedHashMap<>();

        exception.getBindingResult()
                .getFieldErrors()
                .forEach(error -> fieldErrors.putIfAbsent(
                        error.getField(),
                        error.getDefaultMessage()
                ));

        return new ValidationErrorResponse(
                "VALIDATION_ERROR",
                fieldErrors
        );
    }

    @ExceptionHandler(ApplicationNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ApiErrorResponse handleApplicationNotFound(ApplicationNotFoundException exception) {
        return new ApiErrorResponse("APPLICATION_NOT_FOUND", exception.getMessage());
    }

    @ExceptionHandler(CoverLetterGenerationException.class)
    @ResponseStatus(HttpStatus.BAD_GATEWAY)
    public ApiErrorResponse handleCoverLetterGeneration(
            CoverLetterGenerationException exception
    ) {
        return new ApiErrorResponse(
                "COVER_LETTER_GENERATION_FAILED",
                exception.getMessage()
        );
    }

    @ExceptionHandler(AiGenerationException.class)
    @ResponseStatus(HttpStatus.BAD_GATEWAY)
    public ApiErrorResponse handleAiGeneration(AiGenerationException exception) {
        return new ApiErrorResponse(
                "AI_GENERATION_FAILED",
                exception.getMessage()
        );
    }
}
