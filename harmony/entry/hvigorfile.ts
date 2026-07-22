import { hapTasks } from '@ohos/hvigor-ohos-plugin';
import { createRNOHModulePlugin } from '@rnoh/hvigor-plugin';
import { HvigorNode, HvigorPlugin } from '@ohos/hvigor';
import fs from 'fs';
import path from 'path';

/**
 * The RNOH HAR declares ohos.permission.INTERNET (it needs it for Metro and the
 * dev tooling), and hvigor merges dependency permissions into our module. This
 * app ships fully offline and is submitted to AppGallery as a standalone app, so
 * a merged INTERNET permission would contradict that declaration.
 *
 * There is no declarative way to drop a permission inherited from a HAR, so strip
 * it from the merged profile after MergeProfile runs and before the HAP is packed.
 */
function stripInternetPermissionPlugin(): HvigorPlugin {
  return {
    pluginId: 'stripInternetPermission',
    apply(node: HvigorNode) {
      node.registerTask({
        name: 'stripInternetPermission',
        run() {
          const merged = path.resolve(
            node.getNodePath(),
            'build/default/intermediates/merge_profile/default/module.json',
          );
          if (!fs.existsSync(merged)) {
            return;
          }

          const profile = JSON.parse(fs.readFileSync(merged, 'utf8'));
          const permissions = profile?.module?.requestPermissions;
          if (!Array.isArray(permissions)) {
            return;
          }

          const kept = permissions.filter(
            (p: { name?: string }) => p?.name !== 'ohos.permission.INTERNET',
          );
          if (kept.length === permissions.length) {
            return;
          }

          profile.module.requestPermissions = kept;
          fs.writeFileSync(merged, JSON.stringify(profile, null, 2), 'utf8');
          console.log('[stripInternetPermission] removed ohos.permission.INTERNET');
        },
        dependencies: ['default@MergeProfile'],
        postDependencies: ['default@ProcessProfile'],
      });
    },
  };
}

export default {
  system: hapTasks,
  plugins: [
    createRNOHModulePlugin({
      codegen: {
        rnohModulePath: './oh_modules/@rnoh/react-native-openharmony',
      },
    }),
    stripInternetPermissionPlugin(),
  ],
};
