'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { auth, db } from '../../lib/firebase-client';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendEmailVerification } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const ADMIN_EMAIL = 'mosegaard622@gmail.com';

const syncUserToFirestore = async (user: any, provider: string) => {
  if (!db) return;
  const userRef = doc(db, 'users', user.uid);
  try {
    const userSnap = await getDoc(userRef);
    const baseData = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || '',
      provider: provider,
      lastLoginAt: serverTimestamp(),
    };
    if (userSnap.exists()) {
      // Uppdatera befintlig användare, skriv inte över createdAt
      await setDoc(userRef, baseData, { merge: true });
    } else {
      // Ny användare, sätt createdAt
      await setDoc(userRef, {
        ...baseData,
        createdAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error('Error syncing user to Firestore:', error);
  }
};

function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setStatus('error');
      setMessage('Please enter both email and password.');
      return;
    }
    if (!auth) {
      setStatus('error');
      setMessage('Firebase is not configured. Please contact support.');
      return;
    }

    setStatus('loading');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await syncUserToFirestore(user, 'email');
      setStatus('success');
      setMessage('Login successful! Redirecting...');
      const redirectPath = user.email === ADMIN_EMAIL ? '/admin/beta' : (searchParams.get('next') || '/library/prayer-forum');
      router.push(redirectPath);
    } catch (error: any) {
      setStatus('error');
      switch (error.code) {
        case 'auth/invalid-email':
          setMessage('Please enter a valid email address.');
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          setMessage('Invalid email or password.');
          break;
        default:
          setMessage(`Sign in failed: ${error.message}`);
      }
    }
  };

  const handleCreateAccount = async () => {
    if (!email || !password) {
      setStatus('error');
      setMessage('Please enter both email and password.');
      return;
    }
    if (!auth) {
      setStatus('error');
      setMessage('Firebase is not configured. Please contact support.');
      return;
    }

    setStatus('loading');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await syncUserToFirestore(user, 'email');
      // Skicka e-postverifiering efter lyckad kontoskapning
      try {
        await sendEmailVerification(userCredential.user);
        setStatus('success');
        setMessage('Account created. Please check your email and verify your address before continuing.');
      } catch (verificationError: any) {
        // Kontot skapades men verifieringsmeddelandet kunde inte skickas
        setStatus('error');
        setMessage('Account created, but we were unable to send the verification email. Please try signing in later to resend the verification email.');
      }
    } catch (error: any) {
      setStatus('error');
      switch (error.code) {
        case 'auth/invalid-email':
          setMessage('Please enter a valid email address.');
          break;
        case 'auth/weak-password':
          setMessage('Password must be at least 6 characters long.');
          break;
        case 'auth/email-already-in-use':
          setMessage('An account with this email already exists.');
          break;
        default:
          setMessage(`Account creation failed: ${error.message}`);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth) {
      setStatus('error');
      setMessage('Firebase is not configured. Please contact support.');
      return;
    }

    setStatus('loading');
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      await syncUserToFirestore(user, 'google');
      setStatus('success');
      setMessage('Login successful! Redirecting...');
      const redirectPath = user.email === ADMIN_EMAIL ? '/admin/beta' : (searchParams.get('next') || '/library/prayer-forum');
      router.push(redirectPath);
    } catch (error: any) {
      setStatus('error');
      if (error.code === 'auth/popup-closed-by-user') {
        setMessage('Google sign-in was cancelled. Please try again.');
      } else {
        setMessage(`Google sign-in failed: ${error.message}`);
      }
    }
  };

  return (
    <main style={{ maxWidth: '600px', margin: '2rem auto', padding: '0 1rem' }}>
      <h1 style={{ color: '#FFD700', fontFamily: 'sans-serif', marginBottom: '0.5rem' }}>Log in</h1>
      <p style={{ color: '#FFFFFF', fontFamily: 'sans-serif', marginBottom: '1.5rem' }}>
        Sign in with your email and password, or use Google to log in.
      </p>

      {status === 'error' && (
        <div style={{ color: '#F44336', margin: '1rem 0' }}>{message}</div>
      )}

      {status === 'success' && (
        <div style={{ color: '#4CAF50', margin: '1rem 0' }}>{message}</div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={status === 'loading'}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#1a1a1a',
            color: '#FFFFFF',
            border: '1px solid #FFD700',
            borderRadius: '4px',
            cursor: 'pointer',
            fontFamily: 'sans-serif',
            fontWeight: 'bold',
            fontSize: '1rem',
            opacity: status === 'loading' ? 0.7 : 1,
            alignSelf: 'flex-start',
          }}
        >
          Continue with Google
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.5rem 0' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#333' }} />
          <span style={{ color: '#FFFFFF', fontFamily: 'sans-serif', fontSize: '0.875rem' }}>Or sign in with email</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#333' }} />
        </div>

        <form onSubmit={handleEmailSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label htmlFor="email" style={{ color: '#FFFFFF', fontFamily: 'sans-serif' }}>
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            style={{
              padding: '0.75rem',
              borderRadius: '4px',
              border: '1px solid #333',
              backgroundColor: '#1a1a1a',
              color: '#FFFFFF',
              fontFamily: 'sans-serif',
              fontSize: '1rem',
            }}
            placeholder="you@example.com"
          />

          <label htmlFor="password" style={{ color: '#FFFFFF', fontFamily: 'sans-serif' }}>
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            style={{
              padding: '0.75rem',
              borderRadius: '4px',
              border: '1px solid #333',
              backgroundColor: '#1a1a1a',
              color: '#FFFFFF',
              fontFamily: 'sans-serif',
              fontSize: '1rem',
            }}
            placeholder="Enter your password"
          />

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              type="submit"
              disabled={status === 'loading'}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#FFD700',
                color: '#000000',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontFamily: 'sans-serif',
                fontWeight: 'bold',
                fontSize: '1rem',
                opacity: status === 'loading' ? 0.7 : 1,
              }}
            >
              {status === 'loading' ? 'Signing in...' : 'Sign in with email'}
            </button>

            <button
              type="button"
              onClick={handleCreateAccount}
              disabled={status === 'loading'}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#1a1a1a',
                color: '#FFFFFF',
                border: '1px solid #FFD700',
                borderRadius: '4px',
                cursor: 'pointer',
                fontFamily: 'sans-serif',
                fontWeight: 'bold',
                fontSize: '1rem',
                opacity: status === 'loading' ? 0.7 : 1,
              }}
            >
              {status === 'loading' ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <main style={{ maxWidth: '600px', margin: '2rem auto', padding: '0 1rem' }}>
        <h1 style={{ color: '#FFD700', fontFamily: 'sans-serif', marginBottom: '0.5rem' }}>Log in</h1>
        <div style={{ color: '#FFD700', fontFamily: 'sans-serif', margin: '1rem 0' }}>Loading login page...</div>
      </main>
    }>
      <LoginContent />
    </Suspense>
  );
}
