package com.neuroforge.repository;

import com.neuroforge.entity.Task;
import com.neuroforge.entity.TaskLabel;
import com.neuroforge.entity.TaskLabelId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TaskLabelRepository extends JpaRepository<TaskLabel, TaskLabelId> {
    List<TaskLabel> findByTask(Task task);
}
