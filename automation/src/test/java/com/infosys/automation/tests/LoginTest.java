package com.infosys.automation.tests;

import com.infosys.automation.base.BaseTest;
import com.infosys.automation.pages.LoginPage;
import com.infosys.automation.pages.RegisterPage;
import com.infosys.automation.pages.HomePage;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.time.Duration;

public class LoginTest extends BaseTest {

    private final String BASE_URL = "http://localhost:5173";

    @Test(priority = 1)
    public void testValidLogin() {
        // Step 1: Dynamically register a user to ensure it exists
        driver.get(BASE_URL + "/register");
        RegisterPage registerPage = new RegisterPage(driver);
        
        String uniqueEmail = "login_test_" + System.currentTimeMillis() + "@example.com";
        String password = "SecurePassword123";
        
        System.out.println("Valid Login: Registering dynamic user: " + uniqueEmail);
        registerPage.registerUser(
            "Login Test User",
            uniqueEmail,
            password,
            "Male",
            "30",
            "+91 99999 77777"
        );

        // Wait for redirection to login screen
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until(ExpectedConditions.urlToBe(BASE_URL + "/"));

        // Step 2: Log in with the registered user
        LoginPage loginPage = new LoginPage(driver);
        System.out.println("Valid Login: Logging in...");
        loginPage.login(uniqueEmail, password);

        // Assert redirect to dashboard home
        wait.until(ExpectedConditions.urlToBe(BASE_URL + "/dashboard"));
        Assert.assertEquals(driver.getCurrentUrl(), BASE_URL + "/dashboard", "Did not redirect to /dashboard after successful login.");
        
        // Clean up session by logging out
        HomePage homePage = new HomePage(driver);
        homePage.logout();
        wait.until(ExpectedConditions.urlToBe(BASE_URL + "/"));
    }

    @Test(priority = 2)
    public void testInvalidLogin() {
        driver.get(BASE_URL + "/");
        LoginPage loginPage = new LoginPage(driver);

        System.out.println("Executing Invalid Login (Non-existent user)...");
        loginPage.login("non_existent_user_999@example.com", "Password123");

        // Verify popup shows Error
        String header = loginPage.getPopupHeaderText();
        System.out.println("Error Popup Header: " + header);
        Assert.assertEquals(header, "Error", "Login popup did not show Error header for invalid user.");
    }

    @Test(priority = 3)
    public void testEmptyEmail() {
        driver.get(BASE_URL + "/");
        LoginPage loginPage = new LoginPage(driver);

        System.out.println("Executing Empty Email Validation...");
        loginPage.enterPassword("Password123");
        loginPage.clickSignIn();

        // Browser HTML5 validation should block submission
        Assert.assertEquals(driver.getCurrentUrl(), BASE_URL + "/", "Page redirected despite blank email.");
    }

    @Test(priority = 4)
    public void testEmptyPassword() {
        driver.get(BASE_URL + "/");
        LoginPage loginPage = new LoginPage(driver);

        System.out.println("Executing Empty Password Validation...");
        loginPage.enterEmail("test_empty_pwd@example.com");
        loginPage.clickSignIn();

        // Browser HTML5 validation should block submission
        Assert.assertEquals(driver.getCurrentUrl(), BASE_URL + "/", "Page redirected despite blank password.");
    }

    @Test(priority = 5)
    public void testInvalidCredentialsErrorValidation() {
        // Step 1: Register a user
        driver.get(BASE_URL + "/register");
        RegisterPage registerPage = new RegisterPage(driver);
        
        String uniqueEmail = "error_val_" + System.currentTimeMillis() + "@example.com";
        String correctPassword = "SecurePassword123";
        
        registerPage.registerUser(
            "Error Val User",
            uniqueEmail,
            correctPassword,
            "Female",
            "25",
            "+91 99999 66666"
        );

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until(ExpectedConditions.urlToBe(BASE_URL + "/"));

        // Step 2: Attempt login with incorrect password
        LoginPage loginPage = new LoginPage(driver);
        System.out.println("Executing Invalid Credentials Error Validation (Wrong password)...");
        loginPage.login(uniqueEmail, "WrongPassword_xyz");

        // Verify popup shows "Invalid email or password"
        String header = loginPage.getPopupHeaderText();
        String message = loginPage.getPopupMessageText();
        
        System.out.println("Popup Header: " + header);
        System.out.println("Popup Message: " + message);

        Assert.assertEquals(header, "Error", "Popup header was not 'Error'.");
        Assert.assertEquals(message, "Invalid email or password", "Popup message was not 'Invalid email or password'.");
    }
}
