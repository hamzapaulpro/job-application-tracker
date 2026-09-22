package com.hamzapaulpro.jobtracker;

import org.springframework.data.jpa.repository.JpaRepository;

public interface JobApplicationRepository extends JpaRepository<JobApplicationEntity, Long> {
}
