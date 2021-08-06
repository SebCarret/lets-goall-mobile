import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignUp({ navigation, handleError }) {

    const [pseudo, setPseudo] = useState('');
    const [pseudoError, setPseudoError] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [password, setPassword] = useState('');
    const [pwdError, setPwdError] = useState(false);
    const [pwdHidden, setPwdHidden] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {

        const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

        if (pseudo === "") {
            setPseudoError(true);
            handleError(true, 'Please choose a pseudo');
        } else if (!regex.test(email)) {
            setPseudoError(false);
            setEmailError(true);
            handleError(true, 'Please enter a valid email')
        } else if (password === "") {
            setPseudoError(false);
            setEmailError(false);
            setPwdError(true);
            handleError(true, 'Stop ! You need a password')
        } else {
            setPseudoError(false);
            setEmailError(false);
            setPwdError(false);
            setLoading(true);
            const datas = JSON.stringify({
                pseudo,
                email,
                password
            });

            const request = await fetch(`${API_URL}/users/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: datas
            });
            const response = await request.json();
            if (response.result) {
                AsyncStorage.setItem('user', JSON.stringify(response.user));
                navigation.navigate('BottomNav', { screen: 'Events' });
                setPseudoError(false);
                setEmailError(false);
                setErrorMsg('')
            } else {
                handleError(true, response.error)
            }
            setLoading(false);
        }
    };

    return (
        <View style={{ width: '90%', height: 250 }}>
            <TextInput
                error={pseudoError}
                mode="flat"
                label="Your pseudo"
                style={styles.input}
                value={pseudo}
                onChangeText={value => setPseudo(value)}
            />
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
                labelStyle={{ color: '#ffffff' }}
                icon="account-plus"
                onPress={handleSignUp}
            >
                Create account
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        marginBottom: 10
    }
});