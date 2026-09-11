package com.neuroforge.repository;

import com.neuroforge.entity.Project;
import com.neuroforge.entity.Requirement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RequirementRepository extends JpaRepository<Requirement, Integer> {
    List<Requirement> findByProject(Project project);
}
