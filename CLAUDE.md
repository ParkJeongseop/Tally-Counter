# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Native tally counter app that uses volume buttons (Android) or on-screen buttons to count. The app includes custom Android native modules for volume button handling.

## Common Development Commands

### Development
```bash
# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS (requires Mac with Xcode)
npm run ios

# For iOS first-time setup
bundle install
cd ios && bundle exec pod install
```

### Code Quality
```bash
# Run linting
npm run lint

# Run tests
npm test

# Run tests in watch mode
npm test -- --watch
```

## Architecture

### Core Structure
- **App.tsx**: Main component containing all app logic and UI
- **Custom Native Module**: Android-specific volume button handling via:
  - `android/app/src/main/java/com/tallycounter/VolumeButtonModule.kt`: Native module that emits volume button events
  - `android/app/src/main/java/com/tallycounter/MainActivity.kt`: Intercepts hardware volume button presses
  - Events are received in JavaScript via `DeviceEventEmitter`

### Key Implementation Details

1. **Volume Button Integration** (Android only):
   - Native module emits 'VolumeUp' and 'VolumeDown' events
   - JavaScript listens via: `DeviceEventEmitter.addListener('VolumeUp', callback)`
   - Volume buttons are intercepted and don't affect system volume when app is active

2. **State Management**:
   - Simple useState hook for counter value
   - No external state management libraries

3. **Haptic Feedback**:
   - Uses `Vibration.vibrate(10)` for button press feedback

## Testing Approach

- Jest with React Native preset
- Test files in `__tests__/` directory
- Run single test: `npm test -- --testNamePattern="pattern"`

## Platform-Specific Notes

### Android
- Custom native modules require rebuilding: `cd android && ./gradlew clean && cd .. && npm run android`
- Volume button functionality only works on Android

### iOS
- Standard React Native iOS setup
- Volume buttons don't work (iOS limitation)
- Requires CocoaPods: `cd ios && pod install`

## TypeScript Configuration
- Strict type checking enabled
- Extends '@react-native/typescript-config'
- All component code should be typed