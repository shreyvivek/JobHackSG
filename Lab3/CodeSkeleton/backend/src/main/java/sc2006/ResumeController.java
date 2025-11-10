package sc2006;

import java.time.LocalDateTime;
import java.util.*;

import static sc2006.Exceptions.*;

public class ResumeController {

    public ResumeController() {}

    /** Upload or replace a user's resume and optionally ingest skills from provided text. */
    public Resume uploadResume(int userId, String fileType, double fileSizeMB, String resumeText) {
        if(!InMemoryStore.USERS.containsKey(userId)) throw new NotFound("User not found");
        if(fileType == null || fileType.isBlank()) throw new Validation("fileType required");
        if(fileSizeMB <= 0) throw new Validation("fileSizeMB must be positive");
        if(fileSizeMB > 20.0) throw new Validation("file too large (max 20MB)");

        // Replace existing resume for this user if any
        Optional<Resume> existing = findResumeByUser(userId);
        existing.ifPresent(r -> InMemoryStore.RESUMES.remove(r.getResumeId()));

        int id = InMemoryStore.nextResumeId();
        Resume resume = new Resume(id, userId, fileType.toLowerCase(), fileSizeMB, LocalDateTime.now());
        InMemoryStore.RESUMES.put(id, resume);

        if(resumeText != null && !resumeText.isBlank()) {
            ingestSkillsFromText(userId, resumeText);
        }
        return resume;
    }

    /** Return the user's current resume, if any. */
    public Optional<Resume> getResume(int userId) {
        return findResumeByUser(userId);
    }

    /** Delete the user's resume, optionally removing skills that were sourced from resume. */
    public void deleteResume(int userId, boolean removeIngestedSkills) {
        Optional<Resume> r = findResumeByUser(userId);
        if(r.isEmpty()) throw new NotFound("No resume found for user");
        InMemoryStore.RESUMES.remove(r.get().getResumeId());
        if(removeIngestedSkills) {
            List<UserSkill> list = InMemoryStore.USER_SKILLS.getOrDefault(userId, new ArrayList<>());
            list.removeIf(us -> "resume".equalsIgnoreCase(us.getSource()));
        }
    }

    /** List only the skills that were added from the resume. */
    public List<UserSkill> listResumeSkills(int userId) {
        List<UserSkill> src = InMemoryStore.USER_SKILLS.getOrDefault(userId, List.of());
        List<UserSkill> out = new ArrayList<>();
        for(UserSkill us : src) if("resume".equalsIgnoreCase(us.getSource())) out.add(us);
        return out;
    }

    /** Extract skills by name matching against known skills; add them to the user's profile. */
    public int ingestSkillsFromText(int userId, String resumeText) {
        if(!InMemoryStore.USERS.containsKey(userId)) throw new NotFound("User not found");
        if(resumeText == null || resumeText.isBlank()) return 0;
        String text = resumeText.toLowerCase();

        // Build lookup of skill names -> id
        Map<String,Integer> nameToId = new HashMap<>();
        for(Map.Entry<Integer, Skill> e : InMemoryStore.SKILLS.entrySet()) {
            String name = e.getValue().getName();
            if(name != null && !name.isBlank()) nameToId.put(name.toLowerCase(), e.getKey());
        }

        // Identify mentioned skills by simple substring match
        Set<Integer> mentioned = new HashSet<>();
        for(Map.Entry<String,Integer> e : nameToId.entrySet()) {
            if(text.contains(e.getKey())) mentioned.add(e.getValue());
        }

        // Insert if not already present
        List<UserSkill> list = InMemoryStore.USER_SKILLS.computeIfAbsent(userId, k -> new ArrayList<>());
        int added = 0;
        for(int skillId : mentioned) {
            boolean exists = false;
            for(UserSkill us : list) {
                if(us.getSkillId() == skillId) { exists = true; break; }
            }
            if(!exists) {
                list.add(new UserSkill(userId, skillId, 3, "resume"));
                added++;
            }
        }
        return added;
    }

    public void resumeMsg(String message){ /* UI hook */ }
    public void resumeError(String message){ /* UI hook */ }

    private Optional<Resume> findResumeByUser(int userId) {
        for(Resume r : InMemoryStore.RESUMES.values()) if(r.getUserId() == userId) return Optional.of(r);
        return Optional.empty();
    }
}