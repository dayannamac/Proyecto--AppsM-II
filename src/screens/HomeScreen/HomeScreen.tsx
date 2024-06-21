import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Button, IconButton, Text } from 'react-native-paper';
import { styles } from '../../themes/styles';
import { Image } from 'expo-image';
import { EditProfileModal } from './components/EditProfileModal';
import firebase, { signOut } from 'firebase/auth';
import { auth, dbRealTime } from '../../configs/firebaseConfig';
import { ref, onValue } from 'firebase/database';
import { CommonActions, useNavigation } from '@react-navigation/native';

//Interface - usuarios data
interface FormUser {
    name: string;
}

export const HomeScreen = () => {

    //hook navegacion
    const navigation = useNavigation();

    //Hook useState: trabajar con la data del usuario
    const [formUser, setFormUser] = useState<FormUser>({
        name: ''
    });

    //hook useState: trabajar con la data del usuario autenticado
    const [userAuth, setUserAuth] = useState<firebase.User | null>(null)

    //hook useState: almacenar el puntaje más alto
    const [highestScore, setHighestScore] = useState<number | null>(null);

    //hook useEffect: capturar la data del usuario autenticado
    useEffect(() => {
        //Obtener el usuario logueado
        setUserAuth(auth.currentUser);
        setFormUser({ name: auth.currentUser?.displayName ?? 'usuario' })
    }, [])

    //hook useEffect: obtener el puntaje más alto del usuario
    useEffect(() => {
        if (userAuth) {
            const scoresRef = ref(dbRealTime, 'scores/' + userAuth.uid);
            onValue(scoresRef, (snapshot) => {
                const scores = snapshot.val();
                if (scores) {
                    const scoresArray = Object.values(scores).map((score: any) => score.score);
                    const maxScore = Math.max(...scoresArray);
                    setHighestScore(maxScore);
                } else {
                    setHighestScore(0); 
                }
            });
        }
    }, [userAuth]);

    // Hook useState: manipular el modal
    const [showModal, setShowModal] = useState<boolean>(false);

    //funcion cerrar sesion
    const handlerSignOut = async () => {
        await signOut(auth);
        navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Login' }] }));
        setShowModal(false);
    }

    return (
        <View style={styles.root}>
            {/* Fondo con un gif */}
            <Image
                source={{ uri: 'https://i.gifer.com/U8mq.gif' }}
                style={styles.gif}
                resizeMode="cover"
            />

            <View style={styles.content}>
                <Image
                    source={require('../../static/images/logo.png')}
                    style={styles.localImage}
                    resizeMode="contain"
                />

                <Text style={styles.textHead}>Hola, {userAuth?.displayName}</Text>

                {highestScore !== null && (
                    <View>
                        <Text variant="headlineMedium" style={styles.highScoreText}>Tu puntuación más alta es: </Text>
                        <Text style={styles.highScoreNumber}>{highestScore}</Text>
                    </View>
                )}


                <View>
                    <Button
                        style={styles.playButton}
                        labelStyle={styles.playButtonText}
                        mode="contained"
                        onPress={() => navigation.dispatch(CommonActions.navigate('Game'))}
                    >
                        Jugar
                    </Button>

                    <Button
                        style={styles.button}
                        labelStyle={styles.buttonText}
                        mode="contained"
                        onPress={() => setShowModal(true)}
                    >
                        Edit profile
                    </Button>

                    <EditProfileModal
                        showModal={showModal}
                        setShowModal={setShowModal}
                    />
                </View>

                {/*GIF debajo del formulario*/}
                <Image
                    source={{ uri: 'https://i.gifer.com/4jwo.gif' }}
                    style={styles.gifCarDown}
                    resizeMode="contain"
                />

                <View style={styles.iconSignOut}>
                    <IconButton
                        icon="logout"
                        size={30}
                        style={{ backgroundColor: '#ff3131' }}
                        onPress={handlerSignOut}
                    />
                </View>

            </View>
        </View>
    );
};

