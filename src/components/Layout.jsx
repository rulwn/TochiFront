import { Link } from 'react-router-dom'; // Removí NavLink ya que no lo estás usando

export default function Layout({ children }) {
  return (
    <div>
      <nav>
        <ul style={{ listStyle: 'none', display: 'flex', gap: '20px', padding: 0 }}>
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/about">Acerca de</Link></li>
        </ul>
      </nav>
      
      <main style={{ margin: '20px' }}>
        {children}
      </main>
    </div>
  );
}