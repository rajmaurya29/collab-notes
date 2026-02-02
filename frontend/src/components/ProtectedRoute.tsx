import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchUser } from '../store/slices/authSlice';
import Loader from './Loader';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.auth);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (!user) {
        try {
          await dispatch(fetchUser()).unwrap();
        } catch (error) {
          console.log('Not authenticated');
        }
      }
      setIsChecking(false);
    };

    checkAuth();
  }, [dispatch, user]);

  if (isChecking || loading) {
    return <Loader fullScreen message="Checking authentication..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
