import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useCertificates } from '../../hooks/useCertificates';
import { CertificateCard } from '../../components/certificates/CertificateCard';
import { CertificatePreview } from '../../components/certificates/CertificatePreview';
import { Modal } from '../../components/ui/Modal';
import { LoadingState } from '../../components/ui/LoadingState';
import { EmptyState } from '../../components/ui/EmptyState';
import { Award, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { Certificate } from '../../types';

export const EmployeeCertificates: React.FC = () => {
  const { user } = useAuth();
  const { certificates, fetchCertificates, loading } = useCertificates();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [activeCert, setActiveCert] = useState<Certificate | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCertificates(user.id);
    }
  }, [user, fetchCertificates]);

  const handleViewCert = (cert: Certificate) => {
    setActiveCert(cert);
    setShowPreviewModal(true);
  };

  const handlePrintCert = (cert: Certificate) => {
    setActiveCert(cert);
    // Timeout to let state apply, then call print
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const handleVerifyCert = (cert: Certificate) => {
    navigate(`/verify/${cert.id}`);
  };

  if (loading) {
    return <LoadingState type="card" rows={2} />;
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-none">
          My Earned Certifications
        </h2>
        <p className="text-sm text-slate-500 mt-1 font-medium">
          Review and print secure certificates of completion for your completed skills.
        </p>
      </div>

      {certificates.length === 0 ? (
        <EmptyState
          icon={Award}
          title="No certifications earned yet"
          description="Complete 100% of the course modules, pass the assessment quiz with an 80% score, and unlock certificates."
          actionText="Browse Courses"
          onActionClick={() => navigate('/employee/courses')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map(cert => (
            <CertificateCard
              key={cert.id}
              certificate={cert}
              onViewClick={() => handleViewCert(cert)}
              onDownloadClick={() => handlePrintCert(cert)}
              onVerifyClick={() => handleVerifyCert(cert)}
            />
          ))}
        </div>
      )}

      {/* Certificate Viewer Modal */}
      <Modal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        title="Verified Credential Viewer"
        size="lg"
      >
        {activeCert && (
          <CertificatePreview 
            certificate={activeCert} 
            onPrint={() => window.print()}
          />
        )}
      </Modal>
    </div>
  );
};
export default EmployeeCertificates;
