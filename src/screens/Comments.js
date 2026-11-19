import { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, FlatList, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { auth, db } from '../firebase/config';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

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
    if (comment === "") {
      setSubmitError('Escribí un comentario.');
      return;
    }

    setSending(true);
    setSubmitError('');
    db.collection('comments').add({
      postId: postId,
      owner: auth.currentUser.email,
      description: comment,
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
      <View style={styles.content}>
        <View style={styles.header}>
          <Image
            source={require('../../assets/ronda-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.postLabel}>PUBLICACIÓN</Text>
        </View>
        <View style={styles.postCard}>
          <Text style={styles.postOwner}>{owner}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>

        <Text style={styles.title}>Comentarios</Text>
        <View style={styles.commentsArea}>
          {loadError ? (<Text style={styles.error}>{loadError}</Text>) : null}
          {!loading && !loadError && comments.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons
                name="comment-outline"
                size={28}
                color="#0b6f91"
              />
              <Text style={styles.emptyTitle}>
                Todavía no hay comentarios
              </Text>
              <Text style={styles.emptyText}>
                Podés empezar la conversación.
              </Text>
            </View>
          ) : null}
          {loading ? (
            <View style={styles.loading}>
              <ActivityIndicator size="large" color="#0b6f91" />
            </View>
          ) : (
            <FlatList
              style={styles.list}
              data={comments}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <View style={styles.commentHeader}>
                    <View style={styles.avatar}>
                      <MaterialCommunityIcons
                        name="account-outline"
                        size={20}
                        color="#0b6f91"
                      />
                    </View>
                    <Text style={styles.commentOwner}>{item.data.owner}</Text>
                  </View>
                  <Text style={styles.description}>{item.data.description}</Text>
                </View>
              )}
            />
          )}
        </View>

        <View style={styles.composer}>
          <TextInput
            style={styles.input}
            placeholder="Escribí un comentario"
            multiline={true}
            value={comment}
            onChangeText={setComment}
            editable={!sending}
          />
          {submitError ? (<Text style={styles.submitError}>{submitError}</Text>) : null}
          <Pressable style={styles.button} onPress={addComment} disabled={sending}>
            {sending ? (
              <View style={styles.sending}>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={styles.sendingText}>Enviando... </Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>Agregar comentario </Text>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#d9eef7',
    alignItems: 'center'
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
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#c6dfe9',
  },
  logo: {
    width: 120,
    height: 40,
  },
  postLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4d6f80',
  },
  postCard: {
    backgroundColor: '#f5fafc',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#c6dfe9',
  },
  postOwner: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0b678b',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#174f68',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#c6dfe9',
  },
  commentsArea: {
    flex: 1,
    width: '100%',
  },
  list: {
    flex: 1,
    width: '100%',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#c6dfe9',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#173b4d',
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#e8f5fa',
    borderWidth: 1,
    borderColor: '#bfdce8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  commentOwner: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0b678b',
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyState: {
    padding: 20,
    margin: 18,
    backgroundColor: '#f5fafc',
    borderWidth: 1,
    borderColor: '#bfdce8',
    borderRadius: 5,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#174f68',
    textAlign: 'center',
    marginTop: 10,
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#4d6f80',
    textAlign: 'center',
    marginTop: 6,
  },
  error: {
    fontSize: 14,
    lineHeight: 20,
    color: '#a32525',
    margin: 18,
  },
  composer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#c6dfe9',
  },
  input: {
    backgroundColor: '#f5fafc',
    borderWidth: 1,
    borderColor: '#aac6d4',
    padding: 12,
    minHeight: 72,
    maxHeight: 110,
    fontSize: 16,
    lineHeight: 22,
    color: '#173b4d',
    textAlignVertical: 'top',
    marginBottom: 12,
    borderRadius: 5,
  },
  button: {
    minHeight: 44,
    backgroundColor: '#0b6f91',
    borderWidth: 1,
    borderColor: '#075675',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  sending: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendingText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  submitError: {
    color: '#a32525',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
});

export default Comments;


