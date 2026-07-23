# Physical Tally Counter

A simple and elegant physical tally counter app built with React Native. Count anything using on-screen buttons or hardware volume buttons.

## Download

[<img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Get it on Google Play" height="60">](https://play.google.com/store/apps/details?id=com.parkjeongseop.tallycounter)
[<img src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us" alt="Download on the App Store" height="41">](https://apps.apple.com/kr/app/physical-tally-counter/id6751624376)

- **Google Play**: https://play.google.com/store/apps/details?id=com.parkjeongseop.tallycounter
- **App Store**: https://apps.apple.com/kr/app/physical-tally-counter/id6751624376

## Screenshots

| Counter | History | Goal Setting |
|:---:|:---:|:---:|
| ![Counter screen](fastlane/screenshots_android/en-US/01_CounterScreen.png) | ![History screen](fastlane/screenshots_android/en-US/02_HistoryScreen.png) | ![Goal setting screen](fastlane/screenshots_android/en-US/03_GoalSetting.png) |

## Features

- 📱 Clean, modern UI with gradient design
- 🔊 Hardware volume button support (increment/decrement)
- 💾 Automatic save/restore of count value
- 📳 Haptic feedback on button press
- 🎯 Safe area support for all devices
- 🌐 Cross-platform (iOS & Android)

## Tech Stack

- **React Native** 0.80
- **TypeScript** - Type safety and better DX
- **AsyncStorage** - Persistent data storage
- **React Native Safe Area Context** - Handle device safe areas
- **Custom Native Modules** - Volume button integration

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Header.tsx       # App header with title
│   ├── CounterDisplay.tsx # Main counter display
│   └── ControlButtons.tsx # Increment/decrement/reset buttons
├── hooks/               # Custom React hooks
│   ├── useCounter.ts    # Counter logic & persistence
│   └── useVolumeButtons.ts # Volume button handling
├── constants/           # App constants
│   └── storage.ts       # Storage keys
├── styles/              # Styling utilities
│   └── colors.ts        # Color palette
└── screens/             # Screen components
    └── CounterScreen.tsx # Main counter screen
```

## Architecture Decisions

### Component-Based Architecture
- **Separation of Concerns**: Each component has a single responsibility
- **Reusability**: Components and hooks can be used independently
- **Maintainability**: Small, focused files are easier to understand and modify
- **Testability**: Each part can be tested in isolation

### Custom Hooks Pattern
- `useCounter`: Encapsulates counter state logic and persistence
- `useVolumeButtons`: Abstracts platform-specific volume button handling

### Platform-Specific Implementation
- **iOS**: Uses `react-native-volume-manager` for volume button detection
- **Android**: Custom native module for direct volume button interception

## Getting Started

### Prerequisites
- Node.js (v18 or newer)
- React Native development environment set up
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ParkJeongseop/Tally-Counter.git
cd Tally-Counter
```

2. Install dependencies:
```bash
npm install
```

3. Install iOS dependencies (macOS only):
```bash
cd ios && pod install && cd ..
```

### Running the App

#### Android
```bash
npm run android
```

#### iOS
```bash
npm run ios
```

#### Start Metro bundler separately
```bash
npm start
```

## Development

### Code Quality
```bash
# Run linter
npm run lint

# Run tests
npm test

# Type check
npx tsc --noEmit
```

### Project Commands
- `npm start` - Start Metro bundler
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm test` - Run tests
- `npm run lint` - Check code style

## Volume Button Support

### Android
The app intercepts hardware volume button presses to control the counter without affecting system volume. This is achieved through a custom native module.

### iOS
Volume button detection works through the `react-native-volume-manager` library, which monitors volume changes and resets them immediately to simulate button capture.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- React Native community for the excellent libraries
- Icons and design inspiration from modern UI trends
- Built with ❤️ using React Native