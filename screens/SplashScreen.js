import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ImageBackground, Image } from 'react-native';
import { Title } from 'react-native-paper';
import { Asset } from 'expo-asset';

export default function SplashScreen() {

    const [assetSrc, setAssetSrc] = useState(null);

    useEffect(() => {
        (async () => {
            const [{ localUri }] = await Asset.loadAsync(require('../assets/fans.jpg'));
            setAssetSrc(localUri);
        })()
    }, []);

    if (!assetSrc){
        return <View style={{flex: 1}} />
    } else {
        return (
            <ImageBackground style={styles.container} source={{uri: assetSrc}}>
                <Image source={require('../assets/letsgoall.png')} style={{ margin: 10, width: 100, height: 100 }} />
                {/* <Title>Let's Goall</Title> */}
            </ImageBackground>
        )
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});