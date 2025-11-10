package sc2006;

import java.util.List;

import sc2006.Application;
import sc2006.JobApplicationController;



public class ApplicationsPage {

    public ApplicationsPage() {}

    public void displayApplications(JobApplication[] applicationList) {
        for(var a : applicationList){
            System.out.println("#%d job=%d status=%s note=%s".formatted(a.getAppId(), a.getJobId(), a.getStatus(), a.getNote()));
        }
    }

    public JobApplication updateApplicationStatus(int appId, String status) {
        return new JobApplicationController().updateJobApplication(appId, status, null);
    }

    public List<JobApplication> loadForUser(int userId){
        return new JobApplicationController().listJobApplications(userId);
    }
}
