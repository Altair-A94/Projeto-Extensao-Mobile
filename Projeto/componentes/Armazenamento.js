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
