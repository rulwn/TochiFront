import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [salesData, setSalesData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [stats, setStats] = useState({
    ventasTotales: 0,
    ordenes: 0,
    usuarios: 0,
    productos: 0
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28CFE', '#FF6F61'];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch ordenes
        const resOrder = await fetch('https://tochi-api.onrender.com/api/order');
        const orders = await resOrder.json();

        // Agrupar ventas por mes
        const monthlySales = {};
        let totalVentas = 0;

        orders.forEach(order => {
          const date = new Date(order.createdAt);
          const month = date.getMonth(); // 0 = Ene
          const amount = order.total || 0;
          monthlySales[month] = (monthlySales[month] || 0) + amount;
          totalVentas += amount;
        });

        const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const salesArray = Object.entries(monthlySales).map(([month, total]) => ({
          name: monthNames[parseInt(month)],
          ventas: total
        }));

        // Obtener las últimas 4 órdenes
        const recent = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4);

        // Fetch productos
        const resProducts = await fetch('https://tochi-api.onrender.com/api/products');
        const products = await resProducts.json();

        // Contar los productos más vendidos (simulación por falta de campo real)
        const topProducts = products.slice(0, 4).map(product => ({
          name: product.name,
          value: product.sold || Math.floor(Math.random() * 100 + 50) // fallback si no hay campo sold
        }));

        // Fetch usuarios
        const resUsers = await fetch('https://tochi-api.onrender.com/api/users');
        const users = await resUsers.json();

        setStats({
          ventasTotales: totalVentas.toFixed(2),
          ordenes: orders.length,
          usuarios: users.length,
          productos: products.length
        });

        setSalesData(salesArray);
        setProductData(topProducts);
        setRecentOrders(recent);

      } catch (err) {
        console.error('Error cargando datos del dashboard:', err);
      }
    };

    fetchDashboardData();
  }, []);

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
