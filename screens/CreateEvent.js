import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Text, ScrollView } from 'react-native';
import { Title, TextInput, IconButton, Divider, Checkbox, Paragraph, Button, Snackbar } from 'react-native-paper';
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

import AddressModal from './AddressModal';

export default function CreateEvent({ navigation, route: { params } }) {

    const { homeTeam, awayTeam, date } = params;

    // console.log(homeTeam);
    // console.log(awayTeam);

    const [creatorId, setCreatorId] = useState('');
    const [title, setTitle] = useState(`${homeTeam.name} - ${awayTeam.name}`);
    const [matchDate, setMatchDate] = useState(new Date(date).toLocaleDateString());
    const [dateFromDP, setDateFromDP] = useState(undefined);
    const [matchHour, setMatchHour] = useState('');
    const [openDP, setOpenDP] = useState(false);
    const [openTP, setOpenTP] = useState(false);
    const [address, setAddress] = useState('');
    const [addressCoords, setAddressCoords] = useState(null);
    const [addressModal, setAddressModal] = useState(false);
    const [place, setPlace] = useState('home');
    const [capacity, setCapacity] = useState(1);
    const [food, setFood] = useState(false);
    const [beverages, setBeverages] = useState(false);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [eventCreated, setEventCreated] = useState(null);

    useEffect(() => {
        let hour = new Date(date).getHours();
        let minutes = new Date(date).getMinutes();
        if (hour < 10) hour = "0" + hour;
        if (minutes < 10) minutes = "0" + minutes;
        setMatchHour(`${hour}:${minutes}`);
        AsyncStorage.getItem('user', (error, data) => {
            if (data) {
                const userDatas = JSON.parse(data);
                setCreatorId(userDatas._id)
            }
        })
    }, []);

    const onDismissDP = useCallback(() => {
        setOpenDP(false);
    }, [setOpenDP]);

    const onConfirmDP = useCallback(
        (params) => {
            setOpenDP(false);
            setDateFromDP(params.date);
            if (new Date(params.date).toLocaleDateString() !== matchDate) {
                setMatchDate(params.date)
            }
        },
        [setOpenDP, setDateFromDP]
    );

    const onDismissTP = useCallback(() => {
        setOpenTP(false)
    }, [setOpenTP])

    const onConfirmTP = useCallback(
        ({ hours, minutes }) => {
            setOpenTP(false);
            if (hours < 10) hours = "0" + hours;
            if (minutes < 10) minutes = "0" + minutes;
            const hour = hours + ":" + minutes;
            if (hour !== matchHour) setMatchHour(hour)
        },
        [setOpenTP]
    );

    const hideAddressModal = () => setAddressModal(false);

    const confirmAddress = (coords, location) => {
        setAddressCoords(coords);
        setAddress(location);
        hideAddressModal()
    };

    const createEvent = async () => {
        const { latitude, longitude } = addressCoords;
        setLoading(true);
        const datas = JSON.stringify({
            title,
            homeTeamLogo: homeTeam.logo,
            awayTeamLogo: awayTeam.logo,
            date,
            hour: matchHour,
            address,
            latitude,
            longitude,
            place: place,
            capacity: capacity,
            beverages,
            food,
            comment,
            creator: creatorId,
        });
        const request = await fetch(`${API_URL}/add-event`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: datas
        })
        const response = await request.json();
        if (response.result) setEventCreated(response.event)
        // console.log(response);
        setIsModalVisible(true);
        setMessage(response.message);
        setLoading(false);
        setTimeout(() => setIsModalVisible(false), 5000)
    }

    let possibleCapacity = [];
    for (let i = 1; i < 11; i++) {
        possibleCapacity.push(
            <Checkbox.Item
                label={i}
                value={i}
                color="#fff"
                uncheckedColor="#4392F1"
                style={capacity === i ? { backgroundColor: '#4392F1', borderRadius: 3 } : null}
                labelStyle={capacity === i ? { color: '#fff' } : null}
                status={capacity === i ? 'checked' : 'unchecked'}
                onPress={() => setCapacity(i)}
            />
        )
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <View style={styles.header}>
                <IconButton
                    icon="arrow-left"
                    size={25}
                    color="#4392F1"
                    onPress={() => navigation.goBack()}
                />
                <Title style={styles.title}>Create your event !</Title>
            </View>
            {/* <Divider style={{ backgroundColor: '#4392F1', width: '80%', marginBottom: 25 }} /> */}
            <ScrollView style={{ width: '90%', flex: 1 }}>
                <TextInput
                    label="Match"
                    value={title}
                    style={styles.inputs}
                    onChangeText={value => setTitle(value)}
                />
                <View style={styles.inputsContainer}>
                    <TextInput
                        label="Date"
                        value={matchDate}
                        style={styles.date}
                        right={<TextInput.Icon icon="calendar" onPress={() => setOpenDP(true)} />}
                    />
                    <TextInput
                        label="Hour"
                        value={matchHour}
                        style={styles.time}
                        right={<TextInput.Icon icon="clock-time-four-outline" onPress={() => setOpenTP(true)} />}
                    />
                </View>
                {
                    address !== ''
                        ? <TextInput
                            label="Address"
                            value={address}
                            style={styles.inputs}
                            onChangeText={value => setAddress(value)}
                        />
                        : <View style={styles.inputsContainer}>
                            <Paragraph style={{ flex: 1 }}>Press the map icon to get an address</Paragraph>
                            <IconButton
                                icon="map"
                                size={25}
                                color="#4392F1"
                                onPress={() => setAddressModal(true)}
                            />
                        </View>
                }
                <View style={styles.dividerContainer}>
                    <Divider style={styles.leftDivider} />
                    <Text style={styles.textDivider}>IS IT</Text>
                    <Divider style={styles.rightDivider} />
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginBottom: 10 }}>
                    <Checkbox.Item
                        label="At home"
                        value="first"
                        color="#fff"
                        uncheckedColor="#4392F1"
                        style={place === 'home' ? { backgroundColor: '#4392F1', borderRadius: 3 } : null}
                        labelStyle={place === 'home' ? { color: '#fff' } : null}
                        status={place === 'home' ? 'checked' : 'unchecked'}
                        onPress={() => setPlace('home')}
                    />
                    <Checkbox.Item
                        label="In a bar"
                        value="second"
                        color="#fff"
                        uncheckedColor="#4392F1"
                        style={place === 'bar' ? { backgroundColor: '#4392F1', borderRadius: 3 } : null}
                        labelStyle={place === 'bar' ? { color: '#fff' } : null}
                        status={place === 'bar' ? 'checked' : 'unchecked'}
                        onPress={() => setPlace('bar')}
                    />
                </View>
                <View style={styles.dividerContainer}>
                    <Divider style={styles.leftDivider} />
                    <Text style={styles.textDivider}>GUESTS ACCEPTED</Text>
                    <Divider style={styles.rightDivider} />
                </View>
                <View style={{ flexDirection: 'row', width: '100%', marginBottom: 10 }}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {possibleCapacity}
                    </ScrollView>
                </View>
                <View style={styles.dividerContainer}>
                    <Divider style={styles.leftDivider} />
                    <Text style={styles.textDivider}>WHICH SHOULD BRING</Text>
                    <Divider style={styles.rightDivider} />
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginBottom: 10 }}>
                    <Checkbox.Item
                        label="Food"
                        value={false}
                        color="#fff"
                        uncheckedColor="#4392F1"
                        style={food ? { backgroundColor: '#4392F1', borderRadius: 3 } : null}
                        labelStyle={food ? { color: '#fff' } : null}
                        status={food ? 'checked' : 'unchecked'}
                        onPress={() => setFood(!food)}
                    />
                    <Checkbox.Item
                        label="Beverages"
                        value={false}
                        color="#fff"
                        uncheckedColor="#4392F1"
                        style={beverages ? { backgroundColor: '#4392F1', borderRadius: 3 } : null}
                        labelStyle={beverages ? { color: '#fff' } : null}
                        status={beverages ? 'checked' : 'unchecked'}
                        onPress={() => setBeverages(!beverages)}
                    />
                </View>
                <TextInput
                    label="Comments"
                    value={comment}
                    style={styles.comments}
                    onChangeText={value => setComment(value)}
                />
            </ScrollView>
            <Button
                mode="contained"
                labelStyle={{ color: "#fff" }}
                style={{ width: '90%', marginTop: 10, marginBottom: 10, backgroundColor: '#DC493A' }}
                icon="calendar-plus"
                loading={loading}
                onPress={createEvent}
            >
                CREATE EVENT
            </Button>
            <DatePickerModal
                mode="single"
                style={{ color: "#fff" }}
                visible={openDP}
                onDismiss={onDismissDP}
                date={dateFromDP}
                onConfirm={onConfirmDP}
            />
            <TimePickerModal
                visible={openTP}
                onDismiss={onDismissTP}
                onConfirm={onConfirmTP}
                hours={new Date().getHours()}
                minutes={new Date().getMinutes()}
                label="Select time"
                cancelLabel="Cancel"
                confirmLabel="Ok"
                animationType="fade"
            />
            <AddressModal visible={addressModal} hideModal={hideAddressModal} confirmAddress={confirmAddress} />
            <Snackbar
                visible={isModalVisible}
                onDismiss={() => setIsModalVisible(false)}
                action={{
                    label: 'See',
                    onPress: () => navigation.navigate('Events', {
                        screen: 'event',
                        params: {
                            event: eventCreated
                        }
                    })
                }}
            >
                {message}
            </Snackbar>
        </KeyboardAvoidingView>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "flex-start",
        alignItems: "center"
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
    title: {
        textAlign: 'center',
        width: '66%'
    },
    inputs: {
        marginBottom: 10
    },
    inputsContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
    },
    date: {
        flex: 1,
        marginRight: 5
    },
    time: {
        flex: 1,
        marginLeft: 5
    },
    dividerContainer: {
        // marginTop: 10,
        // width: '90%',
        marginBottom: 10,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    leftDivider: {
        backgroundColor: "#4392F1",
        flex: 1,
        marginRight: 10
    },
    textDivider: {
        color: "#4392F1",
        fontWeight: 'bold'
    },
    rightDivider: {
        backgroundColor: "#4392F1",
        flex: 1,
        marginLeft: 10
    },
    comments: {
        width: '100%',
        // height: 100
    }
});