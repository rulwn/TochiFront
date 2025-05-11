import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './AdminDashboard.css';

const AdminDashboard = () => {
  // Datos de prueba para los gráficos
  const salesData = [
    { name: 'Ene', ventas: 4000 },
    { name: 'Feb', ventas: 3000 },
    { name: 'Mar', ventas: 2000 },
    { name: 'Abr', ventas: 2780 },
    { name: 'May', ventas: 1890 },
    { name: 'Jun', ventas: 2390 },
  ];

  const productData = [
    { name: 'Producto A', value: 400 },
    { name: 'Producto B', value: 300 },
    { name: 'Producto C', value: 300 },
    { name: 'Producto D', value: 200 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="admin-dashboard">
      <h1 className="dashboard-title">Panel de Administración</h1>
      
      <div className="stats-container">
        <div className="stat-card">
          <h3>Ventas Totales</h3>
          <p>$24,780</p>
          <span>+12% vs mes anterior</span>
        </div>
        
        <div className="stat-card">
          <h3>Órdenes</h3>
          <p>189</p>
          <span>+8% vs mes anterior</span>
        </div>
        
        <div className="stat-card">
          <h3>Usuarios</h3>
          <p>1,243</p>
          <span>+5% vs mes anterior</span>
        </div>
        
        <div className="stat-card">
          <h3>Productos</h3>
          <p>56</p>
          <span>+3 nuevos este mes</span>
        </div>
      </div>
      
      <div className="charts-row">
        <div className="chart-container">
          <h3>Ventas Mensuales</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="ventas" fill="#00BF63" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="chart-container">
          <h3>Productos Más Vendidos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={productData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {productData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="recent-orders">
        <h3>Órdenes Recientes</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>#1001</td>
              <td>Juan Pérez</td>
              <td>2023-06-15</td>
              <td>$120.50</td>
              <td className="status-completed">Completado</td>
            </tr>
            <tr>
              <td>#1002</td>
              <td>María Gómez</td>
              <td>2023-06-14</td>
              <td>$85.20</td>
              <td className="status-pending">Pendiente</td>
            </tr>
            <tr>
              <td>#1003</td>
              <td>Carlos López</td>
              <td>2023-06-14</td>
              <td>$210.00</td>
              <td className="status-shipped">Enviado</td>
            </tr>
            <tr>
              <td>#1004</td>
              <td>Ana Martínez</td>
              <td>2023-06-13</td>
              <td>$65.75</td>
              <td className="status-completed">Completado</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;