package com.neuroforge.service;

import com.neuroforge.dto.request.DocumentationRequest;
import com.neuroforge.dto.response.DocumentationResponse;
import com.neuroforge.entity.Documentation;
import com.neuroforge.entity.DocumentationId;
import com.neuroforge.entity.Project;
import com.neuroforge.exception.ResourceNotFoundException;
import com.neuroforge.repository.DocumentationRepository;
import com.neuroforge.repository.ProjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DocumentationService {

    private final DocumentationRepository documentationRepository;
    private final ProjectRepository projectRepository;
    private final AuditLogService auditLogService;

    public DocumentationService(DocumentationRepository documentationRepository,
                                ProjectRepository projectRepository,
                                AuditLogService auditLogService) {
        this.documentationRepository = documentationRepository;
        this.projectRepository = projectRepository;
        this.auditLogService = auditLogService;
    }

    @Transactional(readOnly = true)
    public List<DocumentationResponse> getAllDocumentation() {
        return documentationRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<DocumentationResponse> getDocumentationByProject(Integer projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));
        return documentationRepository.findByProject(project).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DocumentationResponse getDocumentation(Integer projectId, Integer version) {
        DocumentationId id = new DocumentationId(projectId, version);
        Documentation doc = documentationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Documentation not found with projectId=" + projectId + " and version=" + version));
        return mapToResponse(doc);
    }

    @Transactional
    public DocumentationResponse createDocumentation(DocumentationRequest request) {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + request.getProjectId()));

        int nextVersion = request.getDocumentVersion() != null ? request.getDocumentVersion() :
                documentationRepository.findByProject(project).stream().mapToInt(Documentation::getDocumentVersion).max().orElse(0) + 1;

        Documentation doc = new Documentation(
                project,
                nextVersion,
                request.getTitle(),
                request.getDocumentType() != null ? request.getDocumentType() : "ADR",
                LocalDateTime.now()
        );
        doc = documentationRepository.save(doc);

        auditLogService.record("DOCUMENTATION_CREATED", "CREATE", "DOCUMENTATION", Long.valueOf(project.getProjectId()), "Architecture document created: " + doc.getTitle());

        return mapToResponse(doc);
    }

    @Transactional
    public DocumentationResponse updateDocumentation(Integer projectId, Integer version, DocumentationRequest request) {
        DocumentationId id = new DocumentationId(projectId, version);
        Documentation doc = documentationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Documentation not found"));

        doc.setTitle(request.getTitle());
        if (request.getDocumentType() != null) doc.setDocumentType(request.getDocumentType());

        doc = documentationRepository.save(doc);

        auditLogService.record("DOCUMENTATION_UPDATED", "UPDATE", "DOCUMENTATION", Long.valueOf(projectId), "Architecture document updated: " + doc.getTitle());

        return mapToResponse(doc);
    }

    @Transactional
    public void deleteDocumentation(Integer projectId, Integer version) {
        DocumentationId id = new DocumentationId(projectId, version);
        Documentation doc = documentationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Documentation not found"));
        documentationRepository.delete(doc);

        auditLogService.record("DOCUMENTATION_DELETED", "DELETE", "DOCUMENTATION", Long.valueOf(projectId), "Architecture document deleted for project ID: " + projectId);
    }

    private DocumentationResponse mapToResponse(Documentation doc) {
        DocumentationResponse res = new DocumentationResponse();
        res.setProjectId(doc.getProject().getProjectId());
        res.setDocumentVersion(doc.getDocumentVersion());
        res.setProjectName(doc.getProject().getProjectName());
        res.setTitle(doc.getTitle());
        res.setDocumentType(doc.getDocumentType());
        res.setCreatedDate(doc.getCreatedDate());
        return res;
    }
}
