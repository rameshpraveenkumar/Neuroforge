package com.neuroforge.repository;

import com.neuroforge.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByName(String name);
    Optional<User> findByEmail(String email);
    Optional<User> findByRole(String role);
    List<User> findAllByRole(String role);
    boolean existsByName(String name);
    boolean existsByEmail(String email);
}
