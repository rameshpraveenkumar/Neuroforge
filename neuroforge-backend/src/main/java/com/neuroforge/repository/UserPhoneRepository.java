package com.neuroforge.repository;

import com.neuroforge.entity.User;
import com.neuroforge.entity.UserPhone;
import com.neuroforge.entity.UserPhoneId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UserPhoneRepository extends JpaRepository<UserPhone, UserPhoneId> {
    List<UserPhone> findByUser(User user);
}
