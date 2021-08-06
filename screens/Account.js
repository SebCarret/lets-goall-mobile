import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Title, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Map({navigation}) {

  return (
    <View style={styles.container}>
      <Title style={{ marginBottom: 25 }}>ACCOUNT SCREEN</Title>
      <Button
        mode="contained"
        labelStyle={styles.buttonLabel}
        icon="logout"
        onPress={() => {
          AsyncStorage.removeItem('user'); 
          navigation.navigate('Login')
        }}
      >
        Logout
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonLabel: {
    color: '#fff'
  }
});