package sc2006;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.net.URI;
import java.net.URL;

/** Super-light in-memory store so everything runs locally. */
final class InMemoryStore {
    private InMemoryStore() {}

    static final Map<Integer, User> USERS = new ConcurrentHashMap<>();
    static final Map<String, Integer> EMAIL_TO_USER = new ConcurrentHashMap<>();
    static final Map<Integer, JobPosting> JOBS = new ConcurrentHashMap<>();
    static final Map<Integer, JobApplication> APPS = new ConcurrentHashMap<>();
    static final Map<Integer, List<Integer>> SAVED_BY_USER = new ConcurrentHashMap<>();
    static final Map<Integer, List<UserSkill>> USER_SKILLS = new ConcurrentHashMap<>();
    static final Map<Integer, Resume> RESUMES = new ConcurrentHashMap<>();
    static final Map<Integer, Course> COURSES = new ConcurrentHashMap<>();
    static final Map<Integer, Skill> SKILLS = new ConcurrentHashMap<>();
    static final Map<Integer, Sector> SECTORS = new ConcurrentHashMap<>();
    static final List<IngestionRun> INGESTION_RUNS = Collections.synchronizedList(new ArrayList<>());
    static final Map<Integer, List<String>> RUN_LOGS = new ConcurrentHashMap<>();

    private static int userSeq=1, jobSeq=1, appSeq=1, runSeq=1, resumeSeq=1, courseSeq=1, skillSeq=1, sectorSeq=1;

    static synchronized int nextUserId(){ return userSeq++; }
    static synchronized int nextJobId(){ return jobSeq++; }
    static synchronized int nextAppId(){ return appSeq++; }
    static synchronized int nextRunId(){ return runSeq++; }
    static synchronized int nextResumeId(){ return resumeSeq++; }
    static synchronized int nextCourseId(){ return courseSeq++; }
    static synchronized int nextSkillId(){ return skillSeq++; }
    static synchronized int nextSectorId(){ return sectorSeq++; }

    /** Seed minimal data so pages don’t look empty. */
    static void seedIfEmpty() {
    // SKILLS
    if (SKILLS.isEmpty()) {
        addSkill("Python"); addSkill("Excel"); addSkill("SQL"); addSkill("Java");
    }

    // SECTORS
    if (SECTORS.isEmpty()) {
        addSector("Infocomm & Tech", 85, "Growing");
        addSector("Manufacturing", 62, "Stable");
    }

    // JOBS
    if (JOBS.isEmpty()) {
        try {
            JobPosting j1 = new JobPosting(nextJobId(), "Data Analyst (Entry)", "SG Startup", "Singapore",
                    "Analyse datasets, build dashboards.", LocalDateTime.now().minusDays(2),
                    new URI("http://example.com/apply").toURL(), true);
            JobPosting j2 = new JobPosting(nextJobId(), "Junior Java Developer", "FinTech SG", "Singapore",
                    "Build REST APIs and services.", LocalDateTime.now().minusDays(1),
                    new URI("http://example.com/apply").toURL(), true);
            JOBS.put(j1.getJobId(), j1);
            JOBS.put(j2.getJobId(), j2);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // USERS
    if (USERS.isEmpty()) {
        int id = nextUserId();
        User u = new User(id, "Sundari", "sundari@example.com",
                "dummyHash", "dummySalt", "NUS", 2025);
        USERS.put(id, u);
        EMAIL_TO_USER.put("sundari@example.com", id);
    }

    // (optional) Seed a JobApplication for testing
    if (APPS.isEmpty()) {
        int appId = nextAppId();
        APPS.put(appId, new JobApplication(appId, 1, 1, "Applied", "", LocalDateTime.now()));
    }
}



    private static void addSkill(String name){
        int id = nextSkillId();
        SKILLS.put(id, new Skill(id, name));
    }
    private static void addSector(String name, int vacancyIdx, String direction){
        int id = nextSectorId();
        SECTORS.put(id, new Sector(id, name, vacancyIdx, direction));
    }
}
