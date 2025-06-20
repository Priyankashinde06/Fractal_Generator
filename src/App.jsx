import { useState, useEffect, useRef } from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import FractalCanvas from "./components/FractalCanvas";
import Loader from "./components/Loader";
import ControlsPanel from "./components/ControlsPanel";
import "./styles.css";

function App() {
  const [zoom, setZoom] = useState(200);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fractalType, setFractalType] = useState("mandelbrot");
  const [juliaCX, setJuliaCX] = useState(-0.7);
  const [juliaCY, setJuliaCY] = useState(0.27015);
  const [colorScheme, setColorScheme] = useState("classic");
  const [maxIter, setMaxIter] = useState(100);
  const [isDragging, setIsDragging] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [viewHistory, setViewHistory] = useState([]);
  const [initialTouchDistance, setInitialTouchDistance] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const controlsRef = useRef();
  const canvasRef = useRef();

  /**
   * Resets view to default zoom and position
   */
  const resetView = () => {
    setZoom(200);
    setOffsetX(0);
    setOffsetY(0);
  };

  /**
   * Moves the view by specified pixel amounts
   * @param {number} dx - Horizontal movement in pixels
   * @param {number} dy - Vertical movement in pixels
   */
  const move = (dx, dy) => {
    setOffsetX(offsetX + dx / zoom);
    setOffsetY(offsetY + dy / zoom);
  };

  /**
   * Handles downloading the current fractal as PNG
   */
  const handleDownload = () => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `${fractalType}-fractal-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /**
   * Handles clicking on Mandelbrot to set Julia parameters
   * @param {Event} e - Mouse click event
   */

  /**
   * Smoothly animates zoom transition using easing function
   * @param {number} targetZoom - The final zoom level to reach
   * @param {number} targetX - The target x offset
   * @param {number} targetY - The target y offset
   */
  const animateZoom = (targetZoom, targetX, targetY) => {
    const duration = 500;
    const startZoom = zoom;
    const startX = offsetX;
    const startY = offsetY;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 0.5 - 0.5 * Math.cos(progress * Math.PI);

      setZoom(startZoom + (targetZoom - startZoom) * easeProgress);
      setOffsetX(startX + (targetX - startX) * easeProgress);
      setOffsetY(startY + (targetY - startY) * easeProgress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  /**
   * Tracks mouse position for coordinate display
   * @param {Event} e - Mouse move event
   */
  const handleMouseMoveForCoords = (e) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePos({
      x: ((x - canvas.width / 2) / zoom + offsetX).toFixed(4),
      y: ((y - canvas.height / 2) / zoom + offsetY).toFixed(4),
    });
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setLastPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - lastPos.x;
    const dy = e.clientY - lastPos.y;
    move(-dx, -dy);
    setLastPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 1 / 1.2 : 1.2;
    setZoom(zoom * delta);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      setInitialTouchDistance(
        Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        )
      );
    } else if (e.touches.length === 1) {
      setIsDragging(true);
      setLastPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && initialTouchDistance) {
      const currentDistance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const scale = currentDistance / initialTouchDistance;
      setZoom(zoom * scale);
      setInitialTouchDistance(currentDistance);
    } else if (isDragging && e.touches.length === 1) {
      const dx = e.touches[0].clientX - lastPos.x;
      const dy = e.touches[0].clientY - lastPos.y;
      move(-dx, -dy);
      setLastPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setInitialTouchDistance(null);
  };

  const handleKeyDown = (e) => {
    const moveAmount = 50;
    switch (e.key) {
      case "ArrowLeft":
        move(moveAmount, 0);
        break;
      case "ArrowRight":
        move(-moveAmount, 0);
        break;
      case "ArrowUp":
        move(0, moveAmount);
        break;
      case "ArrowDown":
        move(0, -moveAmount);
        break;
      case "+":
      case "=":
        animateZoom(zoom * 1.2, offsetX, offsetY);
        break;
      case "-":
        animateZoom(zoom / 1.2, offsetX, offsetY);
        break;
      case "0":
        resetView();
        break;
      default:
        return;
    }
    e.preventDefault();
  };

  /**
   * Saves current view parameters to history
   */
  const saveView = () => {
    const newView = {
      zoom,
      offsetX,
      offsetY,
      fractalType,
      juliaCX,
      juliaCY,
      colorScheme,
      maxIter,
      timestamp: Date.now(),
    };
    setViewHistory([...viewHistory, newView].slice(-5));
  };

  /**
   * Restores view from history
   * @param {number} index - Index of view to restore
   */
  const restoreView = (index) => {
    const view = viewHistory[index];
    setZoom(view.zoom);
    setOffsetX(view.offsetX);
    setOffsetY(view.offsetY);
    setFractalType(view.fractalType);
    if (view.fractalType === "julia") {
      setJuliaCX(view.juliaCX);
      setJuliaCY(view.juliaCY);
    }
    setColorScheme(view.colorScheme);
    setMaxIter(view.maxIter);
  };

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.focus();
    }
  }, []);

  return (
    <Container maxWidth="lg" className="fractal-container">
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ mt: 0, fontWeight: 700, borderBottom: 2, fontFamily: "serif" }}
      >
        Fractal Explorer
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        {fractalType === "mandelbrot"
          ? "Mandelbrot Set"
          : fractalType === "julia"
          ? "Julia Set"
          : fractalType === "burning-ship"
          ? "Burning Ship Fractal"
          : fractalType === "mandelbar"
          ? "Mandelbar Fractal"
          : "Mandelbrot Set"}
      </Typography>

      {loading && <Loader />}

      <Box className="canvas-wrapper">
        <div
          onMouseDown={handleMouseDown}
          onMouseMove={(e) => {
            handleMouseMove(e);
            handleMouseMoveForCoords(e);
          }}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            cursor:
              fractalType === "mandelbrot"
                ? "grabbing"
                : isDragging
                ? "grabbing"
                : "grab",
            touchAction: "none",
            position: "relative",
          }}
        >
          <FractalCanvas
            ref={canvasRef}
            zoom={zoom}
            offsetX={offsetX}
            offsetY={offsetY}
            setLoading={setLoading}
            fractalType={fractalType}
            juliaCX={juliaCX}
            juliaCY={juliaCY}
            colorScheme={colorScheme}
            maxIter={maxIter}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />
          <Typography
            variant="caption"
            sx={{
              position: "absolute",
              bottom: 8,
              left: 8,
              backgroundColor: "rgba(0,0,0,0.5)",
              color: "white",
              padding: "2px 8px",
              borderRadius: 1,
            }}
          >
            {mousePos.x}, {mousePos.y}
          </Typography>
        </div>
      </Box>
      <Typography
        variant="caption"
        color="text.secondary"
        align="center"
        sx={{ mt: 1 }}
      >
        Tip: Use pinch/drag gestures on mobile.
      </Typography>

      <ControlsPanel
        ref={controlsRef}
        fractalType={fractalType}
        setFractalType={setFractalType}
        animateZoom={animateZoom}
        zoom={zoom}
        offsetX={offsetX}
        offsetY={offsetY}
        resetView={resetView}
        handleDownload={handleDownload}
        move={move}
        colorScheme={colorScheme}
        setColorScheme={setColorScheme}
        juliaCX={juliaCX}
        setJuliaCX={setJuliaCX}
        juliaCY={juliaCY}
        setJuliaCY={setJuliaCY}
        maxIter={maxIter}
        setMaxIter={setMaxIter}
        saveView={saveView}
        viewHistory={viewHistory}
        restoreView={restoreView}
        handleKeyDown={handleKeyDown}
      />
    </Container>
  );
}

export default App;
