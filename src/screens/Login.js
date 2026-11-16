import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, TextInput } from 'react-native';
import { auth } from '../firebase/config';

function Login(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");

    function onSubmit() {
        if (!email) {
            return setLoginError('Completa el email');
        } else if (!password) {
            return setLoginError('Completa la contraseña');
        }

        auth.signInWithEmailAndPassword(email, password)
            .then(() => {
                setLoginError("");
            })
            .catch((error) => {
                if (error.code === 'auth/invalid-email') {
                    setLoginError('El email no es válido');
                } else if (error.code === 'auth/user-not-found') {
                    setLoginError('No existe una cuenta con ese email');
                } else if (error.code === 'auth/wrong-password') {
                    setLoginError('Contraseña incorrecta');
                } else if (error.code === 'auth/invalid-credential' || error.code === 'auth/invalid-login-credentials') {
                    setLoginError('Email o contraseña incorrectos');
                } else if (error.code === 'auth/user-disabled') {
                    setLoginError('Esta cuenta está deshabilitada');
                } else if (error.code === 'auth/too-many-requests') {
                    setLoginError('Demasiados intentos. Probá más tarde');
                } else {
                    setLoginError('No se pudo iniciar sesión. Intentá de nuevo');
                }
            });
    }

    return (
        <View style={styles.container}>
            <Text>Email</Text>
            <TextInput
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="email"
                onChangeText={text => setEmail(text)}
                value={email} />
            <Text>Contraseña</Text>
            <TextInput
                keyboardType="default"
                placeholder="password"
                secureTextEntry={true}
                onChangeText={text => setPassword(text)}
                value={password} />

            {loginError ? <Text style={styles.error}>{loginError}</Text> : null}

            <Pressable onPress={() => onSubmit()}>
                <Text >Login</Text>
            </Pressable>

            <Pressable onPress={() => props.navigation.navigate('Register')}>
                <Text >Ir al registro</Text>
            </Pressable>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    error: {
        color: 'red',
        fontWeight: 'bold',
    }
})

export default Login;
