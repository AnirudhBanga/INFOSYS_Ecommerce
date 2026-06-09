package com.infosys.automation.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class LoginPage extends BasePage {

    // Locators
    private final By emailField = By.cssSelector("input[type='email']");
    private final By passwordField = By.cssSelector("input[type='password']");
    private final By signInButton = By.cssSelector("button[type='submit']");
    private final By createAccountLink = By.linkText("Create account");
    
    // Popup validation feedback elements
    private final By popupHeader = By.cssSelector(".popup-box h3");
    private final By popupMessage = By.cssSelector(".popup-box p");

    public LoginPage(WebDriver driver) {
        super(driver);
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
     * Clicks the Sign In button.
     */
    public void clickSignIn() {
        actions.click(signInButton);
    }

    /**
     * Clicks the "Create account" link to navigate to the registration page.
     */
    public void clickCreateAccount() {
        actions.click(createAccountLink);
    }

    /**
     * Performs a complete login action.
     *
     * @param email user email
     * @param password user password
     */
    public void login(String email, String password) {
        enterEmail(email);
        enterPassword(password);
        clickSignIn();
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
}
