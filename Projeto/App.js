import React, { createContext, useEffect, useState } from 'react';
import { Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import HomeScreen from './Screens/HomeScreen';
import FormScreen from './Screens/FormScreen';
import TarefasScreen from './Screens/TarefasScreen';
import { getTarefas } from './componentes/Armazenamento';  

export const TarefasContext = createContext();

const Tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();

function Tabs({ navigation }) {
  return (
    <Tab.Navigator
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
          else if (route.name === 'Minhas Tarefas') iconName = 'clipboard-list';
          return <Icon name={iconName} size={20} color={color} />;
        },
        headerRight: () =>
          route.name === 'Início' ? (
            <Button onPress={() => navigation.navigate('Form', { modoEdicao: false })}
              title="Criar"
              color="#ffd60a"
            />
          ) : null
      })}
    >
      <Tab.Screen name="Início" component={HomeScreen} />
      <Tab.Screen name="Minhas Tarefas" component={TarefasScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [tarefas, setTarefas] = useState([]);

  
  useEffect(() => {
    const carregarTarefas = async () => {
      const armazenadas = await getTarefas();
      setTarefas(armazenadas);
    };
    carregarTarefas();
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
        <Stack.Navigator>
          <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
          <Stack.Screen name="Form" component={FormScreen} options={{ title: 'Formulário' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </TarefasContext.Provider>
  );
}
