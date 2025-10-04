package sc2006;

import java.util.Map;

public class ProfilePage {

    public ProfilePage() {}

    public User displayProfile(int userId) { return new ProfileController().displayProfile(userId); }

    public Map<String,Object> displayEditableFields(int userId) { return new ProfileController().displayEditableFields(userId); }

    public User updateProfile(Map<String,Object> formData) {
        int userId = (int) formData.get("userId");
        return new ProfileController().updateProfile(userId, formData);
    }

    public void showMsg(String message) { /* UI */ }

    public void showError(String message) { /* UI */ }

    public void addSkill(int skillId) { /* boundary-only: need userId in real flow */ }

    public void removeSkill(int skillId) { /* boundary-only */ }
}
