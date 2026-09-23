package com.hamzapaulpro.jobtracker.application.history;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationStatusHistoryRepository extends JpaRepository<ApplicationStatusHistoryEntity, Long> {

    List<ApplicationStatusHistoryEntity> findByApplication_IdOrderByChangedAtAscIdAsc(Long applicationId);
}
