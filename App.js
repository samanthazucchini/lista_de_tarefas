import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Keyboard, FlatList, Switch, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
      tarefas: [],
    };
  }

  componentDidMount() {
    this.carregarTarefas();
  }

  componentDidUpdate(_, prevState) {
    if (prevState.tarefas !== this.state.tarefas) {
      AsyncStorage.setItem('tarefas', JSON.stringify(this.state.tarefas));
    }
  }

  carregarTarefas = async () => {
    const tarefasSalvas = await AsyncStorage.getItem('tarefas');
    if (tarefasSalvas) {
      this.setState({ tarefas: JSON.parse(tarefasSalvas) });
    }
  };

  adicionarTarefa = () => {
    if (this.state.input.trim() === '') return;

    const novaTarefa = {
      id: Date.now().toString(),
      texto: this.state.input,
      concluida: false,
    };

    this.setState((prevState) => ({
      tarefas: [...prevState.tarefas, novaTarefa],
      input: '',
    }));

    Keyboard.dismiss();
  };

  alternarConclusao = (id) => {
    const novasTarefas = this.state.tarefas.map((tarefa) =>
      tarefa.id === id ? { ...tarefa, concluida: !tarefa.concluida } : tarefa
    );
    this.setState({ tarefas: novasTarefas });
  };

  renderTarefa = ({ item }) => (
    <View style={styles.tarefaContainer}>
      <Text
        style={[
          styles.tarefaTexto,
          item.concluida && styles.tarefaConcluida,
        ]}
      >
        {item.texto}
      </Text>
      <Switch
        value={item.concluida}
        onValueChange={() => this.alternarConclusao(item.id)}
        trackColor={{ false: '#d9c4ec', true: '#c7afe7' }} 
        thumbColor={item.concluida ? '#9a7eaf' : '#e0c6a8'} 
      />
    </View>
  );

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.titulo}>Lista de Tarefas</Text>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/66/66936.png',
            }}
            style={styles.icone}
          />
        </View>

        <Image
          source={{
            uri: 'https://png.pngtree.com/png-clipart/20221231/original/pngtree-beauty-care-vector-logo-in-a-minimalist-vintage-style-lotus-flower-png-image_8837517.png', // Flor minimalista
          }}
          style={styles.florImagemEsquerda}
        />

        <Image
          source={{
            uri: 'https://png.pngtree.com/png-clipart/20221231/original/pngtree-beauty-care-vector-logo-in-a-minimalist-vintage-style-lotus-flower-png-image_8837517.png', // Flor minimalista
          }}
          style={styles.florImagemDireita}
        />

        <View style={styles.viewInput}>
          <TextInput
            style={styles.input}
            placeholder="Digite uma tarefa..."
            placeholderTextColor="#bcaecc"
            value={this.state.input}
            onChangeText={(text) => this.setState({ input: text })}
          />
          <TouchableOpacity onPress={this.adicionarTarefa}>
            <Text style={styles.botao}>+</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={this.state.tarefas.slice().reverse()}
          keyExtractor={(item) => item.id}
          renderItem={this.renderTarefa}
          style={{ width: '90%' }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdf6ff',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f8f3f9', 
    borderRadius: 16, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  titulo: {
    fontSize: 28,
    fontWeight: '700',
    color: '#9a7eaf', 
    marginRight: 12,
    fontFamily: 'serif',
  },
  icone: {
    width: 26,
    height: 26,
  },
  florImagemEsquerda: {
    width: 80,
    height: 80,
    position: 'absolute',
    top: 30, 
    left: -3,
    opacity: 0.8,
    transform: [{ rotate: '20deg' }],
  },
  florImagemDireita: {
    width: 80,
    height: 80,
    position: 'absolute',
    top: 30, 
    right: -3, 
    opacity: 0.8,
    transform: [{ rotate: '-20deg' }],
  },
  viewInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    width: '100%',
    justifyContent: 'space-between',
    backgroundColor: '#f8f3f9',
    borderRadius: 16,
    paddingHorizontal: 15,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  input: {
    flex: 1,
    height: 45,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderColor: '#c8b0e3',
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#5a4c74',
    fontFamily: 'sans-serif-light',
  },
  botao: {
    marginLeft: 12,
    backgroundColor: '#9a7eaf',
    color: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    fontSize: 22,
  },
  tarefaContainer: {
    backgroundColor: '#f3e8ff',
    borderRadius: 14,
    padding: 15,
    marginVertical: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  tarefaTexto: {
    fontSize: 18,
    color: '#5e4b8b',
    fontFamily: 'sans-serif-light',
  },
  tarefaConcluida: {
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
});

export default App;
