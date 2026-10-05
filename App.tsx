import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, Linking, Alert, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { createClient } from '@supabase/supabase-js';

// Inicializar Supabase
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Prestamo {
  id?: string;
  persona: string;
  contacto: string;
  objeto: string;
  fecha: string;
  imagenUrl?: string;
  estado: 'activo' | 'devuelto'; // Nuevo campo de estado
}

export default function App() {
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);

  // Estados del formulario
  const [persona, setPersona] = useState<string>('');
  const [contacto, setContacto] = useState<string>('');
  const [objeto, setObjeto] = useState<string>('');
  const [imagenLocal, setImagenLocal] = useState<string | null>(null);
  const [cargando, setCargando] = useState<boolean>(false);

  // 0. Lógica: Cargar datos iniciales
  React.useEffect(() => {
    const fetchPrestamos = async () => {
      const { data, error } = await supabase
        .from('prestamos')
        .select('*')
        .order('fecha', { ascending: false });
      
      if (!error && data) {
        setPrestamos(data);
      }
    };
    
    fetchPrestamos();
  }, []);

  const seleccionarImagen = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permisos', 'Necesitamos acceso a la galería.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImagenLocal(result.assets[0].uri);
    }
  };

  const subirImagenACloudinary = async (uri: string): Promise<string> => {
    const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) throw new Error("Faltan variables de Cloudinary");

    const data = new FormData();
    data.append('file', { uri, type: 'image/jpeg', name: 'upload.jpg' } as any);
    data.append('upload_preset', uploadPreset);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: data,
    });

    const result = await response.json();
    if (result.secure_url) return result.secure_url;
    throw new Error("Error subiendo imagen a Cloudinary");
  };

  // --- OPERACIONES SUPABASE (CRUD COMPLETO) ---

  // CREATE
  const handleAgregar = async () => {
    if (!persona || !contacto || !objeto) {
      Alert.alert('Error', 'Completá los textos.');
      return;
    }
    setCargando(true);
    try {
      let finalImageUrl = undefined;
      if (imagenLocal) finalImageUrl = await subirImagenACloudinary(imagenLocal);

      const nuevoRegistro: Prestamo = {
        persona: persona.trim(),
        contacto: contacto.trim(),
        objeto: objeto.trim(),
        fecha: new Date().toLocaleDateString(),
        imagenUrl: finalImageUrl,
        estado: 'activo'
      };

      const { data, error } = await supabase.from('prestamos').insert([nuevoRegistro]).select().single();
      if (error) throw error;
      
      setPrestamos([data, ...prestamos]);
      setPersona(''); setContacto(''); setObjeto(''); setImagenLocal(null);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setCargando(false);
    }
  };

  // UPDATE (Marcar devuelto)
  const handleMarcarDevuelto = async (id: string) => {
    try {
      const { error } = await supabase.from('prestamos').update({ estado: 'devuelto' }).eq('id', id);
      if (error) throw error;

      setPrestamos(prev => prev.map(p => p.id === id ? { ...p, estado: 'devuelto' } : p));
    } catch (error: any) {
      Alert.alert('Error actualizando', error.message);
    }
  };

  // DELETE (Cancelar / Borrar)
  const handleBorrar = async (id: string) => {
    Alert.alert('¿Estás seguro?', 'Vas a borrar este préstamo permanentemente.', [
      { text: 'Cancelar', style: 'cancel' },
      { 
        text: 'Borrar', 
        style: 'destructive',
        onPress: async () => {
          try {
            const { error } = await supabase.from('prestamos').delete().eq('id', id);
            if (error) throw error;
            setPrestamos(prev => prev.filter(p => p.id !== id));
          } catch (error: any) {
            Alert.alert('Error borrando', error.message);
          }
        }
      }
    ]);
  };

  // --- FIN OPERACIONES ---

  const handleReclamar = (personaReclamo: string, contactoReclamo: string, objetoReclamo: string, fechaReclamo: string) => {
    const numeroLimpio = contactoReclamo.replace(/\D/g, '');
    const url = `whatsapp://send?phone=${numeroLimpio}&text=Che ${personaReclamo}, devolveme el ${objetoReclamo} que te presté el ${fechaReclamo}.`;
    Linking.canOpenURL(url).then(sup => sup ? Linking.openURL(url) : Alert.alert('Error', 'Sin WhatsApp'));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Gestor de Tuppers 🍱</Text>

      <View style={styles.form}>
        <TextInput style={styles.input} placeholder="¿A quién?" value={persona} onChangeText={setPersona} />
        <TextInput style={styles.input} placeholder="WhatsApp (ej: 549...)" keyboardType="phone-pad" value={contacto} onChangeText={setContacto} />
        <TextInput style={styles.input} placeholder="¿Qué prestaste?" value={objeto} onChangeText={setObjeto} />
        <TouchableOpacity style={styles.imageButton} onPress={seleccionarImagen}>
          <Text style={styles.imageButtonText}>{imagenLocal ? '📸 Cambiar Foto' : '📸 Foto del Objeto'}</Text>
        </TouchableOpacity>
        {imagenLocal && <Image source={{ uri: imagenLocal }} style={styles.previewImage} />}
        {cargando ? <ActivityIndicator size="large" color="#007BFF" /> : <Button title="Registrar" onPress={handleAgregar} />}
      </View>

      <FlatList
        data={prestamos}
        keyExtractor={item => item.id!}
        renderItem={({ item }) => (
          <View style={[styles.card, item.estado === 'devuelto' && styles.cardDevuelto]}>
            {item.imagenUrl && <Image source={{ uri: item.imagenUrl }} style={styles.cardImage} />}
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.objeto} {item.estado === 'devuelto' ? '✅' : '⏳'}</Text>
              <Text style={styles.cardSubtitle}>{item.persona} - {item.fecha}</Text>
              <Text style={styles.cardSubtitle}>📞 {item.contacto}</Text>
            </View>
            
            <View style={styles.actions}>
              {item.estado === 'activo' && (
                <>
                  <TouchableOpacity onPress={() => handleMarcarDevuelto(item.id!)} style={styles.btnAction}>
                    <Text>✅</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleReclamar(item.persona, item.contacto, item.objeto, item.fecha)} style={styles.btnAction}>
                    <Text>💬</Text>
                  </TouchableOpacity>
                </>
              )}
              <TouchableOpacity onPress={() => handleBorrar(item.id!)} style={styles.btnAction}>
                <Text>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingTop: 50, paddingHorizontal: 20 },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  form: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 15 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 4 },
  imageButton: { backgroundColor: '#e9ecef', padding: 10, borderRadius: 4, alignItems: 'center', marginBottom: 10 },
  imageButtonText: { color: '#495057', fontWeight: 'bold' },
  previewImage: { width: '100%', height: 100, borderRadius: 8, marginBottom: 10 },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10, flexDirection: 'row', alignItems: 'center' },
  cardDevuelto: { opacity: 0.6, backgroundColor: '#e8f5e9' },
  cardImage: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold' },
  cardSubtitle: { fontSize: 12, color: '#666' },
  actions: { flexDirection: 'row' },
  btnAction: { padding: 8, marginLeft: 5, backgroundColor: '#f1f3f5', borderRadius: 4 }
});
