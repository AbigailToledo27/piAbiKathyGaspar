/*
La home del sitio deberá mostrar un listado de posteos ordenados descendentes según su fecha de creación,
es decir, primero los más nuevos.
En cada posteo se mostrará:
El nombre de usuario que lo creó o email.
Descripción del posteo
Cantidad total de likes recibidos y la posibilidad de dar like o deslikear.
Botón de comentar que al hacer click
redireccione a una pantalla donde el usuario pueda agregar comentarios al posteo.
La pantalla será accesible únicamente si el usuario está logueado.
*/

import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { db } from '../firebase/config';
import Post from '../components/Post';

export default function Home(props) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
  }, []);

  return (
    <View style={styles.container}>
      {loading ? <Text>Cargando posteos...</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Post post={item} navigation={props.navigation} />}
        ListEmptyComponent={!loading && !error ? <Text>Todavía no hay posteos.</Text> : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef2ff',
    padding: 16,
  },
  error: { color: '#b91c1c', marginBottom: 12 },
});
