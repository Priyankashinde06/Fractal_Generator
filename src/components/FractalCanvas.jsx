import { useRef, useEffect, forwardRef } from 'react';

const COLOR_SCHEMES = {
  classic: (t) => {
    const r = Math.floor(9 * (1 - t) * t * t * t * 255);
    const g = Math.floor(15 * (1 - t) * (1 - t) * t * t * 255);
    const b = Math.floor(8.5 * (1 - t) * (1 - t) * (1 - t) * t * 255);
    return [r, g, b];
  },
  grayscale: (t) => {
    const v = Math.floor(t * 255);
    return [v, v, v];
  },
  fiery: (t) => {
    const r = Math.floor(255 * t);
    const g = Math.floor(128 * t);
    const b = Math.floor(64 * (1 - t));
    return [r, g, b];
  },
  oceanic: (t) => {
    const r = Math.floor(64 * (1 - t));
    const g = Math.floor(128 * t);
    const b = Math.floor(255 * t);
    return [r, g, b];
  },
  psychedelic: (t) => {
    const r = Math.floor(255 * Math.abs(Math.sin(t * Math.PI)));
    const g = Math.floor(255 * Math.abs(Math.sin(t * Math.PI + Math.PI/3)));
    const b = Math.floor(255 * Math.abs(Math.sin(t * Math.PI + 2*Math.PI/3)));
    return [r, g, b];
  },
  forest: (t) => {
    const r = Math.floor(64 * (1 - t));
    const g = Math.floor(192 * t);
    const b = Math.floor(64 * t);
    return [r, g, b];
  }
};

function getColor(i, maxIter, colorScheme) {
  if (i === maxIter) return [0, 0, 0];
  const t = i / maxIter;
  return COLOR_SCHEMES[colorScheme](t);
}

function drawFractal(ctx, width, height, zoom, offsetX, offsetY, fractalType, juliaCX, juliaCY, colorScheme, maxIter) {
  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let zx = (x - width / 2) / zoom + offsetX;
      let zy = (y - height / 2) / zoom + offsetY;
      let cx = fractalType === 'burning-ship' ? zx : (fractalType === 'julia' ? juliaCX : zx);
      let cy = fractalType === 'burning-ship' ? zy : (fractalType === 'julia' ? juliaCY : zy);
      let i = 0;

      while (zx * zx + zy * zy < 4 && i < maxIter) {
        let tmp;
        if (fractalType === 'burning-ship') {
          tmp = zx * zx - zy * zy + cx;
          zy = Math.abs(2 * zx * zy) + cy; // Burning Ship formula
          zx = Math.abs(tmp);
        } else {
          tmp = zx * zx - zy * zy + (fractalType === 'julia' ? juliaCX : cx);
          zy = 2 * zx * zy + (fractalType === 'julia' ? juliaCY : cy);
          zx = tmp;
        }
        i++;
      }

      const idx = (y * width + x) * 4;
      const [r, g, b] = getColor(i, maxIter, colorScheme);
      data[idx] = r;
      data[idx + 1] = g;
      data[idx + 2] = b;
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

const FractalCanvas = forwardRef(({ 
  zoom, offsetX, offsetY, setLoading, fractalType, 
  juliaCX, juliaCY, colorScheme, maxIter 
}, ref) => {
  const canvasRef = useRef();

  useEffect(() => {
    if (ref) ref.current = canvasRef.current;
  }, [ref]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    setLoading(true);
    
    setTimeout(() => {
      drawFractal(ctx, canvas.width, canvas.height, zoom, offsetX, offsetY, 
                 fractalType, juliaCX, juliaCY, colorScheme, maxIter);
      setLoading(false);
    }, 50);
  }, [zoom, offsetX, offsetY, fractalType, juliaCX, juliaCY, colorScheme, maxIter]);

  useEffect(() => {
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const canvas = canvasRef.current;
        canvas.width = Math.min(700, window.innerWidth - 40);
        canvas.height = Math.min(450, window.innerHeight - 200);
        const ctx = canvas.getContext('2d');
        
        setLoading(true);
        setTimeout(() => {
          drawFractal(ctx, canvas.width, canvas.height, zoom, offsetX, offsetY, 
                     fractalType, juliaCX, juliaCY, colorScheme, maxIter);
          setLoading(false);
        }, 50);
      }, 200);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, [zoom, offsetX, offsetY, fractalType, juliaCX, juliaCY, colorScheme, maxIter]);

  return (
    <canvas 
      ref={canvasRef}
      style={{ 
        display: 'block',
        maxWidth: '100%',
        height: 'auto',
        borderRadius: '4px'
      }} 
    />
  );
});

export default FractalCanvas;