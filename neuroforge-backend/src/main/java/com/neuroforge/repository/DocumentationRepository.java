package com.neuroforge.repository;

import com.neuroforge.entity.Documentation;
import com.neuroforge.entity.DocumentationId;
import com.neuroforge.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DocumentationRepository extends JpaRepository<Documentation, DocumentationId> {
    List<Documentation> findByProject(Project project);
}
