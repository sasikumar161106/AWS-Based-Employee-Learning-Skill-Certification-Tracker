import { Certificate } from '../types';
import { getStoredCertificates } from './assignmentService';

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const certificateService = {
  async getCertificates(employeeId: string): Promise<Certificate[]> {
    await delay(300);
    const certs = getStoredCertificates();
    return certs.filter(c => c.employeeId === employeeId);
  },

  async verifyCertificate(certificateId: string): Promise<Certificate | null> {
    await delay();
    const certs = getStoredCertificates();
    const cert = certs.find(c => c.id.toLowerCase() === certificateId.toLowerCase().trim());
    return cert || null;
  }
};
