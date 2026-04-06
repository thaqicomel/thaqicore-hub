import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { post } from '../api/client';

const CATEGORIES = ['cognitive', 'coding', 'research', 'devops', 'writing', 'data', 'creative', 'productivity', 'security', 'other'];

const inputStyle = { width: '100%', padding: '0.5rem', background: '#1a1a1a', border: '1px solid #333', borderRadius: 6, color: '#e5e5e5', outline: 'none', boxSizing: 'border-box' };

export default function Publish() {
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', slug: '', description: '', category: 'coding', tags: '', definition: '', provider: 'anthropic', model: '' });
  const [error, setError] = useState('');

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const body = { ...form, tags: form.tags ? form.tags.split(',').map((t) => t.trim()) : [], cognitive_systems: [] };
      await post('/publish/agent', body);
      nav('/my-agents');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 650 }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Publish Agent</h1>
      {error && <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: 4, color: '#aaa', fontSize: '0.85rem' }}>Name</label>
          <input style={inputStyle} value={form.name} onChange={set('name')} required />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 4, color: '#aaa', fontSize: '0.85rem' }}>Slug (URL-friendly)</label>
          <input style={inputStyle} value={form.slug} onChange={set('slug')} placeholder="my-agent" required />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 4, color: '#aaa', fontSize: '0.85rem' }}>Description</label>
          <textarea style={{ ...inputStyle, minHeight: 80 }} value={form.description} onChange={set('description')} required />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 4, color: '#aaa', fontSize: '0.85rem' }}>Category</label>
          <select style={inputStyle} value={form.category} onChange={set('category')}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 4, color: '#aaa', fontSize: '0.85rem' }}>Tags (comma-separated)</label>
          <input style={inputStyle} value={form.tags} onChange={set('tags')} placeholder="python, automation, devops" />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 4, color: '#aaa', fontSize: '0.85rem' }}>Provider</label>
          <select style={inputStyle} value={form.provider} onChange={set('provider')}>
            <option value="anthropic">Anthropic</option>
            <option value="openai">OpenAI</option>
            <option value="ollama">Ollama</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 4, color: '#aaa', fontSize: '0.85rem' }}>Model (optional)</label>
          <input style={inputStyle} value={form.model} onChange={set('model')} placeholder="claude-sonnet-4-6" />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 4, color: '#aaa', fontSize: '0.85rem' }}>Agent Definition (markdown)</label>
          <textarea style={{ ...inputStyle, minHeight: 200, fontFamily: 'monospace', fontSize: '0.85rem' }} value={form.definition} onChange={set('definition')} required />
        </div>
        <button type="submit" style={{ padding: '0.6rem', background: '#a78bfa', color: '#000', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: '1rem' }}>
          Publish Agent
        </button>
      </form>
    </div>
  );
}
