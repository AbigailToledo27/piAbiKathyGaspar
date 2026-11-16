import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { auth, db } from '../firebase/config';

function NewPost(props) {
    const [description, setDescription] = useState('');
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');

    function onSubmit() {
        if (!auth.currentUser || sending) return;

        if (!description.trim()) {
            setError('Escribí un texto para publicar.');
            return;
        }

        setSending(true);
        setError('');

        db.collection('posts').add({
            owner: auth.currentUser.email,
            description: description.trim(),
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
            <Text style={styles.title}>Crear un posteo</Text>
            <Text style={styles.subtitle}>Compartí algo con la comunidad.</Text>
            <View style={styles.card}>
                <Text style={styles.label}>Descripción</Text>
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
                    <Text style={styles.buttonText}>
                        {sending ? 'Publicando...' : 'Publicar posteo'}
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#eef2ff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#172554',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#475569',
        marginBottom: 24,
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
        padding: 16,
        minHeight: 180,
        fontSize: 16,
        textAlignVertical: 'top',
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#2446a6',
        padding: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    error: {
        color: '#b91c1c',
        marginBottom: 12,
    },
});

export default NewPost;
