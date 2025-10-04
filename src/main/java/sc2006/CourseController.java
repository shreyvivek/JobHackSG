package sc2006;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class CourseController {

    public CourseController() {}

    /** UC-11: suggest courses for missing skills (very simple demo) */
    public List<Course> suggestCourses(Skill[] missingSkills) {
        List<Course> out = new ArrayList<>();
        for(var c : InMemoryStore.COURSES.values()) out.add(c);
        return out;
    }

    public Optional<Course> fetchCourseDetails(int courseId) {
        return Optional.ofNullable(InMemoryStore.COURSES.get(courseId));
    }
}
