import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../hooks/useAuth';
import PulseLine from '../components/PulseLine';
import { SUPPORT_EMAIL } from '../config';
import PublicHeader from '../components/PublicHeader';

const categories = [
    { value: 'bug', label: 'Something is broken' },
    { value: 'feature_request', label: 'Feature request' },
    { value: 'billing', label: 'Plan / billing question' },
    { value: 'other', label: 'Something else' },
];

export default function Report() {
    const { user } = useAuth();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [category, setCategory] = useState('bug');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            const body = { category, message };
            if (!user) {
                body.name = name;
                body.email = email;
            }
            await api.submitContactMessage(body);
            setDone(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
            <PublicHeader />

            <div className="public-content" style={{ maxWidth: 560, margin: '0 auto', padding: '20px 40px 100px' }}>
                <h1 style={{ fontSize: 28, marginBottom: 8 }}>Report a problem</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 28 }}>
                    Found a bug, have a request, or something's just not working right? Tell us what happened. Common
                    questions are answered faster on the{' '}
                    <Link to="/support" style={{ color: 'var(--signal)' }}>
                        support page
                    </Link>
                    .
                </p>

                {done ? (
                    <div className="card" style={{ padding: 28, textAlign: 'center' }}>
                        <PulseLine status="signal" width={64} height={20} />
                        <h3 style={{ fontSize: 17, margin: '16px 0 8px' }}>Thanks — we've got it.</h3>
                        <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: 0 }}>
                            If you left an email, we'll follow up there if we need more detail.
                        </p>
                    </div>
                ) : (
                    <div className="card" style={{ padding: 24 }}>
                        {error && (
                            <div className="banner banner-error">
                                {error}
                                <div style={{ marginTop: 8 }}>
                                    Form not working? Email us directly at{' '}
                                    <a href={`mailto:${SUPPORT_EMAIL}`} style={{ color: 'inherit', textDecoration: 'underline' }}>
                                        {SUPPORT_EMAIL}
                                    </a>
                                    .
                                </div>
                            </div>
                        )}
                        <form onSubmit={handleSubmit}>
                            {!user && (
                                <>
                                    <div className="field">
                                        <label htmlFor="report-name">Name</label>
                                        <input id="report-name" value={name} onChange={(e) => setName(e.target.value)} required />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="report-email">Email</label>
                                        <input
                                            id="report-email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </>
                            )}

                            <div className="field">
                                <label htmlFor="report-category">What's this about?</label>
                                <select id="report-category" value={category} onChange={(e) => setCategory(e.target.value)}>
                                    {categories.map((c) => (
                                        <option key={c.value} value={c.value}>
                                            {c.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="field">
                                <label htmlFor="report-message">What happened?</label>
                                <textarea
                                    id="report-message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                    maxLength={5000}
                                    rows={6}
                                    style={{
                                        background: 'var(--bg-elevated)',
                                        border: '1px solid var(--border-hairline-strong)',
                                        color: 'var(--text-primary)',
                                        borderRadius: 'var(--radius-sm)',
                                        padding: '10px 12px',
                                        fontSize: 14,
                                        fontFamily: 'var(--font-body)',
                                        resize: 'vertical',
                                    }}
                                    placeholder="The more detail, the faster we can figure out what's going on — what you expected, what happened instead, and when."
                                />
                            </div>

                            <button className="btn btn-primary" type="submit" disabled={submitting} style={{ width: '100%' }}>
                                {submitting ? 'Sending…' : 'Send report'}
                            </button>
                        </form>

                        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 20, textAlign: 'center' }}>
                            Form not loading, or the site itself down? Email{' '}
                            <a href={`mailto:${SUPPORT_EMAIL}`} style={{ color: 'var(--text-muted)' }}>
                                {SUPPORT_EMAIL}
                            </a>{' '}
                            directly — that always works regardless of whether this page does.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}