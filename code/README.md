# JobHack SG

**JobHack SG** is a comprehensive job discovery and upskilling platform designed specifically for Singaporean job seekers. Built with a modern tech stack (React + TypeScript frontend, Java Spring Boot backend), it leverages real-time data from [data.gov.sg](https://data.gov.sg/) to provide personalized job recommendations, skill gap analysis, and upskilling pathways.

## 🎯 Overview

JobHack SG bridges the gap between job seekers and opportunities by:
- Aggregating job listings with detailed skill requirements
- Recommending personalized upskilling courses based on skill gaps
- Visualizing real-time employment trends across sectors
- Providing a personalized job discovery experience

Whether you're a fresh graduate, career switcher, or professional looking to upskill, JobHack SG helps you navigate Singapore's job market with data-driven insights.

## ✨ Key Features

### Personalized Job Feed
- Browse curated job listings tailored to your skills and preferences
- Filter by industry, experience level, salary range, and location
- View detailed job descriptions with required skills highlighted

### Smart Course Recommendations
- Get course suggestions based on your skill gaps
- Discover upskilling pathways to qualify for desired positions
- Access courses from reputable platforms (SkillsFuture, Coursera, Udemy, etc.)

### Sector Trends Dashboard
- Visualize job vacancy trends across different industries
- Analyze hiring patterns using live data from data.gov.sg APIs
- Make informed career decisions based on market demand

### Saved Jobs & Bookmarks
- Bookmark interesting job listings for later review
- Organize saved jobs by priority or application status
- Track your job search journey

### Personalized Onboarding
- Complete a skills assessment during signup
- Receive tailored job and course recommendations from day one

## 🛠️ Tech Stack

### Frontend
| Category | Technology | Purpose |
|----------|------------|---------|
| **Framework** | React 18 + TypeScript | Type-safe component development |
| **Styling** | TailwindCSS + shadcn/ui | Modern, responsive UI components |
| **Icons** | lucide-react | Consistent iconography |
| **Build Tool** | Vite | Fast development and optimized builds |
| **HTTP Client** | Fetch API | Communication with backend REST APIs |
| **Routing** | React Router | Client-side navigation |

### Backend
| Category | Technology | Purpose |
|----------|------------|---------|
| **Framework** | Java Spring Boot | RESTful API development |
| **Language** | Java 17+ | Backend logic |
| **Database** | Supabase (PostgreSQL) | Data persistence |
| **API Integration** | data.gov.sg APIs | Real-time job market data |
| **Build Tool** | Maven | Dependency management & builds |
| **ORM** | Spring Data JPA | Database interactions |

### External APIs
- **data.gov.sg**: Job vacancy statistics and trends
- **Supabase**: Authentication and database services

##  Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (v18 or higher) 
- **Java JDK** (v17 or higher) 
- **Maven** (v3.8+) 
- **Git** 

##  Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/softwarelab3/2006-SCSD-18
cd jobhack-sg
```

### 2. Backend Setup (Spring Boot)

Navigate to the backend directory:
```bash
cd backend
```

#### Install Dependencies & Run
```bash
# Compile the project
mvn clean compile

# Run the Spring Boot application
mvn spring-boot:run
```

The backend server will start at `http://localhost:8080`

### 3. Frontend Setup (React + Vite)

Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

#### Install Dependencies
```bash
npm install
```

#### Run Development Server
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000` (or the port shown in your terminal)

### 4. Access the Application

Open your browser and navigate to:
```
http://localhost:3000/onboarding
```

**Note:** Make sure the backend is running before starting the frontend!


## Team

**SWE Group 3 SCSD**
- [Dharshini Saravanan](https://github.com/dharshhiniii)
- [Vivek Shrey](https://github.com/shreyvivek)
- [Sundari](https://github.com/sundari62)
- [Li Sinuo](https://github.com/Camellia-404)
- [Xin Wei](https://github.com/xwching)

##  Acknowledgments

- [data.gov.sg](https://data.gov.sg/) for providing open government data
- [Supabase](https://supabase.com/) for database infrastructure
- [shadcn/ui](https://ui.shadcn.com/) for UI components

---
