package com.hamzapaulpro.jobtracker;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class JobApplicationService {

    private final List<JobApplication> applications = new CopyOnWriteArrayList<>();
    private final AtomicLong nextId = new AtomicLong(1);

    public List<JobApplication> findAll() {
        return List.copyOf(applications);
    }

    public JobApplication create(CreateApplicationRequest request) {
        JobApplication application = new JobApplication(
                nextId.getAndIncrement(),
                request.company(),
                request.position(),
                "APPLIED"
        );

        applications.add(application);
        return application;
    }
}
