import React from 'react';
import { View, Text, TouchableOpacity,StyleSheet,SafeAreaView, ImageBackground,} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();

  const abrirFormularioCriar = () => {
    navigation.navigate('Form', {
      modoEdicao: false,
      tarefaEditando: null,
    });
  };

  return (
  <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require('../assets/logo.png')}
        style={styles.backgroundImage}
        resizeMode="cover">

  <View style={styles.overlay}>
    <View style={{ flex: 1, justifyContent: 'space-between' }}>
    <Text style={styles.header}>WFJ AUTO CENTER</Text>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.btnAmarelo} onPress={abrirFormularioCriar}>
        <Text style={styles.txtBtn}>Criar</Text>
              </TouchableOpacity>
      </View>
    </View>
  </View>
    </ImageBackground>
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  btnAmarelo: {
    backgroundColor: '#ffd60a',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginTop: 6,
  },
  txtBtn: {
    fontWeight: '700',
    color: '#000',
    fontSize: 16,
    textAlign: 'center',
  },
});
