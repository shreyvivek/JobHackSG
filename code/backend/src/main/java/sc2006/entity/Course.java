package sc2006.entity;

public class Course {

    private int courseId;
    private String title;
    private String provider;
    private String url;  // stored as String for simplicity (instead of java.net.URL)

    public Course() {}

    public Course(int courseId, String title, String provider, String url) {
        this.courseId = courseId;
        this.title = title;
        this.provider = provider;
        this.url = url;
    }

    public int getCourseId() { return courseId; }
    public void setCourseId(int courseId) { this.courseId = courseId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
}
