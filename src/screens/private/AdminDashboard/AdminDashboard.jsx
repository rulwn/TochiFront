import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';
import useDashboardData from './hook/useDashboardData';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { 
    salesData, 
    productData, 
    recentOrders, 
    stats, 
    loading, 
    error 
  } = useDashboardData();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28CFE', '#FF6F61'];

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading">Cargando datos del dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard">
        <div className="error">Error al cargar los datos: {error}</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <h1 className="dashboard-title">Panel de Administración</h1>

      <div className="stats-container">
        <div className="stat-card">
          <h3>Ventas Totales</h3>
          <p>${stats.ventasTotales}</p>
          <span>+12% vs mes anterior</span>
        </div>

        <div className="stat-card">
          <h3>Órdenes</h3>
          <p>{stats.ordenes}</p>
          <span>+8% vs mes anterior</span>
        </div>

        <div className="stat-card">
          <h3>Usuarios</h3>
          <p>{stats.usuarios}</p>
          <span>+5% vs mes anterior</span>
        </div>

        <div className="stat-card">
          <h3>Productos</h3>
          <p>{stats.productos}</p>
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
            {recentOrders.map((order, index) => (
              <tr key={index}>
                <td>{order._id}</td>
                <td>{order.clientName || "Cliente"}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>${order.total ? order.total.toFixed(2) : '0.00'}</td>
                <td className={`status-${order.state?.toLowerCase() || 'pending'}`}>
                  {order.state || 'Pendiente'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;