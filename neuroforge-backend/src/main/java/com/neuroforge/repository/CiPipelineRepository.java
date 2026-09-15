package com.neuroforge.repository;

import com.neuroforge.entity.CiPipeline;
import com.neuroforge.entity.Project;
import com.neuroforge.entity.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

@org.springframework.stereotype.Repository
public interface CiPipelineRepository extends JpaRepository<CiPipeline, Long> {

    Optional<CiPipeline> findByPipelineId(String pipelineId);

    List<CiPipeline> findAllByOrderByCreatedAtDesc();

    List<CiPipeline> findByRepositoryOrderByCreatedAtDesc(Repository repository);

    List<CiPipeline> findByProjectOrderByCreatedAtDesc(Project project);
}