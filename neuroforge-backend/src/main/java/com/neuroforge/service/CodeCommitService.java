package com.neuroforge.service;

import com.neuroforge.dto.request.CodeCommitRequest;
import com.neuroforge.dto.response.CodeCommitResponse;
import com.neuroforge.entity.CodeCommit;
import com.neuroforge.entity.Repository;
import com.neuroforge.entity.User;
import com.neuroforge.exception.ResourceNotFoundException;
import com.neuroforge.repository.CodeCommitRepository;
import com.neuroforge.repository.RepositoryEntityRepository;
import com.neuroforge.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CodeCommitService {

    private final CodeCommitRepository commitRepository;
    private final RepositoryEntityRepository repositoryRepository;
    private final UserRepository userRepository;

    public CodeCommitService(CodeCommitRepository commitRepository,
                             RepositoryEntityRepository repositoryRepository,
                             UserRepository userRepository) {
        this.commitRepository = commitRepository;
        this.repositoryRepository = repositoryRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<CodeCommitResponse> getCommitsByRepository(Integer repositoryId) {
        Repository repo = repositoryRepository.findById(repositoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Repository not found with id: " + repositoryId));
        return commitRepository.findByRepository(repo).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public CodeCommitResponse recordCommit(CodeCommitRequest request) {
        Repository repo = repositoryRepository.findById(request.getRepositoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Repository not found with id: " + request.getRepositoryId()));

        User dev = null;
        if (request.getDeveloperId() != null) {
            dev = userRepository.findById(request.getDeveloperId())
                    .orElseThrow(() -> new ResourceNotFoundException("Developer not found with id: " + request.getDeveloperId()));
        }

        int nextCommitNumber = request.getCommitNumber() != null ? request.getCommitNumber() :
                commitRepository.findByRepository(repo).stream().mapToInt(CodeCommit::getCommitNumber).max().orElse(0) + 1;

        CodeCommit commit = new CodeCommit(
                repo,
                nextCommitNumber,
                request.getCommitMessage(),
                LocalDateTime.now(),
                dev
        );
        commit = commitRepository.save(commit);
        return mapToResponse(commit);
    }

    private CodeCommitResponse mapToResponse(CodeCommit commit) {
        CodeCommitResponse res = new CodeCommitResponse();
        res.setRepositoryId(commit.getRepository().getRepositoryId());
        res.setCommitNumber(commit.getCommitNumber());
        res.setCommitMessage(commit.getCommitMessage());
        res.setCommitDate(commit.getCommitDate());

        if (commit.getDeveloper() != null) {
            res.setDeveloperId(commit.getDeveloper().getUserId());
            res.setDeveloperName(commit.getDeveloper().getName());
            res.setDeveloperEmail(commit.getDeveloper().getEmail());
        }

        return res;
    }
}
