
function Login(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");

    function onSubmit() {
        auth.signInWithEmailAndPassword(email, password)
            .then(() => {
                setLoginError("");
                props.navigation.navigate('MenuNav');
            })
            .catch(() => {
                setLoginError('Credenciales incorrectas');
            });  
    }
    useEffect(() => auth.onAuthStateChanged( (user) => {
        if (user) {
            props.navigation.navigate('MenuNav');
        }
    }),[])

    return (
        <View style={styles.container}>
            <Text>Email</Text>
            <TextInput
                keyboardType="email-address"
                placeholder="email"
                onChangeText={text => setEmail(text)}
                value={email} />
            <Text>Email</Text>
            <TextInput 
                keyboardType="default"
                placeholder="password"
                secureTextEntry={true}
                onChangeText={ text => setPassword(text) }
                value={password} />     

            {loginError ? <Text style={styles.error}>{loginError}</Text> : null}

            <Pressable  onPress={() => onSubmit()}>
                <Text >Login</Text>
            </Pressable>

            <Pressable onPress={() => props.navigation.navigate('Register')}>
                <Text >Ir al registro</Text>
            </Pressable>
  
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
        paddingHorizontal: 10,
        marginTop: 20
    },
    error: {
        color: colors.error,
        fontWeight: 'bold',
    }
})

export default Login;