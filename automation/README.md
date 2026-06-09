# SoleLux Test Automation Framework

This directory contains a standalone UI Automation Framework built using Java, Maven, Selenium WebDriver, TestNG, and WebDriverManager. It is configured following the Page Object Model (POM) pattern and runs entirely decoupled from the main frontend and backend application codebase.

---

## 1. Project Directory Structure

```
automation/
├── pom.xml                   # Maven dependencies and Surefire plugin configuration
├── testng.xml                # TestNG suite orchestration XML
├── README.md                 # This file
└── src
    ├── main
    │   └── java
    │       └── com.infosys.automation
    │           ├── driver
    │           │   └── DriverFactory.java   # ThreadLocal Webdriver instantiation
    │           ├── pages
    │           │   └── BasePage.java        # POM Page Base class
    │           └── utils
    │               └── ElementActions.java  # Reusable UI click/type/wait action wrappers
    └── test
        └── java
            └── com.infosys.automation
                ├── base
                │   └── BaseTest.java        # TestNG Before/AfterMethod lifecycle base
                └── tests
                    ├── SmokeTest.java       # Browser startup smoke verification
                    ├── LoginTest.java       # Login Test class placeholder
                    ├── RegisterTest.java    # Registration Test class placeholder
                    └── LogoutTest.java      # Logout Test class placeholder
```

---

## 2. Prerequisites

Make sure the following are installed and added to your system path:
1. **Java Development Kit (JDK) 17** (or above).
2. **Apache Maven** build tool.
3. **Google Chrome browser** (ChromeDriver is managed automatically).

---

## 3. How to Run the Test Suite

Navigate to the `automation` directory in your terminal before running commands:
```bash
cd automation
```

### A. Run via Maven (Recommended)
You can run all tests specified in the `testng.xml` file using the Maven test command. Run:
```bash
mvn clean test
```
This triggers the Maven Surefire Plugin which compiles the code, downloads any missing driver binaries, opens Chrome, launches Google, runs the assertions, and creates HTML reports inside the `target/surefire-reports` folder.

### B. Run via TestNG XML Suite File
If you are using an IDE (such as IntelliJ IDEA or Eclipse) with the TestNG plugin installed:
1. Right-click on the `testng.xml` file in the root of the `automation/` directory.
2. Select **Run 'testng.xml'**.
3. Alternatively, you can configure TestNG runtime options in your IDE run configurations.

---

## 4. Key Design Details

- **Thread Safety**: `DriverFactory.java` uses `ThreadLocal<WebDriver>` to support concurrent multi-threaded execution (when running parallel tests in TestNG).
- **WebDriverManager**: Automatically checks the Chrome browser version installed on your host system and downloads/caches the matching `chromedriver` executable, eliminating manual driver configuration steps.
- **Fluent Actions**: `ElementActions.java` provides centralized, clean error handling and visibility waits for all basic interactions like clicking and typing.
