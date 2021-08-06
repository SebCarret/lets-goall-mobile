import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Image} from 'react-native';
import { Title, Avatar, Divider, List, Button, IconButton } from 'react-native-paper';
import sources from '../datas/leagues.json';
import teams from '../datas/teams-ligue1.json';

// const { Image } = Avatar;

export default function Teams({ navigation }) {

  const [leagueSelected, setLeagueSelected] = useState(61);
  // const [teams, setTeams] = useState([]);

  // useEffect(() => {
  //   const loadTeams = async () => {
  //     const request = await fetch(`http://172.16.188.143:3000/teams/${leagueSelected}/2021`);
  //     const response = await request.json();
  //     setTeams(response.teams)
  //   };
  //   loadTeams();
  // }, [leagueSelected])

  const leagues = sources.leagues.map((league, i) => {

    let border = leagueSelected === league.league_id ? { borderWidth: 2, borderColor: '#DC493A' } : null;

    return (
      <TouchableOpacity onPress={() => setLeagueSelected(league.league_id)} style={border} key={`league-${league.league_id}`}>
        <Image style={{width: 50, height: 50}} source={{ uri: league.logo }} />
      </TouchableOpacity>
    )
  });

  const teamsList = teams.teams.map((team, i) => {
    return (
      <List.Item
        key={`team-${team.team.id}`}
        // style={{ margin: 5, borderBottomColor: '#4392F1', borderBottomWidth: 1 }}
        title={team.team.name}
        titleStyle={{ color: '#4392F1' }}
        left={props => <Image source={{ uri: team.team.logo }} style={{ width: 50, height: 50 }} />}
        right={props => <IconButton
          icon="calendar"
          // loading={true}
          color= "#DC493A"
          size={25}
          onPress={() => navigation.navigate('calendar', {teamId: team.team.id, leagueId: leagueSelected})}
        />
        }
      />
    )
  });

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Select a league to diplay teams</Title>
      <View style={styles.leagues}>
        {leagues}
      </View>
      <Divider style={{ backgroundColor: '#DC493A', width: '80%', marginTop: 25 }} />
      <ScrollView style={{ width: '100%' }}>
        {teamsList}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  title: {
    color: '#4392F1',
    marginTop: 50,
    marginBottom: 25
  },
  leagues: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around'
  }
});