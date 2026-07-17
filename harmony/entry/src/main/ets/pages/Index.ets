import {
  AnyJSBundleProvider,
  MetroJSBundleProvider,
  RNApp,
  RNInstance,
  RNOHErrorDialog,
  ResourceJSBundleProvider,
  RNOHCoreContext
} from '@rnoh/react-native-openharmony';
import { inputConsumer, KeyEvent, KeyCode } from '@kit.InputKit';
import { hilog } from '@kit.PerformanceAnalysisKit';
import { getRNOHPackages } from '../PackageProvider';

@Entry
@Component
struct Index {
  @StorageLink('RNOHCoreContext') private rnohCoreContext: RNOHCoreContext | undefined = undefined
  private rnInstance: RNInstance | undefined = undefined
  private volumeUpCallback = (event: KeyEvent) => {
    this.rnInstance?.emitDeviceEvent('VolumeUp', {})
  }
  private volumeDownCallback = (event: KeyEvent) => {
    this.rnInstance?.emitDeviceEvent('VolumeDown', {})
  }

  // Subscribing with isRepeat: false consumes the key press so the system
  // volume UI/level is not affected while the app is in the foreground.
  private subscribeVolumeKeys() {
    try {
      const upOptions: inputConsumer.KeyPressedConfig = {
        key: KeyCode.KEYCODE_VOLUME_UP,
        action: 1,
        isRepeat: false,
      }
      inputConsumer.on('keyPressed', upOptions, this.volumeUpCallback)
      const downOptions: inputConsumer.KeyPressedConfig = {
        key: KeyCode.KEYCODE_VOLUME_DOWN,
        action: 1,
        isRepeat: false,
      }
      inputConsumer.on('keyPressed', downOptions, this.volumeDownCallback)
    } catch (e) {
      hilog.error(0x0000, 'TallyCounter', 'Failed to subscribe volume keys: %{public}s', JSON.stringify(e))
    }
  }

  private unsubscribeVolumeKeys() {
    try {
      inputConsumer.off('keyPressed', this.volumeUpCallback)
      inputConsumer.off('keyPressed', this.volumeDownCallback)
    } catch (e) {
      hilog.error(0x0000, 'TallyCounter', 'Failed to unsubscribe volume keys: %{public}s', JSON.stringify(e))
    }
  }

  aboutToDisappear() {
    this.unsubscribeVolumeKeys()
  }

  build() {
    Column() {
      if (this.rnohCoreContext) {
        if (this.rnohCoreContext?.isDebugModeEnabled) {
          RNOHErrorDialog({ ctx: this.rnohCoreContext })
        }
        RNApp({
          rnInstanceConfig: {
            name: "TallyCounter",
            createRNPackages: getRNOHPackages,
            fontResourceByFontFamily: {},
            enableDebugger: this.rnohCoreContext?.isDebugModeEnabled,
          },
          appKey: "TallyCounter",
          onSetUp: (rnInstance: RNInstance) => {
            this.rnInstance = rnInstance
            this.subscribeVolumeKeys()
          },
          jsBundleProvider: this.rnohCoreContext?.isDebugModeEnabled ?
            new AnyJSBundleProvider([
              new MetroJSBundleProvider(),
              // NOTE: plain JS bundle is used because loading hermes_bundle.hbc from
              // rawfile fails with "Buffer misaligned" on the emulator. Revisit HBC
              // (faster startup) before release.
              new ResourceJSBundleProvider(this.rnohCoreContext.uiAbilityContext.resourceManager, 'bundle.harmony.js'),
            ]) :
            new ResourceJSBundleProvider(this.rnohCoreContext.uiAbilityContext.resourceManager, 'bundle.harmony.js'),
        })
      }
    }
    .height('100%')
    .width('100%')
  }
}
