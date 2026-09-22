package com.hamzapaulpro.jobtracker;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class JobApplicationController {

    private final JobApplicationService service;

    public JobApplicationController(JobApplicationService service) {
        this.service = service;
    }

    @GetMapping
    public List<JobApplication> getApplications() {
        return service.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public JobApplication createApplication(@Valid @RequestBody CreateApplicationRequest request) {
        return service.create(request);
    }

    @GetMapping("/{id}")
    public JobApplication getApplication(@PathVariable Long id) {
        return service.findById(id);
    }
}
