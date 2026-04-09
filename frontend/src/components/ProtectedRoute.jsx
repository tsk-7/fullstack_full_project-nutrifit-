import { Navigate } from 'react-router-dom';
import { useNutrition } from '../context/NutritionContext';

const decodeRole = (tokenValue) => {
    try {
        if (!tokenValue) return '';
        const token = typeof tokenValue === 'string' ? tokenValue : String(tokenValue);
        const payloadPart = token.split('.')[1];
        if (!payloadPart) return '';
        const base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
        const normalized = base64.padEnd(base64.length + (4 - (base64.length % 4 || 4)) % 4, '=');
        const payload = JSON.parse(atob(normalized));
        return String(payload?.role || '').toLowerCase();
    } catch {
        return '';
    }
};

const loginPathByRole = {
    admin: '/admin-login',
    doctor: '/doctor-login',
    user: '/login'
};

const homePathByRole = {
    admin: '/admin',
    doctor: '/doctor-dashboard',
    user: '/dashboard'
};

const ProtectedRoute = ({ roles = [], children }) => {
    const { jwtToken } = useNutrition();
    const role = decodeRole(jwtToken);

    if (!jwtToken || !role) {
        const firstRole = roles[0] || 'user';
        return <Navigate to={loginPathByRole[firstRole] || '/login'} replace />;
    }

    if (roles.length > 0 && !roles.includes(role)) {
        return <Navigate to={homePathByRole[role] || '/'} replace />;
    }

    return children;
};

export default ProtectedRoute;