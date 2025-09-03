import { Patient, Session } from './types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'fenix_clinic_v1';

interface Storage {
  patients: Patient[];
  sessions: Session[];
}

function getStorage(): Storage {
  if (typeof window === 'undefined') return { patients: [], sessions: [] };
  
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    const initial = { patients: [], sessions: [] };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
  
  return JSON.parse(data);
}

function saveStorage(data: Storage) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Pacientes
export async function getPatients(): Promise<Patient[]> {
  const { patients } = getStorage();
  return patients;
}

export async function getPatientById(id: string): Promise<Patient | null> {
  const { patients } = getStorage();
  return patients.find(p => p.id === id) ?? null;
}

export async function createPatient(patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>): Promise<Patient> {
  const storage = getStorage();
  const now = new Date().toISOString();
  
  const newPatient: Patient = {
    ...patient,
    id: uuidv4(),
    createdAt: now,
    updatedAt: now,
  };
  
  storage.patients.push(newPatient);
  saveStorage(storage);
  return newPatient;
}

export async function updatePatient(id: string, patient: Partial<Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Patient | null> {
  const storage = getStorage();
  const index = storage.patients.findIndex(p => p.id === id);
  
  if (index === -1) return null;
  
  storage.patients[index] = {
    ...storage.patients[index],
    ...patient,
    updatedAt: new Date().toISOString(),
  };
  
  saveStorage(storage);
  return storage.patients[index];
}

export async function deletePatient(id: string): Promise<boolean> {
  const storage = getStorage();
  const index = storage.patients.findIndex(p => p.id === id);
  
  if (index === -1) return false;
  
  storage.patients.splice(index, 1);
  // También eliminamos las sesiones asociadas
  storage.sessions = storage.sessions.filter(s => s.patientId !== id);
  
  saveStorage(storage);
  return true;
}

// Sesiones
export async function getSessionsByPatientId(patientId: string): Promise<Session[]> {
  const { sessions } = getStorage();
  return sessions.filter(s => s.patientId === patientId);
}

export async function createSession(session: Omit<Session, 'id' | 'createdAt' | 'updatedAt'>): Promise<Session> {
  const storage = getStorage();
  const now = new Date().toISOString();
  
  const newSession: Session = {
    ...session,
    id: uuidv4(),
    createdAt: now,
    updatedAt: now,
  };
  
  storage.sessions.push(newSession);
  saveStorage(storage);
  return newSession;
}

export async function updateSession(id: string, session: Partial<Omit<Session, 'id' | 'patientId' | 'createdAt' | 'updatedAt'>>): Promise<Session | null> {
  const storage = getStorage();
  const index = storage.sessions.findIndex(s => s.id === id);
  
  if (index === -1) return null;
  
  storage.sessions[index] = {
    ...storage.sessions[index],
    ...session,
    updatedAt: new Date().toISOString(),
  };
  
  saveStorage(storage);
  return storage.sessions[index];
}

export async function deleteSession(id: string): Promise<boolean> {
  const storage = getStorage();
  const index = storage.sessions.findIndex(s => s.id === id);
  
  if (index === -1) return false;
  
  storage.sessions.splice(index, 1);
  saveStorage(storage);
  return true;
}

// Utilidades para backup/restore
export function exportData(): string {
  const storage = getStorage();
  return JSON.stringify(storage, null, 2);
}

export function importData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString) as Storage;
    saveStorage(data);
    return true;
  } catch (e) {
    return false;
  }
}
