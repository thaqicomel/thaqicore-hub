import { useState, useEffect } from 'react';
import { get } from '../api/client';
import AgentCard from '../components/AgentCard';

const CATEGORIES = ['all', 'cognitive', 'coding', 'research', 'devops', 'writing', 'data', 'creative', 'productivity', 'security'];

export default function Browse() {
  const [agents, setAgents] = useState([]);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('downloads');

  useEffect(() => {
    const params = new URLSearchParams({ sort });
    if (category !== 'all') params.set('category', category);
    if (search) params.set('search', search);
    get(`/marketplace/agents?${params}`).then(setAgents).catch(() => setAgents([]));
  }, [category, search, sort]);

  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Agent Marketplace</h1>
      <p style={{ color: '#888', marginBottom: '1.5rem' }}>Discover and install cognitive agents for thaqicore</p>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <input
          type="text" placeholder="Search agents..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 200, padding: '0.5rem 1rem', background: '#1a1a1a', border: '1px solid #333', borderRadius: 6, color: '#e5e5e5', outline: 'none' }}
        />
        <select value={sort} onChange={(e) => setSort(e.target.value)}
          style={{ padding: '0.5rem', background: '#1a1a1a', border: '1px solid #333', borderRadius: 6, color: '#e5e5e5' }}>
          <option value="downloads">Most Installed</option>
          <option value="rating">Top Rated</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => setCategory(c)}
            style={{
              padding: '0.3rem 0.75rem', borderRadius: 16, border: 'none', cursor: 'pointer', fontSize: '0.85rem',
              background: category === c ? '#a78bfa' : '#222', color: category === c ? '#000' : '#aaa',
            }}>
            {c}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
        {agents.map((a) => <AgentCard key={a.id} agent={a} />)}
      </div>
      {agents.length === 0 && (
        <p style={{ textAlign: 'center', color: '#666', marginTop: '3rem' }}>No agents found. Be the first to publish one!</p>
      )}
    </div>
  );
}
