package sc2006.controller;

import java.util.List;
import java.util.Optional;

import sc2006.entity.Resume;
import sc2006.entity.UserSkill;

/**
 * ResumePage
 * 
 * Handles UI-level actions for resume upload, retrieval, and deletion.
 * Works with ResumeController that now uses Long IDs (Supabase-compatible).
 */
public class ResumePage {

    private final ResumeController resumeController;

    public ResumePage() {
        this.resumeController = new ResumeController();
    }

    /** Simulates uploading a resume for a user. */
    public void uploadUserResume(int userId, String fileType, double fileSizeMB, String resumeText) {
        Resume resume = resumeController.uploadResume((long) userId, fileType, fileSizeMB, resumeText);
        System.out.println(" Resume uploaded successfully: " + resume);
    }

    /** View an uploaded resume. */
    public void viewUserResume(int userId) {
        Optional<Resume> resume = resumeController.getResume((long) userId);
        if (resume.isPresent()) {
            System.out.println("Found Resume: " + resume.get());
        } else {
            System.out.println("No resume found for user ID " + userId);
        }
    }

    /** Delete a resume. */
    public void deleteUserResume(int userId, boolean removeIngestedSkills) {
        resumeController.deleteResume((long) userId, removeIngestedSkills);
        System.out.println("Resume deleted successfully for user " + userId);
    }

    /** List skills extracted from the resume. */
    public void listExtractedSkills(int userId) {
        List<UserSkill> skills = resumeController.listResumeSkills((long) userId);
        if (skills.isEmpty()) {
            System.out.println("No skills extracted from resume for user " + userId);
        } else {
            System.out.println("Extracted skills from resume:");
            for (UserSkill s : skills) {
                System.out.printf(" - Skill ID: %d | Source: %s | Level: %d%n",
                        s.getSkillId(), s.getSource(), s.getLevel());
            }
        }
    }
}
