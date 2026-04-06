import { Link } from 'react-router-dom';

export default function AgentCard({ agent }) {
  return (
    <Link
      to={`/agent/${agent.slug}`}
      style={{
        display: 'block', padding: '1.25rem', background: '#1a1a1a', border: '1px solid #2a2a2a',
        borderRadius: 8, textDecoration: 'none', color: '#e5e5e5', transition: 'border-color 0.2s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#a78bfa')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#2a2a2a')}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{agent.name}</h3>
        <span style={{ fontSize: '0.75rem', background: '#2a2a2a', padding: '2px 8px', borderRadius: 12, color: '#a78bfa' }}>
          {agent.category}
        </span>
      </div>
      <p style={{ color: '#999', margin: '0.5rem 0', fontSize: '0.9rem', lineHeight: 1.4 }}>
        {agent.description}
      </p>
      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#666', marginTop: '0.75rem' }}>
        <span>by {agent.author_username}</span>
        <span>v{agent.version}</span>
        <span>{agent.downloads} installs</span>
        {agent.rating_count > 0 && <span>{'★'.repeat(Math.round(agent.rating_avg))} ({agent.rating_count})</span>}
      </div>
      {agent.tags?.length > 0 && (
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
          {agent.tags.map((tag) => (
            <span key={tag} style={{ fontSize: '0.7rem', background: '#222', padding: '2px 6px', borderRadius: 4, color: '#888' }}>
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
