package sc2006;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.InputStream;
import java.net.URI;
import java.net.URL;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.List;

@Service
public class CourseService {

    @Value("${data.gov.api.key}")
    private String apiKey;

    public List<Course> fetchCourses() {
        List<Course> courses = new ArrayList<>();

        try {
            String datasetId = "d_b5802b76f409764c16dde4bf2feb19cd";
            String pollUrl = "https://api-open.data.gov.sg/v1/public/api/datasets/" + datasetId + "/poll-download";

            HttpClient client = HttpClient.newHttpClient();
            HttpRequest pollRequest = HttpRequest.newBuilder()
                    .uri(URI.create(pollUrl))
                    .header("x-api-key", apiKey)
                    .build();

            HttpResponse<String> pollResponse = client.send(pollRequest, HttpResponse.BodyHandlers.ofString());
            JSONObject pollJson = new JSONObject(pollResponse.body());

            String dataUrl = pollJson.getJSONObject("data").getString("url");
            System.out.println("📘 Downloading Excel file from: " + dataUrl);

            try (InputStream in = new URL(dataUrl).openStream();
                 Workbook workbook = new XSSFWorkbook(in)) {

                Sheet sheet = workbook.getSheetAt(0); // first sheet
                int id = 1;
                for (Row row : sheet) {
                    if (row.getRowNum() == 0) continue; // skip header row

                    Course c = new Course();
                    c.setCourseId(id++);
                    c.setTitle(getCellValue(row, 0));
                    c.setProvider(getCellValue(row, 1));

                    String urlStr = getCellValue(row, 2);
                    try {
                        c.setUrl(urlStr.isEmpty() ? null : new URL(urlStr));
                    } catch (Exception e) {
                        c.setUrl(null);
                    }

                    courses.add(c);
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return courses;
    }

    private String getCellValue(Row row, int colIndex) {
        try {
            Cell cell = row.getCell(colIndex);
            if (cell == null) return "";
            if (cell.getCellType() == CellType.NUMERIC)
                return String.valueOf(cell.getNumericCellValue());
            return cell.getStringCellValue().trim();
        } catch (Exception e) {
            return "";
        }
    }
}
