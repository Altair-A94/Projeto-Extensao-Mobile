import AsyncStorage from '@react-native-async-storage/async-storage';

const Tarefas_chave = '@ListaTarefas';

export async function getTarefas() {
  try {
    const jsonValue = await AsyncStorage.getItem(Tarefas_chave);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Falha ao Encontrar', e);
    return [];
  }
}

async function salvarTarefas(tarefas) {
  try {
    const jsonValue = JSON.stringify(tarefas);
    await AsyncStorage.setItem(Tarefas_chave, jsonValue);
  } catch (e) {
    console.error('Falha ao Salvar', e);
  }
}

export async function addTarefa(tarefa) {
  const tarefas = await getTarefas();
  tarefas.push(tarefa);
  await salvarTarefas(tarefas);
}

export async function delTarefa(id) {
  let tarefas = await getTarefas();
  tarefas = tarefas.filter(v => v.id !== id);
  await salvarTarefas(tarefas);
}

// New functions for login data storage

const Login_chave = '@LoginUsuario';

export async function salvarLoginUsuario(usuario) {
  try {
    // Ensure the user object uses "role" property instead of "tipo"
    if (usuario.tipo) {
      usuario.role = usuario.tipo;
      delete usuario.tipo;
    }
    const jsonValue = JSON.stringify(usuario);
    await AsyncStorage.setItem(Login_chave, jsonValue);
  } catch (e) {
    console.error('Falha ao salvar login do usuário', e);
  }
}

export async function getLoginUsuario() {
  try {
    const jsonValue = await AsyncStorage.getItem(Login_chave);
    const usuario = jsonValue != null ? JSON.parse(jsonValue) : null;
    if (usuario && usuario.tipo) {
      usuario.role = usuario.tipo;
      delete usuario.tipo;
    }
    return usuario;
  } catch (e) {
    console.error('Falha ao obter login do usuário', e);
    return null;
  }
}

export async function delLoginUsuario() {
  try {
    await AsyncStorage.removeItem(Login_chave);
  } catch (e) {
    console.error('Falha ao limpar login do usuário', e);
  }
}

// New functions for users list storage

const Usuarios_chave = '@ListaUsuarios';

export async function getUsuarios() {
  try {
    const jsonValue = await AsyncStorage.getItem(Usuarios_chave);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Falha ao obter usuários', e);
    return [];
  }
}

export async function salvarUsuarios(usuarios) {
  try {
    const jsonValue = JSON.stringify(usuarios);
    await AsyncStorage.setItem(Usuarios_chave, jsonValue);
  } catch (e) {
    console.error('Falha ao salvar usuários', e);
  }
}

export async function addUsuario(usuario) {
  const usuarios = await getUsuarios();
  usuarios.push(usuario);
  await salvarUsuarios(usuarios);
}

export async function delUsuario(id) {
  let usuarios = await getUsuarios();
  usuarios = usuarios.filter(u => u.id !== id);
  await salvarUsuarios(usuarios);
}
