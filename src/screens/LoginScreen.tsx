import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { getAuthErrorMessage, supabase } from '../services/supabase';

interface LoginScreenProps {
  onBack: () => void;
  onSignUp: () => void;
}

export function LoginScreen({ onBack, onSignUp }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = async () => {
    if (!email.trim() || !password) {
      setError('Ingresá tu email y contraseña.');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (authError) throw authError;
    } catch (authError) {
      setError(getAuthErrorMessage(authError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.screen}>
      <Pressable onPress={onBack}><Text style={styles.back}>‹ Volver</Text></Pressable>
      <View style={styles.content}>
        <Text style={styles.eyebrow}>BIENVENIDO DE NUEVO</Text>
        <Text style={styles.title}>Iniciar sesión</Text>
        <Text style={styles.subtitle}>Ingresá con los datos de tu cuenta.</Text>
        <TextInput autoCapitalize="none" autoComplete="email" keyboardType="email-address" onChangeText={setEmail} placeholder="Email" style={styles.input} value={email} />
        <TextInput autoCapitalize="none" autoComplete="current-password" onChangeText={setPassword} onSubmitEditing={signIn} placeholder="Contraseña" secureTextEntry style={styles.input} value={password} />
        {error && <Text style={styles.error}>{error}</Text>}
        <Pressable disabled={loading} onPress={signIn} style={[styles.button, loading && styles.disabled]}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Entrar</Text>}
        </Pressable>
        <Pressable onPress={onSignUp}><Text style={styles.link}>¿No tenés cuenta? Creala acá</Text></Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 24, paddingTop: 58, backgroundColor: '#f3f4ed' },
  back: { color: '#0f766e', fontSize: 16, fontWeight: '700' },
  content: { flex: 1, justifyContent: 'center', gap: 14 },
  eyebrow: { color: '#0f766e', fontWeight: '800', letterSpacing: 1.5 },
  title: { color: '#172026', fontSize: 34, fontWeight: '800' },
  subtitle: { color: '#66706b', fontSize: 16, marginBottom: 8 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#d8ddd5', borderRadius: 12, padding: 15, fontSize: 16 },
  error: { color: '#a33a2b', lineHeight: 20 },
  button: { alignItems: 'center', borderRadius: 12, padding: 16, backgroundColor: '#0f766e', minHeight: 52 },
  disabled: { opacity: 0.65 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  link: { color: '#0f766e', textAlign: 'center', fontWeight: '700', padding: 8 },
});
