package com.neuroforge.repository;

import com.neuroforge.entity.CiPipeline;
import com.neuroforge.entity.CiPipelineStage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CiPipelineStageRepository extends JpaRepository<CiPipelineStage, Long> {

    List<CiPipelineStage> findByPipelineOrderByStageOrderAsc(CiPipeline pipeline);
}