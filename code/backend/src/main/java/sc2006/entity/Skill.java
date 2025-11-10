package sc2006.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "skills")
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "skill_id")
    private Long skillId;

    @Column(nullable = false, unique = true)
    private String name;

    // === Constructors ===
    public Skill() {}  // Default constructor (required by JPA)

    public Skill(Long skillId, String name) {
        this.skillId = skillId;
        this.name = name;
    }

    public Skill(String name) {
        this.name = name;
    }

    // === Getters and Setters ===
    public Long getSkillId() {
        return skillId;
    }

    public void setSkillId(Long skillId) {
        this.skillId = skillId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
