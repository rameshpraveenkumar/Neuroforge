package com.neuroforge;

import com.neuroforge.config.JwtTokenProvider;
import com.neuroforge.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class AuthControllerTest {

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Test
    void testJwtTokenGenerationAndClaims() {
        User testUser = new User("Liam Zhao", "dev@neuroforge.io", "hashedPass", "DEVELOPER", "+1 (555) 019-7712");
        testUser.setUserId(10);

        String token = jwtTokenProvider.generateToken(testUser);
        assertNotNull(token);
        assertTrue(jwtTokenProvider.validateToken(token));
        assertEquals("Liam Zhao", jwtTokenProvider.getUsernameFromToken(token));
        assertEquals("DEVELOPER", jwtTokenProvider.getRoleFromToken(token));
    }
}
