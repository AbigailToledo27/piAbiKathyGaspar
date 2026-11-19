import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, ActivityIndicator, Pressable } from 'react-native';
import { db } from '../firebase/config';
import Post from '../components/Post';

function Home(props) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refrescar, setRefrescar] = useState(0);

  useEffect(() => {
    const unsubscribe = db.collection('posts')
      .orderBy('createdAt', 'desc')
      .onSnapshot((docs) => {
        const posts = [];
        docs.forEach((doc) => {
          posts.push({ id: doc.id, data: doc.data() });
        });
        setPosts(posts);
        setError('');
        setLoading(false);
      }, () => {
        setError('No se pudieron cargar los posteos.');
        setLoading(false);
      });
    return unsubscribe;
  }, [refrescar]);

  function refrescarPost() {
    if (loading) return;
    setLoading(true);
    setError('');
    setRefrescar(refrescar + 1);
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
          <Pressable
            style={styles.homeButton}
            onPress={refrescarPost}
          >
            <Text style={styles.title}>Inicio</Text>
          </Pressable>
        </View>
        <Text style={styles.subtitle}>Pequeñas ideas, buenas conversaciones. </Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}
        {!loading && !error && posts.length === 0 ? (
          <Text style={styles.message}>
            Todavía no hay posteos. ¡Empezá la ronda! 
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
  container: {
    flex: 1,
    backgroundColor: '#d9eef7',
    padding: 16,
    alignItems: 'center',
  },
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
    fontSize: 13,
    lineHeight: 20,
    color: '#4d6f80',
    backgroundColor: '#f5fafc',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#c6dfe9',
  },
  list: {
    flex: 1,
    width: '100%',
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    color: '#4d6f80',
    margin: 18,
  },
  error: {
    fontSize: 14,
    lineHeight: 20,
    color: '#a32525',
    margin: 18,
  },
  homeButton: {
    minHeight: 44,
    backgroundColor: '#f5fafc',
    borderWidth: 1,
    borderColor: '#aac6d4',
    borderRadius: 5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Home;