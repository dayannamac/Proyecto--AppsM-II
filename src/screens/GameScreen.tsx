import React, { useState, useEffect, useRef } from 'react';
import { View, Animated, Alert } from 'react-native';
import { styles } from '../themes/styles';
import { IconButton, Text } from 'react-native-paper';
import { Image } from 'expo-image';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { push, ref, set } from 'firebase/database';
import { auth, dbRealTime } from '../configs/firebaseConfig';

type Obstacle = {
    key: string;
    position: number;
    animatedValue: Animated.Value;
};

interface ScorePlayer {
    score: number;
}

export const GameScreen = () => {

    const [scorePlayer, setScorePlayer] = useState<ScorePlayer>({ score: 0 });

    const handlerSaveScore = async (score: number) => {
        const dbRef = ref(dbRealTime, 'scores/' + auth.currentUser?.uid);
        const saveScore = push(dbRef);
        try {
            await set(saveScore, { score });
        } catch (ex) {
            console.log(ex);
        }
    };

    const [carPosition, setCarPosition] = useState<number>(0);
    const [obstacles, setObstacles] = useState<Obstacle[]>([]);
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [score, setScore] = useState<number>(0);
    const lanes = [-60, 50, 145];
    const lastLaneRef = useRef<number | null>(null);
    const navigation = useNavigation();

    const moveCar = (direction: 'left' | 'right') => {
        if (gameOver) return;
        const jumpDistance = 105;
        if (direction === 'left' && carPosition > lanes[0]) {
            setCarPosition(carPosition - jumpDistance);
        } else if (direction === 'right' && carPosition < lanes[2]) {
            setCarPosition(carPosition + jumpDistance);
        }
    };

    const generateObstaclePosition = (): number => {
        let position: number;
        do {
            position = lanes[Math.floor(Math.random() * lanes.length)];
        } while (position === lastLaneRef.current);
        lastLaneRef.current = position;
        return position;
    };

    const checkCollision = (carPosition: number, obstaclePosition: number, obstacleY: number) => {
        const carTop = 300;
        const carBottom = 300;
        const carWidth = 50;
        const obstacleTop = obstacleY;
        const obstacleBottom = obstacleY + 50;
        const obstacleWidth = 50;

        const carLeft = carPosition + 100;
        const carRight = carLeft + carWidth;
        const obstacleLeft = obstaclePosition + 100;
        const obstacleRight = obstacleLeft + obstacleWidth;

        const collisionLeft = (carPosition === -105 && obstaclePosition === -60) && carBottom >= obstacleTop && carTop <= obstacleBottom;
        const collisionCenter = (carPosition === 0 && obstaclePosition === 50) && carBottom >= obstacleTop && carTop <= obstacleBottom;
        const collisionRight = (carPosition === 105 && obstaclePosition === 145) && carBottom >= obstacleTop && carTop <= obstacleBottom;

        if (collisionLeft || collisionCenter || collisionRight) {
            setGameOver(true);
            setScorePlayer({ score });
            handlerSaveScore(score);

            Alert.alert(
                'Game Over',
                '¡Has chocado!',
                [
                    {
                        text: 'Jugar nuevamente',
                        onPress: () => {
                            setGameOver(false);
                            setObstacles([]);
                            setCarPosition(0);
                            setScore(0);
                        },
                    },
                    {
                        text: 'Volver a menu',
                        onPress: () => navigation.dispatch(CommonActions.navigate({ name: 'Home' })),
                    },
                ],
                { cancelable: false }
            );
        } else {
            setScore(score + 1);
        }
    };

    useEffect(() => {
        if (gameOver) return;

        const intervalId = setInterval(() => {
            const newObstacle: Obstacle = {
                key: Math.random().toString(),
                position: generateObstaclePosition(),
                animatedValue: new Animated.Value(-50),
            };
            setObstacles((prevObstacles) => [...prevObstacles, newObstacle]);
        }, 3500);

        return () => clearInterval(intervalId);
    }, [gameOver]);

    useEffect(() => {
        if (gameOver) return;

        obstacles.forEach((obstacle) => {
            Animated.timing(obstacle.animatedValue, {
                toValue: 750,
                duration: 8000,
                useNativeDriver: true,
            }).start();
        });
    }, [obstacles, gameOver]);

    useEffect(() => {
        if (gameOver) return;

        const listeners = obstacles.map((obstacle) => {
            return obstacle.animatedValue.addListener(({ value }) => {
                checkCollision(carPosition, obstacle.position, value);
            });
        });

        return () => {
            listeners.forEach((listener, index) => {
                obstacles[index].animatedValue.removeListener(listener);
            });
        };
    }, [carPosition, obstacles, gameOver]);

    return (
        <View style={styles.container}>
            <Image
                source={require('../static/images/logo.png')}
                style={styles.localImageGame}
                resizeMode="contain"
            />
            <Text variant="displaySmall" style={styles.scoreText}>Puntuación:</Text>
            <Text style={styles.scoreNumber}>{score}</Text>
            <View style={styles.carContainer}>
                <View style={[styles.car, { left: carPosition }]} />
            </View>
            <View style={styles.controls}>
                <IconButton
                    icon="arrow-left"
                    size={80}
                    style={{ marginTop: 400, marginLeft: -45 }}
                    onPress={() => moveCar('left')}
                />
                <View style={styles.road}>
                    <View style={[styles.lane, { height: 780 }]} />
                    <View style={[styles.lane, { height: 780 }]} />
                </View>
                <IconButton
                    icon="arrow-right"
                    size={80}
                    style={{ marginTop: 400, marginRight: -45 }}
                    onPress={() => moveCar('right')}
                />
            </View>
            {obstacles.map((obstacle) => (
                <Animated.View
                    key={obstacle.key}
                    style={[
                        styles.obstacle,
                        {
                            left: obstacle.position + 150,
                            transform: [{ translateY: obstacle.animatedValue }],
                        },
                    ]}
                />
            ))}
        </View>
    );
};
