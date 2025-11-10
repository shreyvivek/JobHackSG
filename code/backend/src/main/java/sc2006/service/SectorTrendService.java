package sc2006.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.HttpURLConnection;
import java.util.*;

@Service
public class SectorTrendService {

    @Value("${sector.resource.id}")
    private String resourceId;

    public List<Map<String, Object>> fetchAndTransformTrends() {
        List<Map<String, Object>> trendList = new ArrayList<>();

        try {
            // Use URI.create instead of deprecated new URL(String)
            String apiUrl = "https://data.gov.sg/api/action/datastore_search?limit=500&resource_id=" + resourceId;
            var url = URI.create(apiUrl).toURL();

            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.connect();

            // Use try-with-resources for clean InputStream management
            try (InputStream in = url.openStream();
                 Scanner scanner = new Scanner(in)) {

                String response = scanner.useDelimiter("\\A").next();
                JSONObject json = new JSONObject(response);
                JSONArray records = json.getJSONObject("result").getJSONArray("records");

                for (int i = 0; i < records.length(); i++) {
                    JSONObject rec = records.getJSONObject(i);
                    String sector = rec.getString("DataSeries");

                    for (String key : rec.keySet()) {
                        // Match keys like "20252Q"
                        if (key.matches("\\d{4}\\dQ")) {
                            String year = key.substring(0, 4);
                            String quarter = key.substring(4); // e.g. "2Q"
                            String valueStr = rec.get(key).toString();

                            if (!valueStr.equalsIgnoreCase("na")) {
                                Map<String, Object> entry = new HashMap<>();
                                entry.put("sector", sector);
                                entry.put("year", Integer.parseInt(year));
                                entry.put("quarter", quarter);
                                entry.put("value", Double.parseDouble(valueStr));
                                trendList.add(entry);
                            }
                        }
                    }
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        return trendList;
    }
}
