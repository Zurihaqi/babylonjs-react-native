import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  Modal,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {NativeEngine} from 'reactylon/mobile';
import {Scene} from 'reactylon';
import {type ArcRotateCamera, type Camera} from '@babylonjs/core';
import Content from './Components/Content';

const SceneScreen = () => {
  const [camera, setCamera] = useState<Camera | undefined>();
  const [modalVisible, setModalVisible] = useState(false);
  const [buttonPositions, setButtonPositions] = useState<
    {id: number; x: number; y: number}[]
  >([]);
  const [selectedModel, setSelectedModel] = useState(0);
  const [selectedPoint, setSelectedPoint] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const toggleModel = () => {
    setSelectedModel(prev => (prev === 0 ? 1 : 0));
  };

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
              arcCamera.radius = 10;

              setCamera(arcCamera);
            }}>
            <Content
              onUpdateButtons={setButtonPositions}
              selectedModel={selectedModel}
              setIsLoading={setIsLoading}
            />
          </Scene>
        </NativeEngine>
        <TouchableOpacity
          disabled={isLoading}
          onPress={toggleModel}
          style={{
            position: 'absolute',
            top: 40,
            right: 16,
            backgroundColor: 'rgba(0,0,0,0.3)',
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 8,
            zIndex: 20,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
            <Text style={{color: 'white', fontSize: 16}}>Switch Model</Text>
            {isLoading && <ActivityIndicator size="small" color="white" />}
          </View>
        </TouchableOpacity>
        {buttonPositions.map(pos => (
          <View
            key={pos.id}
            style={{
              position: 'absolute',
              top: pos.y - 20,
              left: pos.x - 40,
              zIndex: 10,
            }}>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(true);
                setSelectedPoint(pos.id);
              }}
              style={{
                backgroundColor: 'rgba(0,0,0,0.3)',
                paddingVertical: 6,
                paddingHorizontal: 12,
                borderRadius: 6,
              }}>
              <Text style={{color: 'yellow'}}>{`Point ${pos.id}`}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>Point {selectedPoint}</Text>
            <TextInput style={styles.input} placeholder="" />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Simpan</Text>
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
    // marginBottom: 16,
    color: 'black',
  },
  closeButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    color: 'black',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default SceneScreen;
