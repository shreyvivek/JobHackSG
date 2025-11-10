package sc2006.controller;

import java.time.LocalDateTime;
import java.util.*;

import org.springframework.stereotype.Controller;

import sc2006.dao.ResumeDAO;
import sc2006.dao.SkillDAO;
import sc2006.dao.UserDAO;
import sc2006.dao.UserSkillDAO;
import sc2006.entity.Resume;
import sc2006.entity.Skill;
import sc2006.entity.UserSkill;
import sc2006.util.Exceptions.NotFound;
import sc2006.util.Exceptions.Validation;

/**
 * Handles uploading, deleting, and skill extraction from resumes.
 * Migrated from InMemoryStore to Supabase DAOs.
 */
@Controller
public class ResumeController {

    private final ResumeDAO resumeDAO;
    private final UserDAO userDAO;
    private final SkillDAO skillDAO;
    private final UserSkillDAO userSkillDAO;

    public ResumeController() {
        this.resumeDAO = new ResumeDAO();
        this.userDAO = new UserDAO();
        this.skillDAO = new SkillDAO();
        this.userSkillDAO = new UserSkillDAO();
    }

    /** Upload or replace a user's resume and optionally ingest skills from provided text. */
    public Resume uploadResume(Long userId, String fileType, double fileSizeMB, String resumeText) {
        if (userDAO.getUserById(userId) == null)
            throw new NotFound("User not found");
        if (fileType == null || fileType.isBlank())
            throw new Validation("fileType required");
        if (fileSizeMB <= 0)
            throw new Validation("fileSizeMB must be positive");
        if (fileSizeMB > 20.0)
            throw new Validation("file too large (max 20MB)");

        // Delete any existing resume
        resumeDAO.deleteResumeByUserId(userId);

        Resume resume = new Resume(null, userId, fileType.toLowerCase(), fileSizeMB, LocalDateTime.now());
        resumeDAO.addResume(resume);

        if (resumeText != null && !resumeText.isBlank()) {
            ingestSkillsFromText(userId, resumeText);
        }

        return resume;
    }

    /** Return the user's current resume, if any. */
    public Optional<Resume> getResume(Long userId) {
        return resumeDAO.getResumeByUserId(userId);
    }

    /** Delete the user's resume, optionally removing skills sourced from resume. */
    public void deleteResume(Long userId, boolean removeIngestedSkills) {
        if (resumeDAO.getResumeByUserId(userId).isEmpty())
            throw new NotFound("No resume found for user");

        resumeDAO.deleteResumeByUserId(userId);

        if (removeIngestedSkills) {
            userSkillDAO.deleteUserSkillsBySource(userId, "resume");
        }
    }
    /** List only the skills that were added from the resume (source='resume'). */
    public List<UserSkill> listResumeSkills(Long userId) {
        List<UserSkill> allSkills = userSkillDAO.getUserSkillsByUserId(userId);
        List<UserSkill> resumeSkills = new ArrayList<>();

        for (UserSkill us : allSkills) {
            if ("resume".equalsIgnoreCase(us.getSource())) {
                resumeSkills.add(us);
            }
        }
        return resumeSkills;
    }


    /** Extract skills from text and insert into user_skill table. */
    public int ingestSkillsFromText(Long userId, String resumeText) {
        if (userDAO.getUserById(userId) == null)
            throw new NotFound("User not found");
        if (resumeText == null || resumeText.isBlank())
            return 0;

        String text = resumeText.toLowerCase();

        // Fetch all known skills
        List<Skill> allSkills = skillDAO.getAllSkills();
        int added = 0;

        for (Skill skill : allSkills) {
            String skillName = skill.getName().toLowerCase();
            if (text.contains(skillName)) {
                boolean exists = userSkillDAO.userHasSkill(userId, skill.getSkillId());
                if (!exists) {
                    UserSkill newSkill = new UserSkill(userId, skill.getSkillId(), 3, "resume");
                    userSkillDAO.addUserSkill(newSkill);
                    added++;
                }
            }
        }
        return added;
    }

    public void resumeMsg(String message) { /* Optional UI hook */ }
    public void resumeError(String message) { /* Optional UI hook */ }
}
