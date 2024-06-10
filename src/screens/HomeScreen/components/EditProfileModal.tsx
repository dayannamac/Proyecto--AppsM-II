import React, { useEffect, useState, useRef } from 'react';
import { Button, Divider, IconButton, Modal, Portal, Text, TextInput} from 'react-native-paper';
import { View } from 'react-native';
import { styles } from '../../../themes/styles';
import { auth } from '../../../configs/firebaseConfig';
import firebase, { updateProfile, PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { Image } from 'expo-image';

interface Props {
    showModal: boolean;
    setShowModal: Function;
}

interface FormUser {
    name: string;
    phone: string;
    photoURL: string;
}

export const EditProfileModal = ({ showModal, setShowModal }: Props) => {
    const [formUser, setFormUser] = useState<FormUser>({
        name: '',
        phone: '',
        photoURL: ''
    });

    const [userAuth, setUserAuth] = useState<firebase.User | null>(null);
    const [verificationId, setVerificationId] = useState<string | null>(null);
    const [verificationCode, setVerificationCode] = useState<string>('');
    const [isEditingPhotoURL, setIsEditingPhotoURL] = useState<boolean>(false);

    const recaptchaVerifier = useRef(null);

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            setUserAuth(user);
            setFormUser({
                name: user.displayName ?? '',
                phone: user.phoneNumber ?? '',
                photoURL: user.photoURL ?? ''
            });
            console.log(auth);            
        }
    }, []);

    const handlerSetValues = (key: string, value: string) => {
        setFormUser({ ...formUser, [key]: value });
    };

    const handlerVerifyPhoneNumber = async (phoneNumber: string) => {
        try {
            const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
            if (recaptchaVerifier.current) {
                const provider = new PhoneAuthProvider(auth);
                const verificationId = await provider.verifyPhoneNumber(formattedPhoneNumber, recaptchaVerifier.current);
                setVerificationId(verificationId);
            } else {
                console.error('reCAPTCHA verifier no está inicializado');
            }
        } catch (error) {
            console.error('Error verificando el número de teléfono: ', error);
        }
    };

    const handlerConfirmVerificationCode = async () => {
        try {
            if (verificationId) {
                const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
                const userCredential = await signInWithCredential(auth, credential);
                setUserAuth(userCredential.user);
                setShowModal(false);
            }
        } catch (error) {
            console.error('Error confirmando el código de verificación: ', error);
        }
    };

    const handlerUpdateUser = async () => {
        try {
            if (userAuth) {
                await updateProfile(userAuth, {
                    displayName: formUser.name,
                    photoURL: formUser.photoURL
                });
                if (formUser.phone !== userAuth.phoneNumber) {
                    await handlerVerifyPhoneNumber(formUser.phone);
                } else {
                    setShowModal(false);
                }
            }
        } catch (error) {
            console.error('Error actualizando el perfil del usuario: ', error);
        }
    };

    const formatPhoneNumber = (phoneNumber: string): string => {
        if (!phoneNumber.startsWith('+')) {
            return `+${phoneNumber}`;
        }
        return phoneNumber;
    };

    return (
        <Portal>
            <Modal visible={showModal} contentContainerStyle={styles.modal}>
                <FirebaseRecaptchaVerifierModal ref={recaptchaVerifier} firebaseConfig={auth.app.options} />
                <View style={styles.header}>
                    <Text variant='headlineMedium'>Editar datos del jugador</Text>
                    <View style={styles.iconEnd}>
                        <IconButton
                            icon="close-circle-outline"
                            size={28}
                            onPress={() => setShowModal(false)}
                        />
                    </View>
                </View>
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: formUser.photoURL || 'https://via.placeholder.com/150' }}
                        style={styles.profileImage}
                    />
                    {isEditingPhotoURL ? (
                        <TextInput
                            mode='outlined'
                            label='URL de la imagen'
                            value={formUser.photoURL}
                            onChangeText={(value) => handlerSetValues('photoURL', value)}
                            style={styles.imageTextInput}
                        />
                    ) : (
                        <IconButton
                            icon="pencil"
                            size={20}
                            style={styles.editIcon}
                            onPress={() => setIsEditingPhotoURL(true)}
                        />
                    )}
                </View>
                <Divider />
                <TextInput
                    mode='outlined'
                    label='Escribe tu nombre'
                    value={formUser.name}
                    onChangeText={(value) => handlerSetValues('name', value)}
                />
                <TextInput
                    mode='outlined'
                    label='Teléfono'
                    value={formUser.phone}
                    keyboardType='number-pad'
                    onChangeText={(value) => handlerSetValues('phone', value)}
                />
                {verificationId && (
                    <TextInput
                        mode='outlined'
                        label='Código de Verificación'
                        value={verificationCode}
                        keyboardType='number-pad'
                        onChangeText={(value) => setVerificationCode(value)}
                    />
                )}
                <Button
                    mode='contained'
                    style={styles.button}
                    onPress={verificationId ? handlerConfirmVerificationCode : handlerUpdateUser}
                >
                    {verificationId ? 'Confirmar Código' : 'Actualizar'}
                </Button>
            </Modal>
        </Portal>
    );
};