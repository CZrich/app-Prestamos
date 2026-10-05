export type LoanStatus = 'activo' | 'devuelto';

export interface UserProfile {
  id: string;
  email: string;
  display_name: string | null;
  created_at: string;
}

export interface Loan {
  id: string;
  owner_id: string;
  persona: string;
  contacto: string;
  objeto: string;
  fecha: string;
  imagen_url: string | null;
  estado: LoanStatus;
  created_at: string;
}

export type NewLoan = Pick<
  Loan,
  'owner_id' | 'persona' | 'contacto' | 'objeto' | 'fecha' | 'imagen_url' | 'estado'
>;
