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
            .catch(() => {
                console.log(error);
                setLoginError(error.message);


                if (error.message.includes('email address')) {
                    setLoginError('Email mal formateado');
                } else if (error.message.includes('password')) {
                    setLoginError('Contraseña incorrecta');
                } else if (error.message.includes('no user record')) {
                    setLoginError('No existe una cuenta con ese email');
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
