package sc2006;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.*;

@Service
public class SectorTrendService {

    @Value("${sector.resource.id}")
    private String resourceId;

    public List<Map<String, Object>> fetchAndTransformTrends() {
        List<Map<String, Object>> trendList = new ArrayList<>();

        try {
            String apiUrl = "https://data.gov.sg/api/action/datastore_search?limit=500&resource_id=" + resourceId;
            URL url = new URL(apiUrl);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.connect();

            Scanner scanner = new Scanner(url.openStream());
            String response = scanner.useDelimiter("\\A").next();
            scanner.close();

            JSONObject json = new JSONObject(response);
            JSONArray records = json.getJSONObject("result").getJSONArray("records");

            for (int i = 0; i < records.length(); i++) {
                JSONObject rec = records.getJSONObject(i);
                String sector = rec.getString("DataSeries");

                for (String key : rec.keySet()) {
                    if (key.matches("\\d{4}\\dQ")) { // e.g. 20252Q
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
        } catch (IOException e) {
            e.printStackTrace();
        }
        return trendList;
    }
}
