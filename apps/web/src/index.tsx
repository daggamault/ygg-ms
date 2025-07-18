import { createRoot } from 'react-dom/client';
import './styles.css';

const App = () => (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Web App</h1>
      <p className="text-blue-600">React app is running with Tailwind CSS v4</p>
    </div>
  </div>
);

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
