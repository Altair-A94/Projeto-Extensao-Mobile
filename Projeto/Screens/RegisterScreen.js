import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { getUsuarios, salvarUsuarios, getLoginUsuario } from '../componentes/Armazenamento';

export default function RegisterScreen({ navigation, route }) {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('cliente'); // default role
  const [password, setPassword] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Hardcoded list of managers for validation
  const gerentes = ['admin'];

  useEffect(() => {
    if (route.params && route.params.userToEdit) {
      const { userToEdit } = route.params;
      setUsername(userToEdit.username);
      setRole(userToEdit.role);
      setPassword(userToEdit.password);
    }
  }, [route.params]);

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      const user = await getLoginUsuario();
      setLoggedInUser(user);
    };
    fetchLoggedInUser();
  }, []);

  const handleRegister = async () => {
    if (!username || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    if (role === 'gerente') {
      if (!loggedInUser || loggedInUser.username !== 'admin') {
        Alert.alert('Erro', 'Apenas o usuário admin pode registrar usuários do tipo gerente.');
        return;
      }
    }

    try {
      const users = await getUsuarios();

      // Check if editing existing user
      const existingIndex = users.findIndex(u => u.username === username);

      if (existingIndex >= 0) {
        // Update existing user
        users[existingIndex] = { id: users[existingIndex].id, username, role, password };
      } else {
        // Add new user
        const newUser = { id: Date.now().toString(), username, role, password };
        users.push(newUser);
      }

      await salvarUsuarios(users);

      Alert.alert('Sucesso', `Usuário ${username} registrado como ${role}.`);
      setUsername('');
      setPassword('');
      setRole('cliente');
      navigation.navigate('Lista de Registrados');
    } catch (e) {
      Alert.alert('Erro', 'Falha ao salvar usuário.');
      console.error('Failed to save user', e);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registrar Usuário</Text>

      <Text style={styles.label}>Nome de Usuário</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o nome de usuário"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <Text style={styles.label}>Senha</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite a senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Text style={styles.label}>Tipo de Usuário</Text>
      <View style={styles.roleContainer}>
          <TouchableOpacity
            style={[styles.roleButton, role === 'cliente' && styles.roleButtonSelected]}
            onPress={() => setRole('cliente')}
          >
            <Text style={[styles.roleText, role === 'cliente' && styles.roleTextSelected]}>Cliente</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleButton, role === 'gerente' && styles.roleButtonSelected]}
            onPress={() => setRole('gerente')}
          >
            <Text style={[styles.roleText, role === 'gerente' && styles.roleTextSelected]}>Gerente</Text>
          </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Registrar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#2c2c2e',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    color: '#ffd60a',
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#000',
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  roleButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#444',
  },
  roleButtonSelected: {
    backgroundColor: '#ffd60a',
  },
  roleText: {
    color: '#fff',
    fontWeight: '600',
  },
  roleTextSelected: {
    color: '#000',
  },
  registerButton: {
    backgroundColor: '#ffd60a',
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 24,
  },
  registerButtonText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center',
  },
});
