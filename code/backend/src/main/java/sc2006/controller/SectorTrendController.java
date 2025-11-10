package sc2006.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import sc2006.service.SectorTrendService;

import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trends")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:5173"})
public class SectorTrendController {

    @Autowired
    private SectorTrendService sectorTrendService;

    @GetMapping("/parsed")
    public List<Map<String, Object>> getParsedTrends() {
        return sectorTrendService.fetchAndTransformTrends();
    }
}
