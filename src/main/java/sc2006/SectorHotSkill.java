package sc2006;

public class SectorHotSkill {
    private int sectorId;
    private int skillId;
    private int rank;

    public SectorHotSkill(){}

    public SectorHotSkill(int sectorId, int skillId, int rank) {
        this.sectorId = sectorId;
        this.skillId = skillId;
        this.rank = rank;
    }

    public int getSectorId(){ return sectorId; }
    public int getSkillId(){ return skillId; }
    public int getRank(){ return rank; }
}
