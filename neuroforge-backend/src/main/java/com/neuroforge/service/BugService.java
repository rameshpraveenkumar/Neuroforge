package com.neuroforge.service;

import com.neuroforge.dto.request.BugRequest;
import com.neuroforge.dto.request.BugStatusUpdateRequest;
import com.neuroforge.dto.response.BugResponse;
import com.neuroforge.entity.*;
import com.neuroforge.exception.ResourceNotFoundException;
import com.neuroforge.repository.BugRepository;
import com.neuroforge.repository.TestCaseRepository;
import com.neuroforge.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BugService {

    private final BugRepository bugRepository;
    private final TestCaseRepository testCaseRepository;
    private final UserRepository userRepository;

    public BugService(BugRepository bugRepository,
                      TestCaseRepository testCaseRepository,
                      UserRepository userRepository) {
        this.bugRepository = bugRepository;
        this.testCaseRepository = testCaseRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<BugResponse> getAllBugs() {
        return bugRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BugResponse> getBugsByTestCase(Integer taskId, Integer testNumber) {
        TestCaseId id = new TestCaseId(taskId, testNumber);
        TestCase tc = testCaseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Test case not found with task id: " + taskId + " and test number: " + testNumber));
        return bugRepository.findByTestCase(tc).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BugResponse> getBugsByAssignee(Integer developerId) {
        User dev = userRepository.findById(developerId)
                .orElseThrow(() -> new ResourceNotFoundException("Developer not found with id: " + developerId));
        return bugRepository.findByAssignedDeveloper(dev).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BugResponse getBug(Integer taskId, Integer testNumber, Integer bugNumber) {
        TestCaseId tcId = new TestCaseId(taskId, testNumber);
        BugId id = new BugId(tcId, bugNumber);
        Bug bug = bugRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bug not found with taskId=" + taskId + ", testNumber=" + testNumber + ", bugNumber=" + bugNumber));
        return mapToResponse(bug);
    }

    @Transactional
    public BugResponse createBug(BugRequest request) {
        TestCaseId tcId = new TestCaseId(request.getTaskId(), request.getTestNumber());
        TestCase tc = testCaseRepository.findById(tcId)
                .orElseThrow(() -> new ResourceNotFoundException("Test case not found with taskId=" + request.getTaskId() + ", testNumber=" + request.getTestNumber()));

        User developer = null;
        if (request.getAssignedDeveloperId() != null) {
            developer = userRepository.findById(request.getAssignedDeveloperId())
                    .orElseThrow(() -> new ResourceNotFoundException("Developer not found with id: " + request.getAssignedDeveloperId()));
        }

        int nextBugNumber = request.getBugNumber() != null ? request.getBugNumber() :
                bugRepository.findByTestCase(tc).stream().mapToInt(Bug::getBugNumber).max().orElse(0) + 1;

        Bug bug = new Bug(
                tc,
                nextBugNumber,
                request.getBugTitle(),
                request.getSeverity() != null ? request.getSeverity() : "MAJOR",
                request.getStatus() != null ? request.getStatus() : "NEW",
                developer
        );
        bug = bugRepository.save(bug);
        return mapToResponse(bug);
    }

    @Transactional
    public BugResponse updateBugStatus(Integer taskId, Integer testNumber, Integer bugNumber, BugStatusUpdateRequest request) {
        TestCaseId tcId = new TestCaseId(taskId, testNumber);
        BugId id = new BugId(tcId, bugNumber);
        Bug bug = bugRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bug not found"));

        bug.setStatus(request.getStatus());

        if (request.getAssignedDeveloperId() != null) {
            User dev = userRepository.findById(request.getAssignedDeveloperId())
                    .orElseThrow(() -> new ResourceNotFoundException("Developer not found with id: " + request.getAssignedDeveloperId()));
            bug.setAssignedDeveloper(dev);
        }

        bug = bugRepository.save(bug);
        return mapToResponse(bug);
    }

    @Transactional
    public void deleteBug(Integer taskId, Integer testNumber, Integer bugNumber) {
        TestCaseId tcId = new TestCaseId(taskId, testNumber);
        BugId id = new BugId(tcId, bugNumber);
        Bug bug = bugRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bug not found"));
        bugRepository.delete(bug);
    }

    private BugResponse mapToResponse(Bug bug) {
        BugResponse res = new BugResponse();
        res.setTaskId(bug.getTestCase().getTask().getTaskId());
        res.setTestNumber(bug.getTestCase().getTestNumber());
        res.setBugNumber(bug.getBugNumber());
        res.setTaskTitle(bug.getTestCase().getTask().getTitle());
        res.setTestName(bug.getTestCase().getTestName());
        res.setBugTitle(bug.getBugTitle());
        res.setSeverity(bug.getSeverity());
        res.setStatus(bug.getStatus());

        if (bug.getAssignedDeveloper() != null) {
            res.setAssignedDeveloperId(bug.getAssignedDeveloper().getUserId());
            res.setAssignedDeveloperName(bug.getAssignedDeveloper().getName());
        }

        return res;
    }
}
