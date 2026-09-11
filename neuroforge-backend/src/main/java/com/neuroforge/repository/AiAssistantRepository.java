package com.neuroforge.repository;

import com.neuroforge.entity.AiAssistant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AiAssistantRepository extends JpaRepository<AiAssistant, Integer> {
    Optional<AiAssistant> findByModelName(String modelName);
}
