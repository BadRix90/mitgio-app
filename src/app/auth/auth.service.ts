// src/app/auth/auth.service.ts - Korrigierte Version
import { Injectable, inject, signal } from '@angular/core';
import { 
  Auth, 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from '@angular/fire/auth';
import { 
  Firestore, 
  doc, 
  setDoc, 
  getDoc,
  serverTimestamp 
} from '@angular/fire/firestore';
import { OrgStore } from '../org-store.service'; // Direkt importieren

// Interfaces
export interface UserProfile {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'vorstand' | 'kassenwart';
  createdAt: any;
  orgIds: string[]; // Vereine, denen der User zugeordnet ist
}

export interface OrgData {
  id?: string;
  name: string;
  type: 'sportverein' | 'foerderverein' | 'chor' | 'kulturverein' | 'ngo' | 'sonstige';
  fiscalYearStartMonth: number; // 1-12
  address?: string;
  foundedYear?: number;
  createdAt: any;
  createdBy: string; // User UID
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private fs = inject(Firestore);
  private orgStore = inject(OrgStore); // Singleton-Instanz verwenden

  // Signals für reaktive UI
  readonly currentUser = signal<User | null>(null);
  readonly userProfile = signal<UserProfile | null>(null);
  readonly isLoading = signal(true);

  constructor() {
    // Auth State Observer
    onAuthStateChanged(this.auth, async (user) => {
      this.currentUser.set(user);
      
      if (user) {
        await this.loadUserProfile(user.uid);
      } else {
        this.userProfile.set(null);
        this.orgStore.clear(); // Organisation deselektieren beim Logout
      }
      
      this.isLoading.set(false);
    });
  }

  // Login
  async login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('Login attempt for:', email); // DEBUG
      await signInWithEmailAndPassword(this.auth, email, password);
      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error); // DEBUG
      return { 
        success: false, 
        error: this.getErrorMessage(error.code) 
      };
    }
  }

  // Registrierung (User + Verein gleichzeitig)
  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserProfile['role'];
  }, orgData: Omit<OrgData, 'id' | 'createdAt' | 'createdBy'>): Promise<{ success: boolean; error?: string }> {
    try {
      // 1. Firebase Auth User erstellen
      const userCredential = await createUserWithEmailAndPassword(
        this.auth, 
        userData.email, 
        userData.password
      );
      
      const user = userCredential.user;

      // 2. Organisation erstellen
      const orgRef = doc(this.fs, 'orgs', user.uid + '_org'); // Einfache ID für Start
      await setDoc(orgRef, {
        ...orgData,
        createdAt: serverTimestamp(),
        createdBy: user.uid
      });

      // 3. User Profile erstellen
      const userProfile: UserProfile = {
        uid: user.uid,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        createdAt: serverTimestamp(),
        orgIds: [orgRef.id] // User ist automatisch dem erstellten Verein zugeordnet
      };

      await setDoc(doc(this.fs, 'users', user.uid), userProfile);

      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: this.getErrorMessage(error.code) 
      };
    }
  }

  // Logout
  async logout(): Promise<void> {
    await signOut(this.auth);
  }

  // User Profile laden
  private async loadUserProfile(uid: string): Promise<void> {
    try {
      const docRef = doc(this.fs, 'users', uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const profile = docSnap.data() as UserProfile;
        this.userProfile.set(profile);
        
        // Automatically select first organization
        if (profile.orgIds && profile.orgIds.length > 0) {
          console.log('Selecting organization:', profile.orgIds[0]); // DEBUG
          this.orgStore.select(profile.orgIds[0]); // Direkte Verwendung der Singleton-Instanz
        }
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  }

  // Error Messages auf Deutsch
  private getErrorMessage(code: string): string {
    console.error('Firebase Auth Error Code:', code); // DEBUG
    switch (code) {
      case 'auth/user-not-found':
        return 'Benutzer nicht gefunden';
      case 'auth/wrong-password':
        return 'Falsches Passwort';
      case 'auth/email-already-in-use':
        return 'E-Mail bereits registriert';
      case 'auth/weak-password':
        return 'Passwort zu schwach (mindestens 6 Zeichen)';
      case 'auth/invalid-email':
        return 'Ungültige E-Mail-Adresse';
      case 'auth/operation-not-allowed':
        return 'Email/Passwort Anmeldung ist nicht aktiviert';
      case 'auth/too-many-requests':
        return 'Zu viele Anfragen. Bitte später versuchen';
      default:
        return `Unbekannter Fehler: ${code}`;
    }
  }
}