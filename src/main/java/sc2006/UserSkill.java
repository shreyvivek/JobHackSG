package sc2006;

public class UserSkill {
    private int userId;
    private int skillId;
    private int proficiency; // 1..5
    private String source;   // "self", "resume", "course"

    public UserSkill(){}

    public UserSkill(int userId, int skillId, int proficiency, String source) {
        this.userId = userId;
        this.skillId = skillId;
        this.proficiency = proficiency;
        this.source = source;
    }

    public int getUserId(){ return userId; }
    public int getSkillId(){ return skillId; }
    public int getProficiency(){ return proficiency; }
    public String getSource(){ return source; }

    public void setProficiency(int p){ this.proficiency = p; }
}
