import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { HomeScreen } from '../screens/HomeScreen/HomeScreen';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { styles } from '../themes/styles';
import { auth } from '../configs/firebaseConfig';

const Stack = createStackNavigator();

//Interfac - Rutas
interface Routes {
    name: string;
    screen: () => JSX.Element; //elemento JSX
}

//Arreglo que contenga las rutas si el usuario no esta autenticado
const routesNoAuth: Routes[] = [
    { name: 'Login', screen: LoginScreen },
    { name: 'Register', screen: RegisterScreen }
]

//Arreglo que contenga las rutas si el usuario esta autenticado
const routesAuth: Routes[] = [
    { name: 'Home', screen: HomeScreen }
]

export const StackNavigator = () => {

    //Hook useState: 
    const [isAuth, setIsAuth] = useState<boolean>(false);

    //Hook useState:
    const [isLoading, setIsLoading] = useState<boolean>(false)

    //Hook use effect: validar y obtner la data del usuario autenticado
    useEffect(() => {
        setIsLoading(true);
        onAuthStateChanged(auth, (user) => {
            //si existe un usuario autenticado 
            if (user) {
                setIsAuth(true);
            }
            setIsLoading(false);
        });
    }, [])

    return (
        <>
            {
                isLoading ? (
                    <View style={styles.root}>
                        <ActivityIndicator size={35} />
                    </View >
                ) : (
                    <Stack.Navigator>
                        {
                            !isAuth ?
                                routesNoAuth.map((item, index) => (
                                    <Stack.Screen key={index} name={item.name} options={{ headerShown: false }} component={item.screen} />
                                ))
                                :
                                routesAuth.map((item, index) => (
                                    <Stack.Screen key={index} name={item.name} options={{ headerShown: false }} component={item.screen} />
                                ))
                        }
                    </Stack.Navigator>
                )}
        </>
    );

}