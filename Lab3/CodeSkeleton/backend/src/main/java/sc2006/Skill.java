package sc2006;

import java.util.Objects;

public class Skill {
    private int skillId;
    private String name;

    public Skill(){}

    public Skill(int skillId, String name) {
        this.skillId = skillId;
        this.name = Objects.requireNonNull(name, "name");
    }

    public int getSkillId(){ return skillId; }
    public String getName(){ return name; }

    @Override public String toString(){ return name + " (#" + skillId + ")"; }
}
