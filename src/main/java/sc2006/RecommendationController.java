package sc2006;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class RecommendationController {

    public RecommendationController() {}

    /** UC-6: compute and return top-N recommendations with match score */
    public List<Recommendation> getRecommendations(int userId) {
        List<UserSkill> us = InMemoryStore.USER_SKILLS.getOrDefault(userId, List.of());
        if(us.isEmpty()){
            // AF-S1: show generic trending jobs by posting recency
            List<Recommendation> generic = new ArrayList<>();
            InMemoryStore.JOBS.values().stream()
                    .filter(JobPosting::isActive)
                    .sorted(Comparator.comparing(JobPosting::getPostedAt).reversed())
                    .limit(10)
                    .forEach(j -> generic.add(new Recommendation(userId, j.getJobId(), 0)));
            return generic;
        }

        // naive skill count matching
        Set<Integer> userSkillIds = new HashSet<>();
        for(var s: us) userSkillIds.add(s.getSkillId());

        List<Recommendation> recs = new ArrayList<>();
        for(var j : InMemoryStore.JOBS.values()){
            if(!j.isActive()) continue;
            // demo: treat description keywords as proxy; real impl: JobSkill table
            int score = 0;
            String desc = (j.getDescription()==null?"":j.getDescription()).toLowerCase();
            for(int sid : userSkillIds){
                String name = InMemoryStore.SKILLS.getOrDefault(sid, new Skill(sid,"")).getName().toLowerCase();
                if(!name.isBlank() && desc.contains(name)) score += 20;
            }
            recs.add(new Recommendation(userId, j.getJobId(), Math.min(100, score)));
        }
        recs.sort(Comparator.comparingInt(Recommendation::getMatchScore).reversed());
        return recs;
    }

    /** helpers kept to satisfy template */
    public int computeMatch(int userSkillsCount, int jobSkillsCount) {
        if(jobSkillsCount==0) return 0;
        double r = Math.min(1.0, (double)userSkillsCount / jobSkillsCount);
        return (int)Math.round(r * 100.0);
    }

    public List<Recommendation> rankJobs(double ignored) { // placeholder
        return List.of();
    }
}
