package sc2006.controller;

import java.util.List;
import java.util.Map;

import sc2006.service.SectorTrendService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

/**
 * Handles displaying sector trends (uses live API data from SectorTrendService).
 */
@Controller
public class TrendsPage {

    private final SectorTrendService sectorTrendService;

    @Autowired
    public TrendsPage(SectorTrendService sectorTrendService) {
        this.sectorTrendService = sectorTrendService;
    }

    /** UC: Fetch and display live sector trends */
    public void displayTrends() {
        List<Map<String, Object>> trends = sectorTrendService.fetchAndTransformTrends();

        if (trends.isEmpty()) {
            System.out.println("⚠️ No sector trends available (API may be unreachable).");
            return;
        }

        System.out.println("=== Sector Trends ===");
        for (Map<String, Object> t : trends) {
            System.out.printf(
                "Sector: %-25s | Year: %d | Quarter: %s | Value: %.2f%n",
                t.get("sector"),
                t.get("year"),
                t.get("quarter"),
                t.get("value")
            );
        }
    }
}
