package sc2006;

import java.util.List;

public class ApplicationsPage {

    public ApplicationsPage() {}

    public void displayApplications(Application[] applicationList) {
        for(var a : applicationList){
            System.out.println("#%d job=%d status=%s note=%s".formatted(a.getAppId(), a.getJobId(), a.getStatus(), a.getNote()));
        }
    }

    public Application updateApplicationStatus(int appId, String status) {
        return new ApplicationController().updateApplication(appId, status, null);
    }

    public List<Application> loadForUser(int userId){
        return new ApplicationController().listApplications(userId);
    }
}
