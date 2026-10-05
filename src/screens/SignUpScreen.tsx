import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { getAuthErrorMessage, supabase } from '../services/supabase';

interface SignUpScreenProps {
  onBack: () => void;
  onLogin: () => void;
}

export function SignUpScreen({ onBack, onLogin }: SignUpScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; success: boolean } | null>(null);

  const signUp = async () => {
    if (!email.trim() || password.length < 6) {
      setFeedback({ message: 'Usá un email válido y una contraseña de al menos 6 caracteres.', success: false });
      return;
    }
    if (password !== confirmation) {
      setFeedback({ message: 'Las contraseñas no coinciden.', success: false });
      return;
    }

    setFeedback(null);
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
      });
      if (error) throw error;
      if (!data.session) {
        setFeedback({ message: 'Cuenta creada. Revisá tu correo para confirmar el email.', success: true });
      }
    } catch (authError) {
      setFeedback({ message: getAuthErrorMessage(authError), success: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.screen}>
      <Pressable onPress={onBack}><Text style={styles.back}>‹ Volver</Text></Pressable>
      <View style={styles.content}>
        <Text style={styles.eyebrow}>NUEVA CUENTA</Text>
        <Text style={styles.title}>Empezá a registrar tus préstamos</Text>
        <Text style={styles.subtitle}>Cada préstamo quedará protegido y asociado a tu usuario.</Text>
        <TextInput autoCapitalize="none" autoComplete="email" keyboardType="email-address" onChangeText={setEmail} placeholder="Email" style={styles.input} value={email} />
        <TextInput autoCapitalize="none" autoComplete="new-password" onChangeText={setPassword} placeholder="Contraseña (mínimo 6 caracteres)" secureTextEntry style={styles.input} value={password} />
        <TextInput autoCapitalize="none" autoComplete="new-password" onChangeText={setConfirmation} onSubmitEditing={signUp} placeholder="Repetir contraseña" secureTextEntry style={styles.input} value={confirmation} />
        {feedback && <Text style={feedback.success ? styles.success : styles.error}>{feedback.message}</Text>}
        <Pressable disabled={loading} onPress={signUp} style={[styles.button, loading && styles.disabled]}>
          {loading ? <ActivityIndicator color="#172026" /> : <Text style={styles.buttonText}>Crear mi cuenta</Text>}
        </Pressable>
        <Pressable onPress={onLogin}><Text style={styles.link}>Ya tengo una cuenta</Text></Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 24, paddingTop: 58, backgroundColor: '#fff8ed' },
  back: { color: '#8a4e17', fontSize: 16, fontWeight: '700' },
  content: { flex: 1, justifyContent: 'center', gap: 14 },
  eyebrow: { color: '#a65f1c', fontWeight: '800', letterSpacing: 1.5 },
  title: { color: '#332319', fontSize: 32, fontWeight: '800', lineHeight: 38 },
  subtitle: { color: '#756459', fontSize: 16, lineHeight: 23, marginBottom: 6 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e4d4c3', borderRadius: 12, padding: 15, fontSize: 16 },
  error: { color: '#a33a2b', lineHeight: 20 },
  success: { color: '#28735a', lineHeight: 20 },
  button: { alignItems: 'center', borderRadius: 12, padding: 16, backgroundColor: '#f0b86e', minHeight: 52 },
  disabled: { opacity: 0.65 },
  buttonText: { color: '#172026', fontSize: 16, fontWeight: '800' },
  link: { color: '#8a4e17', textAlign: 'center', fontWeight: '700', padding: 8 },
});
