import { useEffect, useState } from 'react';
import { View, Text, Pressable, FlatList, StyleSheet } from 'react-native';
import { auth, db } from '../firebase/config';
import Post from '../components/Post';

function Profile(props) {
  const [username, setUsername] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!auth.currentUser) return;

    const unsubscribe = db.collection('users')
      .where('email', '==', auth.currentUser.email)
      .onSnapshot((docs) => {
        docs.forEach((doc) => {
          setUsername(doc.data().userName);
        });
      }, () => {
        setError('No se pudieron cargar los datos del perfil.');
      });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!auth.currentUser) return;

    const unsubscribe = db.collection('posts')
      .where('owner', '==', auth.currentUser.email)
      .onSnapshot((docs) => {
        const posts = [];

        docs.forEach((doc) => {
          posts.push({ id: doc.id, data: doc.data() });
        });

        setPosts(posts);
        setLoading(false);
      }, () => {
        setError('No se pudieron cargar tus posteos.');
        setLoading(false);
      });

    return unsubscribe;
  }, []);

  function logout() {
    auth.signOut()
      .then(() => {
        props.navigation.navigate('Login');
      })
      .catch(() => {
        setError('No se pudo cerrar la sesión. Intentá de nuevo.');
      });
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.username}>{username}</Text>
        <Text style={styles.email}>{auth.currentUser ? auth.currentUser.email : ''}</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Pressable style={styles.button} onPress={logout}>
          <Text style={styles.buttonText}>Cerrar sesión</Text>
        </Pressable>
      </View>
      
      <Text style={styles.title}>Mis posteos</Text>
      {loading ? <Text style={styles.message}>Cargando tus posteos...</Text> : null}
      <FlatList
        style={styles.list}
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Post post={item} navigation={props.navigation} />}
        ListEmptyComponent={!loading && !error ? (
          <Text style={styles.message}>Todavía no publicaste posteos.</Text>
        ) : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#eef2ff' },
  card: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#dbe2f1', borderRadius: 12, padding: 20, marginBottom: 20 },
  username: { fontSize: 24, fontWeight: 'bold', color: '#172554', marginBottom: 6 },
  email: { fontSize: 15, color: '#475569' },
  button: { backgroundColor: '#2446a6', padding: 12, borderRadius: 8, marginTop: 16 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#172554', marginBottom: 12 },
  list: { flex: 1, width: '100%' },
  message: { color: '#475569', fontSize: 14, marginBottom: 12 },
  error: { color: '#b91c1c', marginTop: 12, marginBottom: 8 },
});

export default Profile;
