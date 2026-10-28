import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register service worker with auto-update
registerSW({
  immediate: true,
  onNeedRefresh() {
    // Auto-update SW
  },
  onOfflineReady() {
    console.log('FacturaClara PWA está lista para uso offline');
  },
});

createRoot(document.getElementById('root')!).render(<App />);

