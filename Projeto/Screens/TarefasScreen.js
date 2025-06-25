import React, { useContext, useState } from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TarefasContext } from '../App';

export default function TarefasScreen() {
  const { tarefas, salvarTarefa } = useContext(TarefasContext);
  const [tarefaEditando, setTarefaEditando] = useState(null);
  const navigation = useNavigation();

  const abrirFormularioEditar = () => {
    if (!tarefaEditando) return;

    navigation.navigate('Formulário', {
      modoEdicao: true,
      tarefaEditando,
    });
  };

  const excluirTarefa = (id) => {
    Alert.alert(
      'Excluir Serviço',
      'Tem certeza que deseja excluir esse serviço?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            salvarTarefa({ ...tarefas.find(t => t.id === id), deletar: true });
            setTarefaEditando(null);
          },
        },
      ]
    );
  };

  const selecionarTarefa = (tarefa) => {
    setTarefaEditando(tarefa);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => selecionarTarefa(item)}>
      <View style={styles.tarefaCard}>
        <View style={styles.tarefaInfo}>
          <Text style={styles.tituloTarefa}>{item.titulo}</Text>
          <Text style={styles.dataTarefa}>{item.descricao}</Text>
          <Text style={styles.dataTarefa}>{item.data}</Text>
          <Text style={styles.dataTarefa}>Proprietário: {item.dono}</Text>
          <Text style={styles.dataTarefa}>Marca: {item.marca}</Text>
          <Text style={styles.dataTarefa}>Telefone: {item.tel}</Text>
          <Text style={styles.statusTarefa}>Status: {item.status || 'Pendente'}</Text>
          {item.status === 'Pendente' && (
            <TouchableOpacity
              style={styles.btnStatus}
              onPress={() => {
                const tarefaAtualizada = { ...item, status: 'Pronta' };
                salvarTarefa(tarefaAtualizada);
                if (tarefaEditando && tarefaEditando.id === item.id) {
                  setTarefaEditando(tarefaAtualizada);
                }
              }}
            >
              <Text style={styles.txtStatus}>Marcar como Pronta</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={styles.btnExcluir}
          onPress={() => excluirTarefa(item.id)}
        >
          <Text style={styles.txtExcluir}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Minhas Tarefas</Text>

      <FlatList
        data={tarefas}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
        extraData={tarefaEditando}
      />

      <View style={styles.footer}>
        <TouchableOpacity style={styles.addButton} onPress={abrirFormularioEditar} disabled={!tarefaEditando}>
          <Text style={styles.addButtonText}>
            {tarefaEditando ? 'Editar Selecionada' : 'Selecione uma tarefa'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  tarefaCard: {
    flexDirection: 'row',
    backgroundColor: '#e5e5e5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tarefaInfo: { flex: 1 },
  tituloTarefa: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  dataTarefa: { fontSize: 14, color: '#555' },
  statusTarefa: {
    fontSize: 14,
    color: '#007700',
    fontWeight: '600',
    marginTop: 4,
  },
  btnStatus: {
    marginTop: 8,
    backgroundColor: '#4CAF50',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  txtStatus: {
    color: '#fff',
    fontWeight: '600',
  },
  btnExcluir: {
    backgroundColor: '#ff3b30',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  txtExcluir: {
    color: '#fff',
    fontWeight: '600',
  },
  footer: {
    paddingVertical: 20,
  },
  addButton: {
    backgroundColor: '#ffd60a',
    padding: 15,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#000',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
