import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import InicioScreen from './InicioScreen';  
import FormScreen from './FormScreen';
import TarefasScreen from './TarefasScreen';

const Tab = createMaterialTopTabNavigator();

export default function Homeinicial() {
  return (
    <Tab.Navigator
      initialRouteName="Início"
      screenOptions={({ route }) => ({
        tabBarStyle: { backgroundColor: '#1c1c1e' },
        tabBarLabelStyle: { fontWeight: '600', fontSize: 14 },
        tabBarActiveTintColor: '#ffd60a',
        tabBarInactiveTintColor: '#fff',
        tabBarIndicatorStyle: {
          backgroundColor: '#ffd60a',
          height: 3,
          borderRadius: 2,
        },
        tabBarShowIcon: true,
        tabBarIcon: ({ color }) => {
          let iconName;
          if (route.name === 'Início') iconName = 'home';
          else if (route.name === 'Formulário') iconName = 'file-document-edit';
          else if (route.name === 'Minhas Tarefas') iconName = 'clipboard-list';
          return <Icon name={iconName} size={20} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Início" component={InicioScreen} />
      <Tab.Screen name="Formulário" component={FormScreen} />
      <Tab.Screen name="Minhas Tarefas" component={TarefasScreen} />
    </Tab.Navigator>
  );
}
