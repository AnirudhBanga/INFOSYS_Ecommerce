package com.infosys.automation.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;

public class HomePage extends BasePage {

    // Locators
    private final By brandLogo = By.cssSelector("a.topnav-brand");
    private final By homeLink = By.xpath("//a[text()='Home']");
    private final By collectionLink = By.xpath("//a[text()='Collection']");
    private final By searchInput = By.cssSelector("input[placeholder='Search products...']");
    
    // Account details navbar
    private final By accountDropdown = By.xpath("//div[contains(text(), 'Account')]");
    private final By profileLink = By.linkText("My Profile");
    private final By ordersLink = By.linkText("My Orders");
    private final By logoutButton = By.xpath("//button[contains(text(), 'Logout')]");

    public HomePage(WebDriver driver) {
        super(driver);
    }

    /**
     * Clicks the brand logo to navigate back to dashboard home.
     */
    public void clickLogo() {
        actions.click(brandLogo);
    }

    /**
     * Clicks the Home navigation link.
     */
    public void navigateToHome() {
        actions.click(homeLink);
    }

    /**
     * Clicks the Collection link.
     */
    public void navigateToCollection() {
        actions.click(collectionLink);
    }

    /**
     * Searches for a product by typing a query and pressing ENTER.
     */
    public void searchProduct(String query) {
        actions.type(searchInput, query);
        WebElement searchBox = actions.waitForElement(searchInput, java.time.Duration.ofSeconds(10));
        searchBox.sendKeys(Keys.ENTER);
    }

    /**
     * Triggers mouse hover over the Account dropdown menu.
     */
    public void hoverAccountDropdown() {
        WebElement dropdown = actions.waitForElement(accountDropdown, java.time.Duration.ofSeconds(10));
        Actions builder = new Actions(driver);
        builder.moveToElement(dropdown).perform();
    }

    /**
     * Navigates to user profile page by hovering and clicking "My Profile".
     */
    public void navigateToProfile() {
        hoverAccountDropdown();
        actions.click(profileLink);
    }

    /**
     * Navigates to user orders page by hovering and clicking "My Orders".
     */
    public void navigateToMyOrders() {
        hoverAccountDropdown();
        actions.click(ordersLink);
    }

    /**
     * Triggers logout action from the account dropdown.
     */
    public void logout() {
        hoverAccountDropdown();
        actions.click(logoutButton);
    }
}
