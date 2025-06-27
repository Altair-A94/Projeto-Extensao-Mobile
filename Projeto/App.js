import React, { createContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Image } from 'react-native';

import HomeScreen from './Screens/HomeScreen';       
import InicioScreen from './Screens/InicioScreen';   
import TarefasScreen from './Screens/TarefasScreen'; 
import TarefasVisualizacaoScreen from './Screens/TarefasVisualizacaoScreen';
import FormScreen from './Screens/FormScreen';       
import RegisterScreen from './Screens/RegisterScreen';
import { getTarefas } from './componentes/Armazenamento';

const personIcon = require('./assets/person.png');

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
            else if (route.name === 'Visualizar Tarefas') iconName = 'eye';
            else if (route.name === 'Registrar') iconName = 'account-plus';

            return <Icon name={iconName} size={size || 20} color={color} />;
          },
          tabBarLabelStyle: {
            fontWeight: '600',
            fontSize: 14,
          },
        })}
      >
        <Tab.Screen name="Início">
          {(props) => {
            if (userRole === 'cliente') {
              const InicioClienteScreen = require('./Screens/InicioClienteScreen').default;
              return <InicioClienteScreen {...props} onLogout={async () => {
                setIsLoggedIn(false);
                setUserRole(null);
                const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage');
                await AsyncStorage.removeItem('@LoginUsuario');
                props.navigation.reset({
                  index: 0,
                  routes: [{ name: 'Login' }],
                });
                props.navigation.navigate('Login');
              }} />;
            } else {
              return <InicioScreen {...props} userRole={userRole} onLogout={async () => {
                setIsLoggedIn(false);
                setUserRole(null);
                const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage');
                await AsyncStorage.removeItem('@LoginUsuario');
                props.navigation.reset({
                  index: 0,
                  routes: [{ name: 'Login' }],
                });
                props.navigation.navigate('Login');
              }} />;
            }
          }}
        </Tab.Screen>
        {userRole === 'cliente' ? (
          <>
            <Tab.Screen name="Visualizar Tarefas" component={TarefasVisualizacaoScreen} />
          </>
        ) : (
          <>
            <Tab.Screen name="Formulário" component={FormScreen} />
            <Tab.Screen name="Minhas Tarefas" component={TarefasScreen} />
            {userRole === 'gerente' && (
              <>
                <Tab.Screen name="Registrar" component={RegisterScreen} />
                <Tab.Screen name="Lista de Registrados" component={require('./Screens/ListaRegistradosScreen').default} />
              </>
            )}
          </>
        )}
      </Tab.Navigator>
  );
}

export default function App() {
  const [tarefas, setTarefas] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // Hardcoded list of managers (gerentes)
  const gerentes = ['admin'];

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

  const handleLoginSuccess = (role, username) => {
    setIsLoggedIn(true);
    setUserRole(role);
  };

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
            else if (route.name === 'Visualizar Tarefas') iconName = 'eye';
            else if (route.name === 'Registrar') iconName = 'account-plus';

            return <Icon name={iconName} size={size || 20} color={color} />;
          },
          tabBarLabelStyle: {
            fontWeight: '600',
            fontSize: 14,
          },
        })}
      >
        <Tab.Screen name="Início">
          {(props) => <InicioScreen {...props} onLogout={async () => {
            setIsLoggedIn(false);
            setUserRole(null);
            const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage');
            await AsyncStorage.removeItem('@LoginUsuario');
            props.navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
            props.navigation.navigate('Login');
          }} />}
        </Tab.Screen>
        {userRole === 'cliente' ? (
          <>
            <Tab.Screen name="Visualizar Tarefas" component={TarefasVisualizacaoScreen} />
          </>
        ) : (
          <>
            <Tab.Screen name="Formulário" component={FormScreen} />
            <Tab.Screen name="Minhas Tarefas" component={TarefasScreen} />
        {userRole === 'gerente' && (
              <>
                <Tab.Screen name="Registrar" component={RegisterScreen} />
                <Tab.Screen name="Lista de Registrados" component={require('./Screens/ListaRegistradosScreen').default} />
              </>
            )}
          </>
        )}
      </Tab.Navigator>
  );
}

  return (
    <TarefasContext.Provider value={{ tarefas, salvarTarefa }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!isLoggedIn ? (
            <Stack.Screen name="Login">
              {(props) => (
                <HomeScreen
                  {...props}
                  onLoginSuccess={(role, username) => handleLoginSuccess(role, username)}
                />
              )}
            </Stack.Screen>
          ) : (
            <Stack.Screen name="HomeTabs">
              {(props) => {
                if (userRole === 'cliente') {
                  const InicioClienteScreen = require('./Screens/InicioClienteScreen').default;
                  return <InicioClienteScreen {...props} onLogout={async () => {
                    setIsLoggedIn(false);
                    setUserRole(null);
                    const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage');
                    await AsyncStorage.removeItem('@LoginUsuario');
                    props.navigation.reset({
                      index: 0,
                      routes: [{ name: 'Login' }],
                    });
                    props.navigation.navigate('Login');
                  }} />;
                } else {
                  return <HomeTabs {...props} />;
                }
              }}
            </Stack.Screen>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </TarefasContext.Provider>
  );
}
