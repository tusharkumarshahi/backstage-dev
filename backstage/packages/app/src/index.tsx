import '@backstage/cli/asset-types';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@backstage/ui/css/styles.css';
import './branding/tokens.css';
import './branding/global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(App.createRoot());
