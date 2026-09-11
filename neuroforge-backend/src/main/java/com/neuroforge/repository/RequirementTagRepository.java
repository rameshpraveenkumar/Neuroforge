package com.neuroforge.repository;

import com.neuroforge.entity.Requirement;
import com.neuroforge.entity.RequirementTag;
import com.neuroforge.entity.RequirementTagId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RequirementTagRepository extends JpaRepository<RequirementTag, RequirementTagId> {
    List<RequirementTag> findByRequirement(Requirement requirement);
}
