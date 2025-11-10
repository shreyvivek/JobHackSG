package sc2006;

import java.net.URL;

public class Course {
    private int courseId;
    private String title;
    private String provider;
    private URL url;

    public int getCourseId() { return courseId; }
    public String getTitle() { return title; }
    public String getProvider() { return provider; }
    public URL getUrl() { return url; }

    public void setCourseId(int courseId) { this.courseId = courseId; }
    public void setTitle(String title) { this.title = title; }
    public void setProvider(String provider) { this.provider = provider; }
    public void setUrl(URL url) { this.url = url; }
}
