import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Lobby from './Lobby';
import CodeBlock from './CodeBlock';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Lobby />} />
        <Route path="/code/:blockIndex" element={<CodeBlock />} />
      </Routes>
    </Router>
  );
};

export default App;
