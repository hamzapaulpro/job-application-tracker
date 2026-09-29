package com.hamzapaulpro.jobtracker.coverletter.exception;

public class CoverLetterGenerationException extends RuntimeException {

    public CoverLetterGenerationException(String message) {
        super(message);
    }

    public CoverLetterGenerationException(
            String message,
            Throwable cause
    ) {
        super(message, cause);
    }
}
