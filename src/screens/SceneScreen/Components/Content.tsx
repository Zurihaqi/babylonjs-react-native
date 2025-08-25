import React, {useEffect, useState} from 'react';
import {useCanvas, useScene} from 'reactylon';
import {
  AbstractMesh,
  FreeCamera,
  HemisphericLight,
  Matrix,
  Nullable,
  Observer,
  Scene,
  Vector3,
} from '@babylonjs/core';
import {ImportMeshAsync} from '@babylonjs/core/Loading/sceneLoader';
import {Tools} from '@babylonjs/core/Misc/tools';
import '@babylonjs/loaders/glTF';

import RNFS from 'react-native-fs';
import {Platform} from 'react-native';
import {Dimensions} from 'react-native';

type ContentProps = {
  onUpdateButtons: (screenPoints: {id: number; x: number; y: number}[]) => void;
  selectedModel: number;
  setIsLoading: (isLoading: boolean) => void;
};

const Content: React.FC<ContentProps> = ({
  onUpdateButtons,
  selectedModel,
  setIsLoading,
}) => {
  const [pointArray, setPointArray] = useState<
    {id: number; position: Vector3}[]
  >([]);
  const pointArrayRef = React.useRef(pointArray);

  const scene = useScene();
  const canvas = useCanvas();

  const cameraRef = React.useRef<FreeCamera | null>(null);

  if (!cameraRef.current) {
    cameraRef.current = new FreeCamera('camera', new Vector3(0, 0, 0), scene);
  }

  let importedMeshes: AbstractMesh[] = [];
  let light: HemisphericLight | null = null;
  let renderObserver: Nullable<Observer<Scene>> = null;

  const copyModelToFS = async (modelName: string) => {
    const localPath = RNFS.DocumentDirectoryPath + '/' + modelName;

    // If file doesn’t exist, copy it from APK/assets or Metro bundle
    const exists = await RNFS.exists(localPath);
    if (!exists) {
      if (Platform.OS === 'android') {
        // Copy from android assets
        await RNFS.copyFileAssets(`models/${modelName}`, localPath);
      } else {
        // For iOS, copy from bundle if needed
        await RNFS.copyFile(`${RNFS.MainBundlePath}/${modelName}`, localPath);
      }
    }

    return 'file://' + localPath;
  };

  const loadModel = async () => {
    try {
      setIsLoading(true);

      const modelName = selectedModel === 0 ? 'rearcross.glb' : 'mainframe.glb';
      const modelUri = await copyModelToFS(modelName);

      const result = await ImportMeshAsync(modelUri, scene, {
        meshNames: null,
      });
      importedMeshes = result.meshes;

      const mesh = result.meshes[0];
      mesh.rotationQuaternion = null;
      mesh.rotation.y = Tools.ToRadians(-90);

      const camera = cameraRef.current!;
      camera.attachControl(canvas, true);
      camera.setTarget(mesh.position);

      light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);
      light.intensity = 0.7;

      renderObserver = scene.onBeforeRenderObservable.add(() => {
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
          // Logs the position for reference
          console.log(pickResult.pickedPoint.clone());
        }
      };
    } catch (err) {
      console.error('Failed to load model', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // if (!scene) return;
    const unloadModel = () => {
      importedMeshes.forEach(m => {
        if (m && m.name !== '__root__') m.dispose();
      });

      if (light) {
        light.dispose();
        light = null;
      }

      if (renderObserver) {
        scene.onBeforeRenderObservable.remove(renderObserver);
        renderObserver = null;
      }

      if (cameraRef.current) {
        cameraRef.current.detachControl();
      }
    };

    loadModel();

    // Clean scene on unmount
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
          position: new Vector3(
            -0.6670454398345176,
            2.0327539669135909,
            1.8888699511353988,
          ),
        },
        {
          id: 1,
          position: new Vector3(
            -2.0900514875800136,
            2.5832272078635468,
            2.501547576943127,
          ),
        },
        {
          id: 2,
          position: new Vector3(
            -1.7071223461246063,
            1.9590993149352483,
            7.1651665411827485,
          ),
        },
        {
          id: 3,
          position: new Vector3(
            -0.37023726190185635,
            3.1849124431610094,
            5.607042116886386,
          ),
        },
        {
          id: 4,
          position: new Vector3(
            -0.37023726190185635,
            2.1849124431610094,
            5.607042116886386,
          ),
        },
      ]);
    } else {
      setPointArray([]);
    }

    return () => {
      setPointArray([]);
    };
  }, [selectedModel]);

  useEffect(() => {
    pointArrayRef.current = pointArray;

    return () => {
      pointArrayRef.current = [];
    };
  }, [pointArray]);

  return <></>;
};

export default Content;
