import { useState, useEffect } from 'react';

const useDashboardData = () => {
  const [salesData, setSalesData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [stats, setStats] = useState({
    ventasTotales: 0,
    ordenes: 0,
    usuarios: 0,
    productos: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

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
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return {
    salesData,
    productData,
    recentOrders,
    stats,
    loading,
    error
  };
};

export default useDashboardData;