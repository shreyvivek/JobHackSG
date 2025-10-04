package sc2006;

import java.util.List;

public class AdminDashboard {

    public AdminDashboard() {}

    public void displayIngestionStatus(int runId) {
        var run = new AdminIngestionController().recheckIngestion(runId);
        if(run!=null){
            System.out.println("Run #" + run.getRunId() + " status=" + run.getStatus());
        } else {
            System.out.println("No such run");
        }
    }

    public IngestionRun triggerIngestion() {
        return new AdminIngestionController().runIngestion();
    }

    public void viewLogs(int runId) {
        List<String> logs = new AdminIngestionController().viewLogs(runId);
        logs.forEach(System.out::println);
    }
}
