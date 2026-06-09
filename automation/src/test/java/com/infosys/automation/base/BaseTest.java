package com.infosys.automation.base;

import com.infosys.automation.driver.DriverFactory;
import org.openqa.selenium.WebDriver;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Optional;
import org.testng.annotations.Parameters;

public class BaseTest {

    protected WebDriver driver;

    /**
     * Set up the WebDriver browser session before executing each test method.
     * Allows overriding the browser parameter from the testng.xml file.
     *
     * @param browser the browser type parameter (defaults to "chrome" if not supplied)
     */
    @BeforeMethod
    @Parameters({"browser"})
    public void setUp(@Optional("chrome") String browser) {
        DriverFactory.initDriver(browser);
        driver = DriverFactory.getDriver();
    }

    /**
     * Clean up and close the browser session after each test method completes.
     */
    @AfterMethod
    public void tearDown() {
        DriverFactory.quitDriver();
    }
}
