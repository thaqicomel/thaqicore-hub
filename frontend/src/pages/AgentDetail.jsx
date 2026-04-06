import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { get, post } from '../api/client';

export default function AgentDetail() {
  const { slug } = useParams();
  const [agent, setAgent] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    get(`/marketplace/agents/${slug}`).then(setAgent).catch(() => {});
  }, [slug]);

  useEffect(() => {
    if (agent) {
      get(`/reviews/agent/${agent.id}`).then(setReviews).catch(() => {});
    }
  }, [agent]);

  const handleInstall = async () => {
    const result = await post(`/marketplace/agents/${slug}/install`);
    await navigator.clipboard.writeText(result.definition);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!agent) return <p style={{ color: '#888' }}>Loading...</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', margin: 0 }}>{agent.name}</h1>
          <p style={{ color: '#888', margin: '0.25rem 0' }}>
            by {agent.author_username} · v{agent.version} · {agent.downloads} installs
          </p>
        </div>
        <button onClick={handleInstall}
          style={{ padding: '0.6rem 1.5rem', background: '#a78bfa', color: '#000', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>
          {copied ? 'Copied!' : 'Install'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <span style={{ background: '#2a2a2a', padding: '4px 10px', borderRadius: 12, fontSize: '0.85rem', color: '#a78bfa' }}>
          {agent.category}
        </span>
        {agent.tags.map((t) => (
          <span key={t} style={{ background: '#222', padding: '4px 8px', borderRadius: 12, fontSize: '0.8rem', color: '#888' }}>{t}</span>
        ))}
      </div>

      <p style={{ color: '#ccc', lineHeight: 1.6, marginBottom: '2rem' }}>{agent.description}</p>

      <h2 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Agent Definition</h2>
      <pre style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8, padding: '1rem', overflow: 'auto', fontSize: '0.85rem', color: '#ccc' }}>
        {agent.definition}
      </pre>

      {agent.cognitive_systems.length > 0 && (
        <>
          <h2 style={{ fontSize: '1.1rem', marginTop: '2rem', marginBottom: '0.5rem' }}>Cognitive Systems</h2>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {agent.cognitive_systems.map((s) => (
              <span key={s} style={{ background: '#1a1a2e', padding: '4px 10px', borderRadius: 12, fontSize: '0.8rem', color: '#818cf8' }}>{s}</span>
            ))}
          </div>
        </>
      )}

      <h2 style={{ fontSize: '1.1rem', marginTop: '2rem', marginBottom: '0.75rem' }}>
        Reviews ({reviews.length})
        {agent.rating_count > 0 && <span style={{ color: '#f59e0b', marginLeft: '0.5rem' }}>{'★'.repeat(Math.round(agent.rating_avg))}</span>}
      </h2>
      {reviews.length === 0 ? (
        <p style={{ color: '#666' }}>No reviews yet.</p>
      ) : (
        reviews.map((r) => (
          <div key={r.id} style={{ background: '#1a1a1a', padding: '1rem', borderRadius: 8, marginBottom: '0.75rem', border: '1px solid #222' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 600 }}>{r.username}</span>
              <span style={{ color: '#f59e0b' }}>{'★'.repeat(r.rating)}</span>
            </div>
            {r.comment && <p style={{ color: '#aaa', margin: '0.5rem 0 0', fontSize: '0.9rem' }}>{r.comment}</p>}
          </div>
        ))
      )}
    </div>
  );
}
