import { useRef, useEffect } from 'react';

const MAX_ITER = 100;

function drawMandelbrot(ctx, width, height, zoom, offsetX, offsetY) {
  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let zx = (x - width / 2) / zoom + offsetX;
      let zy = (y - height / 2) / zoom + offsetY;
      let cx = zx;
      let cy = zy;
      let i = 0;

      while (zx * zx + zy * zy < 4 && i < MAX_ITER) {
        const tmp = zx * zx - zy * zy + cx;
        zy = 2 * zx * zy + cy;
        zx = tmp;
        i++;
      }

      const idx = (y * width + x) * 4;
      const color = i === MAX_ITER ? 0 : (i * 9) % 255;
      data[idx] = color;
      data[idx + 1] = color;
      data[idx + 2] = color;
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

function drawJulia(ctx, width, height, zoom, offsetX, offsetY, cx, cy) {
  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let zx = (x - width / 2) / zoom + offsetX;
      let zy = (y - height / 2) / zoom + offsetY;
      let i = 0;

      while (zx * zx + zy * zy < 4 && i < MAX_ITER) {
        const tmp = zx * zx - zy * zy + cx;
        zy = 2 * zx * zy + cy;
        zx = tmp;
        i++;
      }

      const idx = (y * width + x) * 4;
      const color = i === MAX_ITER ? 0 : (i * 9) % 255;
      data[idx] = color;
      data[idx + 1] = color;
      data[idx + 2] = color;
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

export default function FractalCanvas({ zoom, offsetX, offsetY, setLoading, fractalType, juliaCX, juliaCY }) {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    setLoading(true);
    setTimeout(() => {
      if (fractalType === 'mandelbrot') {
        drawMandelbrot(ctx, canvas.width, canvas.height, zoom, offsetX, offsetY);
      } else {
        drawJulia(ctx, canvas.width, canvas.height, zoom, offsetX, offsetY, juliaCX, juliaCY);
      }
      setLoading(false);
    }, 50);
  }, [zoom, offsetX, offsetY, fractalType, juliaCX, juliaCY]);

  return <canvas ref={canvasRef} width={800} height={600} style={{ border: '1px solid #ccc' }} />;
}