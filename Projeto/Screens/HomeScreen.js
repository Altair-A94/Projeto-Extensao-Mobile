
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
  const [tarefas, setTarefas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [data, setData] = useState('');
  const [tarefaEditando, setTarefaEditando] = useState(null);

  const abrirModalCriar = () => {
    setTitulo('');
    setData('');
    setModoEdicao(false);
    setModalVisible(true);
  };

  const abrirModalEditar = () => {
    if (!tarefaEditando) return;
    setTitulo(tarefaEditando.titulo);
    setData(tarefaEditando.data);
    setModoEdicao(true);
    setModalVisible(true);
  };

  const salvarTarefa = () => {
    if (!titulo || !data) return;
    if (modoEdicao && tarefaEditando) {
      const atualizadas = tarefas.map(t =>
        t.id === tarefaEditando.id ? { ...t, titulo, data } : t
      );
      setTarefas(atualizadas);
    } else {
      const nova = {
        id: Date.now().toString(),
        titulo,
        data,
      };
      setTarefas([...tarefas, nova]);
    }
    setModalVisible(false);
    setTarefaEditando(null);
  };

  const excluirTarefa = (id) => {
    setTarefas(tarefas.filter(t => t.id !== id));
  };

  const selecionarTarefa = (tarefa) => {
    setTarefaEditando(tarefa);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => selecionarTarefa(item)}>
      <View style={styles.tarefaCard}>
        <View style={styles.tarefaInfo}>
          <Text style={styles.tituloTarefa}>{item.titulo}</Text>
          <Text style={styles.dataTarefa}>{item.data}</Text>
        </View>
        <TouchableOpacity style={styles.btnExcluir} onPress={() => excluirTarefa(item.id)}>
          <Text style={styles.txtExcluir}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Minhas Tarefas</Text>

      <FlatList
        data={tarefas}
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
          <Text style={styles.modalTitle}>{modoEdicao ? 'Editar Tarefa' : 'Nova Tarefa'}</Text>
          <TextInput
            placeholder="Título da tarefa"
            value={titulo}
            onChangeText={setTitulo}
            style={styles.input}
            placeholderTextColor="#888"
          />
          <TextInput
            placeholder="Data da tarefa"
            value={data}
            onChangeText={setData}
            style={styles.input}
            placeholderTextColor="#888"
          />
          <TouchableOpacity style={styles.btnAmarelo} onPress={salvarTarefa}>
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
