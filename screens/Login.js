import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { Title, Snackbar, Switch } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SignUp from './SignUp';
import SignIn from './SignIn';
import SplashScreen from './SplashScreen';

export default function Login({ navigation }) {

    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [isSwitchOn, setIsSwitchOn] = useState(false);
    const [loading, setLoading] = useState(true);

    const isFocused = useIsFocused();

    useEffect(() => {
        (async () => {
          await AsyncStorage.getItem('user', (error, data) => {
            // console.log(data);
            data ? navigation.navigate('BottomNav', {screen: 'Events'}) : setLoading(false)
          })
        })()
      }, [isFocused]);

    const handleError = (value, message) => {
        setError(value);
        setErrorMsg(message)
    };

    const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

    let switchLabel = isSwitchOn ? 'Not registered yet ? Switch left to sign up' : 'Have an account ? Switch right to sign in';
    
    if (loading){
        return <SplashScreen />
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
            <Title style={{ marginBottom: 25 }}>Welcome to Let's Goall !</Title>
            <View style={{ width: '90%', marginBottom: 25, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text>{switchLabel}</Text>
                <Switch value={isSwitchOn} color="#4392F1" onValueChange={onToggleSwitch} />
            </View>
            {
                isSwitchOn
                    ? <SignIn navigation={navigation} handleError={handleError} />
                    : <SignUp navigation={navigation} handleError={handleError} />
            }
            <Snackbar
                visible={error}
                duration={3000}
                style={styles.snackbar}
                onDismiss={() => setError(false)}
            >
                {errorMsg}
            </Snackbar>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    snackbar: {
        backgroundColor: '#DC493A'
    }
});