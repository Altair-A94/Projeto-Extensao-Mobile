import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

export default function HomeScreen() {
  const [carros, setCarros] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [nome, setNome] = useState('');
  const [ano, setAno] = useState('');
  const [oleo, setOleo] = useState('');
  const [carroEditando, setCarroEditando] = useState(null);
  const [busca, setBusca] = useState('');

  const abrirModalCriar = () => {
    setNome('');
    setAno('');
    setOleo('');
    setModoEdicao(false);
    setModalVisible(true);
  };

  const abrirModalEditar = () => {
    if (!carroEditando) return;
    setNome(carroEditando.nome);
    setAno(carroEditando.ano);
    setOleo(carroEditando.oleo || '');
    setModoEdicao(true);
    setModalVisible(true);
  };

  const salvarCarro = () => {
    if (!nome || !ano || !oleo) return;
    if (modoEdicao && carroEditando) {
      const atualizados = carros.map(c =>
        c.id === carroEditando.id ? { ...c, nome, ano, oleo } : c
      );
      setCarros(atualizados);
    } else {
      const novo = {
        id: Date.now().toString(),
        nome,
        ano,
        oleo,
      };
      setCarros([...carros, novo]);
    }
    setModalVisible(false);
    setCarroEditando(null);
  };

  const excluirCarro = (id) => {
    setCarros(carros.filter(c => c.id !== id));
  };

  const selecionarCarro = (carro) => {
    setCarroEditando(carro);
  };

  const carrosFiltrados = carros.filter(c =>
    c.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => selecionarCarro(item)}>
      <View style={styles.tarefaCard}>
        <View style={styles.tarefaInfo}>
          <Text style={styles.tituloTarefa}>{item.nome}</Text>
          <Text style={styles.dataTarefa}>Ano: {item.ano}</Text>
          <Text style={styles.dataTarefa}>Óleo: {item.oleo}</Text>
        </View>
        <TouchableOpacity style={styles.btnExcluir} onPress={() => excluirCarro(item.id)}>
          <Text style={styles.txtExcluir}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Galeria de Carros</Text>

      <TextInput
        style={styles.input}
        placeholder="Buscar carro..."
        value={busca}
        onChangeText={setBusca}
        placeholderTextColor="#888"
      />

      <FlatList
        data={carrosFiltrados}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
      />

      <View style={styles.footer}>
        <TouchableOpacity style={styles.btnAmarelo} onPress={abrirModalCriar}>
          <Text style={styles.txtBtn}>Criar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnAmarelo} onPress={abrirModalEditar}>
          <Text style={styles.txtBtn}>Editar</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>{modoEdicao ? 'Editar Carro' : 'Novo Carro'}</Text>
          <TextInput
            placeholder="Nome do carro"
            value={nome}
            onChangeText={setNome}
            style={styles.input}
            placeholderTextColor="#888"
          />
          <TextInput
            placeholder="Ano do carro"
            value={ano}
            onChangeText={setAno}
            style={styles.input}
            placeholderTextColor="#888"
          />
          <TextInput
            placeholder="Tipo de óleo"
            value={oleo}
            onChangeText={setOleo}
            style={styles.input}
            placeholderTextColor="#888"
          />
          <TouchableOpacity style={styles.btnAmarelo} onPress={salvarCarro}>
            <Text style={styles.txtBtn}>Salvar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1e',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
  tarefaCard: {
    flexDirection: 'row',
    backgroundColor: '#e5e5e5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tarefaInfo: {
    flex: 1,
  },
  tituloTarefa: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  dataTarefa: {
    fontSize: 14,
    color: '#555',
  },
  btnExcluir: {
    backgroundColor: '#ff3b30',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  txtExcluir: {
    color: '#fff',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: '#1c1c1e',
  },
  btnAmarelo: {
    backgroundColor: '#ffd60a',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  txtBtn: {
    fontWeight: '700',
    color: '#000',
    fontSize: 16,
  },
  modalView: {
    margin: 20,
    backgroundColor: '#2c2c2e',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    top: '25%',
  },
  modalTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
});