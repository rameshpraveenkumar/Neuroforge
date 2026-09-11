package com.neuroforge.repository;

import com.neuroforge.entity.Deployment;
import com.neuroforge.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DeploymentRepository extends JpaRepository<Deployment, Integer> {
    List<Deployment> findByProject(Project project);
}
