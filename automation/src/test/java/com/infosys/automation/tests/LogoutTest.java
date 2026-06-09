package com.infosys.automation.tests;

import com.infosys.automation.base.BaseTest;
import com.infosys.automation.pages.LoginPage;
import com.infosys.automation.pages.RegisterPage;
import com.infosys.automation.pages.HomePage;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.time.Duration;

public class LogoutTest extends BaseTest {

    private final String BASE_URL = "http://localhost:5173";

    /**
     * Helper method to register and log in a dynamic user.
     */
    private void registerAndLoginUser() {
        driver.get(BASE_URL + "/register");
        RegisterPage registerPage = new RegisterPage(driver);
        
        String uniqueEmail = "logout_test_" + System.currentTimeMillis() + "@example.com";
        String password = "SecurePassword123";
        
        registerPage.registerUser(
            "Logout Test User",
            uniqueEmail,
            password,
            "Male",
            "30",
            "+91 99999 55555"
        );

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until(ExpectedConditions.urlToBe(BASE_URL + "/"));

        LoginPage loginPage = new LoginPage(driver);
        loginPage.login(uniqueEmail, password);
        wait.until(ExpectedConditions.urlToBe(BASE_URL + "/dashboard"));
    }

    @Test(priority = 1)
    public void testSuccessfulLogoutAndRedirect() {
        registerAndLoginUser();

        HomePage homePage = new HomePage(driver);
        System.out.println("Executing Successful Logout...");
        homePage.logout();

        // Verify user is redirected to login page after logout
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until(ExpectedConditions.urlToBe(BASE_URL + "/"));
        Assert.assertEquals(driver.getCurrentUrl(), BASE_URL + "/", "Did not redirect to Login screen after logging out.");
    }

    @Test(priority = 2)
    public void testBrowserBackButtonAfterLogout() {
        registerAndLoginUser();

        HomePage homePage = new HomePage(driver);
        System.out.println("Logging out before Back Button check...");
        homePage.logout();

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until(ExpectedConditions.urlToBe(BASE_URL + "/"));

        // Trigger browser Back button
        System.out.println("Clicking browser back button...");
        driver.navigate().back();

        // PrivateRoute should force redirection back to login
        wait.until(ExpectedConditions.urlToBe(BASE_URL + "/"));
        Assert.assertEquals(driver.getCurrentUrl(), BASE_URL + "/", "Allowed to visit protected dashboard via browser back button after logout.");
    }

    @Test(priority = 3)
    public void testDirectProtectedUrlAccessAfterLogout() {
        registerAndLoginUser();

        HomePage homePage = new HomePage(driver);
        System.out.println("Logging out before direct URL access check...");
        homePage.logout();

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until(ExpectedConditions.urlToBe(BASE_URL + "/"));

        // Attempt direct access to protected page
        System.out.println("Attempting direct access to /dashboard...");
        driver.get(BASE_URL + "/dashboard");

        // Should instantly redirect back to login
        wait.until(ExpectedConditions.urlToBe(BASE_URL + "/"));
        Assert.assertEquals(driver.getCurrentUrl(), BASE_URL + "/", "Allowed to directly load protected dashboard URL after logout.");
    }

    @Test(priority = 4)
    public void testSessionInvalidationValidation() {
        registerAndLoginUser();

        // Verify token exists before logout
        JavascriptExecutor js = (JavascriptExecutor) driver;
        String tokenBefore = (String) js.executeScript("return localStorage.getItem('token');");
        Assert.assertNotNull(tokenBefore, "Token was null despite active logged-in session.");

        HomePage homePage = new HomePage(driver);
        System.out.println("Logging out for Session Invalidation check...");
        homePage.logout();

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until(ExpectedConditions.urlToBe(BASE_URL + "/"));

        // Verify token is cleared from localStorage
        String tokenAfter = (String) js.executeScript("return localStorage.getItem('token');");
        System.out.println("Token after logout: " + tokenAfter);
        Assert.assertNull(tokenAfter, "Session token is still present in localStorage after logout.");
    }
}
