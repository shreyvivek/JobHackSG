package sc2006.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import sc2006.dao.UserDAO;
import sc2006.dao.UserSkillDAO;
import sc2006.dao.SkillDAO;
import sc2006.entity.User;
import sc2006.entity.UserSkill;
import sc2006.entity.Skill;
import sc2006.util.Exceptions.NotFound;

import java.util.*;

@Service
public class UserProfileService {

    @Autowired
    private UserDAO userDAO;

    @Autowired
    private UserSkillDAO userSkillDAO;

    @Autowired
    private SkillDAO skillDAO;

    public User getUserProfile(Long userId) {
        User user = userDAO.getUserById(userId);
        if (user == null) {
            throw new NotFound("User not found with ID: " + userId);
        }
        return user;
    }

    public User updateUserProfile(Long userId, Map<String, Object> profileData) {
        User user = getUserProfile(userId);
        
        // Update basic profile fields
        if (profileData.containsKey("name")) {
            user.setName((String) profileData.get("name"));
        }
        if (profileData.containsKey("email")) {
            user.setEmail((String) profileData.get("email"));
        }
        if (profileData.containsKey("school")) {
            user.setSchool((String) profileData.get("school"));
        }
        if (profileData.containsKey("gradYear")) {
            user.setGradYear((Integer) profileData.get("gradYear"));
        }
        
        // Save updated user
        userDAO.updateUser(user);
        return user;
    }

    public void updateUserSkills(Long userId, List<String> skillNames) {
        // Remove existing skills
        userSkillDAO.deleteUserSkillsBySource(userId, "profile");
        
        // Add new skills
        for (String skillName : skillNames) {
            Skill skill = skillDAO.getSkillByName(skillName);
            if (skill == null) {
                // Create new skill if it doesn't exist
                skill = new Skill(skillName);
                skill = skillDAO.createSkill(skill);
            }
            // Add user skill with default level
            UserSkill userSkill = new UserSkill(userId, skill.getSkillId(), 3, "profile");
            userSkillDAO.addUserSkill(userSkill);
        }
    }

    public List<String> getUserSkillNames(Long userId) {
        List<UserSkill> userSkills = userSkillDAO.getUserSkillsByUserId(userId);
        List<String> skillNames = new ArrayList<>();
        
        for (UserSkill userSkill : userSkills) {
            Skill skill = skillDAO.getSkillById(userSkill.getSkillId());
            if (skill != null) {
                skillNames.add(skill.getName());
            }
        }
        
        return skillNames;
    }
}
