package sc2006;

import java.net.URL;

public class Course {
    private int courseId;
    private String title;
    private String provider;
    private URL url;

    public Course(){}

    public Course(int courseId, String title, String provider, URL url) {
        this.courseId = courseId;
        this.title = title;
        this.provider = provider;
        this.url = url;
    }

    public int getCourseId(){ return courseId; }
    public String getTitle(){ return title; }
    public String getProvider(){ return provider; }
    public URL getUrl(){ return url; }
}
