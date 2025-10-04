package sc2006;

import java.util.ArrayList;
import java.util.List;

public class TrendsPage {

    public TrendsPage() {}

    public void displaySectorTrends(Object[] sectorStats) { /* UI */ }

    public Sector selectSector(int sectorId) {
        return InMemoryStore.SECTORS.get(sectorId);
    }

    public List<Sector> listSectors(){
        return new ArrayList<>(InMemoryStore.SECTORS.values());
    }
}
