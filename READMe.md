# SoleLux E-Commerce Platform & Test Automation Suite

SoleLux is a premium e-commerce platform specializing in luxury footwear and sandals. It is composed of a responsive React SPA frontend, a secure Spring Boot REST API backend, and a comprehensive Selenium POM Automation framework.

<img width="1050" height="827" alt="SoleLux Platform Preview" src="https://github.com/user-attachments/assets/f4e9cfb4-b88e-49d4-b7c1-0b943dcbe8fc" />

---

## 1. Technologies Used

### Frontend (React SPA)
* **React 18** with **Vite** build tooling
* **React Router Dom** for client-side routing & private path redirection
* **Axios** for centralized API request/response handling
* Vanilla **CSS3** for premium user interface designs

### Backend (Spring Boot REST API)
* **Java 17** & **Spring Boot 3.2.x**
* **Spring Security** & **JWT (Json Web Tokens)** for stateless authentication
* **Spring Data JPA** & **Hibernate**
* **MySQL Database**
* **Cloudinary** integration for image uploads
* **Razorpay Gateway** for secure checkout and payment simulation

### Automation Testing Framework
* **Java 17** & **Apache Maven**
* **Selenium WebDriver 4.18.x** for cross-browser web element interaction
* **TestNG 7.9.x** for test runner control and assertions
* **WebDriverManager 5.7.x** for automated Chrome, Firefox, and Edge driver configurations
* **Maven Surefire Plugin** for CLI test suite executions

---

## 2. Project Directory Structure

```text
InfosysProject/
├── .gitignore                      # Root git ignore exclusions (target, node_modules, logs, envs)
├── READMe.md                       # Main project documentation
│
├── backend/                        # Spring Boot REST API Application
│   ├── src/                        # Java Source files & resources
│   ├── pom.xml                     # Maven dependency configuration
│   └── application.properties.example # Template environment variable values
│
├── frontend/                       # React JS Web Application
│   ├── src/                        # CSS styles, JSX pages, components, context state
│   ├── package.json                # npm dependency specifications
│   └── .env.example                # Template API endpoint configurations
│
└── automation/                     # Selenium Automation Framework
    ├── pom.xml                     # Automation Maven dependencies
    ├── testng.xml                  # Test suite runner mapping
    └── src/
        ├── main/java/com/infosys/automation/
        │   ├── base/               # BasePage initialization
        │   ├── driver/             # ThreadLocal DriverFactory registry
        │   ├── pages/              # Page Object Model locators & wrappers
        │   └── utils/              # Resumable scroll/click/type utilities
        │
        └── test/java/com/infosys/automation/
            ├── base/               # BaseTest lifecycle setup & teardown
            └── tests/              # TestNG test cases (SmokeTest, RegisterTest, LoginTest, LogoutTest)
```

---

## 3. How to Run the Application

### Step 1: Database Initialization
1. Ensure a MySQL Server instance is running locally on port `3306`.
2. Create a database schema named `ecommerce`:
   ```sql
   CREATE DATABASE ecommerce;
   ```
3. Default credentials: User: `root` | Password: `Anirudh` (Adjust environment variables if yours differs).

### Step 2: Running the Spring Boot Backend
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Copy the example configuration to build active properties:
   ```bash
   copy application.properties.example src\main\resources\application.properties
   ```
3. Start the server using the Maven wrapper:
   ```bash
   .\mvnw.cmd spring-boot:run
   ```
   *The server will run on [http://localhost:8081](http://localhost:8081).*

### Step 3: Running the React Frontend
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Copy the example environment variables:
   ```bash
   copy .env.example .env
   ```
3. Install the dependencies and boot up the development server:
   ```bash
   npm install
   npm run dev
   ```
   *The application UI will run on [http://localhost:5173](http://localhost:5173).*

---

## 4. How to Run the Automation Tests

The automation suite validates the user flow from registration, validation warnings, logins, to logout and session caching.

### Step 1: Verification
Ensure both the **Backend API** and **Frontend Web App** are active and listening on their default ports.

### Step 2: Running the Test Suite
1. Open a terminal and navigate to the automation directory:
   ```bash
   cd automation
   ```
2. Execute the TestNG suite:
   ```bash
   mvn clean test
   ```
3. The execution triggers 14 tests covering:
   * **SmokeTest**: Launches Google to confirm setup integrity.
   * **RegisterTest**: Successful registration, empty fields validation, invalid email warning, and weak password indicator.
   * **LoginTest**: Valid login, non-existent login, empty fields, and incorrect credential messages.
   * **LogoutTest**: Successful logout, back button session caching prevention, direct URL access restriction, and localStorage token invalidation.

### Step 3: View Reports
Once finished, Open the generated HTML reports in any browser to review test execution run summaries:
```text
automation/target/surefire-reports/index.html
```
