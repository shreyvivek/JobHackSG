package sc2006;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public class ResumePage {

    public ResumePage() {}

    public Resume upload(int userId, Map<String,Object> form) {
        String fileType = (String) form.getOrDefault("fileType", "pdf");
        double size = form.get("fileSizeMB") instanceof Number ? ((Number)form.get("fileSizeMB")).doubleValue() : 0.0;
        String text = (String) form.getOrDefault("resumeText", "");
        return new ResumeController().uploadResume(userId, fileType, size, text);
    }

    public Optional<Resume> view(int userId) {
        return new ResumeController().getResume(userId);
    }

    public void remove(int userId, boolean removeSkills) {
        new ResumeController().deleteResume(userId, removeSkills);
    }

    public List<UserSkill> listIngestedSkills(int userId) {
        return new ResumeController().listResumeSkills(userId);
    }
}
