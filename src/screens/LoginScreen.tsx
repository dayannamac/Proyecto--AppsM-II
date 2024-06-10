import React, { useState } from 'react'
import { View } from 'react-native'
import { Button, Snackbar, Text, TextInput } from 'react-native-paper'
import { styles } from '../themes/styles'
import { Image } from 'expo-image'
import { CommonActions, useNavigation } from '@react-navigation/native'
import { auth } from '../configs/firebaseConfig'
import { signInWithEmailAndPassword } from 'firebase/auth'

//interface -mensajes
interface MessageSnackBar {
    visible: boolean;
    message: string;
    color: string;
}

//interfac -Formulariomlogin
interface FormLogin {
    email: string;
    password: string;
}

export const LoginScreen = () => {

    //hook useState: formulario de login
    const [formLogin, setFormLogin] = useState<FormLogin>({
        email: '',
        password: ''
    })

    //hook useState: visualizar u ocultar mensaje
    const [showMessage, setShowMessage] = useState<MessageSnackBar>({
        visible: false,
        message: '',
        color: '#fff'
    })

    //hook useState: mostrar/ocultar contraseña
    const [hiddenPassword, setHiddenPassword] = useState<boolean>(true)

    //hook de navgacion
    const navigation = useNavigation();

    //Funcion que cambie los valores de formRegister
    const handlerSetValues = (key: string, value: string) => {
        //operador spread: sacar una copia superficial de un objeto
        setFormLogin({ ...formLogin, [key]: value })
    }

    const handlerLogin = async () => {
        if (!formLogin.email || !formLogin.password) {
            setShowMessage({
                visible: true,
                message: 'Completa todos los campos!',
                color: '#b53333'
            })
            return;
        }
        try {
            const response = await signInWithEmailAndPassword(
                auth,
                formLogin.email,
                formLogin.password
            );
        } catch (ex) {
            console.log(ex)
            setShowMessage({
                visible: true,
                message: 'Usuario y/o contraseña incorrecta!',
                color: '#b53333'
            })
        }
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
                    source={require('../static/images/logo.png')}
                    style={styles.localImage}
                    resizeMode="contain"
                />

                <Text style={styles.textHead}>Iniciar Sesión</Text>

                <TextInput
                    mode='outlined'
                    label='Email'
                    placeholder='Escriba su correo'
                    style={styles.inputs}
                    onChangeText={(value) => handlerSetValues('email', value)}
                    keyboardType='email-address'
                />
                <TextInput
                    mode='outlined'
                    label='Contraseña'
                    placeholder='Escriba su contraseña'
                    secureTextEntry={hiddenPassword}
                    style={styles.inputs}
                    onChangeText={(value) => handlerSetValues('password', value)}
                    right={<TextInput.Icon icon={hiddenPassword ? "eye" : "eye-off"}
                        onPress={() => setHiddenPassword(!hiddenPassword)} />}
                />
                <Button
                    style={styles.button}
                    labelStyle={{ fontSize: 18 }}
                    mode="contained"
                    onPress={handlerLogin}
                >Iniciar</Button>

                <Snackbar
                    visible={showMessage.visible}
                    onDismiss={() => setShowMessage({ ...showMessage, visible: false })}
                    style={{ backgroundColor: showMessage.color }}
                >
                    {showMessage.message}
                </Snackbar>
            </View>

            {/*GIF debajo del formulario*/}
            <Image
                source={{ uri: 'https://i.gifer.com/4jwo.gif' }}
                style={styles.gifCarDown}
                resizeMode="contain"
            />

            <Text
                style={styles.textRedirect}
                onPress={() => navigation.dispatch(CommonActions.navigate({ name: 'Register' }))}>
                ¿No tienes una cuenta? Registrate ahora.
            </Text>

            <Snackbar
                visible={showMessage.visible}
                onDismiss={() => setShowMessage({ ...showMessage, visible: false })}
                style={{ backgroundColor: showMessage.color }}>
                {showMessage.message}
            </Snackbar>
        </View>
    );
}
