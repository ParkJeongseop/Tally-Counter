package com.parkjeongseop.tallycounter

import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.rule.ActivityTestRule
import org.junit.ClassRule
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith
import tools.fastlane.screengrab.Screengrab
import tools.fastlane.screengrab.UiAutomatorScreenshotStrategy
import tools.fastlane.screengrab.locale.LocaleTestRule

@RunWith(AndroidJUnit4::class)
class ScreenshotTest {

    companion object {
        @get:ClassRule
        @JvmStatic
        val localeTestRule = LocaleTestRule()
    }

    @get:Rule
    val activityRule = ActivityTestRule(MainActivity::class.java)

    @Test
    fun takeScreenshots() {
        Screengrab.setDefaultScreenshotStrategy(UiAutomatorScreenshotStrategy())

        // Wait for React Native to load
        Thread.sleep(4000)

        // Screenshot 1: Main counter screen
        Screengrab.screenshot("01_CounterScreen")

        // Tap history button (top-right area)
        val device = androidx.test.platform.app.InstrumentationRegistry.getInstrumentation()
        val uiDevice = androidx.test.uiautomator.UiDevice.getInstance(device)

        // Tap top-right corner for history button
        val screenWidth = uiDevice.displayWidth
        val screenHeight = uiDevice.displayHeight
        uiDevice.click(screenWidth - 80, (screenHeight * 0.08).toInt())
        Thread.sleep(2000)

        // Screenshot 2: History screen
        Screengrab.screenshot("02_HistoryScreen")

        // Tap back button (top-left area)
        uiDevice.click(80, (screenHeight * 0.08).toInt())
        Thread.sleep(1500)

        // Tap goal button (center area)
        uiDevice.click(screenWidth / 2, (screenHeight * 0.55).toInt())
        Thread.sleep(1000)

        // Screenshot 3: Goal setting modal
        Screengrab.screenshot("03_GoalSetting")
    }
}
