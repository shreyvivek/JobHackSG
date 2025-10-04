package sc2006;

public class JobDetailsPage {

    public JobDetailsPage() {}

    public JobPosting displayJob(int jobId) {
        return new JobDetailsController().getJob(jobId);
    }

    public void showError(int jobId) { /* UI */ }

    public void showJobMsg(String message) { /* UI */ }

    public Application logApplication(int jobId, String status) {
        throw new UnsupportedOperationException("Need userId in boundary to log application");
    }

    public void viewCourses(Skill[] missingSkills) { /* link to CourseController */ }
}
