package com.neuroforge.repository;

import com.neuroforge.entity.Sprint;
import com.neuroforge.entity.SprintGoal;
import com.neuroforge.entity.SprintGoalId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SprintGoalRepository extends JpaRepository<SprintGoal, SprintGoalId> {
    List<SprintGoal> findBySprint(Sprint sprint);
}
