import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import firebase from 'firebase';
import { auth, db } from '../firebase/config';

export default function Post(props) {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const likes = props.post.data.likes || [];
  const user = auth.currentUser;
  const liked = user ? likes.includes(user.email) : false;

  function toggleLike() {
    if (!auth.currentUser || updating) return;

    setUpdating(true);
    setError('');
    const email = auth.currentUser.email;
    const value = liked
      ? firebase.firestore.FieldValue.arrayRemove(email)
      : firebase.firestore.FieldValue.arrayUnion(email);

    db.collection('posts').doc(props.post.id).update({ likes: value })
      .then(() => {
        setUpdating(false);
      })
      .catch(() => {
        setError('No se pudo actualizar el like. Intentá de nuevo.');
        setUpdating(false);
      });
  }

  return (
    <View style={styles.card}>
      <Text style={styles.owner}>{props.post.data.owner}</Text>
      <Text style={styles.description}>{props.post.data.description}</Text>
      <Text>{likes.length} likes</Text>
      <View style={styles.actions}>
        <Pressable style={styles.button} onPress={toggleLike} disabled={updating || !user}>
          <Text style={styles.buttonText}>{liked ? 'Quitar like' : 'Dar like'}</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => props.navigation.navigate('Comments', { postId: props.post.id })}
        >
          <Text style={styles.buttonText}>Comentar</Text>
        </Pressable>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 16 },
  owner: { fontWeight: 'bold', color: '#172554', marginBottom: 8 },
  description: { fontSize: 16, marginBottom: 12 },
  actions: { flexDirection: 'row', marginTop: 12 },
  button: { backgroundColor: '#2446a6', padding: 12, borderRadius: 6, marginRight: 12 },
  buttonText: { color: '#fff' },
  error: { color: '#b91c1c', marginTop: 8 },
});
