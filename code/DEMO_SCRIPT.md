# JobHackSG - Demo Video Transcript
[Link to video](https://www.youtube.com/watch?v=YCLz3ozYyNI&t=2s)

---

## Introduction and Project Overview

Welcome to JobHackSG, a comprehensive job search and career development platform designed specifically for students and fresh graduates in Singapore. JobHack is a full-stack web application that follows SWE Principles. Built with a modern React TypeScript frontend and powered by a robust Spring Boot Java backend connected to a PostgreSQL database, JobHack integrates seamlessly with Singapore's Data.gov.sg API to provide authentic government employment trends. This creates a powerful, all-in-one platform where you can discover jobs tailored to your skills, track your career journey, identify skill gaps, and access learning resources - everything you need to launch your career.

---

## Use Case 1: User Registration

When you first visit JobHack, you're immediately taken to the registration page, designed to onboard new users quickly and efficiently. In the first step, you'll enter your full name, select your current role, provide a valid email address, and create a secure password that must be at least 8 characters long with at least one uppercase letter. The system validates all inputs in real-time, and relevant error messages show up if needed. Once you click "Continue to Skills," you'll be taken to the skills selection step where you can choose from a comprehensive list of popular skills and add in your custom skills as text too. The system requires at least two skills before you can complete registration. When you click "Complete Registration," the backend checks for duplicate emails, securely stores your credentials, and immediately logs you into your personalized dashboard on the "For You" page. 

---

## Use Case 2: User Login

For returning users, the login process is streamlined and secure. Simply switch to login mode on the same page, and you'll see a clean interface that validates your credentials with precision.  And the errors automatically clear as you fix them, making the correction process seamless. The login system handles both successful authentication and error scenarios gracefully, ensuring a professional user experience.

---

## Use Case 3: Manage Profile & Skills

The Profile tab has a beautifully designed profile interface featuring a prominent header with your avatar, name, email, current role, school information, and graduation year. Below that, your skills are displayed as elegant badges, each showing the skill name. To edit your profile, simply click "Edit Profile" which opens a dialog where you can update your name, email, school, and graduation year. All changes are saved immediately and synced with the backend database via REST API calls. For skills management, click "Edit Skills" to open another dialog where you can add new skills from the popular skills list, add custom skills using the input field, or remove skills by clicking the X icon next to any skill badge.

---

## Use Case 4: View Sector Trends

The Trends tab transforms raw employment data into actionable insights about Singapore's job market. When you navigate here, you'll see an impressive grid of sector cards, each representing different industries like Technology, Finance, Healthcare, Marketing, Design, Sales, and Education. These cards aren't just static displays - they're live, data-driven components that fetch real-time information from Singapore's Data.gov.sg API. Each sector card prominently displays the latest employment count, a growth percentage with intuitive visual indicators - you'll see a green upward arrow for positive growth trends and a red downward arrow for declining sectors. 

---

## Use Case 5: View Recommended Jobs

The "For You" tab is where JobHack's sophisticated skill matching algorithm analyzes your profile and compares it against all available job postings. The system calculates a match percentage for each job by comparing your skills against the required skills for that position. The card also displays the required skills, with your matching skills highlighted in green with checkmarks, and missing skills shown in orange with X marks. The recommendation system updates in real-time as you modify your profile, ensuring your recommendations always reflect your current skill set.

---

## Use Case 6: Search & Filter Jobs

The Search interface features a prominent search bar at the top where you can enter keywords that search across job titles. You can also filter by location, sector, Full-time, Part-time, Contract, Freelance, or Internship options simultaneously. There's also a recency filter that lets you see only jobs posted in the last 24 hours, last 3 days, or last week. When you're ready to start fresh, a single "Clear All Filters" button resets everything instantly.

---

## Use Case 7: View Job Details

Clicking on any job card opens a clean, focused layout showing the complete job title, company name, location, and posting date prominently at the top. Below that, you'll see the full job description, giving you all the context about the role, responsibilities, and requirements. The page also includes an "Apply" button that can take you to the company's application portal if available. The entire skill gap analysis happens automatically based on your current profile, so as you add new skills, the recommendations become more accurate and personalized.

---

## Use Case 8: Save and Unsave Jobs
You can click save job if you are interested in it and want to refer to it later. You can see it in Saved Tab section, and unsave later as well. 

---

## Use Case 9: Fetch Courses for Matching Skill Gaps
In the job details page, users see their missing skills for that job, and can click on the links provided to upskill themselves. This ensures that the platform actually helps the user become more industry ready!

---

## Use Case 10: Add Job Postings
You can now sign up and login as a company posting a job, mentioning all the details in a single page. It gets saved to the database immediately. The users will be able to view the updated jobs in their pages as well.  

---

## Conclusion

JobHack represents a complete job search and career development ecosystem, from the moment you register with your skills profile to tracking your application status and accessing courses to fill skill gaps, every feature is designed to support your career journey. Whether you're exploring sector trends to understand the market, receiving personalized job recommendations based on your unique skill set, or identifying what you need to learn to qualify for your dream job, JobHack provides the tools, insights, and resources to help you succeed. Thank you for exploring JobHack with us today.
