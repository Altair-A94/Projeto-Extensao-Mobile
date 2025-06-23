import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, KeyboardAvoidingView, Platform,TouchableWithoutFeedback, Keyboard,ScrollView,} from 'react-native';
import { TarefasContext } from '../App';
import { TextInputMask } from 'react-native-masked-text';

const options = ['Motor', 'Óleo', 'Revisão', 'Pneus', 'Bateria', 'Elétrica'];
const marcas = ['Fiat', 'Chevrolet', 'Hyundai', 'Jeep', 'Ford', 'Volkswagen', 'Nissan'];

export default function FormScreen({ route, navigation }) {
  const { modoEdicao, tarefaEditando } = route.params || {};
  const { salvarTarefa } = useContext(TarefasContext);

  const [data, setData] = useState('');
  const [descricao, setDescricao] = useState('');
  const [marcaVeiculo, setMarcaVeiculo] = useState('');
  const [dono, setDonoVeiculo] = useState('');
  const [tel, setTelefoneDono] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [modalMarcaVisible, setModalMarcaVisible] = useState(false);

  useEffect(() => {
    if (modoEdicao && tarefaEditando) {
      setData(tarefaEditando.data);
      setDescricao(tarefaEditando.descricao);
      setMarcaVeiculo(tarefaEditando.marca);
      setDonoVeiculo(tarefaEditando.dono);
      setTelefoneDono(tarefaEditando.tel);
      setSelectedOptions(tarefaEditando.titulo.split(', '));
    } else {
      setData('');
      setDescricao('');
      setMarcaVeiculo('');
      setDonoVeiculo('');
      setTelefoneDono('');
      setSelectedOptions([]);
    }
  }, [modoEdicao, tarefaEditando]);

  const toggleSelection = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter(item => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const salvar = () => {
    const tarefa = {
      id: modoEdicao && tarefaEditando ? tarefaEditando.id : Date.now().toString(),
      titulo: selectedOptions.join(', '),
      descricao,
      data,
      marca: marcaVeiculo,
      dono,
      tel,
    };

    salvarTarefa(tarefa);

    navigation.navigate('Minhas Tarefas');
  };

  const fecharFormulario = () => {
    navigation.navigate('Minhas Tarefas');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.formContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={fecharFormulario}
          >
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>

          <Text style={styles.modalTitle}>{modoEdicao ? 'Editar Tarefa' : 'Adicionar Serviço'}</Text>

          <TextInputMask
            type={'datetime'}
            options={{ format: 'DD/MM/YYYY' }}
            placeholder="Data"
            value={data}
            onChangeText={setData}
            style={styles.input}
            placeholderTextColor="#888"
          />

          <TextInput
            placeholder="Proprietário do Veículo"
            value={dono}
            onChangeText={setDonoVeiculo}
            style={styles.input}
            placeholderTextColor="#888"
          />

          <TextInputMask
            type={'cel-phone'}
            options={{ maskType: 'BRL', withDDD: true, dddMask: '(99)' }}
            placeholder="(xx) xxxxx-xxxx"
            value={tel}
            onChangeText={setTelefoneDono}
            style={styles.input}
            placeholderTextColor="#888"
          />

          <Text style={styles.label}>Marca do veículo</Text>
          <TouchableOpacity style={styles.input} onPress={() => setModalMarcaVisible(true)}>
            <Text style={{ color: marcaVeiculo ? '#000' : '#888' }}>
              {marcaVeiculo || 'Selecione a marca'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.label}>Serviços</Text>
          <View style={styles.optionsContainer}>
            {options.map(option => (
              <TouchableOpacity
                key={option}
                style={styles.optionButton}
                onPress={() => toggleSelection(option)}
              >
                <View
                  style={[
                    styles.optionCircle,
                    selectedOptions.includes(option) && styles.optionCircleSelected,
                  ]}
                />
                <Text
                  style={[
                    styles.optionText,
                    selectedOptions.includes(option) && styles.optionTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            placeholder="Descrição do(s) serviço(s)"
            value={descricao}
            onChangeText={setDescricao}
            style={styles.input}
            placeholderTextColor="#888"
            multiline
          />

          <TouchableOpacity style={styles.btnAmarelo} onPress={salvar}>
            <Text style={styles.txtBtn}>Salvar</Text>
          </TouchableOpacity>
        </View>

        <Modal
          visible={modalMarcaVisible}
          animationType="fade"
          transparent
          onRequestClose={() => setModalMarcaVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setModalMarcaVisible(false)}>
            <View style={styles.modalMarcaBackdrop}>
              <View style={styles.modalMarcaContainer}>
                <Text style={styles.modalTitle}>Selecione a Marca</Text>
                <ScrollView style={{ maxHeight: 250 }}>
                  {marcas.map((marca) => (
                    <TouchableOpacity
                      key={marca}
                      onPress={() => {
                        setMarcaVeiculo(marca);
                        setModalMarcaVisible(false);
                      }}
                      style={styles.marcaOption}
                    >
                      <Text style={styles.marcaOptionText}>{marca}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2c2c2e',
    padding: 20,
  },
  formContainer: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    color: '#000',
  },
  label: {
    fontSize: 14,
    color: 'white',
    marginTop: 12,
    marginBottom: 4,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginVertical: 10,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 8,
  },
  optionCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#4CAF50',
    marginRight: 6,
  },
  optionCircleSelected: {
    backgroundColor: '#FF8C00',
  },
  optionText: {
    fontSize: 16,
    color: 'white',
  },
  optionTextSelected: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 15,
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 28,
    color: 'white',
    fontWeight: '600',
  },
  btnAmarelo: {
    backgroundColor: '#ffd60a',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginTop: 8,
  },
  txtBtn: {
    fontWeight: '700',
    color: '#000',
    fontSize: 16,
    textAlign: 'center',
  },
  modalMarcaBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalMarcaContainer: {
    backgroundColor: '#2c2c2e',
    width: '80%',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  marcaOption: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  marcaOptionText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});
