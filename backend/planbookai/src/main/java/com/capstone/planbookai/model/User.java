package com.capstone.planbookai.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.Date;

@Entity
@Table(name = "users",
        uniqueConstraints = {
            @UniqueConstraint(columnNames = "username"),
            @UniqueConstraint(columnNames = "email")
        })
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String fullName;

    private String phone; 

    @Enumerated(EnumType.STRING)
    private Role role;
    
    @Column(columnDefinition = "VARCHAR(20) DEFAULT 'ACTIVE'")
    private String status;

    @Column(columnDefinition = "BOOLEAN DEFAULT true")
    private boolean enabled = true;

    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = new Date();
        if (status == null) status = "ACTIVE"; // Mặc định là Active
    }
}