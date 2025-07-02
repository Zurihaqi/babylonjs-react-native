import React, {useEffect} from 'react';
import {AppendSceneAsync} from '@babylonjs/core/Loading/sceneLoader';
import '@babylonjs/loaders/glTF';
import {Tools} from '@babylonjs/core/Misc/tools';
import {useScene} from 'reactylon';

// Ignore the warning
import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';

const Content: React.FC = () => {
  const scene = useScene();

  // Cara load model dari local
  const modelPath = resolveAssetSource(
    require('./assets/models/rearcross.glb'),
  ).uri;

  useEffect(() => {
    const loadModel = async () => {
      try {
        console.log('Loading model...');
        await AppendSceneAsync(modelPath, scene);

        console.log('Model loaded successfully!');
      } catch (error) {
        console.error('Failed to load model:', error);
        Tools.Error(`Failed to load model: ${error}`);
      }
    };

    loadModel();
  }, [scene]);

  return null;
};

export default Content;
