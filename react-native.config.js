/**
 * This cli config is needed for the coexistance of react-native and other
 * out-of-tree implementations such react-native-macos.
 * The following issue is tracked by
 * https://github.com/react-native-community/discussions-and-proposals/issues/182
 *
 * The work-around involves having a metro.config.js for each out-of-tree
 * platform, i.e. metro.config.js for react-native and
 * metro.config.macos.js for react-native-macos.
 * This react-native.config.js looks for a --use-react-native-macos
 * switch and when present pushes --config=metro.config.macos.js
 * and specifies reactNativePath: 'node_modules/react-native-macos'.
 * The metro.config.js has to blacklist 'node_modules/react-native-macos',
 * and conversely metro.config.macos.js has to blacklist 'node_modules/react-native'.
 */
'use strict';

let supportsCodegenConfig = false;
try {
  const rnCliAndroidVersion = require('@react-native-community/cli-platform-android/package.json')
    .version;
  const [major] = rnCliAndroidVersion.split('.');
  supportsCodegenConfig = major >= 9;
} catch (e) {
  // ignore
}

// this is a quick workaround for enabling custom codegen config in the fabric example app
// the require above picks up the version of the cli-platform-android package from the root node_modules
// instead of the one from the example app and doesn't correctly set the flag
// this, along with the patch to the rncli allows to run the fabric example properly
const codegenSwitch = '--enable-rnpicker-codegen';
if (process.argv.includes(codegenSwitch)) {
  process.argv = process.argv.filter((arg) => arg !== codegenSwitch);
  supportsCodegenConfig = true;
}

module.exports = {
  project: {
    android: {
      sourceDir: './example/android',
    },
    windows: {
      sourceDir: './example/windows',
      solutionFile: 'PickerExample.sln',
      project: {
        projectFile: 'PickerExample/PickerExample.vcxproj',
      },
    },
  },
  dependency: {
    platforms: {
      android: supportsCodegenConfig
        ? {
            componentDescriptors: [
              'RNCAndroidDialogPickerComponentDescriptor',
              'RNCAndroidDropdownPickerComponentDescriptor',
            ],
            cmakeListsPath: '../android/src/main/jni/CMakeLists.txt',
          }
        : {},
    },
  },
};

const macSwitch = '--use-react-native-macos';

if (process.argv.includes(macSwitch)) {
  process.argv = process.argv.filter((arg) => arg !== macSwitch);
  process.argv.push('--config=metro.config.macos.js');
  module.exports = {
    reactNativePath: 'node_modules/react-native-macos',
  };
}
