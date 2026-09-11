package com.neuroforge.repository;

import com.neuroforge.entity.CodeCommit;
import com.neuroforge.entity.CodeCommitId;
import com.neuroforge.entity.Repository;
import com.neuroforge.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

@org.springframework.stereotype.Repository
public interface CodeCommitRepository extends JpaRepository<CodeCommit, CodeCommitId> {
    List<CodeCommit> findByRepository(Repository repository);
    List<CodeCommit> findByDeveloper(User developer);
}
