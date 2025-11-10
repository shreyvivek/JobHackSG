package sc2006.service;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import sc2006.entity.Course;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.InputStream;
import java.net.URI;
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
            System.out.println("Downloading Excel file from: " + dataUrl);

            try (InputStream in = URI.create(dataUrl).toURL().openStream();
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
                        c.setUrl(urlStr.isEmpty() ? null : URI.create(urlStr).toString());
                    } catch (Exception e) {
                        c.setUrl(null);
                    }

                    courses.add(c);
                }
            }

        } catch (Exception e) {
            System.out.println("Failed to fetch courses from API, returning fallback courses: " + e.getMessage());
            // Return fallback courses if API fails
            return getFallbackCourses();
        }

        return courses;
    }

    private List<Course> getFallbackCourses() {
        List<Course> courses = new ArrayList<>();
        
        Course course1 = new Course();
        course1.setCourseId(1);
        course1.setTitle("Java Programming Fundamentals");
        course1.setProvider("Coursera");
        course1.setUrl("https://www.coursera.org/learn/java-programming");
        courses.add(course1);
        
        Course course2 = new Course();
        course2.setCourseId(2);
        course2.setTitle("React Development Bootcamp");
        course2.setProvider("Udemy");
        course2.setUrl("https://www.udemy.com/course/react-bootcamp");
        courses.add(course2);
        
        Course course3 = new Course();
        course3.setCourseId(3);
        course3.setTitle("Python for Data Science");
        course3.setProvider("edX");
        course3.setUrl("https://www.edx.org/course/python-data-science");
        courses.add(course3);
        
        Course course4 = new Course();
        course4.setCourseId(4);
        course4.setTitle("Spring Boot Masterclass");
        course4.setProvider("Pluralsight");
        course4.setUrl("https://www.pluralsight.com/courses/spring-boot");
        courses.add(course4);
        
        Course course5 = new Course();
        course5.setCourseId(5);
        course5.setTitle("AWS Cloud Practitioner");
        course5.setProvider("AWS Training");
        course5.setUrl("https://aws.amazon.com/training/cloud-practitioner");
        courses.add(course5);
        
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
