package sc2006;

public class JobSkill {
    private int jobId;
    private int skillId;
    private double weight; // importance 0..1

    public JobSkill(){}

    public JobSkill(int jobId, int skillId, double weight) {
        this.jobId = jobId;
        this.skillId = skillId;
        this.weight = weight;
    }

    public int getJobId(){ return jobId; }
    public int getSkillId(){ return skillId; }
    public double getWeight(){ return weight; }
}
