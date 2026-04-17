#!/bin/bash
# Android localized screenshot automation via adb
# Uses per-app locale API (Android 13+)
#
# Usage:
#   bash scripts/take-screenshots.sh              # auto-detect single device
#   bash scripts/take-screenshots.sh phone         # use first phone/device
#   bash scripts/take-screenshots.sh tablet        # use first emulator (tablet)
#   bash scripts/take-screenshots.sh SERIAL_NUMBER  # use specific device

set -e

PACKAGE="com.parkjeongseop.tallycounter"
ACTIVITY="com.parkjeongseop.tallycounter.MainActivity"

LOCALES=(
  "en-US"
  "ko-KR"
  "ja-JP"
  "zh-CN"
  "es-ES"
  "fr-FR"
  "de-DE"
  "pt-PT"
)

echo "=== Android Screenshot Automation ==="

# Device selection
DEVICES=$(adb devices | grep -w "device" | awk '{print $1}')
DEVICE_COUNT=$(echo "$DEVICES" | grep -c "." || true)

if [ "$DEVICE_COUNT" -eq 0 ]; then
  echo "ERROR: No device connected"
  exit 1
fi

if [ -n "$1" ]; then
  case "$1" in
    phone)
      SERIAL=$(echo "$DEVICES" | grep -v "emulator" | head -1)
      DEVICE_LABEL="phone"
      ;;
    tablet)
      SERIAL=$(echo "$DEVICES" | grep "emulator" | head -1)
      DEVICE_LABEL="tablet"
      ;;
    *)
      SERIAL="$1"
      DEVICE_LABEL="$1"
      ;;
  esac
  if [ -z "$SERIAL" ]; then
    echo "ERROR: No matching device found for '$1'"
    echo "Available devices:"
    echo "$DEVICES"
    exit 1
  fi
  ADB="adb -s $SERIAL"
  echo "Using device: $SERIAL ($DEVICE_LABEL)"
elif [ "$DEVICE_COUNT" -gt 1 ]; then
  echo "Multiple devices detected:"
  echo "$DEVICES"
  echo ""
  echo "Usage: bash scripts/take-screenshots.sh [phone|tablet|SERIAL]"
  exit 1
else
  SERIAL=$(echo "$DEVICES" | head -1)
  ADB="adb -s $SERIAL"
  DEVICE_LABEL="device"
  echo "Using device: $SERIAL"
fi

# Get screen dimensions & determine device type
SCREEN_SIZE=$($ADB shell wm size | grep -oP '[0-9]+x[0-9]+' | tail -1)
SCREEN_W="${SCREEN_SIZE%x*}"
SCREEN_H="${SCREEN_SIZE#*x}"
echo "Screen: ${SCREEN_W}x${SCREEN_H}"

# Set output directory based on device type
if [ "$SCREEN_W" -ge 1600 ] || [ "$DEVICE_LABEL" = "tablet" ]; then
  OUTPUT_DIR="./fastlane/screenshots_android_tablet"
  echo "Type: Tablet"
else
  OUTPUT_DIR="./fastlane/screenshots_android"
  echo "Type: Phone"
fi

mkdir -p "$OUTPUT_DIR"

for LOCALE in "${LOCALES[@]}"; do
  echo ""
  echo "=== $LOCALE ==="

  LOCALE_DIR="$OUTPUT_DIR/$LOCALE"
  mkdir -p "$LOCALE_DIR"

  # Set per-app locale (Android 13+)
  $ADB shell cmd locale set-app-locales "$PACKAGE" --locales "$LOCALE"

  # Restart app to apply locale
  $ADB shell am force-stop "$PACKAGE"
  sleep 2
  $ADB shell am start -W -n "$PACKAGE/$ACTIVITY"
  # Wait for React Native to fully render
  sleep 8

  # Screenshot 1: Counter screen
  $ADB shell "screencap /data/local/tmp/screenshot.png"
  $ADB pull //data/local/tmp/screenshot.png "$LOCALE_DIR/01_CounterScreen.png" > /dev/null 2>&1
  echo "  01_CounterScreen"

  # Tap history button (top-right)
  HIST_X=$((SCREEN_W - 80))
  HIST_Y=$((SCREEN_H * 12 / 100))
  $ADB shell input tap "$HIST_X" "$HIST_Y"
  sleep 2

  # Screenshot 2: History screen
  $ADB shell "screencap /data/local/tmp/screenshot.png"
  $ADB pull //data/local/tmp/screenshot.png "$LOCALE_DIR/02_HistoryScreen.png" > /dev/null 2>&1
  echo "  02_HistoryScreen"

  # Go back
  $ADB shell input tap 100 "$HIST_Y"
  sleep 2

  # Tap goal button (center of card)
  GOAL_X=$((SCREEN_W / 2))
  GOAL_Y=$((SCREEN_H * 55 / 100))
  $ADB shell input tap "$GOAL_X" "$GOAL_Y"
  sleep 1

  # Screenshot 3: Goal modal
  $ADB shell "screencap /data/local/tmp/screenshot.png"
  $ADB pull //data/local/tmp/screenshot.png "$LOCALE_DIR/03_GoalSetting.png" > /dev/null 2>&1
  echo "  03_GoalSetting"

  # Dismiss modal
  $ADB shell input keyevent KEYCODE_BACK
  sleep 1
done

# Restore to Korean
echo ""
echo "Restoring to ko-KR..."
$ADB shell cmd locale set-app-locales "$PACKAGE" --locales "ko-KR"
$ADB shell am force-stop "$PACKAGE"
$ADB shell am start -n "$PACKAGE/$ACTIVITY"

# Cleanup
$ADB shell "rm -f /data/local/tmp/screenshot.png"

echo ""
echo "=== Done! ==="
echo "Screenshots saved to: $OUTPUT_DIR"
echo ""
for d in "$OUTPUT_DIR"/*/; do
  echo "$(basename "$d"): $(ls "$d" | wc -l) files"
done
