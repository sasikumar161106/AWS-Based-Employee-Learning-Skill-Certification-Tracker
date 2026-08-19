import { useState, useCallback } from 'react';
import { dashboardService } from '../services/dashboardService';

export const useDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [adminStats, setAdminStats] = useState<any>(null);
  const [employeeStats, setEmployeeStats] = useState<any>(null);
  const [skillMatrix, setSkillMatrix] = useState<any>(null);

  const fetchAdminStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dashboardService.getAdminStats();
      setAdminStats(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch admin stats');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEmployeeStats = useCallback(async (employeeId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await dashboardService.getEmployeeStats(employeeId);
      setEmployeeStats(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch employee stats');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSkillMatrix = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dashboardService.getSkillMatrix();
      setSkillMatrix(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch skill matrix');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    adminStats,
    employeeStats,
    skillMatrix,
    fetchAdminStats,
    fetchEmployeeStats,
    fetchSkillMatrix
  };
};
