import * as React from 'react';
import { StyleSheet } from 'react-native';
import * as Facebook from 'expo-auth-session/providers/facebook';
import { ResponseType } from 'expo-auth-session';
import { Button } from 'react-native-paper';
import { FACEBOOK_APP_ID } from '@env';

export default function FacebookLogin() {

    const [request, response, promptAsync] = Facebook.useAuthRequest({clientId: FACEBOOK_APP_ID});

    // React.useEffect(() => {
    //     if (response?.type === 'success') {
    //         const { code } = response.params;
    //     }
    // }, [response]);

    const facebookLogin = async () => {
        await promptAsync();
        try {
            console.log(response);
            if (response.type === 'success'){
                const { access_token } = response.params;
                // console.log(code);
                const fbRequest = await fetch(`https://graph.facebook.com/me?access_token=${access_token}`);
                const fbResponse = await fbRequest.json();
                console.log(fbResponse);
            }
        } catch (error) {
            console.log(error)
        }
    };

    return (
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
    );
};

const styles = StyleSheet.create({
    buttonLabel: {
        color: '#ffffff'
    },
    facebook: {
        flex: 1,
        marginRight: 5,
        backgroundColor: "#1977F2"
    },
});