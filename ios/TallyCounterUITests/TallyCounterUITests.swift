import XCTest

class TallyCounterUITests: XCTestCase {

  override func setUpWithError() throws {
    continueAfterFailure = false
  }

  func testTakeScreenshots() throws {
    let app = XCUIApplication()
    setupSnapshot(app)
    app.launch()

    // Wait for React Native to load
    sleep(3)

    // Screenshot 1: Main counter screen
    snapshot("01_CounterScreen")

    // Screenshot 2: Try to navigate to history screen
    // Tap the history button (clipboard emoji button in header)
    let historyButton = app.buttons.element(boundBy: 0)
    if historyButton.exists {
      // Look for the history button more specifically
      let buttons = app.buttons.allElementsBoundByIndex
      for button in buttons {
        if button.isHittable {
          // Try tapping - we'll look for the history/clipboard button
          break
        }
      }
    }

    // Try tapping on the top-right area where the history button should be
    let topRight = app.coordinate(withNormalizedOffset: CGVector(dx: 0.9, dy: 0.08))
    topRight.tap()
    sleep(2)

    // Screenshot 2: History screen
    snapshot("02_HistoryScreen")

    // Go back to counter screen
    let backArea = app.coordinate(withNormalizedOffset: CGVector(dx: 0.1, dy: 0.08))
    backArea.tap()
    sleep(1)

    // Tap the goal button area (center of the card, below counter)
    let goalArea = app.coordinate(withNormalizedOffset: CGVector(dx: 0.5, dy: 0.55))
    goalArea.tap()
    sleep(1)

    // Screenshot 3: Goal setting modal
    snapshot("03_GoalSetting")
  }
}
