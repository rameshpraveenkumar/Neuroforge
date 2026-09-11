package com.neuroforge.repository;

import com.neuroforge.entity.Task;
import com.neuroforge.entity.TestCase;
import com.neuroforge.entity.TestCaseId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TestCaseRepository extends JpaRepository<TestCase, TestCaseId> {
    List<TestCase> findByTask(Task task);
}
