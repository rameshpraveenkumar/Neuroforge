package com.neuroforge.repository;

import com.neuroforge.entity.Project;
import com.neuroforge.entity.ProjectTechnology;
import com.neuroforge.entity.ProjectTechnologyId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProjectTechnologyRepository extends JpaRepository<ProjectTechnology, ProjectTechnologyId> {
    List<ProjectTechnology> findByProject(Project project);
}
