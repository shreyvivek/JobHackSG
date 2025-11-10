package sc2006;

public class CourseSkill {
    private int courseId;
    private int skillId;

    public CourseSkill(){}

    public CourseSkill(int courseId, int skillId) {
        this.courseId = courseId;
        this.skillId = skillId;
    }

    public int getCourseId(){ return courseId; }
    public int getSkillId(){ return skillId; }
}
