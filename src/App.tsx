import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {RootStackParamList} from './types';
import HomeScreen from './screens/HomeScreen/HomeScreen';
import SceneScreen from './screens/SceneScreen/SceneScreen';

// @ts-expect-error
import Icon from 'react-native-vector-icons/FontAwesome';

const Tab = createBottomTabNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({route}) => ({
          headerShown: true,
          tabBarIcon: ({color, size}) => {
            let iconName: string;

            switch (route.name) {
              case 'Home':
                iconName = 'home';
                break;
              case 'Scene':
                iconName = 'cube';
                break;
              default:
                iconName = 'circle';
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: 'gray',
        })}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Scene" component={SceneScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
