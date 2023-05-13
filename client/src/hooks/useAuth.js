import jwtDecode from 'jwt-decode';
import { useSelector } from 'react-redux';
import { selectCurrentToken } from '../features/auth/authSlice';

const useAuth = () => {
    const token = useSelector(state => selectCurrentToken(state));
    let isManager = false;
    let isAdmin = false;
    let status = 'Employee';

    if (token) {
        const decode = jwtDecode(token);
        const { username, roles } = decode.userInfo;

        isManager = roles.includes('Manager');
        isAdmin = roles.includes('Admin');

        if (isManager) status = 'Manager';
        if (isAdmin) status = 'Admin';

        return { username, roles, isManager, isAdmin, status }
    }

    return { username: '', roles: [], isManager, isAdmin, status }
}

export default useAuth;