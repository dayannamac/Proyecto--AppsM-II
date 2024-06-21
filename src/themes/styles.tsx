import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    root: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: '5%',
    },
    gif: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    content: {
        width: '100%',
        marginTop: 70,
        alignItems: 'center',
    },
    textHead: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 16,
        color: 'white'
    },
    inputs: {
        width: '100%',
        marginBottom: 16,
        marginTop: 25,
    },
    button: {
        width: '100%',
        marginBottom: 16,
        marginVertical: 28,
        backgroundColor: '#ff3131',
        cursor: 'auto'
    },
    textRedirect: {
        position: 'absolute',
        bottom: 20,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ff3131',
    },
    gifCarDown: {
        width: '100%',
        height: 250,
    },
    localImage: {
        width: '100%',
        height: 200,
        marginBottom: 60,
    },
    iconEnd: {
        alignItems: 'flex-end',
        flex: 1
    },
    modal: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        marginHorizontal: 20,
        borderRadius: 10,
        backgroundColor: '#fff',
        gap: 10
    },
    header: {
        flexDirection: 'row',
        gap: 15,
        alignItems: 'center'
    },
    imageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginRight: 10,
    },
    imageTextInput: {
        flex: 1,
        marginLeft: 10,
    },
    editIcon: {
        position: 'absolute',
        right: 0,
    },
    playButton: {
        backgroundColor: '#ff3131'
    },
    playButtonText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white'
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    iconSignOut: {
        position: 'absolute',
        top: 800,
        right: 15,
    },
    container: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },
    carContainer: {
        position: 'absolute',
        bottom: 20,
        width: '100%',
        alignItems: 'center',
    },
    car: {
        width: 70,
        height: 100,
        backgroundColor: '#ff3131',
        borderRadius: 25,
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '80%',
        marginTop: 20,
    },
    road: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 70,
        height: 100,
        flex: 1,
        alignItems: 'center',
    },
    lane: {
        width: 3,
        backgroundColor: 'white',
        height: '100%',
        marginTop: 380
    },
    localImageGame: {
        width: '100%',
        height: 200,
        marginBottom: 60,
        marginTop: 70,
    },
    obstacle: {
        position: 'absolute',
        width: 50,
        height: 50,
        backgroundColor: '#fff',
        top: 500,
    },
    scoreText: {
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
        color:'#fff'
    },
    scoreNumber: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
        color:'#fff'
    },
    highScoreText: {
        fontSize: 25,
        color: '#fff',
        marginVertical: 10,
        textAlign: 'center',
    },
    highScoreNumber: {
        fontSize: 25,
        color: '#fff',
        marginVertical: 10,
        textAlign: 'center',
        fontWeight:'bold',
        marginBottom:25
    }
})