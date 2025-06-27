import React, { useContext, useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { TarefasContext } from '../App';
import { getLoginUsuario } from '../componentes/Armazenamento';

export default function TarefasVisualizacaoScreen() {
  const { tarefas } = useContext(TarefasContext);
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [tarefasFiltradas, setTarefasFiltradas] = useState([]);

  useEffect(() => {
    const fetchUsuarioLogado = async () => {
      const usuario = await getLoginUsuario();
      setUsuarioLogado(usuario);
    };
    fetchUsuarioLogado();
  }, []);

  useEffect(() => {
    if (usuarioLogado && usuarioLogado.role && usuarioLogado.role.toLowerCase().includes('cliente')) {
      const filtradas = tarefas.filter(tarefa => tarefa.dono === usuarioLogado.username);
      setTarefasFiltradas(filtradas);
    } else {
      setTarefasFiltradas(tarefas);
    }
  }, [usuarioLogado, tarefas]);

  const renderItem = ({ item }) => (
    <View style={styles.tarefaCard}>
      <View style={styles.tarefaInfo}>
        <Text style={styles.tituloTarefa}>{item.titulo}</Text>
        <Text style={styles.dataTarefa}>{item.descricao}</Text>
        <Text style={styles.dataTarefa}>{item.data}</Text>
        <Text style={styles.dataTarefa}>Proprietário: {item.dono}</Text>
        <Text style={styles.dataTarefa}>Marca: {item.marca}</Text>
        <Text style={styles.dataTarefa}>Telefone: {item.tel}</Text>
        <Text style={styles.statusTarefa}>Status: {item.status || 'Pendente'}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Visualização de Tarefas</Text>

      <FlatList
        data={tarefasFiltradas}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  tarefaCard: {
    backgroundColor: '#e5e5e5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
});
