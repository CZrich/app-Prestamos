import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  Image,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import type { Session } from '@supabase/supabase-js';

import { supabase } from '../services/supabase';
import type { Loan, NewLoan } from '../types/entities';

interface LoansScreenProps {
  session: Session;
}

export function LoansScreen({ session }: LoansScreenProps) {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [persona, setPersona] = useState('');
  const [contacto, setContacto] = useState('');
  const [objeto, setObjeto] = useState('');
  const [localImage, setLocalImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLoans = async () => {
      const { data, error } = await supabase
        .from('prestamos')
        .select('*')
        .eq('owner_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) Alert.alert('No se pudieron cargar los préstamos', error.message);
      else setLoans(data ?? []);
    };

    fetchLoans();
  }, [session.user.id]);

  const selectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permisos', 'Necesitamos acceso a la galería.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });
    if (!result.canceled) setLocalImage(result.assets[0].uri);
  };

  const uploadImage = async (uri: string) => {
    const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim();
    const uploadPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET?.trim();
    if (!cloudName || !uploadPreset) throw new Error('Faltan variables de Cloudinary');

    const form = new FormData();
    if (Platform.OS === 'web') {
      const imageResponse = await fetch(uri);
      const imageBlob = await imageResponse.blob();
      form.append('file', imageBlob, 'loan.jpg');
    } else {
      form.append('file', { uri, type: 'image/jpeg', name: 'loan.jpg' } as never);
    }
    form.append('upload_preset', uploadPreset);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: form,
    });
    const result = await response.json();
    if (!response.ok || !result.secure_url) {
      throw new Error(result.error?.message ?? 'Error subiendo la imagen a Cloudinary');
    }
    return result.secure_url as string;
  };

  const addLoan = async () => {
    if (!persona.trim() || !contacto.trim() || !objeto.trim()) {
      Alert.alert('Datos incompletos', 'Completá persona, contacto y objeto.');
      return;
    }

    setLoading(true);
    try {
      const imageUrl = localImage ? await uploadImage(localImage) : null;
      const newLoan: NewLoan = {
        owner_id: session.user.id,
        persona: persona.trim(),
        contacto: contacto.trim(),
        objeto: objeto.trim(),
        fecha: new Date().toISOString(),
        imagen_url: imageUrl,
        estado: 'activo',
      };
      const { data, error } = await supabase.from('prestamos').insert(newLoan).select().single();
      if (error) throw error;

      setLoans((current) => [data, ...current]);
      setPersona('');
      setContacto('');
      setObjeto('');
      setLocalImage(null);
    } catch (error) {
      Alert.alert('No se pudo registrar', error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const markReturned = async (id: string) => {
    const { error } = await supabase
      .from('prestamos')
      .update({ estado: 'devuelto' })
      .eq('id', id)
      .eq('owner_id', session.user.id);
    if (error) Alert.alert('No se pudo actualizar', error.message);
    else setLoans((current) => current.map((loan) => loan.id === id ? { ...loan, estado: 'devuelto' } : loan));
  };

  const deleteLoan = (id: string) => {
    Alert.alert('¿Borrar préstamo?', 'Esta acción es permanente.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Borrar',
        style: 'destructive',
        onPress: async () => {
          const { error } = await supabase
            .from('prestamos')
            .delete()
            .eq('id', id)
            .eq('owner_id', session.user.id);
          if (error) Alert.alert('No se pudo borrar', error.message);
          else setLoans((current) => current.filter((loan) => loan.id !== id));
        },
      },
    ]);
  };

  const claimLoan = async (loan: Loan) => {
    const phone = loan.contacto.replace(/\D/g, '');
    const message = encodeURIComponent(
      `Hola ${loan.persona}, ¿podés devolverme ${loan.objeto}? Te lo presté el ${new Date(loan.fecha).toLocaleDateString()}.`,
    );
    const url = `whatsapp://send?phone=${phone}&text=${message}`;
    if (await Linking.canOpenURL(url)) await Linking.openURL(url);
    else Alert.alert('WhatsApp no está disponible');
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>MIS PRÉSTAMOS</Text>
          <Text numberOfLines={1} style={styles.email}>{session.user.email}</Text>
        </View>
        <Pressable onPress={() => supabase.auth.signOut()} style={styles.signOut}>
          <Text style={styles.signOutText}>Salir</Text>
        </Pressable>
      </View>

      <View style={styles.form}>
        <TextInput style={styles.input} placeholder="¿A quién?" value={persona} onChangeText={setPersona} />
        <TextInput style={styles.input} placeholder="WhatsApp" keyboardType="phone-pad" value={contacto} onChangeText={setContacto} />
        <TextInput style={styles.input} placeholder="¿Qué prestaste?" value={objeto} onChangeText={setObjeto} />
        <Pressable style={styles.imageButton} onPress={selectImage}>
          <Text style={styles.imageButtonText}>{localImage ? 'Cambiar foto' : 'Agregar foto'}</Text>
        </Pressable>
        {localImage && <Image source={{ uri: localImage }} style={styles.previewImage} />}
        {loading ? <ActivityIndicator size="large" color="#0f766e" /> : <Button title="Registrar préstamo" onPress={addLoan} color="#0f766e" />}
      </View>

      <FlatList
        data={loans}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.empty}>Todavía no registraste préstamos.</Text>}
        renderItem={({ item }) => (
          <View style={[styles.card, item.estado === 'devuelto' && styles.returnedCard]}>
            {item.imagen_url && <Image source={{ uri: item.imagen_url }} style={styles.cardImage} />}
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.objeto}</Text>
              <Text style={styles.cardSubtitle}>{item.persona} · {new Date(item.fecha).toLocaleDateString()}</Text>
              <Text style={styles.status}>{item.estado === 'devuelto' ? 'Devuelto' : 'Pendiente'}</Text>
            </View>
            <View style={styles.actions}>
              {item.estado === 'activo' && <Pressable onPress={() => markReturned(item.id)}><Text style={styles.action}>✓</Text></Pressable>}
              {item.estado === 'activo' && <Pressable onPress={() => claimLoan(item)}><Text style={styles.action}>↗</Text></Pressable>}
              <Pressable onPress={() => deleteLoan(item.id)}><Text style={[styles.action, styles.deleteAction]}>×</Text></Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingTop: 52, paddingHorizontal: 18, backgroundColor: '#f3f4ed' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  eyebrow: { color: '#0f766e', fontWeight: '800', letterSpacing: 1.5 },
  email: { color: '#66706b', maxWidth: 240, marginTop: 3 },
  signOut: { borderWidth: 1, borderColor: '#0f766e', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 },
  signOutText: { color: '#0f766e', fontWeight: '700' },
  form: { backgroundColor: '#fff', padding: 16, borderRadius: 18, marginBottom: 16, gap: 10 },
  input: { borderWidth: 1, borderColor: '#d8ddd5', padding: 12, borderRadius: 10 },
  imageButton: { alignItems: 'center', padding: 11, borderRadius: 10, backgroundColor: '#e5f2ef' },
  imageButtonText: { color: '#0f766e', fontWeight: '700' },
  previewImage: { width: '100%', height: 110, borderRadius: 10 },
  empty: { color: '#66706b', textAlign: 'center', marginTop: 30 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 14, borderRadius: 16, marginBottom: 10 },
  returnedCard: { opacity: 0.58 },
  cardImage: { width: 54, height: 54, borderRadius: 12, marginRight: 12 },
  cardContent: { flex: 1 },
  cardTitle: { color: '#172026', fontSize: 16, fontWeight: '800' },
  cardSubtitle: { color: '#66706b', marginTop: 3 },
  status: { color: '#0f766e', fontSize: 12, fontWeight: '700', marginTop: 5 },
  actions: { flexDirection: 'row', gap: 7 },
  action: { width: 30, height: 30, textAlign: 'center', lineHeight: 28, borderRadius: 8, backgroundColor: '#e5f2ef', color: '#0f766e', fontSize: 18 },
  deleteAction: { color: '#a33a2b', backgroundColor: '#f8e8e5' },
});
