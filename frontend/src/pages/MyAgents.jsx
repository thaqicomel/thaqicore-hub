import { useState, useEffect } from 'react';
import { get } from '../api/client';
import AgentCard from '../components/AgentCard';

export default function MyAgents() {
  const [agents, setAgents] = useState([]);
  const username = localStorage.getItem('hub_username');

  useEffect(() => {
    if (username) {
      get(`/marketplace/agents?search=${username}`).then(setAgents).catch(() => {});
    }
  }, [username]);

  if (!username) {
    return <p style={{ color: '#888', textAlign: 'center', marginTop: '3rem' }}>Please login to see your agents.</p>;
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>My Agents</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
        {agents.map((a) => <AgentCard key={a.id} agent={a} />)}
      </div>
      {agents.length === 0 && <p style={{ color: '#666' }}>You haven't published any agents yet.</p>}
    </div>
  );
}
