package com.neuroforge.repository;

import com.neuroforge.entity.Project;
import com.neuroforge.entity.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

@org.springframework.stereotype.Repository
public interface RepositoryEntityRepository extends JpaRepository<Repository, Integer> {
    Optional<Repository> findByProject(Project project);
}
