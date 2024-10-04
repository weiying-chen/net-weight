import { Home } from '@/pages/Home';
import { Form } from '@/pages/Form';
import { Misc } from '@/pages/Misc';
import { Config } from '@/pages/Config';
import { List } from '@/pages/List';
import { Route, Routes } from 'react-router-dom';

export default function App() {
  return (
    <div className="p-4 text-foreground">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/form" element={<Form />} />
        <Route path="/misc" element={<Misc />} />
        <Route path="/config" element={<Config />} />
        <Route path="/list" element={<List />} />
      </Routes>
    </div>
  );
}
