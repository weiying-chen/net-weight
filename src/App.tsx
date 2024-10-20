import { Home } from '@/pages/Home';
import { Home2 } from '@/pages/Home2';
import { Form } from '@/pages/Form';
import { VCard1 } from '@/pages/VCard1';
import { VCard2 } from '@/pages/VCard2';
import { VCard3 } from '@/pages/VCard3';
import { Misc } from '@/pages/Misc';
import { List } from '@/pages/List';
import { Route, Routes } from 'react-router-dom';

export default function App() {
  return (
    <div className="p-4 text-foreground">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home2" element={<Home2 />} />
        <Route path="/form" element={<Form />} />
        <Route path="/vcard1" element={<VCard1 />} />
        <Route path="/vcard2" element={<VCard2 />} />
        <Route path="/vcard3" element={<VCard3 />} />
        <Route path="/misc" element={<Misc />} />
        <Route path="/list" element={<List />} />
      </Routes>
    </div>
  );
}
