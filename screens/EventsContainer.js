import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Title, Switch, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { API_URL } from '@env';
import EventsList from './EventsList';
import EventsMap from './EventsMap';

export default function EventsContainer({ navigation }) {

  const [events, setEvents] = useState([]);
  const [isSwitchOn, setIsSwitchOn] = useState(false);

  const isFocused = useIsFocused();

  useEffect(() => {
    const loadDatas = async () => {
      if (isFocused) {
        const request = await fetch(`${API_URL}/all-events`);
        const response = await request.json();
        setEvents(response.eventsList)
      }
    };
    loadDatas()
  }, [isFocused]);

  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>EVENTS LIST SCREEN</Title>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialCommunityIcons name="map" size={24} color={isSwitchOn ? "#B9B9B9" : "#4392F1"} />
          <Switch color="#4392F1" value={isSwitchOn} onValueChange={onToggleSwitch} />
          <MaterialCommunityIcons name="format-list-checkbox" size={24} color={isSwitchOn ? "#4392F1" : "#B9B9B9"} />
        </View>
      </View>
      {/* <Divider style={styles.divider} /> */}
      {
        isSwitchOn
        ? <EventsList events={events} navigation={navigation} />
        : <EventsMap events={events} navigation={navigation} />
      }
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  header: {
    width: '90%',
    marginTop: 50,
    marginBottom: 25,
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: {
    flex: 1,
    textAlign: 'center',
    color: '#4392F1'
  },
  divider: {
    backgroundColor: '#DC493A',
    width: '80%',
    marginBottom: 25
  },
  cell: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
});