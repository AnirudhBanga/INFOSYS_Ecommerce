package com.infosys.automation.driver;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.edge.EdgeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;

import java.time.Duration;

public class DriverFactory {

    private static final ThreadLocal<WebDriver> tlDriver = new ThreadLocal<>();

    /**
     * Initializes the driver based on the browser name.
     * Uses WebDriverManager to handle browser driver binaries automatically.
     *
     * @param browser the name of the browser (e.g. "chrome", "firefox", "edge")
     * @return the initialized WebDriver instance
     */
    public static WebDriver initDriver(String browser) {
        WebDriver driver = null;
        String browserName = browser == null ? "chrome" : browser.toLowerCase().trim();

        System.out.println("Initializing browser driver: " + browserName);

        if (browserName.equals("chrome")) {
            WebDriverManager.chromedriver().setup();
            ChromeOptions options = new ChromeOptions();
            options.addArguments("--remote-allow-origins=*");
            options.addArguments("--disable-gpu");
            options.addArguments("--no-sandbox");
            options.addArguments("--disable-dev-shm-usage");
            driver = new ChromeDriver(options);
        } else if (browserName.equals("firefox")) {
            WebDriverManager.firefoxdriver().setup();
            driver = new FirefoxDriver();
        } else if (browserName.equals("edge")) {
            WebDriverManager.edgedriver().setup();
            driver = new EdgeDriver();
        } else {
            throw new IllegalArgumentException("Unsupported browser: " + browserName);
        }

        driver.manage().deleteAllCookies();
        driver.manage().window().maximize();
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
        
        tlDriver.set(driver);
        return getDriver();
    }

    /**
     * Returns the thread-safe WebDriver instance.
     */
    public static WebDriver getDriver() {
        return tlDriver.get();
    }

    /**
     * Quits the WebDriver session and cleans up the thread local variable.
     */
    public static void quitDriver() {
        WebDriver driver = getDriver();
        if (driver != null) {
            System.out.println("Quitting browser driver...");
            driver.quit();
            tlDriver.remove();
        }
    }
}
