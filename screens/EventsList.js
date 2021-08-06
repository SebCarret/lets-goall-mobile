import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { List, Avatar, IconButton } from 'react-native-paper';

export default function EventsList({events, navigation}) {

    const eventsList = events.map((event, i) => {

        let day = new Date(event.date).getDate();
        if (day < 10) day = `0${day}`;
        let month = new Date(event.date).getMonth();
        if (month < 10) month = `0${month}`;

        const date = `${month}/${day}`;

        return (
            <List.Item
                key={`event-${event._id}`}
                title={event.title}
                description={`${date} - Hosted by ${event.creator.pseudo}`}
                left={props => <Avatar.Icon
                    size={50}
                    icon={event.place === 'home' ? 'home-account' : 'beer'}
                    color='#fff'
                    style={event.place === 'home' ? null : { backgroundColor: "#DC493A" }}
                />}
                right={props => <IconButton
                    icon="eye"
                    // loading={true}
                    color={event.place === 'home' ? '#4392F1' : "#DC493A"}
                    size={25}
                    onPress={() => navigation.navigate('event', { event })}
                />
                }
            />
        )
    });

    return (
        <ScrollView style={{ width: '100%' }}>
            {eventsList}
        </ScrollView>
    )
};