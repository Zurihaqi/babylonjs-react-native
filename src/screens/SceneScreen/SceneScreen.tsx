import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  StatusBar,
  Modal,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {NativeEngine} from 'reactylon/mobile';
import {Scene} from 'reactylon';
import {Tools, type ArcRotateCamera, type Camera} from '@babylonjs/core';
import Content from './Components/Content';

const SceneScreen = () => {
  const [camera, setCamera] = useState<Camera>();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.engineContainer}>
        {/* @ts-expect-error */}
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
              arcCamera.beta = Math.PI / 2;
              setCamera(arcCamera);
            }}>
            <Content onClick={() => setModalVisible(true)} />
          </Scene>
        </NativeEngine>
      </View>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>Button Clicked!</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  engineContainer: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  modalBox: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 16,
    color: 'black',
  },
  closeButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default SceneScreen;
