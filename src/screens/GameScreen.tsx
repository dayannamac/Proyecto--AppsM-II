import React from 'react';
import { View } from 'react-native';
import { styles } from '../themes/styles';
import { IconButton } from 'react-native-paper';
import { Image } from 'expo-image';


export const GameScreen = () => {
    const [carPosition, setCarPosition] = React.useState(0);

    const moveCar = (direction: 'left' | 'right') => {
        const jumpDistance = 100;
        if (direction === 'left' && carPosition > -jumpDistance) {
            setCarPosition(carPosition - jumpDistance);
        } else if (direction === 'right' && carPosition < jumpDistance) {
            setCarPosition(carPosition + jumpDistance);
        }
    };

    return (
        <View style={styles.container}>
            <Image
                source={require('../static/images/logo.png')}
                style={styles.localImageGame}
                resizeMode="contain"
            />
            <View style={styles.carContainer}>
                <View style={[styles.car, { left: carPosition }]} />
            </View>
            <View style={styles.controls}>
                <IconButton
                    icon="arrow-left"
                    size={80}
                    style={{ marginTop: 480, marginLeft: -45 }}
                    onPress={() => moveCar('left')}
                />
                <View style={styles.road}>
                    <View style={[styles.lane, { height: 700 }]} />
                    <View style={[styles.lane, { height: 700 }]} />
                </View>
                <IconButton
                    icon="arrow-right"
                    size={80}
                    style={{ marginTop: 480, marginRight: -45 }}
                    onPress={() => moveCar('right')}
                />
            </View>
        </View>
    );
};