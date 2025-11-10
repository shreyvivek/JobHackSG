// ...existing code...
package sc2006.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import sc2006.entity.User;
import sc2006.entity.Skill;
import sc2006.entity.UserSkill;
import sc2006.repository.UserRepository;
import sc2006.dao.SkillDAO;
import sc2006.dao.UserSkillDAO;
import sc2006.util.Exceptions;

import java.util.Optional;
import java.util.List;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SkillDAO skillDAO;

    @Autowired
    private UserSkillDAO userSkillDAO;

    // === Register user ===
    public User register(User newUser) throws Exceptions.Validation {
        if (newUser.getEmail() == null || newUser.getPasswordHash() == null) {
            throw new Exceptions.Validation("Email and password are required");
        }

        Optional<User> existing = userRepository.findByEmail(newUser.getEmail());
        if (existing.isPresent()) {
            throw new Exceptions.Validation("Email already registered");
        }

        // You may hash the password here if needed
        User saved = userRepository.save(newUser);
        return saved;
    }

    // === Login user ===
    public User loginAndReturnUser(String email, String password) throws Exceptions.Validation {
        User user = findUserByEmail(email);
        if (user == null) {
            throw new Exceptions.Validation("User not found");
        }

        if (!user.getPasswordHash().equals(password)) {
            throw new Exceptions.Validation("Invalid password");
        }

        return user;
    }

    // === Get user by email ===
    public User findUserByEmail(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        return user.orElse(null);
    }

    public User getUser(String email) {
        return findUserByEmail(email);
    }

    // === Add skills to user ===
    public void addSkillsToUser(Long userId, List<String> skillNames) {
        for (String skillName : skillNames) {
            // Find or create skill
            Skill skill = skillDAO.getSkillByName(skillName);
            if (skill == null) {
                skill = new Skill(skillName);
                skillDAO.saveSkill(skill);
            }
            // Add user-skill relationship with default level 3
            UserSkill userSkill = new UserSkill(userId, skill.getSkillId(), 3, "manual");
            userSkillDAO.addUserSkill(userSkill);
        }
    }

    // === Get user's skill names ===
    public List<String> getUserSkills(Long userId) {
        List<UserSkill> userSkills = userSkillDAO.getUserSkillsByUserId(userId);
        List<String> skillNames = new java.util.ArrayList<>();
        for (UserSkill us : userSkills) {
            Skill skill = skillDAO.getSkillById(us.getSkillId());
            if (skill != null) {
                skillNames.add(skill.getName());
            }
        }
        return skillNames;
    }
}
