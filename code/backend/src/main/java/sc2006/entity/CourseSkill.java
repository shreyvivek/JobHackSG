package sc2006.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "course_skills")
public class CourseSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private int courseId;
    private int skillId;

    public CourseSkill() {}

    public CourseSkill(int id, int courseId, int skillId) {
        this.id = id;
        this.courseId = courseId;
        this.skillId = skillId;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getCourseId() { return courseId; }
    public void setCourseId(int courseId) { this.courseId = courseId; }

    public int getSkillId() { return skillId; }
    public void setSkillId(int skillId) { this.skillId = skillId; }
}
