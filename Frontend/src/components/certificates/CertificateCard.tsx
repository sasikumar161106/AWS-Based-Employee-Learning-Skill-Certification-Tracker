import React from 'react';
import { Card, CardContent, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Eye, Download, ShieldCheck, Award } from 'lucide-react';
import { Certificate } from '../../types';
import { formatDate } from '../../utils/helpers';

interface CertificateCardProps {
  certificate: Certificate;
  onViewClick: () => void;
  onDownloadClick: () => void;
  onVerifyClick: () => void;
}

export const CertificateCard: React.FC<CertificateCardProps> = ({
  certificate,
  onViewClick,
  onDownloadClick,
  onVerifyClick
}) => {
  return (
    <Card hoverable className="flex flex-col h-full bg-white relative">
      {/* Decorative Ribbon Icon */}
      <div className="absolute top-0 right-6 transform -translate-y-1/3 bg-brand-600 text-white rounded-b-lg p-2 shadow-md">
        <Award className="w-5 h-5" />
      </div>

      <CardContent className="flex-1 space-y-4 pt-6">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-100">
            {certificate.skill} Certified
          </span>
        </div>

        <div className="space-y-1.5">
          <h3 className="font-bold text-base text-slate-900 leading-snug line-clamp-1">
            {certificate.courseName}
          </h3>
          <p className="text-xs text-slate-500">
            Recipient: <span className="font-bold text-slate-700">{certificate.employeeName}</span>
          </p>
        </div>

        <div className="bg-slate-50 rounded-lg p-3 text-[11px] space-y-2 border border-slate-100">
          <div className="flex justify-between">
            <span className="text-slate-450 font-medium">Certificate ID:</span>
            <span className="font-mono font-bold text-slate-700">{certificate.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-450 font-medium">Earned Date:</span>
            <span className="font-bold text-slate-700">{formatDate(certificate.completionDate)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-450 font-medium">Status:</span>
            <Badge variant="success" className="text-[9px] px-1.5 py-0">Verified</Badge>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-2 border-t border-slate-100 grid grid-cols-3 gap-2">
        <Button
          onClick={onViewClick}
          variant="outline"
          size="sm"
          leftIcon={<Eye className="w-3.5 h-3.5" />}
          className="px-2"
        >
          View
        </Button>
        <Button
          onClick={onDownloadClick}
          variant="outline"
          size="sm"
          leftIcon={<Download className="w-3.5 h-3.5" />}
          className="px-2"
        >
          Print
        </Button>
        <Button
          onClick={onVerifyClick}
          variant="outline"
          size="sm"
          leftIcon={<ShieldCheck className="w-3.5 h-3.5" />}
          className="px-2"
        >
          Verify
        </Button>
      </CardFooter>
    </Card>
  );
};
export default CertificateCard;
