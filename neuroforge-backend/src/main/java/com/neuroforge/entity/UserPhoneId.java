package com.neuroforge.entity;

import java.io.Serializable;
import java.util.Objects;

public class UserPhoneId implements Serializable {
    private Integer user;
    private String phoneNumber;

    public UserPhoneId() {}

    public UserPhoneId(Integer user, String phoneNumber) {
        this.user = user;
        this.phoneNumber = phoneNumber;
    }

    public Integer getUser() { return user; }
    public void setUser(Integer user) { this.user = user; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserPhoneId that = (UserPhoneId) o;
        return Objects.equals(user, that.user) && Objects.equals(phoneNumber, that.phoneNumber);
    }

    @Override
    public int hashCode() {
        return Objects.hash(user, phoneNumber);
    }
}
