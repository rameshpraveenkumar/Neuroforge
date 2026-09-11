package com.neuroforge.service;

import com.neuroforge.dto.request.UserUpdateRequest;
import com.neuroforge.dto.response.UserProfileResponse;
import com.neuroforge.entity.User;
import com.neuroforge.entity.UserPhone;
import com.neuroforge.exception.ResourceNotFoundException;
import com.neuroforge.repository.UserPhoneRepository;
import com.neuroforge.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserAdminService {

    private final UserRepository userRepository;
    private final UserPhoneRepository userPhoneRepository;

    public UserAdminService(UserRepository userRepository, UserPhoneRepository userPhoneRepository) {
        this.userRepository = userRepository;
        this.userPhoneRepository = userPhoneRepository;
    }

    @Transactional(readOnly = true)
    public List<UserProfileResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UserProfileResponse getUserById(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return mapToResponse(user);
    }

    @Transactional
    public UserProfileResponse updateUser(Integer id, UserUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        if (request.getName() != null) user.setName(request.getName());
        if (request.getEmail() != null) user.setEmail(request.getEmail());
        if (request.getRole() != null) user.setRole(request.getRole());
        if (request.getPhone() != null) user.setPhone(request.getPhone());

        user = userRepository.save(user);
        return mapToResponse(user);
    }

    @Transactional
    public void deleteUser(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        userRepository.delete(user);
    }

    private UserProfileResponse mapToResponse(User user) {
        List<UserPhone> phones = userPhoneRepository.findByUser(user);
        List<String> phoneNumbers = phones.stream().map(UserPhone::getPhoneNumber).collect(Collectors.toList());

        return new UserProfileResponse(
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getName(),
                user.getRole(),
                user.getPhone(),
                phoneNumbers
        );
    }
}
