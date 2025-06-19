import { useState, useEffect } from 'react';
import FractalCanvas from './FractalCanvas';
import Loader from './Loader';

function App() {
  const [zoom, setZoom] = useState(200);
  const [targetZoom, setTargetZoom] = useState(200);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fractalType, setFractalType] = useState('mandelbrot');
  const [juliaCX, setJuliaCX] = useState(-0.7);
  const [juliaCY, setJuliaCY] = useState(0.27015);
  const [maxIter, setMaxIter] = useState(100);
  const [colorScheme, setColorScheme] = useState('rainbow');

  // Smooth zoom animation
  useEffect(() => {
    const animate = () => {
      if (Math.abs(zoom - targetZoom) > 0.1) {
        setZoom(zoom + (targetZoom - zoom) * 0.1);
        requestAnimationFrame(animate);
      }
    };
    animate();
  }, [targetZoom]);

  const resetView = () => {
    setTargetZoom(200);
    setOffsetX(0);
    setOffsetY(0);
  };

  const handleJuliaClick = (e) => {
    if (fractalType === 'mandelbrot') {
      const canvas = document.querySelector('canvas');
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const newCX = (x - canvas.width / 2) / zoom + offsetX;
      const newCY = (y - canvas.height / 2) / zoom + offsetY;
      
      setJuliaCX(newCX);
      setJuliaCY(newCY);
      setFractalType('julia');
    }
  };

  const handleDownload = () => {
    const canvas = document.querySelector('canvas');
    const link = document.createElement('a');
    link.download = `${fractalType}-fractal.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>Fractal Explorer ({fractalType === 'mandelbrot' ? 'Mandelbrot' : 'Julia'} Set)</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setFractalType(fractalType === 'mandelbrot' ? 'julia' : 'mandelbrot')}>
          Switch to {fractalType === 'mandelbrot' ? 'Julia' : 'Mandelbrot'} Set
        </button>
        <button onClick={() => setTargetZoom(targetZoom * 1.5)}>Zoom In</button>
        <button onClick={() => setTargetZoom(targetZoom / 1.5)}>Zoom Out</button>
        <button onClick={resetView}>Reset</button>
        <button onClick={handleDownload}>Download Image</button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>Color Scheme: </label>
        <select value={colorScheme} onChange={(e) => setColorScheme(e.target.value)}>
          <option value="grayscale">Grayscale</option>
          <option value="rainbow">Rainbow</option>
          <option value="fire">Fire</option>
        </select>

        <label style={{ marginLeft: '20px' }}>Iterations: </label>
        <input
          type="range"
          min="20"
          max="500"
          value={maxIter}
          onChange={(e) => setMaxIter(parseInt(e.target.value))}
        />
        <span>{maxIter}</span>
      </div>

      <div 
        onClick={handleJuliaClick}
        style={{ position: 'relative', cursor: fractalType === 'mandelbrot' ? 'pointer' : 'default' }}
      >
        {loading && <Loader />}
        <FractalCanvas
          zoom={zoom}
          offsetX={offsetX}
          offsetY={offsetY}
          setLoading={setLoading}
          fractalType={fractalType}
          juliaCX={juliaCX}
          juliaCY={juliaCY}
          maxIter={maxIter}
          colorScheme={colorScheme}
        />
      </div>

      {fractalType === 'julia' && (
        <div style={{ marginTop: '20px' }}>
          <h3>Julia Set Parameters</h3>
          <label>Real (c<sub>x</sub>): </label>
          <input
            type="number"
            value={juliaCX}
            onChange={(e) => setJuliaCX(parseFloat(e.target.value))}
            step="0.01"
          />
          <label> Imaginary (c<sub>y</sub>): </label>
          <input
            type="number"
            value={juliaCY}
            onChange={(e) => setJuliaCY(parseFloat(e.target.value))}
            step="0.01"
          />
        </div>
      )}
    </div>
  );
}

export default App;