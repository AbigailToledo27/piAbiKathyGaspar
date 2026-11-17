import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, TextInput } from 'react-native';
import { auth, db } from '../firebase/config';

function Register(props) {

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
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
            <Text style={styles.title}>Creá tu cuenta</Text>
            <Text style={styles.subtitle}>Sumate a la comunidad.</Text>

            <View style={styles.card}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="email-address"
                    placeholder="tu@email.com"
                    onChangeText={text => setEmail(text)}
                    value={email}
                />

                <Text style={styles.label}>Nombre de usuario</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="default"
                    placeholder="usuario"
                    onChangeText={text => setUsername(text)}
                    value={username}
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

                {registerError ? <Text style={styles.error}>{registerError}</Text> : null}

                <Pressable style={styles.button} onPress={() => onSubmit()}>
                    <Text style={styles.buttonText}>Registrarme</Text>
                </Pressable>

                <Pressable onPress={() => props.navigation.navigate('Login')}>
                    <Text style={styles.link}>Ya tengo cuenta</Text>
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

export default Register;
