import { useState, useCallback } from 'react';
import { Certificate } from '../types';
import { certificateService } from '../services/certificateService';
import { useToast } from '../context/ToastContext';

export const useCertificates = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const fetchCertificates = useCallback(async (employeeId: string): Promise<Certificate[]> => {
    setLoading(true);
    setError(null);
    try {
      const data = await certificateService.getCertificates(employeeId);
      setCertificates(data);
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch certificates');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyCertificate = useCallback(async (certId: string): Promise<Certificate | null> => {
    setLoading(true);
    setError(null);
    try {
      const cert = await certificateService.verifyCertificate(certId);
      return cert;
    } catch (err: any) {
      setError(err.message || 'Failed to verify certificate');
      showToast('Error verifying certificate', 'error');
      return null;
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  return {
    certificates,
    loading,
    error,
    fetchCertificates,
    verifyCertificate
  };
};
