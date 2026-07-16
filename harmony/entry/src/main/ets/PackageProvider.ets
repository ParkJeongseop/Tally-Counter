import type { RNPackageContext, RNPackage } from '@rnoh/react-native-openharmony';
import { createRNOHPackages as createRNOHPackagesAutolinking } from "./RNOHPackagesFactory"
import { AsyncStoragePackage } from '@react-native-ohos/async-storage';
import { SafeAreaViewPackage } from '@react-native-ohos/react-native-safe-area-context';
import { RNLocalizePackage } from '@react-native-ohos/react-native-localize';

export function getRNOHPackages(ctx: RNPackageContext): RNPackage[] {
  return [
    ...createRNOHPackagesAutolinking(ctx),
    new AsyncStoragePackage(ctx),
    new SafeAreaViewPackage(ctx),
    new RNLocalizePackage(ctx),
  ]
}
