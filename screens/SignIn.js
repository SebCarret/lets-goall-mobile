import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Button, TextInput, Divider, Title } from 'react-native-paper';
import { API_URL, FACEBOOK_APP_ID, GOOGLE_CLIENT_ID } from '@env';
import * as Facebook from 'expo-facebook';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignUp({ navigation, handleError }) {

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [password, setPassword] = useState('');
    const [pwdError, setPwdError] = useState(false);
    const [pwdHidden, setPwdHidden] = useState(true);
    const [loading, setLoading] = useState(false);

    const [request, response, promptAsync] = Google.useAuthRequest({ expoClientId: GOOGLE_CLIENT_ID });

    const handleSignIn = async () => {

        const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

        if (!regex.test(email)) {
            setEmailError(true);
            handleError(true, 'Please enter a valid email')
        } else if (password === "") {
            setEmailError(false);
            setPwdError(true);
            handleError(true, 'Stop ! You need a password')
        } else {
            setEmailError(false);
            setPwdError(false);
            setLoading(true);
            const datas = JSON.stringify({
                email,
                password
            });

            const request = await fetch(`${API_URL}/users/signin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: datas
            });
            const response = await request.json();
            if (response.result) {
                AsyncStorage.setItem('user', JSON.stringify(response.user));
                navigation.navigate('BottomNav', { screen: 'Events' });
                setEmailError(false);
            } else {
                handleError(true, response.error)
            }
            setLoading(false);
        }
    };

    const facebookLogin = async () => {
        try {
            await Facebook.initializeAsync({
                appId: FACEBOOK_APP_ID,
            });
            const {
                type,
                token,
                permissions,
            } = await Facebook.logInWithReadPermissionsAsync({ permissions });
            if (type) {
                if (type === 'success') {
                    const fbRequest = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
                    const fbResponse = await fbRequest.json();
                    const apiRequest = await fetch(`${API_URL}/users/facebook-connect`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            pseudo: fbResponse.name,
                            facebook_id: fbResponse.id
                        })
                    });
                    const apiResponse = await apiRequest.json();
                    if (apiResponse.result) {
                        AsyncStorage.setItem('user', JSON.stringify(apiResponse.user));
                        navigation.navigate('BottomNav', { screen: 'Events' })
                    } else {
                        handleError(true, apiResponse.error)
                    }
                }
            } else {
                handleError(true, 'error with Facebook login... Please try again')
            }
        } catch ({ message }) {
            console.log(`Facebook Login Error: ${message}`);
        }
    };

    const googleLogin = async () => {
        await promptAsync();
        try {
            if (response) {
                if (response.type === 'success') {
                    const { authentication } = response;
                    const googleRequest = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${authentication.accessToken}`);
                    const googleResponse = await googleRequest.json();
                    const apiRequest = await fetch(`${API_URL}/users/google-connect`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            pseudo: googleResponse.given_name,
                            email: googleResponse.email,
                            google_id: googleResponse.id
                        })
                    });
                    const apiResponse = await apiRequest.json();
                    if (apiResponse.result) {
                        AsyncStorage.setItem('user', JSON.stringify(apiResponse.user));
                        navigation.navigate('BottomNav', { screen: 'Events' })
                    } else {
                        handleError(true, apiResponse.error)
                    }
                }
            } else {
                handleError(true, 'error with Google connect... Please try again')
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View style={styles.form}>
            <TextInput
                error={emailError}
                mode="flat"
                label="Your email"
                style={styles.input}
                value={email}
                onChangeText={value => setEmail(value)}
            />
            <TextInput
                error={pwdError}
                mode="flat"
                label="Your password"
                style={styles.input}
                secureTextEntry={pwdHidden}
                right={<TextInput.Icon name={pwdHidden ? "eye" : "eye-off"} onPress={() => setPwdHidden(!pwdHidden)} />}
                value={password}
                onChangeText={value => setPassword(value)}
            />
            <Button
                loading={loading}
                mode="contained"
                labelStyle={styles.buttonLabel}
                icon="login"
                onPress={handleSignIn}
            >
                Login
            </Button>
            <View style={styles.dividerContainer}>
                <Divider style={styles.leftDivider} />
                <Text style={styles.textDivider}>OR CONNECT WITH</Text>
                <Divider style={styles.rightDivider} />
            </View>
            <View style={styles.buttonContainer}>
                <Button
                    style={styles.facebook}
                    // loading={loading}
                    mode="contained"
                    labelStyle={styles.buttonLabel}
                    icon="facebook"
                    onPress={facebookLogin}
                >
                    Facebook
                </Button>
                <Button
                    style={styles.google}
                    // loading={loading}
                    mode="contained"
                    labelStyle={styles.buttonLabel}
                    icon="google"
                    onPress={googleLogin}
                >
                    Google
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    form: {
        width: '90%',
        height: 250
    },
    input: {
        marginBottom: 10
    },
    buttonLabel: {
        color: '#ffffff'
    },
    dividerContainer: {
        marginTop: 10,
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
        color: "#4392F1"
    },
    rightDivider: {
        backgroundColor: "#4392F1",
        flex: 1,
        marginLeft: 10
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: 'row'
    },
    facebook: {
        flex: 1,
        marginRight: 5,
        backgroundColor: "#1977F2"
    },
    google: {
        flex: 1,
        marginLeft: 5,
        backgroundColor: "#EA4335"
    }
});