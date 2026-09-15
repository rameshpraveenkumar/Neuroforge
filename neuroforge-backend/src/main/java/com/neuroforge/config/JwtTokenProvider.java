package com.neuroforge.config;

import com.neuroforge.entity.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtTokenProvider {

    @Value("${neuroforge.jwt.secret}")
    private String jwtSecret;

    @Value("${neuroforge.jwt.expiration-ms}")
    private long jwtExpirationMs;

    private static final String DEFAULT_DEV_SECRET = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";

    private SecretKey getSigningKey() {
        String secret = (jwtSecret != null && jwtSecret.trim().length() >= 32)
                ? jwtSecret.trim()
                : DEFAULT_DEV_SECRET;
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(User user) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        String roleStr = user.getRole();
        String authority = roleStr.startsWith("ROLE_") ? roleStr : "ROLE_" + roleStr;

        return Jwts.builder()
                .subject(user.getName())
                .claim("userId", user.getUserId())
                .claim("email", user.getEmail())
                .claim("fullName", user.getName())
                .claim("role", roleStr)
                .claim("authority", authority)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey())
                .compact();
    }

    public String getUsernameFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claims.getSubject();
    }

    public String getRoleFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claims.get("role", String.class);
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public long getExpirationMs() {
        return jwtExpirationMs;
    }
}
