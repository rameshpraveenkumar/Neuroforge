package com.neuroforge.repository;

import com.neuroforge.entity.Project;
import com.neuroforge.entity.ProjectAi;
import com.neuroforge.entity.ProjectAiId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProjectAiRepository extends JpaRepository<ProjectAi, ProjectAiId> {
    List<ProjectAi> findByProject(Project project);
}
