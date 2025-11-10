package sc2006.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*") //  allows frontend access
public class CourseController {

    @GetMapping("/api/courses/test")
    public String testCourses() {
        return "Courses endpoint is working!";
    }
}

