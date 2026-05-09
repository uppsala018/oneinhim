'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { auth } from '../../lib/firebase-client';
import { sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

function LoginContent() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const mode = searchParams.get('mode');
  const next = searchParams.get('next') || '/beta-dashboard';

  useEffect(() => {
    if (mode === 'finish' && auth) {
      const isSignInLink = isSignInWithEmailLink(auth, window.location.href);
      if (isSignInLink) {
        setStatus('loading');
        const storedEmail = localStorage.getItem('emailForSignIn');
        if (!storedEmail) {
          setStatus('error');
          setMessage('Email address not found. Please try logging in again.');
          return;
        }
        signInWithEmailLink(auth, storedEmail, window.location.href)
          .then(() => {
            localStorage.removeItem('emailForSignIn');
            setStatus('success');
            setMessage('Login successful! Redirecting...');
            router.push(next);
          })
          .catch((error) => {
            setStatus('error');
            setMessage(`Login failed: ${error.message}`);
          });
      }
    }
  }, [mode, next, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }
    if (!auth) {
      setStatus('error');
      setMessage('Firebase is not configured. Please contact support.');
      return;
    }

    setStatus('loading');
    const actionCodeSettings = {
      url: `${window.location.origin}/login?mode=finish`,
      handleCodeInApp: true,
    };

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      localStorage.setItem('emailForSignIn', email);
      setStatus('success');
      setMessage(`Magic link sent to ${email}. Check your inbox.`);
    } catch (error: any) {
      setStatus('error');
      setMessage(`Could not send magic link: ${error.message}`);
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
        Enter your email address to receive a magic link for passwordless login.
      </p>

      {mode === 'finish' && status === 'loading' && (
        <div style={{ color: '#FFD700', margin: '1rem 0' }}>Completing login...</div>
      )}

      {status === 'success' && mode !== 'finish' && (
        <div style={{ color: '#4CAF50', margin: '1rem 0' }}>{message}</div>
      )}

      {status === 'error' && (
        <div style={{ color: '#F44336', margin: '1rem 0' }}>{message}</div>
      )}

      {mode !== 'finish' && (
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
            <span style={{ color: '#FFFFFF', fontFamily: 'sans-serif', fontSize: '0.875rem' }}>Or continue with email</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#333' }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label htmlFor="email" style={{ color: '#FFFFFF', fontFamily: 'sans-serif' }}>
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
                alignSelf: 'flex-start',
              }}
            >
              {status === 'loading' ? 'Sending...' : 'Send magic link'}
            </button>
          </form>
        </div>
      )}

      {mode === 'finish' && status === 'success' && (
        <div style={{ color: '#4CAF50', margin: '1rem 0' }}>Redirecting to {next}...</div>
      )}
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
