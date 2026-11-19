import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import firebase from 'firebase';
import { auth, db } from '../firebase/config';

function Post(props) {
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
      <View style={styles.postHeader}>
        <View style={styles.avatar}>
          <MaterialCommunityIcons name="account-outline" size={22} color="#0b6f91" />
        </View>
        <Text style={styles.owner}>{props.post.data.owner}</Text>
      </View>
      <Text style={styles.description}>{props.post.data.description}</Text>
      <Text style={styles.likes}>
        {likes.length} {likes.length === 1 ? 'like' : 'likes'}
      </Text>
      <View style={styles.actions}>
        <Pressable style={liked ? styles.likedButton : styles.button} onPress={toggleLike} disabled={updating || !user}>
          <MaterialCommunityIcons
            name={liked ? 'heart' : 'heart-outline'}
            size={18}
            color={liked ? '#fff' : '#0b678b'}
          />
          <Text style={liked ? styles.likedButtonText : styles.buttonText}>Me gusta</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => props.navigation.navigate('Comments', {
            postId: props.post.id,
            owner: props.post.data.owner,
            description: props.post.data.description,
          })}
        >
          <MaterialCommunityIcons name="comment-outline" size={18} color="#0b678b" />
          <Text style={styles.buttonText}>Comentar</Text>
        </Pressable>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#c6dfe9',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#e8f5fa',
    borderWidth: 1,
    borderColor: '#bfdce8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  owner: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0b678b',
  },
  description: {
    fontSize: 16,
    marginBottom: 12,
    lineHeight: 24,
    color: '#173b4d',
  },
  likes: {
    fontSize: 13,
    color: '#4d6f80',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 12,
    flexWrap: 'wrap',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    backgroundColor: '#f5fafc',
    borderWidth: 1,
    borderColor: '#aac6d4',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  likedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    backgroundColor: '#0b6f91',
    borderWidth: 1,
    borderColor: '#075675',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  buttonText: {
    color: '#0b678b',
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  likedButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  error: {
    color: '#a32525',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 12,
  },
});

export default Post;