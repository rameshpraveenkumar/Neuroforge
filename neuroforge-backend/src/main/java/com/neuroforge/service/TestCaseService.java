package com.neuroforge.service;

import com.neuroforge.dto.request.TestCaseRequest;
import com.neuroforge.dto.response.TestCaseResponse;
import com.neuroforge.entity.Task;
import com.neuroforge.entity.TestCase;
import com.neuroforge.entity.TestCaseId;
import com.neuroforge.exception.ResourceNotFoundException;
import com.neuroforge.repository.BugRepository;
import com.neuroforge.repository.TaskRepository;
import com.neuroforge.repository.TestCaseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TestCaseService {

    private final TestCaseRepository testCaseRepository;
    private final TaskRepository taskRepository;
    private final BugRepository bugRepository;

    public TestCaseService(TestCaseRepository testCaseRepository,
                           TaskRepository taskRepository,
                           BugRepository bugRepository) {
        this.testCaseRepository = testCaseRepository;
        this.taskRepository = taskRepository;
        this.bugRepository = bugRepository;
    }

    @Transactional(readOnly = true)
    public List<TestCaseResponse> getAllTestCases() {
        return testCaseRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TestCaseResponse> getTestCasesByTask(Integer taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));
        return testCaseRepository.findByTask(task).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TestCaseResponse getTestCase(Integer taskId, Integer testNumber) {
        TestCaseId id = new TestCaseId(taskId, testNumber);
        TestCase tc = testCaseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Test case not found with task id: " + taskId + " and test number: " + testNumber));
        return mapToResponse(tc);
    }

    @Transactional
    public TestCaseResponse createTestCase(TestCaseRequest request) {
        Task task = taskRepository.findById(request.getTaskId())
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + request.getTaskId()));

        int nextTestNumber = request.getTestNumber() != null ? request.getTestNumber() :
                testCaseRepository.findByTask(task).stream().mapToInt(TestCase::getTestNumber).max().orElse(0) + 1;

        TestCase tc = new TestCase(
                task,
                nextTestNumber,
                request.getTestName(),
                request.getDescription(),
                request.getExpectedResult()
        );
        tc = testCaseRepository.save(tc);
        return mapToResponse(tc);
    }

    @Transactional
    public TestCaseResponse updateTestCase(Integer taskId, Integer testNumber, TestCaseRequest request) {
        TestCaseId id = new TestCaseId(taskId, testNumber);
        TestCase tc = testCaseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Test case not found with task id: " + taskId + " and test number: " + testNumber));

        tc.setTestName(request.getTestName());
        tc.setDescription(request.getDescription());
        tc.setExpectedResult(request.getExpectedResult());

        tc = testCaseRepository.save(tc);
        return mapToResponse(tc);
    }

    @Transactional
    public void deleteTestCase(Integer taskId, Integer testNumber) {
        TestCaseId id = new TestCaseId(taskId, testNumber);
        TestCase tc = testCaseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Test case not found with task id: " + taskId + " and test number: " + testNumber));
        testCaseRepository.delete(tc);
    }

    private TestCaseResponse mapToResponse(TestCase tc) {
        TestCaseResponse res = new TestCaseResponse();
        res.setTaskId(tc.getTask().getTaskId());
        res.setTestNumber(tc.getTestNumber());
        res.setTaskTitle(tc.getTask().getTitle());
        res.setTestName(tc.getTestName());
        res.setDescription(tc.getDescription());
        res.setExpectedResult(tc.getExpectedResult());
        res.setBugsCount(bugRepository.findByTestCase(tc).size());
        return res;
    }
}
