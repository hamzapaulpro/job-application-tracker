package com.hamzapaulpro.jobtracker.application.exception;

public class ApplicationNotFoundException extends RuntimeException {
    public ApplicationNotFoundException(Long id) {
        super("Application with ID " + id + " was not found");
    }
}
