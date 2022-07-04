package com.coop.racemgr.service;

import java.util.ArrayList;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class JwtUserDetailsService implements UserDetailsService {
    String adminUser = System.getenv("RM_ADMIN_USER");

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        if (adminUser.equals(username)) {
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            String adminPassword = System.getenv("RM_ADMIN_PASSWORD");
            String hashedAdminPassword = passwordEncoder.encode(adminPassword);
            return new User(adminUser, hashedAdminPassword, new ArrayList<>());
        } else {
            throw new UsernameNotFoundException("User not found with username: " + username);
        }
    }
}
