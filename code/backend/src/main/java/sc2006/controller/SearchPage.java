package sc2006.controller;

import java.util.List;
import java.util.Map;

import sc2006.entity.JobPosting;

public class SearchPage {

    public SearchPage() {}

    public void enterQuery(String query) { /* UI capture */ }

    public List<JobPosting> applyFilters(Map<String,Object> criteria) {
        return new JobSearchController().filterJobs(criteria);
    }

    public void displayResults(JobPosting[] jobList) {
        for(var j : jobList){
            System.out.println("%s — %s".formatted(j.getTitle(), j.getCompany()));
        }
    }
}
