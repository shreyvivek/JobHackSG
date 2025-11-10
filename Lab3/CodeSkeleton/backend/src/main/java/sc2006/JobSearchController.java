package sc2006;

import java.util.*;
import static sc2006.Exceptions.*;

public class JobSearchController {

    public JobSearchController() {}

    /** UC-7 search */
    public List<JobPosting> searchJobs(String query, Map<String,Object> filters) {
        InMemoryStore.seedIfEmpty();
        List<JobPosting> base = new ArrayList<>(InMemoryStore.JOBS.values());
        base.removeIf(j -> !j.isActive());

        if(query != null && !query.isBlank()){
            String q = query.toLowerCase();
            base.removeIf(j -> !(j.getTitle().toLowerCase().contains(q)
                    || j.getCompany().toLowerCase().contains(q)
                    || j.getDescription().toLowerCase().contains(q)));
        }

        if(filters != null){
            String location = (String) filters.get("location");
            if(location != null && !location.isBlank()){
                String loc = location.toLowerCase();
                base.removeIf(j -> !j.getLocation().toLowerCase().contains(loc));
            }
        }
        base.sort(Comparator.comparing(JobPosting::getPostedAt).reversed());
        return base;
    }

    /** UC-7 filter-only (helper) */
    public List<JobPosting> filterJobs(Map<String,Object> criteria) {
        return searchJobs(null, criteria);
    }

    /** UC-7 sort */
    public List<JobPosting> sortJobs(String orderBy) {
        List<JobPosting> list = new ArrayList<>(InMemoryStore.JOBS.values());
        list.removeIf(j -> !j.isActive());
        if("date".equalsIgnoreCase(orderBy)){
            list.sort(Comparator.comparing(JobPosting::getPostedAt).reversed());
        } else if("title".equalsIgnoreCase(orderBy)){
            list.sort(Comparator.comparing(JobPosting::getTitle));
        }
        return list;
    }
}
