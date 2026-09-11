package com.neuroforge.repository;

import com.neuroforge.entity.Deployment;
import com.neuroforge.entity.DeploymentLog;
import com.neuroforge.entity.DeploymentLogId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DeploymentLogRepository extends JpaRepository<DeploymentLog, DeploymentLogId> {
    List<DeploymentLog> findByDeployment(Deployment deployment);
}
