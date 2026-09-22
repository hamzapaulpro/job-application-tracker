package com.hamzapaulpro.jobtracker;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class JobApplicationController {

    @GetMapping("/api/applications")
    public List<JobApplication> getApplications() {
        return List.of(
                new JobApplication(1L, "Example company", "working student java developer", "APPLIED")
        );
    }
}
