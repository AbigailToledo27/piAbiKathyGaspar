import { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, FlatList, StyleSheet } from 'react-native';
import { auth, db } from '../firebase/config';

function Comments(props) {
  const postId = props.route.params.postId;
  const owner = props.route.params.owner;
  const description = props.route.params.description;
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
    <View style={styles.container}><View style={styles.postCard}>
      <Text style={styles.postLabel}>PUBLICACIÓN</Text>
      <Text style={styles.owner}>{owner}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
    <Text style={styles.title}>Comentarios</Text>
      {loading ? <Text>Cargando comentarios...</Text> : null}
      {loadError ? <Text style={styles.error}>{loadError}</Text> : null}
    <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.owner}>{item.data.owner}</Text>
            <Text style={styles.description}>{item.data.description}</Text>
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
  postCard: { backgroundColor: '#fff', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#c7d2fe', marginBottom: 20 },
  postLabel: { fontSize: 12, fontWeight: 'bold', color: '#64748b', marginBottom: 12 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#172554', marginBottom: 12 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#dbe2f1', marginBottom: 12 },
  owner: { fontSize: 14, fontWeight: 'bold', color: '#172554', marginBottom: 8 },
  description: { fontSize: 16, lineHeight: 24, color: '#334155' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#cbd5e1', padding: 16, minHeight: 88, fontSize: 16, textAlignVertical: 'top', marginVertical: 12, borderRadius: 12 },
  button: { backgroundColor: '#2446a6', padding: 14, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  error: { color: '#b91c1c', marginBottom: 8 },
});

export default Comments;