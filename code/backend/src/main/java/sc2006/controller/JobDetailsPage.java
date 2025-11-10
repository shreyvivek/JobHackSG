package sc2006.controller;

import sc2006.Application;
import sc2006.entity.JobApplication;
import sc2006.entity.JobPosting;
import sc2006.entity.Skill;

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

    public JobApplication logApplication(int userId, int jobId, String status) {
        return new JobDetailsController().logApplication(userId, jobId, status, null);
    }
}
