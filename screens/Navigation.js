import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SplashScreen from './SplashScreen';
import Login from './Login';
import Account from './Account';
import Teams from './Teams';
import TeamCalendar from './TeamCalendar';
import CreateEvent from './CreateEvent';
import EventsList from './EventsContainer';
import Event from './Event';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TeamsNavigation = () => {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="leagues" component={Teams} />
      <Stack.Screen name="calendar" component={TeamCalendar} leagueId={({ params }) => params.leagueId} teamId={({ params }) => params.teamId} />
      <Stack.Screen name="event" component={CreateEvent} homeTeam={({ params }) => params.homeTeam} awayTeam={({ params }) => params.awayTeam} date={({ params }) => params.awayTeam} />
    </Stack.Navigator>
  )
};

const EventsNavigation = () => {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="list" component={EventsList} />
      <Stack.Screen name="event" component={Event} event={({ params }) => params.event} />
    </Stack.Navigator>
  )
};

const BottomNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          let iconName;


          if (route.name === 'Account') {
            iconName = 'account';
          } else if (route.name === 'Teams') {
            iconName = 'soccer';
          } else if (route.name === 'Events') {
            iconName = 'calendar';
          }

          return <MaterialCommunityIcons name={iconName} size={25} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: '#DC493A',
        inactiveTintColor: '#4392F1',
        labelStyle: { fontFamily: 'Poppins' }
      }}
    >
      <Tab.Screen name="Teams" component={TeamsNavigation} />
      <Tab.Screen name="Events" component={EventsNavigation} />
      <Tab.Screen name="Account" component={Account} />
    </Tab.Navigator>
  )
};

const StackNavigation = () => {

  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="BottomNav" component={BottomNavigation} />
    </Stack.Navigator>
  )
};

export default function Nav() {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 5000)
  }, []);

  if (loading){
    return <SplashScreen />
  }

  return (
    <NavigationContainer>
      <StackNavigation />
    </NavigationContainer>
  )
};