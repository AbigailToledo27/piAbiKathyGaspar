import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, TextInput } from 'react-native';


function Register(props) {

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [registerError, setRegisterError] = useState("");


    function onSubmit() {
        auth.createUserWithEmailAndPassword(email, password)
            .then(() => {
                return db.collection('users').add({
                    email: auth.currentUser.email,
                    userName: username,
                    createdAt: Date.now()
                });
            })
            .then(() => {
                setRegisterError("");
                props.navigation.navigate('Login');
            })
            .catch(() => {
                setRegisterError('Fallo el registro');
            });  
    } // falta firebase

    return (
        <View style={styles.container}>
            <Text>Email</Text>
            <TextInput
                keyboardType="email-address"
                placeholder="email"
                onChangeText={text => setEmail(text)}
                value={email} />
            <Text>Nombre de usuario</Text>
            <TextInput
                keyboardType="default"
                placeholder="usuario"
                onChangeText={text => setUsername(text)}
                value={username} />           
            <Text>Constraseña</Text>
            <TextInput 
                keyboardType="default"
                placeholder="password"
                secureTextEntry={true}
                onChangeText={text => setPassword(text)}
                value={password} />

            {registerError ? <Text style={styles.error}>{registerError}</Text> : null}

            <Pressable  onPress={() => onSubmit()}>
                <Text >Registrate</Text>
            </Pressable>

            <Pressable onPress={() => props.navigation.navigate('Login')}>
                <Text >Ya tengo cuenta</Text>
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

export default Register;