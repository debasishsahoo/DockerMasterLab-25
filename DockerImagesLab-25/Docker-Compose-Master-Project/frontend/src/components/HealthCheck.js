import React, { useState, useEffect } from 'react';
import axios from 'axios';

function HealthCheck() {
  const [health, setHealth] = useState(null);
  const [error, setError] = useState(null);

  const checkHealth = async () => {
    try {
      const response = await axios.get('/health');
      setHealth(response.data);
      setError(null);
    } catch (err) {
      setError('Health check failed');
      setHealth(null);
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="health-check">
      <h3>🏥 System Health</h3>
      {error ? (
        <div className="status error">{error}</div>
      ) : health ? (
        <div className="status healthy">
          <p>✅ Status: {health.status}</p>
          <p>🔄 Uptime: {Math.floor(health.uptime)}s</p>
          <p>📦 Version: {health.version}</p>
          <p>🖥️ Hostname: {health.hostname}</p>
        </div>
      ) : (
        <div className="status checking">Checking health...</div>
      )}
    </div>
  );
}

export default HealthCheck;