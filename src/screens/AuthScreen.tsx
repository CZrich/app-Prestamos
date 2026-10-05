import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { LoginScreen } from './LoginScreen';
import { SignUpScreen } from './SignUpScreen';

type AuthView = 'welcome' | 'login' | 'signup';

export function AuthScreen() {
  const [view, setView] = useState<AuthView>('welcome');

  if (view === 'login') return <LoginScreen onBack={() => setView('welcome')} onSignUp={() => setView('signup')} />;
  if (view === 'signup') return <SignUpScreen onBack={() => setView('welcome')} onLogin={() => setView('login')} />;

  return (
    <View style={styles.screen}>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>TUPPER TRACKER</Text>
        <Text style={styles.title}>Prestá tranquilo.{`\n`}Nosotros llevamos la cuenta.</Text>
        <Text style={styles.subtitle}>Guardá objetos, contactos y devoluciones en un espacio privado.</Text>
      </View>
      <View style={styles.actions}>
        <Pressable onPress={() => setView('login')} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Iniciar sesión</Text>
        </Pressable>
        <Pressable onPress={() => setView('signup')} style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Crear una cuenta</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: 'space-between', padding: 28, paddingTop: 110, paddingBottom: 50, backgroundColor: '#153b3a' },
  hero: { gap: 18 },
  eyebrow: { color: '#9ed8cb', fontWeight: '800', letterSpacing: 2 },
  title: { color: '#fff', fontSize: 38, fontWeight: '800', lineHeight: 46 },
  subtitle: { color: '#c8dcda', fontSize: 17, lineHeight: 25, maxWidth: 320 },
  actions: { gap: 12 },
  primaryButton: { alignItems: 'center', borderRadius: 14, padding: 16, backgroundColor: '#f0b86e' },
  primaryButtonText: { color: '#172026', fontSize: 16, fontWeight: '800' },
  secondaryButton: { alignItems: 'center', borderRadius: 14, padding: 15, borderWidth: 1, borderColor: '#9ed8cb' },
  secondaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
