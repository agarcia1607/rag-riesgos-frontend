// App.js - Versión lista para producción (Vite + Vercel + Render)
import React, { useState } from 'react';

// Usar variable de entorno definida en Vercel
const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

function App() {
  const [pregunta, setPregunta] = useState('');
  const [respuesta, setRespuesta] = useState('');
  const [fuentes, setFuentes] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!pregunta.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/preguntar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ texto: pregunta }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setRespuesta(data.respuesta);
      setFuentes(data.fuentes || []);
    } catch (error) {
      console.error('Error:', error);
      setRespuesta(
        'Error al conectar con el servidor. Verifica que el backend esté funcionando.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App" style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#222' }}>RAG Riesgos</h1>

      <textarea
        value={pregunta}
        onChange={(e) => setPregunta(e.target.value)}
        placeholder="Escribe tu pregunta aquí..."
        rows="4"
        cols="60"
        style={{
          padding: '10px',
          fontSize: '1rem',
          width: '100%',
          maxWidth: '600px',
          marginBottom: '10px',
        }}
      />
      <br />
      <button
        onClick={handleClick}
        disabled={loading}
        style={{
          padding: '10px 20px',
          fontSize: '1rem',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        {loading ? 'Procesando...' : 'Preguntar'}
      </button>

      {respuesta && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Respuesta:</h3>
          <p>{respuesta}</p>

          {fuentes.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <h4>Fuentes:</h4>
              <ul>
                {fuentes.map((fuente, index) => (
                  <li key={index}>{fuente}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
// Este comentario fuerza un redeploy en Vercel
