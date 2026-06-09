package com.infosys.automation.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.Select;

public class RegisterPage extends BasePage {

    // Locators
    private final By nameField = By.cssSelector("input[name='name']");
    private final By emailField = By.cssSelector("input[name='email']");
    private final By passwordField = By.cssSelector("input[name='password']");
    private final By genderSelect = By.cssSelector("select[name='gender']");
    private final By ageField = By.cssSelector("input[name='age']");
    private final By phoneNoField = By.cssSelector("input[name='phoneNo']");
    private final By submitButton = By.cssSelector("button[type='submit']");
    private final By signInLink = By.linkText("Sign in");
    
    // Popup & validation feedback elements
    private final By popupHeader = By.cssSelector(".popup-box h3");
    private final By popupMessage = By.cssSelector(".popup-box p");
    private final By pwdStrengthLabel = By.xpath("//input[@name='password']/preceding-sibling::div/span");

    public RegisterPage(WebDriver driver) {
        super(driver);
    }

    /**
     * Enters user's full name.
     */
    public void enterName(String name) {
        actions.type(nameField, name);
    }

    /**
     * Enters email address.
     */
    public void enterEmail(String email) {
        actions.type(emailField, email);
    }

    /**
     * Enters password.
     */
    public void enterPassword(String password) {
        actions.type(passwordField, password);
    }

    /**
     * Selects gender from the dropdown menu.
     *
     * @param gender visible text (e.g., "Male", "Female", "Other")
     */
    public void selectGender(String gender) {
        WebElement selectElement = actions.waitForElement(genderSelect, java.time.Duration.ofSeconds(10));
        Select select = new Select(selectElement);
        select.selectByVisibleText(gender);
    }

    /**
     * Enters user's age.
     */
    public void enterAge(String age) {
        actions.type(ageField, age);
    }

    /**
     * Enters phone number.
     */
    public void enterPhoneNo(String phoneNo) {
        actions.type(phoneNoField, phoneNo);
    }

    /**
     * Clicks the submit button.
     */
    public void clickSubmit() {
        actions.click(submitButton);
    }

    /**
     * Clicks the "Sign in" link to navigate back to the login page.
     */
    public void clickSignIn() {
        actions.click(signInLink);
    }

    /**
     * Fills out the entire registration form and submits it.
     */
    public void registerUser(String name, String email, String password, String gender, String age, String phoneNo) {
        enterName(name);
        enterEmail(email);
        enterPassword(password);
        selectGender(gender);
        enterAge(age);
        enterPhoneNo(phoneNo);
        clickSubmit();
    }

    /**
     * Gets the popup header text.
     */
    public String getPopupHeaderText() {
        return actions.getText(popupHeader);
    }

    /**
     * Gets the popup message text.
     */
    public String getPopupMessageText() {
        return actions.getText(popupMessage);
    }

    /**
     * Gets the password strength display text.
     */
    public String getPasswordStrengthText(String pwd) {
        enterPassword(pwd);
        return actions.getText(pwdStrengthLabel);
    }
}
