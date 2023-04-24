import './index.less';
import { createRoot } from 'react-dom/client';

import Router from './router';

createRoot(document.getElementById('root') as HTMLElement).render(<Router />);
