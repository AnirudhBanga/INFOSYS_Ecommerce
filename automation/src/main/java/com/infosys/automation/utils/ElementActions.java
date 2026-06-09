package com.infosys.automation.utils;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class ElementActions {

    private final WebDriver driver;

    public ElementActions(WebDriver driver) {
        this.driver = driver;
    }

    /**
     * Reusable method to wait for element visibility.
     *
     * @param locator the locator of the element
     * @param timeout the maximum duration to wait
     * @return the visible WebElement instance
     */
    public WebElement waitForElement(By locator, Duration timeout) {
        WebDriverWait wait = new WebDriverWait(driver, timeout);
        return wait.until(ExpectedConditions.visibilityOfElementLocated(locator));
    }

    /**
     * Reusable method to click on an element.
     *
     * @param locator the locator of the element
     */
    public void click(By locator) {
        WebElement element = waitForElement(locator, Duration.ofSeconds(10));
        try {
            ((org.openqa.selenium.JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", element);
            element.click();
        } catch (Exception e) {
            System.out.println("Standard click failed for locator: " + locator + ". Attempting JavaScript click fallback...");
            ((org.openqa.selenium.JavascriptExecutor) driver).executeScript("arguments[0].click();", element);
        }
    }

    /**
     * Reusable method to type text into an input field.
     *
     * @param locator the locator of the input element
     * @param text the text value to send
     */
    public void type(By locator, String text) {
        WebElement element = waitForElement(locator, Duration.ofSeconds(10));
        ((org.openqa.selenium.JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", element);
        element.clear();
        element.sendKeys(text);
    }

    /**
     * Reusable method to fetch the text value of an element.
     *
     * @param locator the locator of the element
     * @return the text content of the element
     */
    public String getText(By locator) {
        WebElement element = waitForElement(locator, Duration.ofSeconds(10));
        return element.getText();
    }
}
