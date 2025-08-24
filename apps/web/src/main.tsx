import { createRoot } from 'react-dom/client';
import './main.css';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <p className="text-primary text-center text-xl font-bold">
      React app is running with Tailwind CSS v4
    </p>
  );
}
