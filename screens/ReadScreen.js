import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { Header } from 'react-native-elements';
import * as firebase from 'firebase';
import db from '../config'




export default class ReadStoryScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      allStories: [],
      data: [],
      search: ''
    }
  }
  componentDidMount() {
    this.retrieveStories()
  }

  updateSearch = search => {
    this.setState({ search });
  };


  retrieveStories = () => {
    try {
      var allStories = []
      var stories = db.collection("stories")
        .get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {

            allStories.push(doc.data())
            console.log('this are the stories', allStories)
          })
          this.setState({ allStories })
        })
    }
    catch (error) {
      console.log(error);
    }
  };


  SearchFilterFunction(text) {
    const newData = this.state.allStories.filter((item) => {
      const itemData = item.title ? item.title.toUpperCase() : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      data: newData,
      search: text,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          backgroundColor={'pink'}
          centerComponent={{
            text: 'Bed Time Stories',
            style: { color: 'white', fontSize: 20 }
          }}
        />
        <View styles={{ height: 20, width: '100%' }}>
          <SearchBar
            placeholder="Type Here..."
            onChangeText={text => this.SearchFilterFunction(text)}
            onClear={text => this.SearchFilterFunction('')}
            value={this.state.search}
          />
        </View>

        <FlatList
          data={this.state.search === "" ? this.state.allStories : this.state.data}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text>  Title: {item.title}</Text>
              <Text>  Author : {item.author}</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />



      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  item: {
    backgroundColor: 'pink',
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
  itemContainer: {
    height: 80,
    width: '100%',
    borderWidth: 2,
    borderColor: 'pink',
    justifyContent: 'center',
    alignSelf: 'center',
  }
});