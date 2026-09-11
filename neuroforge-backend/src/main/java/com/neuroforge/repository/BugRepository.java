package com.neuroforge.repository;

import com.neuroforge.entity.Bug;
import com.neuroforge.entity.BugId;
import com.neuroforge.entity.TestCase;
import com.neuroforge.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BugRepository extends JpaRepository<Bug, BugId> {
    List<Bug> findByTestCase(TestCase testCase);
    List<Bug> findByAssignedDeveloper(User assignedDeveloper);
}
