import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const PrivateRoute = ({ allowedRoles = [], redirectTo = '/login' }) => {
    const { isLoggedIn, user, isLoading } = useAuth()

    // Mostrar loading mientras se verifica la autenticación
    if (isLoading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                fontSize: '18px'
            }}>
                Verificando autenticación...
            </div>
        )
    }

    // Si no está logueado, redirigir al login
    if (!isLoggedIn) {
        return <Navigate to={redirectTo} replace />
    }

    // Si se especificaron roles permitidos, verificar el rol del usuario
    if (allowedRoles.length > 0 && user?.role) {
        const userRole = user.role.toLowerCase()
        const hasPermission = allowedRoles.some(role => 
            role.toLowerCase() === userRole
        )
        
        if (!hasPermission) {
            // Redirigir según el rol del usuario
            const redirectPath = userRole === 'administrador' ? '/admin-dashboard' : '/'
            return <Navigate to={redirectPath} replace />
        }
    }

    // Si todo está bien, renderizar el componente protegido
    return <Outlet />
}

export default PrivateRoute