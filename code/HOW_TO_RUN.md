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