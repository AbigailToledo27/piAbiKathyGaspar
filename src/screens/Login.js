import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, TextInput } from 'react-native';
import { auth } from '../firebase/config';

function Login(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");
    const navigation = props.navigation;

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                navigation.navigate('MenuNav');
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
            <Text style={styles.title}>¡Bienvenido!</Text>
            <Text style={styles.subtitle}>Iniciá sesión para continuar.</Text>

            <View style={styles.card}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="email-address"
                    placeholder="tu@email.com"
                    onChangeText={text => setEmail(text)}
                    value={email}
                />

                <Text style={styles.label}>Contraseña</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="default"
                    placeholder="Contraseña"
                    secureTextEntry={true}
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
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#eef2ff',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#172554',
        marginBottom: 4,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#475569',
        marginBottom: 24,
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#dbe2f1',
        borderRadius: 16,
        padding: 20,
    },
    label: {
        fontWeight: 'bold',
        color: '#172554',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#f8faff',
        borderWidth: 1,
        borderColor: '#cbd5e1',
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#2446a6',
        padding: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 4,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    link: {
        color: '#2446a6',
        textAlign: 'center',
        marginTop: 16,
        fontWeight: '600',
    },
    error: {
        color: '#b91c1c',
        fontWeight: 'bold',
        marginBottom: 12,
    },
})
export default Login;
