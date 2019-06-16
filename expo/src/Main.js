import React, { Component } from 'react';
import { SafeAreaView, View, Text, TextInput, Button, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';

import pokemon from 'pokemon';
import Pokemon from './components/Pokemon';
const POKE_API_BASE_URL =  "https://pokeapi.co/api/v2";

export default class App extends Component {

  state = {
    isLoading: false, 
    searchInput: '',
    name: '', 
    pic: '', 
    types: [], 
    desc: ''
  }


  render() {
    const { name, pic, types, desc, searchInput, isLoading } = this.state; 
    return (
      <SafeAreaView style={styles.wrapper}>
        <View style={styles.container}>
          <View style={styles.headContainer}>
            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.textInput}
                onChangeText={(searchInput) => this.setState({searchInput})}
                value={this.state.searchInput}
                placeholder={"Search Pokemon"}
              />
            </View>
            <View style={styles.buttonContainer}>
              <Button
                onPress={this.searchPokemon}
                title="Search"
                color="#0064e1"
              />
            </View>
          </View>
          
          <View style={styles.mainContainer}>
            {
              isLoading && 
              <ActivityIndicator size="large" color="#0064e1" />
            }
            
            {
              !isLoading &&
              <Pokemon 
                name={name} 
                pic={pic} 
                types={types} 
                desc={desc} />
            }
          </View>
        </View>
      </SafeAreaView>
    );
  }


searchPokemon = async () => {
  try {
    const pokemonID = pokemon.getId(this.state.searchInput); // check if the entered Pokemon name is valid

    this.setState({
      isLoading: true // show the loader while request is being performed
    });

    const { data: pokemonData } = await axios.get(`${POKE_API_BASE_URL}/pokemon/${pokemonID}`);
    const { data: pokemonSpecieData } = await axios.get(`${POKE_API_BASE_URL}/pokemon-species/${pokemonID}`);

    const { name, sprites, types } = pokemonData;
    const { flavor_text_entries } = pokemonSpecieData;

    this.setState({
      name,
      pic: sprites.front_default,
      types: this.getTypes(types),
      desc: this.getDescription(flavor_text_entries),
      isLoading: false // hide loader
    });

  } catch (err) {
    Alert.alert("Error", "Pokemon not found");
  }
}


getTypes = (types) => {
  return types.map(({ slot, type }) => {
    return {
      "id": slot,
      "name": type.name
    }
  });
}


getDescription = (entries) => {
  return entries.find(item => item.language.name === 'en').flavor_text;
}

}


const styles = StyleSheet.create({
  wrapper: {
    flex: 1
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5FCFF',
  },
  headContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 100
  },
  textInputContainer: {
    flex: 2
  },
  buttonContainer: {
    flex: 1
  },
  mainContainer: {
    flex: 9
  },
  textInput: {
    height: 35,
    marginBottom: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    backgroundColor: "#eaeaea",
    padding: 5
  }
});