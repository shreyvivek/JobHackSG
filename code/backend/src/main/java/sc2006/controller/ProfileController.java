package sc2006.controller;

import java.util.ArrayList;
import java.util.List;

import sc2006.dao.UserDAO;
import sc2006.dao.SkillDAO;
import sc2006.dao.UserSkillDAO;
import sc2006.entity.User;
import sc2006.entity.Skill;
import sc2006.entity.UserSkill;
import sc2006.util.Exceptions.NotFound;
import sc2006.util.Exceptions.Validation;

public class ProfileController {

    private final UserDAO userDAO;
    private final SkillDAO skillDAO;
    private final UserSkillDAO userSkillDAO;

    public ProfileController() {
        this.userDAO = new UserDAO();
        this.skillDAO = new SkillDAO();
        this.userSkillDAO = new UserSkillDAO();
    }

    /** 
     * UC-12: Load user profile by ID 
     */
    public User getProfile(Long userId) {
        User user = userDAO.getUserById(userId);
        if (user == null) throw new NotFound("User not found.");
        return user;
    }

    /** 
     * UC-13: Update basic user information 
     */
    public void updateProfile(Long userId, String name, String school, int gradYear) {
        User user = userDAO.getUserById(userId);
        if (user == null) throw new NotFound("User not found.");

        if (name == null || name.isBlank()) throw new Validation("Name cannot be empty.");
        if (gradYear < 2000 || gradYear > 2100) throw new Validation("Invalid graduation year.");

        user.setName(name);
        user.setSchool(school);
        user.setGradYear(gradYear);
        userDAO.updateUser(user);
    }

    /** 
     * UC-14: Add a new skill to a user 
     */
    public void addSkill(Long userId, Long skillId, int level) {
        if (userId == null || skillId == null) throw new Validation("Missing user or skill ID.");
        if (level < 1 || level > 5) throw new Validation("Skill level must be between 1 and 5.");

        Skill skill = skillDAO.getSkillById(skillId);
        if (skill == null) throw new NotFound("Skill not found.");

        if (userSkillDAO.userHasSkill(userId, skillId)) {
            throw new Validation("User already has this skill.");
        }

        userSkillDAO.addUserSkill(new UserSkill(userId, skillId, level, "manual"));
    }

    /** 
     * UC-15: Remove an existing user skill 
     */
    public void removeSkill(Long userId, Long skillId) {
        if (!userSkillDAO.userHasSkill(userId, skillId)) {
            throw new NotFound("Skill not found for user.");
        }
        userSkillDAO.deleteUserSkill(userId, skillId);
    }

    /** 
     * UC-16: List all skills for a user 
     */
    public List<Skill> listUserSkills(Long userId) {
        List<UserSkill> userSkills = userSkillDAO.getUserSkills(userId);
        List<Skill> skillList = new ArrayList<>();

        for (UserSkill us : userSkills) {
            Skill skill = skillDAO.getSkillById(us.getSkillId());
            if (skill != null) skillList.add(skill);
        }

        return skillList;
    }
}
