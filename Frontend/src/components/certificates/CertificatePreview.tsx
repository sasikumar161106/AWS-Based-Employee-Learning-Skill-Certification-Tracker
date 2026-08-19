import React from 'react';
import { Award, ShieldCheck, Printer, Calendar, User, CheckCircle2 } from 'lucide-react';
import { Certificate } from '../../types';
import { formatDate } from '../../utils/helpers';
import { Button } from '../ui/Button';

interface CertificatePreviewProps {
  certificate: Certificate;
  onPrint?: () => void;
}

export const CertificatePreview: React.FC<CertificatePreviewProps> = ({
  certificate,
  onPrint
}) => {
  const handlePrintAction = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  return (
    <div className="bg-slate-50 p-2 sm:p-4 rounded-xl border border-slate-200">
      {/* Control panel */}
      <div className="no-print flex justify-end mb-4 gap-2">
        <Button
          onClick={handlePrintAction}
          variant="outline"
          size="sm"
          leftIcon={<Printer className="w-4 h-4" />}
        >
          Print Certificate
        </Button>
      </div>

      {/* The Printable Certificate Frame */}
      <div className="bg-white border-[16px] border-double border-slate-800 p-8 sm:p-12 relative overflow-hidden shadow-inner text-center font-serif text-slate-800 select-none max-w-3xl mx-auto print:border-[16px] print:shadow-none">
        
        {/* Corner Decorations */}
        <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-slate-700 print:border-slate-850" />
        <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-slate-700 print:border-slate-850" />
        <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-slate-700 print:border-slate-850" />
        <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-slate-700 print:border-slate-850" />

        {/* Certificate Seal Badge */}
        <div className="flex justify-center mb-6">
          <div className="bg-brand-50 rounded-full p-4 border border-brand-200 shadow-md">
            <Award className="w-12 h-12 text-brand-600" />
          </div>
        </div>

        {/* Typography Content */}
        <span className="text-xs uppercase font-sans font-bold tracking-[0.2em] text-slate-450 block mb-2 leading-none">
          Certificate of Completion
        </span>
        <h2 className="text-xl sm:text-2xl font-bold font-sans text-slate-900 border-b-2 border-slate-100 pb-3 mb-6 max-w-md mx-auto print:text-slate-900">
          LEARNTRACKER ACADEMY
        </h2>

        <p className="text-sm italic font-medium text-slate-500 mb-2 font-serif">
          This is to officially certify that
        </p>
        
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-700 font-sans tracking-wide my-4 py-2 border-b border-dashed border-slate-200 max-w-lg mx-auto print:text-brand-900">
          {certificate.employeeName}
        </h1>

        <p className="text-sm leading-relaxed text-slate-500 max-w-md mx-auto mb-6 font-serif">
          has successfully fulfilled all course requirements and passed the certified assessment module for the vocational competency program:
        </p>

        <h3 className="text-lg sm:text-xl font-bold font-sans text-slate-800 tracking-wide my-4">
          {certificate.courseName}
        </h3>

        <p className="text-xs uppercase font-sans font-bold tracking-wider text-emerald-700 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100 max-w-xs mx-auto mb-8">
          Authorized Skill: {certificate.skill} Specialist
        </p>

        {/* Signatures & Info Row */}
        <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-100 text-slate-500 text-xs font-sans mt-8">
          {/* Completion Date */}
          <div className="text-left">
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Date of Certification</span>
            <div className="flex items-center gap-1.5 mt-2 font-semibold text-slate-800">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>{formatDate(certificate.completionDate)}</span>
            </div>
          </div>

          {/* Secure verify tag */}
          <div className="text-right flex flex-col items-end">
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Security & Verification</span>
            <div className="flex items-center gap-1 mt-2 text-emerald-600 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span className="font-mono text-[10px] tracking-tight">{certificate.id}</span>
            </div>
          </div>
        </div>

        {/* Signatures Line */}
        <div className="mt-12 flex justify-between items-end border-t border-slate-100 pt-8 font-sans max-w-lg mx-auto">
          <div className="text-center w-40">
            <div className="font-serif italic text-sm text-slate-700 border-b border-slate-200 pb-1 font-bold">Jane Doe</div>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1 block">Course Director</span>
          </div>
          <div className="text-center w-40">
            <div className="font-serif italic text-sm text-slate-700 border-b border-slate-200 pb-1 font-bold">LearnTracker Team</div>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1 block">LMS Coordinator</span>
          </div>
        </div>

      </div>
    </div>
  );
};
export default CertificatePreview;
