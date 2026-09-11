package com.neuroforge.service;

import com.neuroforge.dto.request.RequirementRequest;
import com.neuroforge.dto.response.RequirementResponse;
import com.neuroforge.entity.Project;
import com.neuroforge.entity.Requirement;
import com.neuroforge.entity.RequirementTag;
import com.neuroforge.exception.ResourceNotFoundException;
import com.neuroforge.repository.ProjectRepository;
import com.neuroforge.repository.RequirementRepository;
import com.neuroforge.repository.RequirementTagRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RequirementService {

    private final RequirementRepository requirementRepository;
    private final RequirementTagRepository requirementTagRepository;
    private final ProjectRepository projectRepository;

    public RequirementService(RequirementRepository requirementRepository,
                              RequirementTagRepository requirementTagRepository,
                              ProjectRepository projectRepository) {
        this.requirementRepository = requirementRepository;
        this.requirementTagRepository = requirementTagRepository;
        this.projectRepository = projectRepository;
    }

    @Transactional(readOnly = true)
    public List<RequirementResponse> getAllRequirements() {
        return requirementRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RequirementResponse> getRequirementsByProject(Integer projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));
        return requirementRepository.findByProject(project).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RequirementResponse getRequirementById(Integer id) {
        Requirement req = requirementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Requirement not found with id: " + id));
        return mapToResponse(req);
    }

    @Transactional
    public RequirementResponse createRequirement(RequirementRequest request) {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + request.getProjectId()));

        Requirement req = new Requirement(
                project,
                request.getRequirementName(),
                request.getDescription(),
                request.getPriority() != null ? request.getPriority() : "MUST_HAVE",
                request.getStatus() != null ? request.getStatus() : "DRAFT"
        );
        req = requirementRepository.save(req);

        if (request.getTags() != null) {
            for (String tag : request.getTags()) {
                requirementTagRepository.save(new RequirementTag(req, tag.trim()));
            }
        }

        return mapToResponse(req);
    }

    @Transactional
    public RequirementResponse updateRequirement(Integer id, RequirementRequest request) {
        Requirement req = requirementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Requirement not found with id: " + id));

        req.setRequirementName(request.getRequirementName());
        req.setDescription(request.getDescription());
        if (request.getPriority() != null) req.setPriority(request.getPriority());
        if (request.getStatus() != null) req.setStatus(request.getStatus());

        if (request.getTags() != null) {
            List<RequirementTag> existing = requirementTagRepository.findByRequirement(req);
            requirementTagRepository.deleteAll(existing);
            for (String tag : request.getTags()) {
                requirementTagRepository.save(new RequirementTag(req, tag.trim()));
            }
        }

        req = requirementRepository.save(req);
        return mapToResponse(req);
    }

    @Transactional
    public void deleteRequirement(Integer id) {
        Requirement req = requirementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Requirement not found with id: " + id));
        requirementRepository.delete(req);
    }

    private RequirementResponse mapToResponse(Requirement req) {
        RequirementResponse res = new RequirementResponse();
        res.setRequirementId(req.getRequirementId());
        res.setProjectId(req.getProject().getProjectId());
        res.setProjectName(req.getProject().getProjectName());
        res.setRequirementName(req.getRequirementName());
        res.setDescription(req.getDescription());
        res.setPriority(req.getPriority());
        res.setStatus(req.getStatus());

        List<RequirementTag> tags = requirementTagRepository.findByRequirement(req);
        res.setTags(tags.stream().map(RequirementTag::getTag).collect(Collectors.toList()));
        return res;
    }
}
