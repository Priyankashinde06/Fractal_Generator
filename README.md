A React.js application for exploring Mandelbrot, Julia, and Burning Ship fractals with interactive zoom, pan, and customizable rendering.

https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDZ4eW5mY2VqY2V6eGJ2Z3B6dGJ6YzN6dGJ6YzN6dGJ6YzN6dGJ6YzN6/giphy.gif (Example GIF - replace with your own recording)

Features ✨
✅ Multiple Fractal Types

Mandelbrot Set

Julia Set (with adjustable parameters)

Burning Ship Fractal

🎨 6 Color Schemes

Classic, Grayscale, Fiery, Oceanic, Psychedelic, Forest

🖱️ Interactive Controls

Zoom: Mouse wheel / touch pinch / buttons

Pan: Click & drag / arrow keys

Reset View: One-click back to default

📸 Download

Save high-quality PNG of the current fractal view

🔖 View History

Bookmark favorite positions and restore them later

📱 Fully Responsive

Works on desktop, tablet, and mobile

Tech Stack ⚙️
React.js (Functional Components + Hooks)

Material-UI (UI Components & Styling)

HTML5 Canvas (Fractal Rendering)

Debounced Resize Handling (Performance Optimization)

Installation & Setup 🛠️
Clone the repository


git clone https://github.com/your-username/fractal-explorer.git
cd fractal-explorer
Install dependencies

bash
npm install
# or
yarn install
Run the app

bash
npm start
# or
yarn start
Open in browser
Visit http://localhost:3000

Deployment 🚀
Hosted live on Vercel | Netlify (replace with your link)

Code Highlights 💡
Optimized Rendering: Uses requestAnimationFrame for smooth zoom animations.

Mobile-Friendly: Touch events for pan/zoom on smartphones.

Dynamic Cursors: Changes between pointer (Mandelbrot) and grab (Julia/Burning Ship).

Future Improvements 🔮
WebGL acceleration (via react-three-fiber)

More fractals (e.g., Newton, Barnsley Fern)

Shareable view links (URL parameters)

License 📜
MIT © Your Name

How to Use 🎮
Switch fractals → Click the "Switch to..." button.

Zoom → Mouse wheel or +/- buttons.

Pan → Drag or arrow keys.

Save/restore views → Click the bookmark icon.

