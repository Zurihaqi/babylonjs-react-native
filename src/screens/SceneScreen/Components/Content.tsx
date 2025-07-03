import React, {useEffect} from 'react';
import {ImportMeshAsync} from '@babylonjs/core/Loading/sceneLoader';
import {Tools} from '@babylonjs/core/Misc/tools';
import {useScene} from 'reactylon';
import '@babylonjs/loaders/glTF';
import {AdvancedDynamicTexture, Ellipse, Control} from '@babylonjs/gui';
import {ArcRotateCamera, MeshBuilder, Vector3} from '@babylonjs/core';

// @ts-expect-error
import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';

type ContentProps = {
  onClick: () => void;
};

const Content: React.FC<ContentProps> = ({onClick}) => {
  const scene = useScene();

  const modelPath = resolveAssetSource(
    require('../../../assets/models/rearcross.glb'),
  ).uri;

  useEffect(() => {
    if (!scene) return;

    const createButton = async (
      meshName: string,
      position: Vector3,
      onClick: () => void,
    ) => {
      const plane = MeshBuilder.CreatePlane(
        meshName,
        {width: 1.5, height: 0.6},
        scene,
      );
      plane.position = position;
      plane.rotation = new Vector3(0, Math.PI, 0);

      const texture = AdvancedDynamicTexture.CreateForMesh(plane);
      const button = new Ellipse();

      button.width = '25%';
      button.height = '50%';
      button.background = 'red';
      button.color = 'white';
      button.thickness = 4;
      button.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
      button.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;

      button.onPointerUpObservable.add(onClick);
      texture.addControl(button);
    };

    const loadModel = async () => {
      try {
        console.log('Loading model...');
        const result = await ImportMeshAsync(modelPath, scene, {
          meshNames: null,
        });

        const meshes = result.meshes.filter(m => m.name !== '__root__');
        if (meshes.length === 0) return;

        // Compute bounding box center
        const boundingInfo = meshes[0].getBoundingInfo().boundingBox;
        let min = boundingInfo.minimumWorld;
        let max = boundingInfo.maximumWorld;

        for (let i = 1; i < meshes.length; i++) {
          const meshBI = meshes[i].getBoundingInfo().boundingBox;
          min = Vector3.Minimize(min, meshBI.minimumWorld);
          max = Vector3.Maximize(max, meshBI.maximumWorld);
        }

        const center = max.add(min).scale(0.5);
        const offset = center.scale(1);
        for (const mesh of meshes) {
          mesh.position.addInPlace(offset);
        }

        // Adjust camera
        const arcCamera = scene.activeCamera as ArcRotateCamera;
        if (arcCamera) {
          arcCamera.target = Vector3.Zero();
          const sizeVec = max.subtract(min);
          const maxDimension = Math.max(sizeVec.x, sizeVec.y, sizeVec.z);
          arcCamera.radius = maxDimension * 4;
          arcCamera.alpha = Math.PI / 2;
          arcCamera.beta = Math.PI / 3;
        }

        console.log('Model centered.');

        await createButton('leftButton', new Vector3(-0.5, 2.2, -1), () => {
          console.log('Left Button Clicked!');
          onClick();
        });

        await createButton('rightButton', new Vector3(0.5, 2.2, -1), () => {
          console.log('Right Button Clicked!');
          onClick();
        });
      } catch (error) {
        console.error('Failed to load model:', error);
        Tools.Error(`Failed to load model: ${error}`);
      }
    };

    // Clear previous meshes
    scene.meshes.forEach(mesh => {
      if (mesh.name && mesh.name !== '__root__') {
        mesh.dispose();
      }
    });

    loadModel();
  }, [scene]);

  return <></>;
};

export default Content;
