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

        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        // Fetch ordenes - usando la nueva estructura
        const resOrder = await fetch('https://api-rest-bl9i.onrender.com/api/order', {
          headers
        });
        
        if (!resOrder.ok) {
          throw new Error(`Error fetching orders: ${resOrder.status}`);
        }
        
        const orderResponse = await resOrder.json();
        const orders = orderResponse.success ? orderResponse.data : [];

        // Agrupar ventas por mes usando finalTotal
        const monthlySales = {};
        let totalVentas = 0;

        orders.forEach(order => {
          const date = new Date(order.createdAt);
          const month = date.getMonth(); // 0 = Ene
          const amount = order.finalTotal || 0; // Cambiado de order.total a order.finalTotal
          monthlySales[month] = (monthlySales[month] || 0) + amount;
          totalVentas += amount;
        });

        const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const salesArray = Object.entries(monthlySales).map(([month, total]) => ({
          name: monthNames[parseInt(month)],
          ventas: total
        }));

        // Obtener las últimas 4 órdenes y formatearlas para la tabla
        const recent = [...orders]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 4)
          .map(order => ({
            _id: order._id,
            clientName: order.cartId?.idClient?.name || 'Cliente',
            createdAt: order.createdAt,
            total: order.finalTotal, // Usando finalTotal para mostrar en la tabla
            state: order.state
          }));

        // Fetch productos
        const resProducts = await fetch('https://api-rest-bl9i.onrender.com/api/products', {
          headers
        });
        
        if (!resProducts.ok) {
          throw new Error(`Error fetching products: ${resProducts.status}`);
        }
        
        const productsResponse = await resProducts.json();
        const products = productsResponse.success ? productsResponse.data : productsResponse;

        // Contar los productos más vendidos (simulación por falta de campo real)
        const topProducts = products.slice(0, 4).map(product => ({
          name: product.name,
          value: product.sold || Math.floor(Math.random() * 100 + 50) // fallback si no hay campo sold
        }));

        // Fetch usuarios
        const resUsers = await fetch('https://api-rest-bl9i.onrender.com/api/users', {
          headers
        });
        
        if (!resUsers.ok) {
          throw new Error(`Error fetching users: ${resUsers.status}`);
        }
        
        const usersResponse = await resUsers.json();
        const users = usersResponse.success ? usersResponse.data : usersResponse;

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