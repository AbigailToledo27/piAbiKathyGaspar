import { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, FlatList, StyleSheet } from 'react-native';
import { auth, db } from '../firebase/config';

export default function Comments(props) {
  const postId = props.route.params.postId;
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const unsubscribe = db.collection('comments')
      .where('postId', '==', postId)
      .onSnapshot((docs) => {
        const comments = [];
        docs.forEach((doc) => {
          comments.push({ id: doc.id, data: doc.data() });
        });
        setComments(comments);
        setLoadError('');
        setLoading(false);
      }, () => {
        setLoadError('No se pudieron cargar los comentarios.');
        setLoading(false);
      });
    return unsubscribe;
  }, [postId]);

  function addComment() {
    if (!auth.currentUser || sending) return;
    if (!comment.trim()) {
      setSubmitError('Escribí un comentario.');
      return;
    }

    setSending(true);
    setSubmitError('');
    db.collection('comments').add({
      postId: postId,
      owner: auth.currentUser.email,
      description: comment.trim(),
      createdAt: Date.now(),
    })
      .then(() => {
        setComment('');
        setSending(false);
      })
      .catch(() => {
        setSubmitError('No se pudo guardar el comentario. Intentá de nuevo.');
        setSending(false);
      });
  }

  return (
    <View style={styles.container}>
      {loading ? <Text>Cargando comentarios...</Text> : null}
      {loadError ? <Text style={styles.error}>{loadError}</Text> : null}
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.owner}>{item.data.owner}</Text>
            <Text>{item.data.description}</Text>
          </View>
        )}
        ListEmptyComponent={!loading && !loadError ? <Text>Todavía no hay comentarios.</Text> : null}
      />
      <TextInput
        style={styles.input}
        placeholder="Escribí un comentario"
        multiline
        value={comment}
        onChangeText={setComment}
        editable={!sending}
      />
      {submitError ? <Text style={styles.error}>{submitError}</Text> : null}
      <Pressable style={styles.button} onPress={addComment} disabled={sending}>
        <Text style={styles.buttonText}>{sending ? 'Enviando...' : 'Agregar comentario'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#eef2ff' },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 12 },
  owner: { fontWeight: 'bold', marginBottom: 6 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc', padding: 12, marginVertical: 12, borderRadius: 6 },
  button: { backgroundColor: '#2446a6', padding: 12, borderRadius: 6, alignItems: 'center' },
  buttonText: { color: '#fff' },
  error: { color: '#b91c1c', marginBottom: 8 },
});
