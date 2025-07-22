import React, {useEffect, useState} from 'react';
import {useCanvas, useScene} from 'reactylon';
import {FreeCamera, HemisphericLight, Matrix, Vector3} from '@babylonjs/core';
import {ImportMeshAsync} from '@babylonjs/core/Loading/sceneLoader';
import {Tools} from '@babylonjs/core/Misc/tools';
import '@babylonjs/loaders/glTF';

// @ts-expect-error
import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';
import {Dimensions} from 'react-native';

type ContentProps = {
  onUpdateButtons: (screenPoints: {id: number; x: number; y: number}[]) => void;
  selectedModel: number;
};

const Content: React.FC<ContentProps> = ({onUpdateButtons, selectedModel}) => {
  const [pointArray, setPointArray] = useState<
    {id: number; position: Vector3}[]
  >([]);
  const pointArrayRef = React.useRef(pointArray);

  const scene = useScene();
  const canvas = useCanvas();
  const modelPaths = [
    resolveAssetSource(require('../../../assets/models/rearcross.glb')).uri,
    resolveAssetSource(require('../../../assets/models/mainframe.glb')).uri,
  ];
  const camera = new FreeCamera('camera', new Vector3(0, 0, 0), scene);

  useEffect(() => {
    if (!scene) return;

    const modelPath = modelPaths[selectedModel];

    const loadModel = async () => {
      try {
        console.log('Loading model...');
        const result = await ImportMeshAsync(modelPath, scene, {
          meshNames: null,
        });
        if (result.meshes.length > 0) console.log('Model loaded');

        const mesh = result.meshes[0];
        mesh.rotationQuaternion = null;
        mesh.rotation.y = Tools.ToRadians(-90);

        camera.attachControl(canvas, true);
        camera.setTarget(mesh.position);

        const light = new HemisphericLight(
          'light',
          new Vector3(0, 1, 0),
          scene,
        );
        light.intensity = 0.7;

        scene.onBeforeRenderObservable.add(() => {
          const screen = Dimensions.get('window');
          const updatedPositions = pointArrayRef.current.map((point, idx) => {
            const projected = Vector3.Project(
              point.position,
              Matrix.Identity(),
              scene.getTransformMatrix(),
              camera.viewport.toGlobal(screen.width, screen.height),
            );
            return {id: idx, x: projected.x, y: projected.y};
          });

          onUpdateButtons(updatedPositions);
        });

        scene.onPointerDown = (evt, pickResult) => {
          if (pickResult.hit && pickResult.pickedPoint) {
            // Log the position for reference
            console.log(pickResult.pickedPoint.clone());
          }
        };
      } catch (err) {
        console.error('Failed to load model', err);
        Tools.Error(`Failed to load model: ${err}`);
      }
    };

    // Clean scene on unmount
    const unloadModel = () => {
      scene.meshes.forEach(m => {
        if (m.name && m.name !== '__root__') m.dispose();
      });
      scene.onBeforeRenderObservable.clear();
      scene.lights.forEach(l => l.dispose());
    };

    loadModel();

    return () => unloadModel();
  }, [scene, selectedModel]);

  useEffect(() => {
    if (selectedModel === 0) {
      setPointArray([
        {
          id: 0,
          position: new Vector3(-1.0, 1.8, 0.3811612991788832),
        },
        {
          id: 1,
          position: new Vector3(-1.0, 1.8, 1.6327153249493194),
        },
      ]);
    } else if (selectedModel === 1) {
      setPointArray([
        {
          id: 0,
          position: new Vector3(-1.0, 1.8, 0.3811612991788832),
        },
        {
          id: 1,
          position: new Vector3(-1.0, 1.8, 1.6327153249493194),
        },
      ]);
    } else {
      setPointArray([]);
    }
  }, [selectedModel]);

  useEffect(() => {
    pointArrayRef.current = pointArray;
  }, [pointArray]);

  return <></>;
};

export default Content;
