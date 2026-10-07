import { Outlet } from 'react-router-dom'
import 'rpg-awesome/css/rpg-awesome.min.css';
import GideonAssistant from './components/GideonAssistant';

function App() {
  return (
    <>
      <Outlet />
      {/* Global: a conversa sobrevive às trocas de rota */}
      <GideonAssistant />
    </>
  );
}

export default App