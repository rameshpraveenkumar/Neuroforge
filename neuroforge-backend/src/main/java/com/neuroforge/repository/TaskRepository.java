package com.neuroforge.repository;

import com.neuroforge.entity.Sprint;
import com.neuroforge.entity.Task;
import com.neuroforge.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Integer> {
    List<Task> findBySprint(Sprint sprint);
    List<Task> findByAssignedUser(User assignedUser);
}
