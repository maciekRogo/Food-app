import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Image } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: 'pink',
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: {
                    backgroundColor: 'white', // Białe tło menu
                    ...(Platform.OS === 'ios' ? { position: 'absolute' } : {}),
                },
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarBackground: TabBarBackground,
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Swipe',
                    tabBarIcon: ({ color }) => (
                        <Image
                            source={require('../../assets/images/swipe.png')}
                            style={{ width: 28, height: 28, tintColor: color }}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    title: 'Lodówka', // Napis i emotka lodówki
                    tabBarIcon: ({ color }) => (
                        <Image
                            source={require('../../assets/images/fridge.png')}
                            style={{ width: 28, height: 28, tintColor: color }}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}