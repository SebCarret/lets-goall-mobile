import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Title, Button } from 'react-native-paper';
import MapView, { Marker } from 'react-native-maps';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';

export default function EventsMap({ events, navigation }) {

    const [userPosition, setUserPosition] = useState({ latitude: 0, longitude: 0 });

    useEffect(() => {
        const askPermission = async () => {
            var { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                await Location.watchPositionAsync({ distanceInterval: 10 },
                    (location) => {
                        setUserPosition(location.coords)
                    }
                );
            }
        };
        askPermission()
    }, []);

    const markersList = events.map((event, i) => {

        let icon = event.place === 'home' ? 'home-account' : 'beer';
        let iconColor = event.place === 'home' ? "#4392F1" : '#DC493A';

        return (
            <Marker
                title={event.title}
                description={new Date(event.date).toLocaleDateString()}
                key={`event-${event._id}`}
                coordinate={{ latitude: event.latitude, longitude: event.longitude }}
                onPress={() => navigation.navigate('event', { event })}
            >
                <MaterialCommunityIcons name={icon} size={40} color={iconColor} />
            </Marker>
        )
    });

    return (
        <MapView
            style={styles.map}
            region={{
                latitude: userPosition.latitude,
                longitude: userPosition.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }}
        >
            {markersList}
            <Marker coordinate={{ latitude: userPosition.latitude, longitude: userPosition.longitude }} title="You're here !">
                <MaterialCommunityIcons name="map-marker-radius" size={50} color="#4392F1" />
            </Marker>
        </MapView>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    map: {
        width: '100%',
        height: '100%',
    },
});