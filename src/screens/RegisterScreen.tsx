import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, Snackbar, Text, TextInput } from 'react-native-paper';
import { Image } from 'expo-image';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../configs/firebaseConfig';
import { styles } from '../themes/styles';


// Interface - formRegister
interface FormRegister {
    email: string;
    password: string;
}

// Interface - mensajes
interface MessageSnackBar {
    visible: boolean;
    message: string;
    color: string;
}

export const RegisterScreen = () => {

    // hook useState: manipulacion del formulario
    const [formRegister, setFormRegister] = useState<FormRegister>({
        email: '',
        password: ''
    });

    // hook useState: visualizar u ocultar mensaje
    const [showMessage, setShowMessage] = useState<MessageSnackBar>({
        visible: false,
        message: '',
        color: '#fff'
    });

    // hook useState: mostrar/ocultar contraseña
    const [hiddenPassword, setHiddenPassword] = useState<boolean>(true);

    // hook de navegación
    const navigation = useNavigation();

    // Función que cambie los valores de formRegister
    const handlerSetValues = (key: string, value: string) => {
        // operador spread: sacar una copia superficial de un objeto
        setFormRegister({ ...formRegister, [key]: value });
    };

    // Función que permita crear y enviar el nuevo usuario
    const handlerRegister = async () => {
        if (!formRegister.email || !formRegister.password) {
            setShowMessage({
                visible: true,
                message: 'Completa todos los campos!',
                color: '#b53333'
            });
            return;
        }
        // Código para registrar usuario
        try {
            const response = await createUserWithEmailAndPassword(
                auth,
                formRegister.email,
                formRegister.password
            );
            setShowMessage({ visible: true, message: 'Registro exitoso', color: '#146525' });
        } catch (ex) {
            console.log(ex);
            setShowMessage({ visible: true, message: 'No se registró, inténtelo más tarde', color: '#b53333' });
        }
    };

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
                <Text style={styles.textHead}>Regístrate</Text>
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
                    onPress={handlerRegister}
                >Registrar</Button>

                <Snackbar
                    visible={showMessage.visible}
                    onDismiss={() => setShowMessage({ ...showMessage, visible: false })}
                    style={{ backgroundColor: showMessage.color }}
                >
                    {showMessage.message}
                </Snackbar>
            </View>

            {/*GIF debajo del formulario */}
            <Image
                source={{ uri: 'https://i.gifer.com/4jwo.gif' }}
                style={styles.gifCarDown}
                resizeMode="contain"
            />
            <Text
                style={styles.textRedirect}
                onPress={() => navigation.dispatch(CommonActions.navigate({ name: 'Login' }))}
            >
                ¿Ya tienes una cuenta? Inicia Sesión.
            </Text>

            <Snackbar
                visible={showMessage.visible}
                onDismiss={() => setShowMessage({ ...showMessage, visible: false })}
                style={{ backgroundColor: showMessage.color }}>
                {showMessage.message}
            </Snackbar>
        </View>
    );
};