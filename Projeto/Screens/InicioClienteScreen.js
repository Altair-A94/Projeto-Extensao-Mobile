import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ImageBackground } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import TarefasVisualizacaoScreen from './TarefasVisualizacaoScreen';

const Tab = createMaterialTopTabNavigator();

function InicioClienteContent({ onLogout }) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require('../assets/logo.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={{ flex: 1, justifyContent: 'space-between' }}>
            <Text style={styles.header}>WFJ AUTO CENTER</Text>
            <View style={styles.footer}>
              <TouchableOpacity style={[styles.btnAmarelo, { marginLeft: 10 }]} onPress={onLogout}>
                <Text style={styles.txtBtn}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

export default function InicioClienteScreen({ onLogout }) {
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
          else if (route.name === 'Visualizar Tarefas') iconName = 'eye';

          return <Icon name={iconName} size={size || 20} color={color} />;
        },
        tabBarLabelStyle: {
          fontWeight: '600',
          fontSize: 14,
        },
      })}
    >
      <Tab.Screen name="Início">
        {(props) => <InicioClienteContent {...props} onLogout={onLogout} />}
      </Tab.Screen>
      <Tab.Screen name="Visualizar Tarefas" component={TarefasVisualizacaoScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, width: '100%', height: '100%' },
  overlay: { flex: 1, padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginTop: 20 },
  footer: { flexDirection: 'row', justifyContent: 'center', paddingVertical: 20 },
  btnAmarelo: { backgroundColor: '#ffd60a', borderRadius: 10, paddingVertical: 14, paddingHorizontal: 24, marginTop: 6 },
  txtBtn: { fontWeight: '700', color: '#000', fontSize: 16, textAlign: 'center' },
});
