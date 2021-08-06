import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Image, Text } from 'react-native';
import { IconButton, Title, DataTable } from 'react-native-paper';
import { API_URL } from '@env';

export default function TeamCalendar({ navigation, route: { params } }) {

    const [calendar, setCalendar] = useState([]);

    const { leagueId, teamId } = params;

    useEffect(() => {
        const getCalendar = async () => {
            const request = await fetch(`${API_URL}/team-calendar/${leagueId}/2021/${teamId}`);
            const response = await request.json();
            setCalendar(response.calendar)
        };
        getCalendar()
    }, [])

    // console.log(`league ID : ${leagueId}`);
    // console.log(`team ID : ${teamId}`);

    const matches = calendar.map((match, i) => {

        const date = new Date(match.fixture.date).toLocaleDateString();

        return (
            <DataTable.Row key={`match n°${i + 1}`}>
                <DataTable.Cell style={styles.cell}><Text style={styles.date}>{date}</Text></DataTable.Cell>
                <DataTable.Cell style={styles.cell}><Image style={styles.logo} source={{ uri: match.teams.home.logo }} /></DataTable.Cell>
                <DataTable.Cell style={styles.cell}><Image style={styles.logo} source={{ uri: match.teams.away.logo }} /></DataTable.Cell>
                <DataTable.Cell style={styles.cell}>
                    <IconButton
                        color='#DC493A'
                        icon="calendar-plus" 
                        onPress={() => navigation.navigate('event', {homeTeam: match.teams.home, awayTeam: match.teams.away, date: match.fixture.date})}
                    />
                </DataTable.Cell>
            </DataTable.Row>
        )
    });

    return (
        <View style={styles.container}>
            <Title style={{ fontFamily: 'Poppins', marginBottom: 25, marginTop: 50 }}>CALENDAR SCREEN</Title>
            <DataTable>
                <DataTable.Header>
                    <DataTable.Title style={styles.cell}>Date (TBC)</DataTable.Title>
                    <DataTable.Title style={styles.cell}>Home</DataTable.Title>
                    <DataTable.Title style={styles.cell}>Away</DataTable.Title>
                    <DataTable.Title style={styles.cell}>Event</DataTable.Title>
                </DataTable.Header>
                <ScrollView>
                    {matches}
                </ScrollView>

            </DataTable>
        </View>
    );
}

const styles = ({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    cell: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    date: {
        fontFamily: 'Poppins',
        color: '#4392F1'
    },
    logo: {
        width: 25,
        height: 25
    }
});