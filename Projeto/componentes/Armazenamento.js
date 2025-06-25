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
    const jsonValue = JSON.stringify(usuario);
    await AsyncStorage.setItem(Login_chave, jsonValue);
  } catch (e) {
    console.error('Falha ao salvar login do usuário', e);
  }
}

export async function getLoginUsuario() {
  try {
    const jsonValue = await AsyncStorage.getItem(Login_chave);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
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
