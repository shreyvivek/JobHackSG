package sc2006;

import java.time.LocalDateTime;
import java.util.*;

public class AdminIngestionController {

    public AdminIngestionController() {}

    /** UC-12: run ingestion; UC-13: add postings (simulated) */
    public IngestionRun runIngestion() {
        int id = InMemoryStore.nextRunId();
        IngestionRun run = new IngestionRun(id, LocalDateTime.now(), "RUNNING");
        InMemoryStore.INGESTION_RUNS.add(run);
        InMemoryStore.RUN_LOGS.put(id, new ArrayList<>());
        InMemoryStore.RUN_LOGS.get(id).add("Started ingestion at " + LocalDateTime.now());

        // simulate: seed data if empty
        int before = InMemoryStore.JOBS.size();
        InMemoryStore.seedIfEmpty();
        int after = InMemoryStore.JOBS.size();

        run.finish("OK", (after-before), 0, 0);
        InMemoryStore.RUN_LOGS.get(id).add("Finished with status OK. Inserted=" + (after-before));
        return run;
    }

    public List<String> viewLogs(int runId) {
        return new ArrayList<>(InMemoryStore.RUN_LOGS.getOrDefault(runId, List.of("No logs")));
    }

    public IngestionRun recheckIngestion(int runId) {
        // simply append a check log
        InMemoryStore.RUN_LOGS.computeIfAbsent(runId, k->new ArrayList<>()).add("Rechecked at " + LocalDateTime.now());
        return InMemoryStore.INGESTION_RUNS.stream().filter(r -> r.getRunId()==runId).findFirst().orElse(null);
    }

    /** UC-13: Admin add a new job posting (simulated) */
    public JobPosting addJobPosting(String title, String company, String location, String description) {
        if(title==null || title.isBlank()) throw new Exceptions.Validation("Title required");
        if(company==null || company.isBlank()) throw new Exceptions.Validation("Company required");
        if(location==null || location.isBlank()) throw new Exceptions.Validation("Location required");
        int id = InMemoryStore.nextJobId();
        JobPosting jp = new JobPosting(id, title, company, location, description, LocalDateTime.now(), null, true);
        InMemoryStore.JOBS.put(id, jp);
        return jp;
    }
}
