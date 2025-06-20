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
  Tooltip,
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
  Bookmark,
  History,
} from "@mui/icons-material";

export default function ControlsPanel({
  fractalType,
  setFractalType,
  zoom,
  animateZoom,
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
}) {
  return (
    <Paper elevation={2} sx={{ p: 2, mb: 3, mt: 1 }}>
      <Grid container spacing={2}>
        {/* Fractal Type Switch */}
        <Grid item xs={12} sm={6}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => {
              setFractalType(
                fractalType === "mandelbrot"
                  ? "julia"
                  : fractalType === "julia"
                  ? "burning-ship"
                  : "mandelbrot"
              );
            }}
          >
            Switch to{" "}
            {fractalType === "mandelbrot"
              ? "Julia Set"
              : fractalType === "julia"
              ? "Burning Ship"
              : "Mandelbrot Set"}
          </Button>
        </Grid>

        {/* Zoom Controls */}
        <Grid item xs={12} sm={6} sx={{ml: -1}}>
          <Box display="flex" justifyContent="center" gap={0}>
            <Tooltip title="Zoom in">
              <IconButton onClick={() => animateZoom(zoom * 1.5,offsetX, offsetY)}>
                <ZoomIn />
              </IconButton>
            </Tooltip>
            <Tooltip title="Zoom out">
              <IconButton onClick={() => animateZoom(zoom / 1.5,offsetX, offsetY)}>
                <ZoomOut />
              </IconButton>
            </Tooltip>
            <Tooltip title="Reset view">
              <IconButton onClick={resetView} color="secondary">
                <RestartAlt />
              </IconButton>
            </Tooltip>
            <Tooltip title="Download image">
              <IconButton onClick={handleDownload} color="success">
                <Download />
              </IconButton>
            </Tooltip>
            <Tooltip title="Save current view">
              <IconButton onClick={saveView} color="info">
                <Bookmark />
              </IconButton>
            </Tooltip>
          </Box>
        </Grid>

        {/* Navigation Controls */}
        <Grid item xs={12} sx={{ml: -2}}>
          <Box display="flex" justifyContent="center" gap={0}>
            <IconButton onClick={() => move(50, 0)}>
              <NavigateBefore />
            </IconButton>
            <IconButton onClick={() => move(-50, 0)}>
              <NavigateNext />
            </IconButton>
            <IconButton onClick={() => move(0, 50)}>
              <ArrowUpward />
            </IconButton>
            <IconButton onClick={() => move(0, -50)}>
              <ArrowDownward />
            </IconButton>
          </Box>
        </Grid>

        {/* Color Scheme Selector */}
        <Grid item xs={12} sm={6} >
          <FormControl fullWidth>
            <InputLabel>Color Scheme</InputLabel>
            <Select
              value={colorScheme}
              label="Color Scheme"
              sx={{ height: 40 }}
              onChange={(e) => setColorScheme(e.target.value)}
            >
              <MenuItem value="classic">Classic</MenuItem>
              <MenuItem value="grayscale">Grayscale</MenuItem>
              <MenuItem value="fiery">Fiery</MenuItem>
              <MenuItem value="oceanic">Oceanic</MenuItem>
              <MenuItem value="psychedelic">Psychedelic</MenuItem>
              <MenuItem value="forest">Forest</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            sx={{
              height: "40px", // Set height
              "& .MuiInputBase-root": {
                // Target the input container
                height: "70px", // Ensure inner elements match
              },
              "& .MuiInputBase-input": {
                // Target the input itself
                padding: "0 8px", // Reduce padding to fit
                fontSize: "14px", // Optional: make text smaller
              },
            }}
            label="Max Iterations"
            type="number"
            value={maxIter}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              setMaxIter(Math.min(1000, Math.max(10, value || 100)));
            }}
            inputProps={{ min: 10, max: 1000 }}
            fullWidth
          />
        </Grid>

        {/* Julia Set Parameters */}
        {fractalType === "julia" && (
          <Grid item xs={12}>
            <Box display="flex" gap={2} justifyContent="center">
              <TextField
                sx={{
                  height: "40px",
                  width: "90px", // Set height
                  "& .MuiInputBase-root": {
                    // Target the input container
                    height: "70px", // Ensure inner elements match
                  },
                  "& .MuiInputBase-input": {
                    // Target the input itself
                    padding: "0 8px", // Reduce padding to fit
                    fontSize: "14px", // Optional: make text smaller
                  },
                }}
                label="Julia Real"
                type="number"
                value={juliaCX}
                onChange={(e) => setJuliaCX(parseFloat(e.target.value))}
                inputProps={{ step: "0.01" }}
              />
              <TextField
                label="Julia Imaginary"
                type="number"
                value={juliaCY}
                onChange={(e) => setJuliaCY(parseFloat(e.target.value))}
                inputProps={{ step: "0.01" }}
                 sx={{
                  height: "40px",
                  width: "90px", // Set height
                  "& .MuiInputBase-root": {
                    // Target the input container
                    height: "70px", // Ensure inner elements match
                  },
                  "& .MuiInputBase-input": {
                    // Target the input itself
                    padding: "0 8px", // Reduce padding to fit
                    fontSize: "14px", // Optional: make text smaller
                  },
                }}
              />
            </Box>
          </Grid>
        )}

        {/* View History */}
        {viewHistory.length > 0 && (
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom sx={{mt: 0}}>
              
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap" justifyContent="center">
              {viewHistory.map((view, index) => (
                <Tooltip
                  key={index}
                  title={`Zoom: ${Math.round(
                    view.zoom
                  )}, X: ${view.offsetX.toFixed(2)}, Y: ${view.offsetY.toFixed(
                    2
                  )}`}
                >
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<History />}
                    onClick={() => restoreView(index)}
                  >
                    View {index + 1}
                  </Button>
                </Tooltip>
              ))}
            </Box>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
}
