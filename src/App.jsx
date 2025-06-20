import { useState } from 'react';
import FractalCanvas from './components/FractalCanvas';
import Loader from './components/Loader';

function App() {
  const [zoom, setZoom] = useState(200);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fractalType, setFractalType] = useState('mandelbrot');
  const [juliaCX, setJuliaCX] = useState(-0.7);
  const [juliaCY, setJuliaCY] = useState(0.27015);

  const resetView = () => {
    setZoom(200);
    setOffsetX(0);
    setOffsetY(0);
  };

  const move = (dx, dy) => {
    setOffsetX(offsetX + dx / zoom);
    setOffsetY(offsetY + dy / zoom);
  };

  const handleDownload = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = `${fractalType}-fractal-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleJuliaClick = (e) => {
    if (fractalType === 'mandelbrot') {
      const canvas = document.querySelector('canvas');
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Convert click position to complex coordinates
      const newCX = (x - canvas.width / 2) / zoom + offsetX;
      const newCY = (y - canvas.height / 2) / zoom + offsetY;
      
      setJuliaCX(newCX);
      setJuliaCY(newCY);
      setFractalType('julia');
    }
  };

  return (
    <div style={{ textAlign: 'center', position: 'relative' }}>
      <h2>Fractal Viewer ({fractalType === 'mandelbrot' ? 'Mandelbrot' : 'Julia'} Set)</h2>
      {loading && <Loader />}
      <div 
        onClick={handleJuliaClick}
        style={{ cursor: fractalType === 'mandelbrot' ? 'pointer' : 'default' }}
      >
        <FractalCanvas 
          zoom={zoom} 
          offsetX={offsetX} 
          offsetY={offsetY} 
          setLoading={setLoading}
          fractalType={fractalType}
          juliaCX={juliaCX}
          juliaCY={juliaCY}
        />
      </div>
      <div style={{ marginTop: 10 }}>
        <button onClick={() => setFractalType(fractalType === 'mandelbrot' ? 'julia' : 'mandelbrot')}>
          Switch to {fractalType === 'mandelbrot' ? 'Julia' : 'Mandelbrot'} Set
        </button>
        <button onClick={() => setZoom(zoom * 1.5)}>Zoom In</button>
        <button onClick={() => setZoom(zoom / 1.5)}>Zoom Out</button>
        <button onClick={resetView}>Reset</button>
        <button onClick={handleDownload}>Download Image</button>
        <div style={{ marginTop: 10 }}>
          <button onClick={() => move(50, 0)}>←</button>
          <button onClick={() => move(-50, 0)}>→</button>
          <button onClick={() => move(0, -50)}>↑</button>
          <button onClick={() => move(0, 50)}>↓</button>
        </div>
        {fractalType === 'julia' && (
          <div style={{ marginTop: 10 }}>
            <span>Julia Set Parameters: </span>
            <input 
              type="number" 
              value={juliaCX} 
              onChange={(e) => setJuliaCX(parseFloat(e.target.value))} 
              step="0.01"
              style={{ width: 60 }}
            />
            <span> + </span>
            <input 
              type="number" 
              value={juliaCY} 
              onChange={(e) => setJuliaCY(parseFloat(e.target.value))} 
              step="0.01"
              style={{ width: 60 }}
            />
            <span>i</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;