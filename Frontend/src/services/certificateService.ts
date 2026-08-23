import { Certificate } from '../types';
import { getStoredCertificates } from './assignmentService';
import { quizApi, isApiEnabled } from '../utils/api';

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const certificateService = {
  async getCertificates(employeeId: string): Promise<Certificate[]> {
    await delay(300);
    const certs = getStoredCertificates();
    return certs.filter(c => c.employeeId === employeeId);
  },

  async verifyCertificate(certificateId: string): Promise<Certificate | null> {
    if (isApiEnabled()) {
      try {
        const response = await quizApi.get<{
          valid: boolean;
          certificate_id: string;
          employee_id: string;
          course_id: string;
          issued_date: string;
        }>(`/verify/${encodeURIComponent(certificateId.trim())}`);

        if (!response.data.valid) return null;

        return {
          id: response.data.certificate_id,
          employeeId: response.data.employee_id,
          courseId: response.data.course_id,
          courseName: response.data.course_id,
          employeeName: response.data.employee_id,
          completionDate: response.data.issued_date,
          status: 'valid',
          skill: 'General'
        };
      } catch (error: any) {
        if (error.response?.status === 404) return null;
        throw error;
      }
    }

    await delay();
    const certs = getStoredCertificates();
    const cert = certs.find(c => c.id.toLowerCase() === certificateId.toLowerCase().trim());
    return cert || null;
  }
};
