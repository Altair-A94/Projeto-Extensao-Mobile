import React, { createContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import HomeScreen from './Screens/HomeScreen';       
import InicioScreen from './Screens/InicioScreen';   
import TarefasScreen from './Screens/TarefasScreen'; 
import FormScreen from './Screens/FormScreen';       
import { getTarefas } from './componentes/Armazenamento';

export const TarefasContext = createContext();

const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: { backgroundColor: '#1c1c1e' },
        tabBarActiveTintColor: '#ffd60a',
        tabBarInactiveTintColor: '#fff',
        tabBarIndicatorStyle: { backgroundColor: '#ffd60a', height: 3, borderRadius: 2 },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Início') iconName = 'home';
          else if (route.name === 'Formulário') iconName = 'file-document-edit';
          else if (route.name === 'Minhas Tarefas') iconName = 'clipboard-list';

          return <Icon name={iconName} size={size || 20} color={color} />;
        },
        tabBarLabelStyle: {
          fontWeight: '600',
          fontSize: 14,
        },
      })}
    >
      <Tab.Screen name="Início" component={InicioScreen} />
      <Tab.Screen name="Formulário" component={FormScreen} />
      <Tab.Screen name="Minhas Tarefas" component={TarefasScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [tarefas, setTarefas] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    (async () => {
      const armazenadas = await getTarefas();
      setTarefas(armazenadas);
    })();
  }, []);

  const salvarTarefa = async (tarefa) => {
    let novas;
    if (tarefa.deletar) {
      novas = tarefas.filter(t => t.id !== tarefa.id);
    } else {
      novas = tarefas.some(t => t.id === tarefa.id)
        ? tarefas.map(t => (t.id === tarefa.id ? tarefa : t))
        : [...tarefas, tarefa];
    }
    setTarefas(novas);
    const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage');
    await AsyncStorage.setItem('@ListaTarefas', JSON.stringify(novas));
  };

  return (
    <TarefasContext.Provider value={{ tarefas, salvarTarefa }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!isLoggedIn ? (
            <Stack.Screen name="Login">
              {(props) => (
                <HomeScreen
                  {...props}
                  onLoginSuccess={() => setIsLoggedIn(true)}
                />
              )}
            </Stack.Screen>
          ) : (
            <Stack.Screen name="HomeTabs" component={HomeTabs} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </TarefasContext.Provider>
  );
}
