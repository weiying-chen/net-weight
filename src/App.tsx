import { Home } from '@/pages/Home';
import { Form } from '@/pages/Form';
import { Route, Routes } from 'react-router-dom';

export default function App() {
  return (
    <div className="p-4">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/form" element={<Form />} />
      </Routes>
    </div>
  );
}
