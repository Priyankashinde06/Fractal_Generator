export default function Loader() {
  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'rgba(0,0,0,0.7)',
      color: 'white',
      padding: '10px 20px',
      borderRadius: '5px'
    }}>
      <div className="spinner"></div>
      Rendering...
    </div>
  );
}