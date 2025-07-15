import React, { useState } from 'react';

// Variable CRA
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

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

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setRespuesta(data.respuesta);
      setFuentes(data.fuentes || []);
    } catch (error) {
      console.error('Error:', error);
      setRespuesta('❌ Error al conectar con el backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0d0d0d',
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '2rem',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Logo y título */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <img src="/logo.png" alt="Logo" style={{ height: '60px', marginBottom: '1rem' }} />
        <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#ffffff' }}>
          Asistente de Riesgos
        </h1>
      </div>

      {/* Entrada */}
      <textarea
        value={pregunta}
        onChange={(e) => setPregunta(e.target.value)}
        placeholder="Ej: ¿Cuál es el riesgo de una mercancía frágil con valor de USD 60,000?"
        rows="4"
        cols="60"
        style={{
          padding: '12px',
          fontSize: '1rem',
          width: '100%',
          maxWidth: '700px',
          marginBottom: '1rem',
          borderRadius: '6px',
          border: '1px solid #444',
          backgroundColor: '#1c1c1c',
          color: '#fff',
        }}
      />
      <button
        onClick={handleClick}
        disabled={loading}
        style={{
          padding: '10px 24px',
          fontSize: '1rem',
          backgroundColor: '#ffffff',
          color: '#0d0d0d',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
      >
        {loading ? 'Consultando...' : 'Consultar'}
      </button>

      {/* Respuesta */}
      {respuesta && (
        <div style={{ marginTop: '2rem', maxWidth: '800px' }}>
          <h3 style={{ color: '#fff' }}>🧠 Respuesta:</h3>
          <p>{respuesta}</p>

          {fuentes.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <h4>📚 Fuentes:</h4>
              <ul>
                {fuentes.map((fuente, idx) => (
                  <li key={idx}>{fuente}</li>
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
