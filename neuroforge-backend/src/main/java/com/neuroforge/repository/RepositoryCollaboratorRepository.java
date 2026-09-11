package com.neuroforge.repository;

import com.neuroforge.entity.Repository;
import com.neuroforge.entity.RepositoryCollaborator;
import com.neuroforge.entity.RepositoryCollaboratorId;
import com.neuroforge.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

@org.springframework.stereotype.Repository
public interface RepositoryCollaboratorRepository extends JpaRepository<RepositoryCollaborator, RepositoryCollaboratorId> {
    List<RepositoryCollaborator> findByRepository(Repository repository);
    List<RepositoryCollaborator> findByUser(User user);
}
