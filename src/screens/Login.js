import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, TextInput } from 'react-native';
import { auth } from '../firebase/config';

function Login(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");

    function onSubmit() {
        auth.signInWithEmailAndPassword(email, password)
            .then(() => {
                setLoginError("");
            })
            .catch(() => {
                setLoginError('Credenciales incorrectas');
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
                onChangeText={ text => setPassword(text) }
                value={password} />     

            {loginError ? <Text style={styles.error}>{loginError}</Text> : null}

            <Pressable  onPress={() => onSubmit()}>
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
