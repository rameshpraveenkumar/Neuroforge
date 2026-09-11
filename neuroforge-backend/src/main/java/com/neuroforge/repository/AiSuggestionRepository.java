package com.neuroforge.repository;

import com.neuroforge.entity.AiAssistant;
import com.neuroforge.entity.AiSuggestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AiSuggestionRepository extends JpaRepository<AiSuggestion, Integer> {
    List<AiSuggestion> findByAiAssistant(AiAssistant aiAssistant);
}
