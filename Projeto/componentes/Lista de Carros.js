import AsyncStorage from '@react-native-async-storage/async-storage';

const Carros_chave = '@ListaCarros';

export async function getC() {
  try {
    const jsonValue = await AsyncStorage.getItem(Carros_chave);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Falha ao Encontrar', e);
    return [];
  }
}

async function salvarcarros(carros) {
  try {
    const jsonValue = JSON.stringify(carros);
    await AsyncStorage.setItem(Carros_chave, jsonValue);
  } catch (e) {
    console.error('Falha ao Salvar', e);
  }
}

export async function addC(carro) {
  const carros = await getC();
  carros.push(carro);
  await salvarcarros(carros);
}

export async function delC(id) {
  let carros = await getC();
  carros = carros.filter(v => v.id !== id);
  await salvarcarros(carros);
}
