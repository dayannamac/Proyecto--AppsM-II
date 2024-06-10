import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { styles } from '../../themes/styles';
import { Image } from 'expo-image';
import { EditProfileModal } from './components/EditProfileModal';
import firebase from 'firebase/auth';
import { auth } from '../../configs/firebaseConfig';

//Interface - usuarios data
interface FormUser {
    name: string;
}

export const HomeScreen = () => {

    //Hook useState: trabajar con la data del usuario
    const [formUser, setFormUser] = useState<FormUser>({
        name: ''
    });

    //hook ueState: trabajar con la data del usuario autenticado
    const [userAuth, setUserAuth] = useState<firebase.User | null>(null)

    //hook useEffect: capturar la data del usuario autenticado
    useEffect(() => {
        //Obtener el usuario logueado
        setUserAuth(auth.currentUser);
        setFormUser({ name: auth.currentUser?.displayName ?? '' })
    }, [])

    // Hook useState: manipular el modal
    const [showModal, setShowModal] = useState<boolean>(false);

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

                <View>
                    <Button
                        style={styles.button}
                        labelStyle={{ fontSize: 18 }}
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
            </View>
        </View>
    );
};

