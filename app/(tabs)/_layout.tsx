import React, { useMemo, useRef, useEffect } from 'react';
import { View } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Animated, Easing } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TopNavbar from '../components/TopNavbar';

const COLORS = {
    active: '#40ffdc',
    inactive: '#ffffff',
    barBg: '#12042b',
};

function AnimatedIcon({
                          render,
                          focused,
                      }: {
    render: (animatedColor: string | undefined, animatedSize: number) => React.ReactElement;
    focused: boolean;
}) {
    const t = useRef(new Animated.Value(focused ? 1 : 0)).current;

    useEffect(() => {
        Animated.timing(t, {
            toValue: focused ? 1 : 0,
            duration: 180,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
        }).start();
    }, [focused]);

    // Scale 1 → 1.12, translateY 0 → -1 (lift a touch)
    const scale = t.interpolate({ inputRange: [0, 1], outputRange: [1, 1.12] });
    const translateY = t.interpolate({ inputRange: [0, 1], outputRange: [0, -1] });

    return (
        <Animated.View style={{ transform: [{ scale }, { translateY }] }}>
            {render(undefined, 24)}
        </Animated.View>
    );
}

function AnimatedLabel({
                           label,
                           color,
                           focused,
                       }: {
    label: string;
    color: string;
    focused: boolean;
}) {
    const t = useRef(new Animated.Value(focused ? 1 : 0)).current;

    useEffect(() => {
        Animated.timing(t, {
            toValue: focused ? 1 : 0,
            duration: 160,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
        }).start();
    }, [focused]);

    // Opacity 0.6 → 1, translateY 2 → 0 (slide up a bit when active)
    const opacity = t.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] });
    const translateY = t.interpolate({ inputRange: [0, 1], outputRange: [2, 0] });

    return (
        <Animated.Text
            style={{
                color,
                fontSize: 10,          // smaller
                fontWeight: '300',     // thinner
                letterSpacing: 0.3,
                transform: [{ translateY }],
                opacity,
                marginTop: 2,
            }}
            numberOfLines={1}
        >
            {label}
        </Animated.Text>
    );
}

export default function TabsLayout() {
    const insets = useSafeAreaInsets();

    const screenOptions = useMemo(
        () => ({
            headerShown: false,
            tabBarShowLabel: true, // we'll override tabBarLabel with our AnimatedLabel
            tabBarActiveTintColor: COLORS.active,
            tabBarInactiveTintColor: COLORS.inactive,
            contentStyle: {
                backgroundColor: '#0a0019',
                flex: 1,
                zIndex: 10,
                elevation: 10,
            },
            tabBarStyle: {
                backgroundColor: COLORS.barBg,
                borderTopColor: 'transparent',
                height: 64 + insets.bottom,           // iOS home-indicator safe space
                paddingBottom: Math.max(insets.bottom, 10),
                paddingTop: 6,
            },
        }),
        [insets.bottom]
    );
    const tabsRef = useRef(null);

    return (
        <View style={{ flex: 1, zIndex: 10, elevation: 10 }}>
            <TopNavbar />
            <Tabs screenOptions={screenOptions} ref={tabsRef}>
            {/* HOME */}
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => (
                        <AnimatedIcon
                            focused={focused}
                            render={(c, s) => (
                                <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
                            )}
                        />
                    ),
                    tabBarLabel: ({ color, focused }) => (
                        <AnimatedLabel label="HOME" color={color} focused={focused} />
                    ),
                }}
            />

            {/* RELOAD */}
            <Tabs.Screen
                name="reload"
                options={{
                    title: 'Reload',
                    tabBarIcon: ({ color, focused }) => (
                        <AnimatedIcon
                            focused={focused}
                            render={(c, s) => (
                                <Ionicons name={focused ? 'refresh' : 'refresh-outline'} size={24} color={color} />
                            )}
                        />
                    ),
                    tabBarLabel: ({ color, focused }) => (
                        <AnimatedLabel label="RELOAD" color={color} focused={focused} />
                    ),
                }}
            />

            {/* PLAY */}
            <Tabs.Screen
                name="play"
                options={{
                    title: 'Play',
                    tabBarIcon: ({ color, focused }) => (
                        <AnimatedIcon
                            focused={focused}
                            render={(c, s) => (
                                <Ionicons
                                    name={focused ? 'game-controller' : 'game-controller-outline'}
                                    size={24}
                                    color={color}
                                />
                            )}
                        />
                    ),
                    tabBarLabel: ({ color, focused }) => (
                        <AnimatedLabel label="PLAY" color={color} focused={focused} />
                    ),
                }}
            />

            {/* VAULT */}
            <Tabs.Screen
                name="vault"
                options={{
                    title: 'Vault',
                    tabBarIcon: ({ color, focused }) => (
                        <AnimatedIcon
                            focused={focused}
                            render={(c, s) => (
                                <MaterialCommunityIcons name="safe" size={24} color={color} />
                            )}
                        />
                    ),
                    tabBarLabel: ({ color, focused }) => (
                        <AnimatedLabel label="VAULT" color={color} focused={focused} />
                    ),
                }}
            />

            {/* PROFILE */}
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, focused }) => (
                        <AnimatedIcon
                            focused={focused}
                            render={(c, s) => (
                                <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
                            )}
                        />
                    ),
                    tabBarLabel: ({ color, focused }) => (
                        <AnimatedLabel label="PROFILE" color={color} focused={focused} />
                    ),
                }}
            />
        </Tabs>
        </View>
    );
}
