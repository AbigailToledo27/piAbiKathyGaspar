import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { auth, db } from '../firebase/config';

function NewPost(props) {
    const [description, setDescription] = useState('');
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');

    function onSubmit() {
        if (!auth.currentUser || sending) return;

        if (description === "") {
            setError('Escribí un texto para publicar.');
            return;
        }

        setSending(true);
        setError('');

        db.collection('posts').add({
            owner: auth.currentUser.email,
            description: description,
            createdAt: Date.now(),
            likes: [],
        })
            .then(() => {
                setDescription('');
                setSending(false);
                props.navigation.navigate('Inicio', { screen: 'Home' });
            })
            .catch((error) => {
                setError('No se pudo publicar el posteo. Intentá de nuevo.');
                setSending(false);
            });
    }

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Image
                        source={require('../../assets/ronda-logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <Text style={styles.title}>Nuevo post</Text>
                </View>

                <View style={styles.form}>
                    <Text style={styles.subtitle}>Compartí una idea con la comunidad.</Text>
                    <Text style={styles.label}>Tu publicación</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="default"
                        placeholder="Escribí tu posteo"
                        multiline={true}
                        value={description}
                        onChangeText={text => setDescription(text)}
                        editable={!sending}
                    />
                    {error ? <Text style={styles.error}>{error}</Text> : null}
                    <Pressable
                        style={styles.button}
                        onPress={() => onSubmit()}
                        disabled={sending}
                    >
                        {sending ? (
                            <View style={styles.sending}>
                                <ActivityIndicator size="small" color="#fff" />
                                <Text style={styles.sendingText}>Publicando...</Text>
                            </View>
                        ) : (
                            <Text style={styles.buttonText}>Publicar posteo</Text>
                        )}
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#d9eef7', 
        alignItems: 'center',
    },
    content: {
        width: '100%',
        maxWidth: 960,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#a9cadb',
        borderRadius: 8,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#c6dfe9',
    },
    logo: { 
        width: 148, 
        height: 50,
     },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#174f68',
    },
    subtitle: {
        fontSize: 14,
        lineHeight: 20,
        color: '#4d6f80',
        marginBottom: 20,
    },
    form: { padding: 20 },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#174f68',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#f5fafc',
        borderWidth: 1,
        borderColor: '#aac6d4',
        borderRadius: 5,
        padding: 14,
        minHeight: 180,
        fontSize: 16,
        lineHeight: 24,
        color: '#173b4d',
        textAlignVertical: 'top',
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#0b6f91',
        padding: 14,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#075675',
        minHeight: 48,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    sending: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center',
     },
    sendingText: { 
        color: '#fff', 
        fontSize: 16, 
        fontWeight: 'bold', 
        marginLeft: 8,
     },
    error: {
        color: '#a32525', 
        fontSize: 14, 
        lineHeight: 20, 
        marginBottom: 12,
    },
});

export default NewPost;
