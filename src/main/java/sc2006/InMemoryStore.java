package sc2006;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/** Super-light in-memory store so everything runs locally. */
final class InMemoryStore {
    private InMemoryStore() {}

    static final Map<Integer, User> USERS = new ConcurrentHashMap<>();
    static final Map<String, Integer> EMAIL_TO_USER = new ConcurrentHashMap<>();
    static final Map<Integer, JobPosting> JOBS = new ConcurrentHashMap<>();
    static final Map<Integer, Application> APPS = new ConcurrentHashMap<>();
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
    static void seedIfEmpty(){
        if(SKILLS.isEmpty()){
            addSkill("Python"); addSkill("Excel"); addSkill("SQL"); addSkill("Java");
        }
        if(SECTORS.isEmpty()){
            addSector("Infocomm & Tech", 85, "Growing");
            addSector("Manufacturing", 62, "Stable");
        }
        if(JOBS.isEmpty()){
            JobPosting j1 = new JobPosting(InMemoryStore.nextJobId(), "Data Analyst (Entry)",
                    "SG Startup", "Singapore", "Analyse datasets, build dashboards.",
                    LocalDateTime.now().minusDays(2), null, true);
            JobPosting j2 = new JobPosting(InMemoryStore.nextJobId(), "Junior Java Developer",
                    "FinTech SG", "Singapore", "Build REST APIs and services.",
                    LocalDateTime.now().minusDays(1), null, true);
            JOBS.put(j1.getJobId(), j1); JOBS.put(j2.getJobId(), j2);
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
