package com.hamzapaulpro.jobtracker;

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

    @Column(nullable = false, length = 30)
    private String status;

    protected JobApplicationEntity() {
        // Required by JPA.
    }

    public JobApplicationEntity(String company, String position) {
        this.company = company;
        this.position = position;
        this.status = "APPLIED";
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

    public String getStatus() {
        return status;
    }
}
