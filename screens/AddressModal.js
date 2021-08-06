import React, { useEffect, useState } from 'react';
import { Dialog, Button, TextInput } from 'react-native-paper';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function Addressmodal({ visible, hideModal, confirmAddress }) {

    const [userPosition, setUserPosition] = useState({ latitude: 0, longitude: 0 });
    const [selectedAddress, setSelectedAddress] = useState('');
    const [addressCoords, setAddressCoords] = useState(null);

    useEffect(() => {
        const askPermission = async () => {
            var { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                await Location.watchPositionAsync({ distanceInterval: 10 },
                    (location) => {
                        // console.log(location);
                        setUserPosition(location.coords)
                    }
                );
            }
        };
        askPermission()
    }, []);

    const onMapPress = async coords => {
        setAddressCoords(coords);
        let address = await Location.reverseGeocodeAsync(coords);
        // console.log(address);
        setSelectedAddress(`${address[0].name} ${address[0].postalCode} ${address[0].city}`)
    }

    return (
        <Dialog style={{ flex: 1 }} visible={visible} onDismiss={() => hideModal()}>
            <Dialog.Title style={{ fontSize: 20, textAlign: 'center' }}>Press the map and get your address</Dialog.Title>
            <Dialog.Content style={{ flex: 1 }}>
                <TextInput label="Selected address" value={selectedAddress} onChangeText={value => setSelectedAddress(value)} />
                <MapView
                    style={{ flex: 1 }}
                    region={{
                        latitude: userPosition.latitude,
                        longitude: userPosition.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                    onPress={e => onMapPress(e.nativeEvent.coordinate)}
                >
                    <Marker
                        title="My position"
                        coordinate={{ latitude: userPosition.latitude, longitude: userPosition.longitude }}
                    />
                </MapView>
            </Dialog.Content>
            <Dialog.Actions>
                <Button onPress={() => hideModal()}>Cancel</Button>
                <Button onPress={() => confirmAddress(addressCoords, selectedAddress)}>Confirm</Button>
            </Dialog.Actions>
        </Dialog >
    )
}