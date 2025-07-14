import React, { useState } from 'react';
import './App.css';
import logo from './logo_riesgos.png'; // Asegúrate de tener esta imagen en `src`
import logoEmpresa from './logo_riesgos.png';


function App() {
  const [pregunta, setPregunta] = useState('');
  const [respuesta, setRespuesta] = useState('');
  const [fuentes, setFuentes] = useState([]);
  const [cargando, setCargando] = useState(false);

  const handleConsulta = async () => {
    if (!pregunta.trim()) return;

    setCargando(true);
    setRespuesta('');
    setFuentes([]);

    try {
      const res = await fetch('http://127.0.0.1:8000/preguntar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto: pregunta }),
      });

      if (!res.ok) throw new Error('Error al consultar');

      const data = await res.json();
      setRespuesta(data.respuesta || 'No se obtuvo respuesta');
      setFuentes(data.fuentes || []);
    } catch (error) {
      console.error(error);
      setRespuesta('❌ Error al consultar el backend.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <img src={logo} alt="Logo de riesgos" className="logo" />
        <h1>
  <img src={logoEmpresa} alt="Logo Vertech" className="logo" />
  Asistente de Riesgos
</h1>

      </header>

      <textarea
        placeholder="Ej: nivel del riesgo de unas manzanas frescas chilenas de 40000 dólares"
        rows="4"
        value={pregunta}
        onChange={(e) => setPregunta(e.target.value)}
      />

      <button onClick={handleConsulta} disabled={cargando}>
        {cargando ? 'Consultando...' : 'Consultar'}
      </button>

      <div className="respuesta">
        <h3>🧠 Respuesta:</h3>
        <p>{respuesta}</p>
      </div>

      {fuentes.length > 0 && (
        <div className="fuentes">
          <h3>📚 Fuentes consultadas:</h3>
          <ul>
            {fuentes.map((f, i) => (
              <li key={i}>
                {typeof f === 'string'
                  ? f.slice(0, 200) + '...'
                  : 'Documento sin texto legible'}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;

