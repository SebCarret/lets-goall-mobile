import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { Title, IconButton, Card, Avatar, Button, Snackbar, Chip, List } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

export default function Event({ navigation, route: { params } }) {

    const { event } = params;

    const [user, setUser] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');
    const [capacity, setCapacity] = useState(event.capacity);
    const [guests, setGuests] = useState([]);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem('user', (error, data) => {
            if (data) {
                const userDatas = JSON.parse(data);
                setUser(userDatas)
            }
        });
        setGuests(event.guests)
    }, []);



    const joinEvent = async () => {
        setIsLoading(true);
        setIsError(false);
        const request = await fetch(`${API_URL}/add-guest/${event._id}/${user._id}`);
        const response = await request.json();
        setIsVisible(true);
        if (response.result) {
            setMessage('Congratulations ! You\'ve joined this event');
            setCapacity(response.event.capacity);
            setGuests([...guests, user])
        } else {
            setIsError(true);
            setMessage(response.message)
        }
        setIsLoading(false)
    };

    const removeGuest = async () => {
        setIsError(false);
        const request = await fetch(`${API_URL}/remove-guest/${event._id}/${user._id}`);
        const response = await request.json();
        setIsVisible(true);
        if (response.result) {
            setMessage('You\'re now out of this event');
            setCapacity(response.event.capacity);
            setGuests(guests.filter(e => e._id != user._id));
        }
    };

    const guestsList = guests.map((guest, i) => {
        if (guest._id === user._id) {
            return <Chip icon="account" style={styles.chip} onClose={() => removeGuest()}>{guest.pseudo}</Chip>
        } else {
            return <Chip mode="outlined" icon="account" style={styles.chip}>{guest.pseudo}</Chip>
        }
    });

    let creator = event.creator.pseudo === user.pseudo ? 'you !' : event.creator.pseudo;

    let buttonStyle;
    if (capacity === 0) {
        buttonStyle = styles.disabledButton
    } else {
        buttonStyle = event.place === 'home' ? styles.homeButton : styles.barButton
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <IconButton
                    icon="arrow-left"
                    size={25}
                    color="#4392F1"
                    onPress={() => navigation.goBack()}
                />
                <View style={styles.headerTitle}>
                    <Image style={styles.logos} source={{ uri: event.homeTeamLogo }} />
                    <Title style={event.place === 'home' ? styles.homeTitle : styles.barTitle} >
                        {new Date(event.date).toLocaleDateString()}
                    </Title>
                    <Image style={styles.logos} source={{ uri: event.awayTeamLogo }} />
                </View>
            </View>
            <Card style={styles.card}>
                <Card.Title
                    title="Avalaible seats"
                    subtitle={event.title}
                    style={event.place === 'home' ? styles.homeColor : styles.barColor}
                    titleStyle={styles.title}
                    subtitleStyle={styles.subTitle}
                    left={props => <Avatar.Text
                        label={capacity}
                        size={50}
                        color={event.place === 'home' ? '#4392F1' : '#DC493A'}
                        style={styles.icons}
                    />}
                />
                <Card.Content>
                    <View style={styles.infoContainer}>
                        <Avatar.Icon
                            size={50}
                            icon="account"
                            color={event.place === 'home' ? '#4392F1' : '#DC493A'}
                            style={styles.icons}
                        />
                        <Text>Created by {creator}</Text>
                    </View>
                    <View style={styles.infoContainer}>
                        <Avatar.Icon
                            size={50}
                            icon="map-marker"
                            color={event.place === 'home' ? '#4392F1' : '#DC493A'}
                            style={styles.icons}
                        />
                        <Text style={styles.longText}>{event.address}</Text>
                    </View>
                    <View style={styles.infoContainer}>
                        <Avatar.Icon
                            size={50}
                            icon={event.place === 'home' ? 'home-account' : 'beer'}
                            color={event.place === 'home' ? '#4392F1' : '#DC493A'}
                            style={styles.icons}
                        />
                        <Text>{event.place === 'home' ? `At ${event.creator.pseudo}'s house` : 'In a bar'}</Text>
                    </View>
                    <View style={styles.infoContainer}>
                        <Avatar.Icon
                            size={50}
                            icon={event.food ? 'food' : 'food-off'}
                            color={event.place === 'home' ? '#4392F1' : '#DC493A'}
                            style={styles.icons}
                        />
                        <Text>{event.food ? 'Food needed' : 'No food needed'}</Text>
                    </View>
                    <View style={styles.infoContainer}>
                        <Avatar.Icon
                            size={50}
                            icon={event.beverages ? 'cup' : 'cup-off'}
                            color={event.place === 'home' ? '#4392F1' : '#DC493A'}
                            style={styles.icons}
                        />
                        <Text>{event.beverages ? 'Beverages needed' : 'No beverages needed'}</Text>
                    </View>
                    {
                        event.comment && event.comment !== ''
                            ? <View style={styles.infoContainer}>
                                <Avatar.Icon
                                    size={50}
                                    icon="comment"
                                    color={event.place === 'home' ? '#4392F1' : '#DC493A'}
                                    style={styles.icons}
                                />
                                <Text style={styles.longText}>{event.comment}</Text>
                            </View>
                            : null
                    }
                    <List.Accordion
                        title={!expanded ? "View guests" : "Hide guests"}
                        titleStyle={event.place === 'home' ? { color: '#4392F1' } : { color: '#DC493A' }}
                        expanded={expanded}
                        onPress={() => setExpanded(!expanded)}
                        style={{ backgroundColor: '#fff' }}
                    >
                        <View style={styles.guests}>
                            {
                                guests.length === 0
                                    ? <Chip style={styles.chip}>No guests for the moment</Chip>
                                    : guestsList
                            }
                        </View>
                    </List.Accordion>
                </Card.Content>
                {
                    event.creator._id === user._id
                        ? null
                        : <Card.Actions>
                            <Button
                                mode="contained"
                                icon={capacity === 0 ? "cancel" : "account-multiple-plus-outline"}
                                labelStyle={styles.subTitle}
                                style={buttonStyle}
                                loading={isLoading}
                                disabled={capacity === 0 ? true : false}
                                onPress={joinEvent}
                            >
                                {capacity === 0 ? 'EVENT FULL' : 'JOIN THIS EVENT'}
                            </Button>
                        </Card.Actions>
                }
            </Card>
            <Snackbar
                visible={isVisible}
                duration={3000}
                onDismiss={() => setIsVisible(false)}
                style={isError ? styles.barColor : styles.noError}
            >
                {message}
            </Snackbar>
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
    header: {
        width: '90%',
        marginTop: 50,
        marginBottom: 25,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    headerTitle: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    logos: {
        width: 50,
        height: 50
    },
    card: {
        width: '90%',
        marginBottom: 10
    },
    homeTitle: {
        // flex: 1,
        textAlign: 'center',
        color: '#4392F1',
        //fontSize: 20
    },
    title: {
        fontSize: 15,
        color: '#fff'
    },
    subTitle: {
        color: '#fff'
    },
    barTitle: {
        // flex: 1,
        textAlign: 'center',
        color: '#DC493A',
        //fontSize: 20
    },
    homeColor: {
        backgroundColor: '#4392F1'
    },
    barColor: {
        backgroundColor: '#DC493A'
    },
    infoContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 10
    },
    icons: {
        backgroundColor: '#fff',
        marginRight: 10
    },
    longText: {
        flex: 1,
        flexWrap: 'wrap'
    },
    homeButton: {
        width: '100%',
        backgroundColor: '#DC493A'
    },
    barButton: {
        width: '100%',

    },
    disabledButton: {
        width: '100%'
    },
    noError: {
        backgroundColor: '#2A9D8F'
    },
    guests: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 10
    },
    chip: {
        margin: 5
    }
});