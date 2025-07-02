import React, {useState} from 'react';
import {SafeAreaView, View, StatusBar} from 'react-native';
import {NativeEngine} from 'reactylon/mobile';
import {Scene} from 'reactylon';
import {Tools, type ArcRotateCamera, type Camera} from '@babylonjs/core';
import Content from './Content';

const App = () => {
  const [camera, setCamera] = useState<Camera>();

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <View style={{flex: 1}}>
          {camera && (
            <NativeEngine camera={camera}>
              <Scene
                onSceneReady={scene => {
                  scene.createDefaultCameraOrLight(true, undefined, true);
                  const arcCamera = scene.activeCamera as ArcRotateCamera;

                  arcCamera.panningSensibility = 5000; // Default is 1000, higher = slower

                  arcCamera.pinchPrecision = 3000; // Default is 12, higher = slower

                  arcCamera.wheelPrecision = 100; // Default is 3, higher = slower

                  arcCamera.speed = 0.1; // Default is 2, lower = slower

                  arcCamera.angularSensibilityX = 4000; // Default is 1000
                  arcCamera.angularSensibilityY = 4000; // Default is 1000

                  // Posisi awal camera
                  arcCamera.alpha = Math.PI / 2;
                  arcCamera.beta = Tools.ToRadians(70);
                  setCamera(arcCamera);
                }}>
                <Content />
              </Scene>
            </NativeEngine>
          )}
        </View>
      </SafeAreaView>
    </>
  );
};

export default App;
