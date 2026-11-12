import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { auth } from '../firebase/config';

export default function Profile() {
  const [error, setError] = useState('');

  function logout() {
    auth.signOut().catch(() => {
      setError('No se pudo cerrar la sesión. Intentá de nuevo.');
    });
  }

  return (
    <View style={styles.container}>
      <Text>{auth.currentUser ? auth.currentUser.email : ''}</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Pressable style={styles.button} onPress={logout}>
        <Text style={styles.buttonText}>Cerrar sesión</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#eef2ff' },
  button: { backgroundColor: '#2446a6', padding: 12, borderRadius: 6, marginTop: 16 },
  buttonText: { color: '#fff', textAlign: 'center' },
  error: { color: '#b91c1c', marginTop: 12 },
});
