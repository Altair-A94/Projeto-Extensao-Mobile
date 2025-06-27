import React, { useState } from 'react';
import { View,Text,TextInput,TouchableOpacity,StyleSheet,SafeAreaView,Image,Dimensions, } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { salvarLoginUsuario, getUsuarios } from '../componentes/Armazenamento';

const windowWidth = Dimensions.get('window').width;

export default function HomeScreen({ onLoginSuccess }) {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');

  const autenticar = async () => {
      if (login === 'admin' && senha === '123') {
        setErro('');
        await salvarLoginUsuario({ username: login, role: 'gerente' });    
        onLoginSuccess('gerente', login);
      } else if (login && senha) {
        try {
          const usuarios = await getUsuarios();
          const usuarioEncontrado = usuarios.find(u => u.username === login && u.password === senha);
          if (!usuarioEncontrado) {
            setErro('Usuário não registrado.');
            return;
          }
          setErro('');
          await salvarLoginUsuario({ username: login, role: usuarioEncontrado.role || 'cliente' });
          onLoginSuccess(usuarioEncontrado.role || 'cliente', login);
        } catch (e) {
          setErro('Erro ao verificar usuário.');
          console.error('Erro ao verificar usuário', e);
        }
      } else {
        setErro('Login ou senha inválidos');
      }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../assets/logo2.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.loginBox}>
        <Text style={styles.label}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu login"
          value={login}
          onChangeText={setLogin}
          autoCapitalize="none"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Senha</Text>
        <View style={styles.senhaContainer}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Digite sua senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry={!mostrarSenha}
            placeholderTextColor="#999"
          />
          <TouchableOpacity
            onPress={() => setMostrarSenha(!mostrarSenha)}
            style={styles.iconBtn}
          >
            <Icon
              name={mostrarSenha ? 'eye-off' : 'eye'}
              size={24}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        {erro ? <Text style={styles.mensagemErro}>{erro}</Text> : null}

        <TouchableOpacity style={styles.botao} onPress={autenticar}>
          <Text style={styles.textoBotao}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    width: windowWidth * 0.7,
    aspectRatio: 1.5,
    marginBottom: 8,
  },
  loginBox: {
    width: windowWidth * 0.85,
    maxWidth: 400,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 10,
  },
  label: {
    color: '#333',
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    color: '#000',
  },
  senhaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    paddingHorizontal: 8,
  },
  botao: {
    backgroundColor: '#ffd60a',
    padding: 14,
    borderRadius: 8,
    marginTop: 24,
    alignItems: 'center',
  },
  textoBotao: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  mensagemErro: {
    color: 'red',
    marginTop: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});
