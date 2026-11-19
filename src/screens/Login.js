import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, TextInput, Image } from 'react-native';
import { auth } from '../firebase/config';

function Login(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loginError, setLoginError] = useState("");
    const navigation = props.navigation;

    useEffect(() => {
        let primeraRevision = true;

        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (primeraRevision) {
                primeraRevision = false;
                if (user) {
                    navigation.navigate('MenuNav');
                }
            }
        });
        return unsubscribe;
    }, [navigation]);

    function onSubmit() {
        if (!email) {
            return setLoginError('Completa el email');
        } else if (!password) {
            return setLoginError('Completa la contraseña');
        }

        auth.signInWithEmailAndPassword(email, password)
            .then(() => {
                setLoginError("");
                props.navigation.navigate('MenuNav');
            })
            .catch((error) => {
                console.log(error);
                if (error.message.includes('email address')) {
                    setLoginError('Email mal formateado');
                } else if (error.message.includes('password')) {
                    setLoginError('Contraseña incorrecta');
                } else if (error.message.includes('no user record')) {
                    setLoginError('No existe una cuenta con ese email');
                } else {
                    setLoginError('No se pudo iniciar sesión. Revisá el email y la contraseña');
                }
            });
    }

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Image
                    source={require('../../assets/ronda-logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.title}>¡Hola de nuevo!</Text>
                <Text style={styles.subtitle}>Pequeñas ideas, buenas conversaciones.</Text>

                <View style={styles.card}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="email-address"
                        placeholder="tu@email.com"
                        placeholderTextColor="#718997"
                        onChangeText={text => setEmail(text)}
                        value={email}
                    />

                    <View style={styles.passwordHeader}>
                        <Text style={styles.label}>Contraseña</Text>
                        <Pressable
                            style={styles.passwordToggle}
                            onPress={() => setShowPassword(!showPassword)}
                        >
                            <Text style={styles.passwordToggleText}>
                                {showPassword ? 'Ocultar' : 'Mostrar'}
                            </Text>
                        </Pressable>
                    </View>
                    <TextInput
                        style={styles.input}
                        keyboardType="default"
                        placeholder="Contraseña"
                        placeholderTextColor="#718997"
                        secureTextEntry={!showPassword}
                        onChangeText={text => setPassword(text)}
                        value={password}
                    />

                    {loginError ? <Text style={styles.error}>{loginError}</Text> : null}

                    <Pressable style={styles.button} onPress={() => onSubmit()}>
                        <Text style={styles.buttonText}>Iniciar sesión</Text>
                    </Pressable>

                    <Pressable onPress={() => props.navigation.navigate('Register')}>
                        <Text style={styles.link}>¿No tenés cuenta? Registrate</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#d9eef7',
    },
    content: {
        width: '100%',
        maxWidth: 420,
    },
    logo: {
        width: 264,
        maxWidth: '100%',
        height: 88,
        alignSelf: 'center',
        marginBottom: 12,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#174f68',
        marginBottom: 6,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 15,
        lineHeight: 22,
        color: '#4d6f80',
        marginBottom: 24,
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#a9cadb',
        borderRadius: 8,
        padding: 24,
    },
    label: {
        fontWeight: 'bold',
        fontSize: 14,
        color: '#174f68',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#f5fafc',
        borderWidth: 1,
        borderColor: '#aac6d4',
        borderRadius: 5,
        padding: 13,
        fontSize: 16,
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#0b6f91',
        borderWidth: 1,
        borderColor: '#075675',
        padding: 14,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 4,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    link: {
        color: '#0b678b',
        textAlign: 'center',
        marginTop: 16,
        fontSize: 14,
        fontWeight: 'bold',
    },
    error: {
        color: '#a32525',
        fontSize: 14,
        lineHeight: 20,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    passwordHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    passwordToggle: {
        paddingLeft: 12,
        paddingBottom: 8,
    },
    passwordToggleText: {
        color: '#0b678b',
        fontSize: 14,
        fontWeight: 'bold',
    },
})
export default Login;
