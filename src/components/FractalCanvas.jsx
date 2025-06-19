import { useRef, useEffect, useState } from 'react';

const COLOR_PALETTES = {
  grayscale: (i, maxIter) => {
    const color = i === maxIter ? 0 : (i * 9) % 255;
    return [color, color, color, 255];
  },
  rainbow: (i, maxIter) => {
    if (i === maxIter) return [0, 0, 0, 255];
    const hue = (i / maxIter) * 360;
    return [...hslToRgb(hue / 360, 1, 0.5), 255];
  },
  fire: (i, maxIter) => {
    if (i === maxIter) return [0, 0, 0, 255];
    const intensity = i / maxIter;
    return [intensity * 255, intensity * 100, 0, 255];
  }
};

function hslToRgb(h, s, l) {
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function drawFractal(ctx, width, height, zoom, offsetX, offsetY, maxIter, fractalType, cx, cy, colorScheme) {
  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;
  const getColor = COLOR_PALETTES[colorScheme] || COLOR_PALETTES.grayscale;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let zx = (x - width / 2) / zoom + offsetX;
      let zy = (y - height / 2) / zoom + offsetY;
      let i = 0;

      while (zx * zx + zy * zy < 4 && i < maxIter) {
        const tmp = zx * zx - zy * zy + (fractalType === 'julia' ? cx : zx);
        zy = 2 * zx * zy + (fractalType === 'julia' ? cy : zy);
        zx = tmp;
        i++;
      }

      const idx = (y * width + x) * 4;
      const [r, g, b, a] = getColor(i, maxIter);
      data[idx] = r;
      data[idx + 1] = g;
      data[idx + 2] = b;
      data[idx + 3] = a;
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

export default function FractalCanvas({
  zoom, offsetX, offsetY, setLoading, fractalType, juliaCX, juliaCY, maxIter, colorScheme
}) {
  const canvasRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    setLoading(true);

    const render = () => {
      drawFractal(
        ctx, canvas.width, canvas.height, zoom, offsetX, offsetY,
        maxIter, fractalType, juliaCX, juliaCY, colorScheme
      );
      setLoading(false);
    };

    const timer = setTimeout(render, 50);
    return () => clearTimeout(timer);
  }, [zoom, offsetX, offsetY, fractalType, juliaCX, juliaCY, maxIter, colorScheme]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = (e.clientX - dragStart.x) / zoom;
    const dy = (e.clientY - dragStart.y) / zoom;
    setOffsetX(offsetX - dx);
    setOffsetY(offsetY - dy);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.1 : 0.9;
    setZoom(zoom * factor);
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      style={{
        width: '100%',
        height: '70vh',
        border: '1px solid #ccc',
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
    />
  );
}