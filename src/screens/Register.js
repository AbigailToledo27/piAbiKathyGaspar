import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, TextInput, Image } from 'react-native';
import { auth, db } from '../firebase/config';

function Register(props) {

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [registerError, setRegisterError] = useState("");


    function onSubmit() {
        if (!email) {
            return setRegisterError('Completa el email');
        } else if (!username) {
            return setRegisterError('Completa el username');
        } else if (!password) {
            return setRegisterError('Completa la contraseña');
        }
        auth.createUserWithEmailAndPassword(email, password)
            .then((response) => {
                return db.collection('users').add({
                    email: response.user.email,
                    userName: username,
                    createdAt: Date.now()
                });
            })
            .then(() => {
                return auth.signOut();
            })
            .then(() => {
                setRegisterError("");
                props.navigation.navigate('Login')
            })

            .catch((error) => {
                console.log(error);

                if (error.message.includes('already in use')) {
                    setRegisterError('Ese email ya está registrado');
                } else if (error.message.includes('email address')) {
                    setRegisterError('Email mal formateado');
                } else if (error.message.includes('6 characters')) {
                    setRegisterError('La contraseña debe tener al menos 6 caracteres');
                } else {
                    setRegisterError('No se pudo completar el registro. Intentá de nuevo');
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
                <Text style={styles.title}>Creá tu cuenta</Text>
                <Text style={styles.subtitle}>Sumate a la conversación.</Text>

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

                    <Text style={styles.label}>Nombre de usuario</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="default"
                        placeholder="Elegí tu nombre de usuario"
                        placeholderTextColor="#718997"
                        onChangeText={text => setUsername(text)}
                        value={username}
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
                        placeholder="Creá tu contraseña"
                        placeholderTextColor="#718997"
                        secureTextEntry={!showPassword}
                        onChangeText={text => setPassword(text)}
                        value={password}
                    />

                    {registerError ? <Text style={styles.error}>{registerError}</Text> : null}

                    <Pressable style={styles.button} onPress={() => onSubmit()}>
                        <Text style={styles.buttonText}>Registrarme</Text>
                    </Pressable>

                    <Pressable onPress={() => props.navigation.navigate('Login')}>
                        <Text style={styles.link}>¿Ya tenés cuenta? Iniciá sesión</Text>
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
        color: '#172554',
        marginBottom: 4,
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

export default Register;
