package com.infosys.automation.tests;

import com.infosys.automation.base.BaseTest;
import com.infosys.automation.pages.RegisterPage;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.time.Duration;

public class RegisterTest extends BaseTest {

    private final String BASE_URL = "http://localhost:5173";

    @Test(priority = 1)
    public void testSuccessfulRegistration() {
        driver.get(BASE_URL + "/register");
        RegisterPage registerPage = new RegisterPage(driver);

        String uniqueEmail = "testuser_" + System.currentTimeMillis() + "@example.com";
        System.out.println("Executing Successful Registration with email: " + uniqueEmail);

        registerPage.registerUser(
            "Automation User",
            uniqueEmail,
            "P@ssword123",
            "Male",
            "28",
            "+91 99999 88888"
        );

        // Verify popup shows Success
        String header = registerPage.getPopupHeaderText();
        String message = registerPage.getPopupMessageText();
        
        System.out.println("Popup Header: " + header);
        System.out.println("Popup Message: " + message);

        Assert.assertEquals(header, "Success", "Registration popup header did not show Success.");
        Assert.assertTrue(message.contains("Account created!"), "Registration popup message was incorrect.");

        // Wait for redirect to login page "/"
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));
        wait.until(ExpectedConditions.urlToBe(BASE_URL + "/"));
        Assert.assertEquals(driver.getCurrentUrl(), BASE_URL + "/", "Did not redirect to Login screen after registration.");
    }

    @Test(priority = 2)
    public void testEmptyMandatoryFields() {
        driver.get(BASE_URL + "/register");
        RegisterPage registerPage = new RegisterPage(driver);

        System.out.println("Executing Empty Name Validation...");
        
        // Enter all details except full name
        registerPage.enterEmail("test_empty_name@example.com");
        registerPage.enterPassword("P@ssword123");
        registerPage.selectGender("Female");
        registerPage.enterAge("25");
        registerPage.enterPhoneNo("9876543210");
        registerPage.clickSubmit();

        // HTML5 validation prevents submission, so URL must still be /register and no popup is shown
        Assert.assertTrue(driver.getCurrentUrl().contains("/register"), "Form submitted despite empty mandatory Full Name field.");
    }

    @Test(priority = 3)
    public void testInvalidEmailFormat() {
        driver.get(BASE_URL + "/register");
        RegisterPage registerPage = new RegisterPage(driver);

        System.out.println("Executing Invalid Email Format Validation...");

        // Enter email in invalid format
        registerPage.registerUser(
            "Automation User",
            "invalidemailformat", // missing @ and domain
            "P@ssword123",
            "Other",
            "32",
            "9876543210"
        );

        // HTML5 validation prevents form submission, so URL remains /register
        Assert.assertTrue(driver.getCurrentUrl().contains("/register"), "Form submitted despite invalid email format.");
    }

    @Test(priority = 4)
    public void testWeakPasswordValidation() {
        driver.get(BASE_URL + "/register");
        RegisterPage registerPage = new RegisterPage(driver);

        System.out.println("Executing Weak Password Validation...");

        // Type a password under 6 characters and verify weak strength indicator
        String strengthText = registerPage.getPasswordStrengthText("123");
        System.out.println("Password Strength Indicator Text: " + strengthText);

        Assert.assertEquals(strengthText, "Weak", "Password strength indicator did not register 'Weak' for small password.");
    }
}
