package com.hamzapaulpro.jobtracker;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class JobApplicationService {

    private final JobApplicationRepository repository;

    public JobApplicationService(JobApplicationRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<JobApplication> findAll() {
        return repository.findAll(Sort.by("id").ascending())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public JobApplication create(CreateApplicationRequest request) {
        JobApplicationEntity entity = new JobApplicationEntity(
                request.company(),
                request.position()
        );

        JobApplicationEntity saved = repository.save(entity);
        return toResponse(saved);
    }

    private JobApplication toResponse(JobApplicationEntity entity) {
        return new JobApplication(
                entity.getId(),
                entity.getCompany(),
                entity.getPosition(),
                entity.getStatus()
        );
    }
}
