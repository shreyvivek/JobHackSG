package sc2006;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import static sc2006.Exceptions.*;

public class ProfileController {

    public ProfileController() {}

    /** UC-3: load profile */
    public User getProfile(int userId) {
        var u = InMemoryStore.USERS.get(userId);
        if(u == null) throw new NotFound("User not found");
        return u;
    }

    public User findProfile(int userId){ return getProfile(userId); }
    public User fetchProfile(int userId){ return getProfile(userId); }

    /** UC-3: display (boundary delegates to page) */
    public User displayProfile(int userId){ return getProfile(userId); }

    /** UC-3: editable fields (boundary concern, return map to render) */
    public Map<String,Object> displayEditableFields(int userId){
        var u = getProfile(userId);
        Map<String,Object> m = new LinkedHashMap<>();
        m.put("name", u.getName());
        m.put("school", u.getSchool());
        m.put("gradYear", u.getGradYear());
        return m;
    }

    /** UC-3: submit changes */
    public User updateProfile(int userId, Map<String,Object> updatedFields){
        var u = getProfile(userId);
        if(updatedFields.containsKey("name")) u.setName((String)updatedFields.get("name"));
        if(updatedFields.containsKey("school")) u.setSchool((String)updatedFields.get("school"));
        if(updatedFields.containsKey("gradYear")) u.setGradYear((Integer)updatedFields.get("gradYear"));
        return u;
    }

    public void profileMsg(String message){ /* UI message hook */ }
    public void profileError(String message){ /* UI message hook */ }

    /** UC-3: Manage skills */
    public void addSkill(int userId, int skillId){
        var skill = InMemoryStore.SKILLS.get(skillId);
        if(skill == null) throw new NotFound("Skill not found");
        List<UserSkill> userSkills = InMemoryStore.USER_SKILLS.get(userId);
        if (userSkills == null) {
            userSkills = new ArrayList<>();
            InMemoryStore.USER_SKILLS.put(userId, userSkills);
        }
        boolean exists = userSkills.stream().anyMatch(userSkill -> userSkill.getSkillId() == skillId);
        if(!exists) userSkills.add(new UserSkill(userId, skillId, 3, "self"));
    }
    public void insertSkill(int userId, int skillId){ addSkill(userId, skillId); }

    public void deleteSkill(int userId, int skillId){
        List<UserSkill> userSkills = InMemoryStore.USER_SKILLS.getOrDefault(userId, new ArrayList<>());
        userSkills.removeIf(userSkill -> userSkill.getSkillId() == skillId);
    }
    public void removeSkill(int userId, int skillId){ deleteSkill(userId, skillId); }

    public List<UserSkill> listSkills(int userId){
        return new ArrayList<>(InMemoryStore.USER_SKILLS.getOrDefault(userId, List.of()));
    }
}
