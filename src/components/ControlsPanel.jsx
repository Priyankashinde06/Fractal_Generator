import {
  Button,
  Grid,
  Paper,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
  Typography,
  IconButton,
  Box,
  Divider,
  Tooltip
} from "@mui/material";
import {
  ZoomIn,
  ZoomOut,
  RestartAlt,
  Download,
  NavigateBefore,
  NavigateNext,
  ArrowUpward,
  ArrowDownward,
  Save,
  Info
} from "@mui/icons-material";

export default function ControlsPanel({
  fractalType,
  setFractalType,
  animateZoom,
  zoom,
  offsetX,
  offsetY,
  resetView,
  handleDownload,
  move,
  colorScheme,
  setColorScheme,
  juliaCX,
  setJuliaCX,
  juliaCY,
  setJuliaCY,
  maxIter,
  setMaxIter,
  saveView,
  viewHistory,
  restoreView,
  handleKeyDown
}) {
  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }} onKeyDown={handleKeyDown} tabIndex={0}>
      <Grid container spacing={1} justifyContent="center">
        {/* Fractal Type Switch */}
        <Grid item xs={12} sm={6} md={4}>
          <Tooltip title="Cycle through different fractal types" placement="top">
            <Button
  fullWidth
  variant="contained"
  color="primary"
  onClick={() => {
    const types = ["mandelbrot", "julia", "burning-ship", "mandelbar"];
    const currentIndex = types.indexOf(fractalType);
    setFractalType(types[(currentIndex + 1) % types.length]);
  }}
>
  Switch to{" "}
  {fractalType === "mandelbrot" ? "Julia" : 
   fractalType === "julia" ? "Burning Ship" : 
   fractalType === "burning-ship" ? "Mandelbar" :
   "Mandelbrot"}
</Button>
          </Tooltip>
        </Grid>

        {/* Zoom Controls */}
        <Grid item xs={12} sm={6} md={4}>
          <Box display="flex" justifyContent="center" gap={0}>
            <Tooltip title="Zoom in (also + key)" placement="top">
              <IconButton
                color="primary"
                onClick={() => animateZoom(zoom * 1.5, offsetX, offsetY)}
                aria-label="Zoom in"
              >
                <ZoomIn />
              </IconButton>
            </Tooltip>
            <Tooltip title="Zoom out (also - key)" placement="top">
              <IconButton
                color="primary"
                onClick={() => animateZoom(zoom / 1.5, offsetX, offsetY)}
                aria-label="Zoom out"
              >
                <ZoomOut />
              </IconButton>
            </Tooltip>
            <Tooltip title="Reset view (also 0 key)" placement="top">
              <IconButton
                color="secondary"
                onClick={resetView}
                aria-label="Reset view"
              >
                <RestartAlt />
              </IconButton>
            </Tooltip>
            <Tooltip title="Download current view as PNG" placement="top">
              <IconButton
                color="success"
                onClick={handleDownload}
                aria-label="Download image"
              >
                <Download />
              </IconButton>
            </Tooltip>
          </Box>
        </Grid>

        {/* Navigation Controls */}
        <Grid item xs={12}>
          <Box display="flex" justifyContent="center" gap={0}>
            <Tooltip title="Move left (also ← key)" placement="top">
              <IconButton onClick={() => move(50, 0)} aria-label="Move left">
                <NavigateBefore />
              </IconButton>
            </Tooltip>
            <Tooltip title="Move right (also → key)" placement="top">
              <IconButton onClick={() => move(-50, 0)} aria-label="Move right">
                <NavigateNext />
              </IconButton>
            </Tooltip>
            <Tooltip title="Move up (also ↑ key)" placement="top">
              <IconButton onClick={() => move(0, 50)} aria-label="Move up">
                <ArrowUpward />
              </IconButton>
            </Tooltip>
            <Tooltip title="Move down (also ↓ key)" placement="top">
              <IconButton onClick={() => move(0, -50)} aria-label="Move down">
                <ArrowDownward />
              </IconButton>
            </Tooltip>
          </Box>
        </Grid>

        {/* Color Scheme Selector */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Color Scheme</InputLabel>
            <Select
              sx={{ height: 40}}
              value={colorScheme}
              label="Color Scheme"
              onChange={(e) => setColorScheme(e.target.value)}
            >
              <MenuItem value="classic">Classic</MenuItem>
              <MenuItem value="grayscale">Grayscale</MenuItem>
              <MenuItem value="fiery">Fiery</MenuItem>
              <MenuItem value="oceanic">Oceanic</MenuItem>
              <MenuItem value="forest">Forest</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Iteration Controls */}
        <Grid item xs={12} sm={6}>
          <Box display="flex" alignItems="center" gap={0}>
            <Tooltip title="Higher values show more detail but render slower" placement="top">
              <TextField
                label="Max Iterations"
                type="number"
                value={maxIter}
                onChange={(e) => setMaxIter(parseInt(e.target.value))}
                size="small"
                inputProps={{ min: 10, max: 1000, step: 10 }}
                sx={{ width: 70 }}
              />
            </Tooltip>
          </Box>
        </Grid>

        {/* Julia Set Parameters */}
        {fractalType === "julia" && (
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" gap={1}>
              <Tooltip title="Real component of Julia constant" placement="top">
                <TextField
                  label="Real"
                  type="number"
                  value={juliaCX}
                  onChange={(e) => setJuliaCX(parseFloat(e.target.value))}
                  size="small"
                  inputProps={{ step: "0.01" }}
                  sx={{ width: 70 }}
                />
              </Tooltip>
              <Tooltip title="Imaginary component of Julia constant" placement="top">
                <TextField
                  label="Imaginary"
                  type="number"
                  value={juliaCY}
                  onChange={(e) => setJuliaCY(parseFloat(e.target.value))}
                  size="small"
                  inputProps={{ step: "0.01" }}
                  sx={{ width: 90 }}
                />
              </Tooltip>
            </Box>
          </Grid>
        )}

        {/* View History */}
        <Grid item xs={12}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap={1}
          >
            <Tooltip title="Save current zoom and position" placement="top">
              <Button variant="outlined" startIcon={<Save />} onClick={saveView}>
                Save Current View
              </Button>
            </Tooltip>

            {viewHistory.length > 0 && (
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Load Saved View</InputLabel>
                <Select
                  label="Load Saved View"
                  onChange={(e) => restoreView(e.target.value)}
                >
                  <MenuItem value="">Select a view...</MenuItem>
                  {viewHistory.map((view, i) => (
                    <MenuItem key={i} value={i}>
                      {new Date(view.timestamp).toLocaleTimeString()} -{" "}
                      {view.fractalType} (zoom: {Math.round(view.zoom)})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Box>
        </Grid>

      </Grid>
    </Paper>
  );
}