//
//  SnapshotHelper.swift
//  Fastlane
//
//  Created by Felix Krause on 10/8/15.
//  Copyright © 2015 Felix Krause. All rights reserved.
//

// This file should be replaced with the latest version from:
// https://github.com/fastlane/fastlane/blob/master/snapshot/lib/assets/SnapshotHelper.swift
//
// Run this command to download the latest version:
// fastlane snapshot reset_simulators
// Or copy from: fastlane/snapshot/lib/assets/SnapshotHelper.swift

import Foundation
import XCTest

var deviceLanguage = ""
var locale = ""

func setupSnapshot(_ app: XCUIApplication, waitForAnimations: Bool = true) {
    Snapshot.setupSnapshot(app, waitForAnimations: waitForAnimations)
}

func snapshot(_ name: String, waitForLoadingIndicator: Bool = true) {
    if waitForLoadingIndicator {
        Snapshot.snapshot(name, waitForLoadingIndicator: waitForLoadingIndicator)
    } else {
        Snapshot.snapshot(name)
    }
}

enum SnapshotError: Error {
    case cannotDetectUser
    case cannotFindHomeDirectory
    case cannotFindSimulatorHomeDirectory
    case cannotAccessSimulatorHomeDirectory(String)
    case cannotRunOnPhysicalDevice
}

@objcMembers
class Snapshot: NSObject {
    static var app: XCUIApplication?
    static var waitForAnimations = true
    static var cacheDirectory: URL?
    static var screenshotsDirectory: URL? {
        return cacheDirectory
    }

    class func setupSnapshot(_ app: XCUIApplication, waitForAnimations: Bool = true) {
        Snapshot.app = app
        Snapshot.waitForAnimations = waitForAnimations

        do {
            let cacheDir = try pathPrefix()
            Snapshot.cacheDirectory = cacheDir
            setLanguage(app)
            setLocale(app)
            setLaunchArguments(app)
        } catch {
            NSLog("Snapshot: Error setting up snapshot: \(error)")
        }
    }

    class func setLanguage(_ app: XCUIApplication) {
        guard let cacheDirectory = self.cacheDirectory else {
            NSLog("Snapshot: Cache directory not set")
            return
        }

        let path = cacheDirectory.appendingPathComponent("language.txt")

        do {
            let trimCharacterSet = CharacterSet.whitespacesAndNewlines
            deviceLanguage = try String(contentsOf: path, encoding: .utf8).trimmingCharacters(in: trimCharacterSet)
            app.launchArguments += ["-AppleLanguages", "(\(deviceLanguage))"]
        } catch {
            NSLog("Snapshot: Couldn't detect/set language: \(error)")
        }
    }

    class func setLocale(_ app: XCUIApplication) {
        guard let cacheDirectory = self.cacheDirectory else {
            NSLog("Snapshot: Cache directory not set")
            return
        }

        let path = cacheDirectory.appendingPathComponent("locale.txt")

        do {
            let trimCharacterSet = CharacterSet.whitespacesAndNewlines
            locale = try String(contentsOf: path, encoding: .utf8).trimmingCharacters(in: trimCharacterSet)
        } catch {
            NSLog("Snapshot: Couldn't detect/set locale: \(error)")
        }

        if locale.isEmpty && !deviceLanguage.isEmpty {
            locale = Locale(identifier: deviceLanguage).identifier
        }

        if !locale.isEmpty {
            app.launchArguments += ["-AppleLocale", "\"\(locale)\""]
        }
    }

    class func setLaunchArguments(_ app: XCUIApplication) {
        guard let cacheDirectory = self.cacheDirectory else {
            NSLog("Snapshot: Cache directory not set")
            return
        }

        let path = cacheDirectory.appendingPathComponent("snapshot-launch_arguments.txt")
        app.launchArguments += ["-FASTLANE_SNAPSHOT", "YES", "-ui_testing"]

        do {
            let argsString = try String(contentsOf: path, encoding: .utf8)
            let trimCharacterSet = CharacterSet.whitespacesAndNewlines
            let lines = argsString.components(separatedBy: .newlines)
            for line in lines {
                let arg = line.trimmingCharacters(in: trimCharacterSet)
                guard !arg.isEmpty else { continue }
                app.launchArguments.append(arg)
            }
        } catch {
            NSLog("Snapshot: Couldn't read launch arguments: \(error)")
        }
    }

    class func snapshot(_ name: String, waitForLoadingIndicator: Bool = false) {
        if waitForLoadingIndicator {
            waitForLoadingIndicatorToDisappear()
        }

        NSLog("Snapshot: Taking snapshot '\(name)'")

        sleep(1)

        let screenshot = app?.windows.firstMatch.screenshot()
        guard let png = screenshot?.pngRepresentation else {
            NSLog("Snapshot: Could not take screenshot")
            return
        }

        guard let cacheDir = cacheDirectory else {
            NSLog("Snapshot: Cache directory not set")
            return
        }

        let path = cacheDir.appendingPathComponent("\(name).png")
        do {
            try png.write(to: path)
            NSLog("Snapshot: Saved screenshot to '\(path.path)'")
        } catch {
            NSLog("Snapshot: Could not save screenshot: \(error)")
        }

        let activity = XCTContext.runActivity(named: "Snapshot: \(name)") { activity in
            let attachment = XCTAttachment(screenshot: XCUIScreen.main.screenshot())
            attachment.lifetime = .keepAlways
            activity.add(attachment)
        }
    }

    class func waitForLoadingIndicatorToDisappear() {
        guard let app = self.app else { return }

        let query = app.statusBars.children(matching: .other).element(boundBy: 1).children(matching: .other)

        while query.count > 4 {
            sleep(1)
            NSLog("Snapshot: Waiting for loading indicator to disappear...")
        }
    }

    class func pathPrefix() throws -> URL? {
        let homeDir: URL
        // Simulators
        guard let simulatorHostHome = ProcessInfo().environment["SIMULATOR_HOST_HOME"] else {
            NSLog("Snapshot: Running on a physical device, skipping snapshot setup")
            return nil
        }
        guard let homeDirUrl = URL(string: simulatorHostHome) else {
            throw SnapshotError.cannotFindSimulatorHomeDirectory
        }
        homeDir = homeDirUrl

        return homeDir
            .appendingPathComponent("Library")
            .appendingPathComponent("Caches")
            .appendingPathComponent("tools.fastlane")
    }
}
