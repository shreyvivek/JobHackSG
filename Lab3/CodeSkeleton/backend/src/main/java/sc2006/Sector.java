package sc2006;

public class Sector {
    private int sectorId;
    private String name;
    private int vacancyIndex; // 0..100
    private String growthDirection; // e.g., "Growing", "Stable", "Declining"

    public Sector(){}

    public Sector(int sectorId, String name, int vacancyIndex, String growthDirection) {
        this.sectorId = sectorId;
        this.name = name;
        this.vacancyIndex = vacancyIndex;
        this.growthDirection = growthDirection;
    }

    public int getSectorId(){ return sectorId; }
    public String getName(){ return name; }
    public int getVacancyIndex(){ return vacancyIndex; }
    public String getGrowthDirection(){ return growthDirection; }
}
