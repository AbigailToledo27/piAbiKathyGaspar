import { useEffect, useState } from 'react';
import { View, Text, Pressable, FlatList, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { auth, db } from '../firebase/config';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Post from '../components/Post';

function Profile(props) {
  const [username, setUsername] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingUser, setLoadingUser] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!auth.currentUser) return;

    const unsubscribe = db.collection('users')
      .where('email', '==', auth.currentUser.email)
      .onSnapshot((docs) => {
        docs.forEach((doc) => {
          setUsername(doc.data().userName);
        });
        setLoadingUser(false);
      }, () => {
        setError('No se pudieron cargar los datos del perfil.');
        setLoadingUser(false);
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
      <View style={styles.content}>
        <View style={styles.header}>
          <Image
            source={require('../../assets/ronda-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.pageTitle}>Mi perfil</Text>
        </View>
        <View style={styles.profileCard}>
          <View style={styles.profileInfo}>
            <View style={styles.avatar}>
              <MaterialCommunityIcons name="account-outline" size={30} color="#0b6f91" />
            </View>
            <View style={styles.userInfo}>
              {loadingUser ? (
                <View style={styles.usernameLoading}>
                  <ActivityIndicator size="small" color="#0b6f91" />
                </View>
              ) : (
                <Text style={styles.username}>
                  {username ? username : 'Mi perfil'}
                </Text>
              )}
              <Text style={styles.email}>{auth.currentUser ? auth.currentUser.email : ''}</Text>
            </View>
          </View>
          <Pressable style={styles.button} onPress={logout}>
            <Text style={styles.buttonText}>Cerrar sesión </Text>
          </Pressable>
        </View>

        <Text style={styles.title}>Mis publicaciones</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {!loading && !error && posts.length === 0 ? (
          <Text style={styles.message}>
            Todavía no publicaste posteos.
          </Text>
        ) : null}
        {loading ? (<View style={styles.loading}>
          <ActivityIndicator size="large" color="#0b6f91" />
        </View>
        ) : (
          <FlatList
            style={styles.list}
            data={posts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <Post post={item} navigation={props.navigation} />}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#d9eef7', alignItems: 'center' },
  content: {
    flex: 1,
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
  logo: { width: 148, height: 50 },
  pageTitle: { fontSize: 20, fontWeight: 'bold', color: '#174f68' },
  profileCard: { padding: 18, borderBottomWidth: 1, borderBottomColor: '#c6dfe9' },
  profileInfo: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#e8f5fa',
    borderWidth: 1,
    borderColor: '#bfdce8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  userInfo: { flex: 1 },
  username: { fontSize: 24, fontWeight: 'bold', color: '#174f68', marginBottom: 6 },
  email: { fontSize: 14, lineHeight: 20, color: '#4d6f80' },
  button: {
    alignSelf: 'flex-start',
    minHeight: 44,
    backgroundColor: '#f5fafc',
    borderWidth: 1,
    borderColor: '#aac6d4',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 14,
    justifyContent: 'center',
  },
  buttonText: { color: '#0b678b', fontSize: 14, fontWeight: 'bold' },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#174f68',
    backgroundColor: '#f5fafc',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#c6dfe9',
  },
  usernameLoading: {
    minHeight: 29,
    marginBottom: 6,
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  list: { flex: 1, width: '100%' },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  message: { color: '#4d6f80', fontSize: 14, lineHeight: 20, margin: 18 },
  error: { fontSize: 14, lineHeight: 20, color: '#a32525', margin: 18 },
});

export default Profile;
