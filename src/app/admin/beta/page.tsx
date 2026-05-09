'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '../../../lib/firebase-client';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import Link from 'next/link';

type UserDoc = {
  uid: string;
  email: string;
  displayName: string;
  provider: string;
  createdAt: any;
  lastLoginAt: any;
};

type BetaTesterDoc = {
  name: string;
  email: string;
  country: string;
  interestedGooglePlay: boolean;
  createdAt: any;
};

type FeedbackDoc = {
  id: string;
  type: 'bug' | 'idea' | 'other';
  title: string;
  description: string;
  pageUrl: string;
  status: 'new' | 'reviewed' | 'planned' | 'fixed' | 'closed';
  userEmail: string;
  createdAt: any;
};

const ADMIN_EMAIL = 'mosegaard622@gmail.com';
const FEEDBACK_STATUSES = ['new', 'reviewed', 'planned', 'fixed', 'closed'] as const;

export default function AdminBetaPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState<UserDoc[]>([]);
  const [betaTesters, setBetaTesters] = useState<BetaTesterDoc[]>([]);
  const [feedback, setFeedback] = useState<FeedbackDoc[]>([]);
  const [totals, setTotals] = useState({
    users: 0,
    betaTesters: 0,
    feedback: 0,
    bugs: 0,
    ideas: 0,
    googlePlayInterested: 0,
  });
  const [googlePlayEmails, setGooglePlayEmails] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAdmin(user?.email === ADMIN_EMAIL);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!currentUser || !isAdmin || !db) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const usersSnap = await getDocs(collection(db, 'users'));
        const usersData = usersSnap.docs.map(doc => ({ ...doc.data() } as UserDoc));
        setUsers(usersData);

        const betaTestersSnap = await getDocs(collection(db, 'beta_testers'));
        const betaTestersData = betaTestersSnap.docs.map(doc => ({ ...doc.data() } as BetaTesterDoc));
        setBetaTesters(betaTestersData);

        const feedbackSnap = await getDocs(collection(db, 'beta_feedback'));
        const feedbackData = feedbackSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as FeedbackDoc));
        setFeedback(feedbackData);

        const bugs = feedbackData.filter(f => f.type === 'bug').length;
        const ideas = feedbackData.filter(f => f.type === 'idea').length;
        const googlePlayInterested = betaTestersData.filter(t => t.interestedGooglePlay).length;
        const googlePlayEmailsList = betaTestersData.filter(t => t.interestedGooglePlay).map(t => t.email);

        setTotals({
          users: usersData.length,
          betaTesters: betaTestersData.length,
          feedback: feedbackData.length,
          bugs,
          ideas,
          googlePlayInterested,
        });
        setGooglePlayEmails(googlePlayEmailsList);
      } catch (err: any) {
        setError(`Failed to load data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser, isAdmin]);

  const handleUpdateFeedbackStatus = async (feedbackId: string, newStatus: string) => {
    if (!db) return;
    try {
      await updateDoc(doc(db, 'beta_feedback', feedbackId), { status: newStatus });
      setFeedback(prev => prev.map(f => 
        f.id === feedbackId ? { ...f, status: newStatus as FeedbackDoc['status'] } : f
      ));
    } catch (err: any) {
      setError(`Failed to update status: ${err.message}`);
    }
  };

  const copyGooglePlayEmails = async () => {
    const text = googlePlayEmails.join('\n');
    try {
      await navigator.clipboard.writeText(text);
      alert('Emails copied to clipboard!');
    } catch (err) {
      setError('Failed to copy emails to clipboard.');
    }
  };

  if (loading) {
    return (
      <main style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem', color: '#FFFFFF' }}>
        <h1 style={{ color: '#FFD700', fontFamily: 'sans-serif' }}>Loading admin panel...</h1>
      </main>
    );
  }

  if (!currentUser) {
    return (
      <main style={{ maxWidth: '600px', margin: '2rem auto', padding: '0 1rem', color: '#FFFFFF', fontFamily: 'sans-serif' }}>
        <h1 style={{ color: '#FFD700', marginBottom: '1rem' }}>Admin Access Required</h1>
        <p style={{ margin: '1rem 0' }}>Please log in to access this page.</p>
        <Link
          href="/login?next=/admin/beta"
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#FFD700',
            color: '#000000',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontFamily: 'sans-serif',
            fontWeight: 'bold',
            textDecoration: 'none',
            display: 'inline-block',
          }}
        >
          Log in
        </Link>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main style={{ maxWidth: '600px', margin: '2rem auto', padding: '0 1rem', color: '#FFFFFF', fontFamily: 'sans-serif' }}>
        <h1 style={{ color: '#F44336', marginBottom: '1rem' }}>Access Denied</h1>
        <p>You do not have permission to view this page.</p>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem', color: '#FFFFFF', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#FFD700', marginBottom: '1.5rem' }}>Beta Admin Panel</h1>

      {error && (
        <div style={{ color: '#F44336', margin: '1rem 0', padding: '1rem', border: '1px solid #F44336', borderRadius: '4px' }}>
          {error}
        </div>
      )}

      <section style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: '#1a1a1a', borderRadius: '8px', border: '1px solid #333' }}>
        <h2 style={{ color: '#FFD700', marginBottom: '1rem' }}>Overview</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: '#0a0a0a', borderRadius: '4px' }}>
            <div style={{ fontSize: '0.875rem', color: '#AAAAAA' }}>Total Regular Users</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{totals.users}</div>
          </div>
          <div style={{ padding: '1rem', backgroundColor: '#0a0a0a', borderRadius: '4px' }}>
            <div style={{ fontSize: '0.875rem', color: '#AAAAAA' }}>Total Beta Testers</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{totals.betaTesters}</div>
          </div>
          <div style={{ padding: '1rem', backgroundColor: '#0a0a0a', borderRadius: '4px' }}>
            <div style={{ fontSize: '0.875rem', color: '#AAAAAA' }}>Total Feedback</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{totals.feedback}</div>
          </div>
          <div style={{ padding: '1rem', backgroundColor: '#0a0a0a', borderRadius: '4px' }}>
            <div style={{ fontSize: '0.875rem', color: '#AAAAAA' }}>Total Bugs</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{totals.bugs}</div>
          </div>
          <div style={{ padding: '1rem', backgroundColor: '#0a0a0a', borderRadius: '4px' }}>
            <div style={{ fontSize: '0.875rem', color: '#AAAAAA' }}>Total Ideas</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{totals.ideas}</div>
          </div>
          <div style={{ padding: '1rem', backgroundColor: '#0a0a0a', borderRadius: '4px' }}>
            <div style={{ fontSize: '0.875rem', color: '#AAAAAA' }}>Google Play Interested</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{totals.googlePlayInterested}</div>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: '#1a1a1a', borderRadius: '8px', border: '1px solid #333' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ color: '#FFD700' }}>Google Play Interested Emails</h2>
          <button
            onClick={copyGooglePlayEmails}
            disabled={googlePlayEmails.length === 0}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#FFD700',
              color: '#000000',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              opacity: googlePlayEmails.length === 0 ? 0.7 : 1,
            }}
          >
            Copy All Emails
          </button>
        </div>
        {googlePlayEmails.length === 0 ? (
          <p style={{ color: '#AAAAAA' }}>No users interested in Google Play beta.</p>
        ) : (
          <div style={{ maxHeight: '200px', overflowY: 'auto', padding: '1rem', backgroundColor: '#0a0a0a', borderRadius: '4px' }}>
            {googlePlayEmails.map((email, index) => (
              <div key={index} style={{ padding: '0.25rem 0', borderBottom: '1px solid #333' }}>{email}</div>
            ))}
          </div>
        )}
      </section>

      <section style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: '#1a1a1a', borderRadius: '8px', border: '1px solid #333' }}>
        <h2 style={{ color: '#FFD700', marginBottom: '1rem' }}>Regular Users</h2>
        {users.length === 0 ? (
          <p style={{ color: '#AAAAAA' }}>No regular users found.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #FFD700' }}>
                  <th style={{ padding: '0.75rem', textAlign: 'left', color: '#FFD700' }}>Display Name</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', color: '#FFD700' }}>Email</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', color: '#FFD700' }}>Provider</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', color: '#FFD700' }}>Created At</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', color: '#FFD700' }}>Last Login</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.uid} style={{ borderBottom: '1px solid #333' }}>
                    <td style={{ padding: '0.75rem' }}>{user.displayName || 'N/A'}</td>
                    <td style={{ padding: '0.75rem' }}>{user.email}</td>
                    <td style={{ padding: '0.75rem' }}>{user.provider}</td>
                    <td style={{ padding: '0.75rem' }}>{user.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}</td>
                    <td style={{ padding: '0.75rem' }}>{user.lastLoginAt?.toDate?.()?.toLocaleDateString() || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: '#1a1a1a', borderRadius: '8px', border: '1px solid #333' }}>
        <h2 style={{ color: '#FFD700', marginBottom: '1rem' }}>Beta Testers</h2>
        {betaTesters.length === 0 ? (
          <p style={{ color: '#AAAAAA' }}>No beta testers found.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #FFD700' }}>
                  <th style={{ padding: '0.75rem', textAlign: 'left', color: '#FFD700' }}>Name</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', color: '#FFD700' }}>Email</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', color: '#FFD700' }}>Country</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', color: '#FFD700' }}>Google Play Interested</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', color: '#FFD700' }}>Created At</th>
                </tr>
              </thead>
              <tbody>
                {betaTesters.map((tester, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #333' }}>
                    <td style={{ padding: '0.75rem' }}>{tester.name || 'N/A'}</td>
                    <td style={{ padding: '0.75rem' }}>{tester.email}</td>
                    <td style={{ padding: '0.75rem' }}>{tester.country || 'N/A'}</td>
                    <td style={{ padding: '0.75rem' }}>{tester.interestedGooglePlay ? 'Yes' : 'No'}</td>
                    <td style={{ padding: '0.75rem' }}>{tester.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: '#1a1a1a', borderRadius: '8px', border: '1px solid #333' }}>
        <h2 style={{ color: '#FFD700', marginBottom: '1rem' }}>Beta Feedback</h2>
        {feedback.length === 0 ? (
          <p style={{ color: '#AAAAAA' }}>No feedback submissions found.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #FFD700' }}>
                  <th style={{ padding: '0.75rem', textAlign: 'left', color: '#FFD700' }}>Type</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', color: '#FFD700' }}>Title</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', color: '#FFD700' }}>Description</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', color: '#FFD700' }}>Page URL</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', color: '#FFD700' }}>User Email</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', color: '#FFD700' }}>Status</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', color: '#FFD700' }}>Created At</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', color: '#FFD700' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {feedback.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #333' }}>
                    <td style={{ padding: '0.75rem' }}>{item.type}</td>
                    <td style={{ padding: '0.75rem' }}>{item.title}</td>
                    <td style={{ padding: '0.75rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.description}</td>
                    <td style={{ padding: '0.75rem', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <a href={item.pageUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#FFD700' }}>{item.pageUrl}</a>
                    </td>
                    <td style={{ padding: '0.75rem' }}>{item.userEmail}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        backgroundColor: item.status === 'new' ? '#FFD700' : item.status === 'fixed' ? '#4CAF50' : '#333',
                        color: item.status === 'new' ? '#000' : '#FFF',
                        fontSize: '0.875rem',
                      }}>
                        {item.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem' }}>{item.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <select
                        value={item.status}
                        onChange={(e) => handleUpdateFeedbackStatus(item.id, e.target.value)}
                        style={{
                          padding: '0.25rem',
                          backgroundColor: '#0a0a0a',
                          color: '#FFFFFF',
                          border: '1px solid #333',
                          borderRadius: '4px',
                        }}
                      >
                        {FEEDBACK_STATUSES.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
