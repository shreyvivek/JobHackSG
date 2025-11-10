package sc2006.entity;

public class UserSkill {
    private Long userId;
    private Long skillId;
    private int level;
    private String source;

    // === Constructors ===
    public UserSkill() {}

    public UserSkill(Long userId, Long skillId, int level, String source) {
        this.userId = userId;
        this.skillId = skillId;
        this.level = level;
        this.source = source;
    }
    public int getLevel() {
        return level;
    }

    public void setLevel(int level) {
        this.level = level;
    }

    // === Getters and Setters ===
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getSkillId() {
        return skillId;
    }

    public void setSkillId(Long skillId) {
        this.skillId = skillId;
    }

    // Removed proficiency getter/setter

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }
}
