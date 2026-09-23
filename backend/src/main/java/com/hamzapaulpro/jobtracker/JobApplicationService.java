package com.hamzapaulpro.jobtracker;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
public class JobApplicationService {

    private final JobApplicationRepository repository;
    private final ApplicationStatusHistoryRepository historyRepository;

    public JobApplicationService(JobApplicationRepository repository, ApplicationStatusHistoryRepository historyRepository) {
        this.repository = repository;
        this.historyRepository = historyRepository;
    }

    @Transactional(readOnly = true)
    public JobApplication findById(Long id) {
        JobApplicationEntity entity = repository.findById(id).orElseThrow(() -> new ApplicationNotFoundException(id));

        return toResponse(entity);
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

    @Transactional
    public JobApplication changeStatus(Long id, ChangeApplicationStatusRequest request) {
        JobApplicationEntity application = repository.findByIdForUpdate(id)
                .orElseThrow(() -> new ApplicationNotFoundException(id));

        ApplicationStatus previousStatus = application.getStatus();
        ApplicationStatus newStatus = request.status();

        if (previousStatus == newStatus) {
            return toResponse(application);
        }

        application.changeStatus(newStatus);
        repository.save(application);

        historyRepository.save(new ApplicationStatusHistoryEntity(
                application,
                previousStatus,
                newStatus,
                Instant.now()
        ));

        return toResponse(application);
    }

    @Transactional(readOnly = true)
    public List<ApplicationStatusHistoryResponse> getHistory(Long applicationId) {
        if (!repository.existsById(applicationId)) {
            throw new ApplicationNotFoundException(applicationId);
        }

        return historyRepository
                .findByApplication_IdOrderByChangedAtAscIdAsc(applicationId)
                .stream()
                .map(entry -> new ApplicationStatusHistoryResponse(
                        entry.getId(),
                        entry.getPreviousStatus(),
                        entry.getNewStatus(),
                        entry.getChangedAt()
                ))
                .toList();
    }
}
