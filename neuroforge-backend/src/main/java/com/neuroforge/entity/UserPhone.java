package com.neuroforge.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "user_phones")
@IdClass(UserPhoneId.class)
public class UserPhone {

    @Id
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Id
    @Column(name = "phone_number", nullable = false, length = 255)
    private String phoneNumber;

    public UserPhone() {}

    public UserPhone(User user, String phoneNumber) {
        this.user = user;
        this.phoneNumber = phoneNumber;
    }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
}
