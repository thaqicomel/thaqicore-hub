import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Browse from './pages/Browse';
import AgentDetail from './pages/AgentDetail';
import Publish from './pages/Publish';
import Login from './pages/Login';
import MyAgents from './pages/MyAgents';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Browse />} />
          <Route path="agent/:slug" element={<AgentDetail />} />
          <Route path="publish" element={<Publish />} />
          <Route path="my-agents" element={<MyAgents />} />
          <Route path="login" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
