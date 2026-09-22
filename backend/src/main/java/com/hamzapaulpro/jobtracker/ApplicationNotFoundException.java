package com.hamzapaulpro.jobtracker;

public class ApplicationNotFoundException extends RuntimeException {
    public ApplicationNotFoundException(Long id) {
        super("Application with ID " + id + " was not found");
    }
}
