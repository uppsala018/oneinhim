'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { auth } from '../../lib/firebase-client';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const next = searchParams.get('next') || '/beta-dashboard';

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
      await signInWithEmailAndPassword(auth, email, password);
      setStatus('success');
      setMessage('Login successful! Redirecting...');
      router.push(next);
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
      await createUserWithEmailAndPassword(auth, email, password);
      setStatus('success');
      setMessage('Account created successfully! Redirecting...');
      router.push(next);
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
      await signInWithPopup(auth, provider);
      setStatus('success');
      setMessage('Login successful! Redirecting...');
      router.push(next);
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
