package com.infosys.automation.tests;

import com.infosys.automation.base.BaseTest;
import org.testng.Assert;
import org.testng.annotations.Test;

public class SmokeTest extends BaseTest {

    @Test
    public void testGoogleLaunch() {
        System.out.println("Executing smoke test: Launching Google...");
        driver.get("https://www.google.com");
        
        String title = driver.getTitle();
        System.out.println("Page Title: " + title);
        
        Assert.assertTrue(title.toLowerCase().contains("google"), "Page title verification failed.");
    }
}
