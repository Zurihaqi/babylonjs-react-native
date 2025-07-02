const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const config = {
  resolver: {
    assetExts: ['glb', 'gltf', 'bin', 'png', 'jpg', 'jpeg', 'gif'],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
