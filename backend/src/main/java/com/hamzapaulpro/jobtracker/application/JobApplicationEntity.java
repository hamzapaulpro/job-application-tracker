package com.hamzapaulpro.jobtracker.application;

import jakarta.persistence.*;

@Entity
@Table(name = "job_applications")
public class JobApplicationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String company;

    @Column(nullable = false, length = 150)
    private String position;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ApplicationStatus status;

    protected JobApplicationEntity() {
        // Required by JPA.
    }

    public JobApplicationEntity(String company, String position) {
        this.company = company;
        this.position = position;
        this.status = ApplicationStatus.APPLIED;
    }

    public Long getId() {
        return id;
    }

    public String getCompany() {
        return company;
    }

    public String getPosition() {
        return position;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void changeStatus(ApplicationStatus status) {
        this.status = java.util.Objects.requireNonNull(status);
    }

    public void updateDetails(String company, String position) {
        this.company = company;
        this.position = position;
    }
}
