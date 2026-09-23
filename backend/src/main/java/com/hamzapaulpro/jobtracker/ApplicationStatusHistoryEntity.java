package com.hamzapaulpro.jobtracker;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "application_status_history")
public class ApplicationStatusHistoryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "application_id", nullable = false)
    private JobApplicationEntity application;

    @Enumerated(EnumType.STRING)
    @Column(name = "previous_status", nullable = false, length = 30)
    private ApplicationStatus previousStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "new_status", nullable = false, length = 30)
    private ApplicationStatus newStatus;

    @Column(name = "changed_at", nullable = false)
    private Instant changedAt;

    protected ApplicationStatusHistoryEntity() {
        // Required by JPA.
    }

    public ApplicationStatusHistoryEntity(
            JobApplicationEntity application,
            ApplicationStatus previousStatus,
            ApplicationStatus newStatus,
            Instant changedAt
    ) {
        this.application = application;
        this.previousStatus = previousStatus;
        this.newStatus = newStatus;
        this.changedAt = changedAt;
    }

    public Long getId() {
        return id;
    }

    public ApplicationStatus getPreviousStatus() {
        return previousStatus;
    }

    public ApplicationStatus getNewStatus() {
        return newStatus;
    }

    public Instant getChangedAt() {
        return changedAt;
    }
}
