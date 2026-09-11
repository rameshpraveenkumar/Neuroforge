package com.neuroforge.repository;

import com.neuroforge.entity.Project;
import com.neuroforge.entity.Sprint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SprintRepository extends JpaRepository<Sprint, Integer> {
    List<Sprint> findByProject(Project project);
}
