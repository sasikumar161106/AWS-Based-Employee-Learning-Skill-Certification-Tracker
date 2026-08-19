import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCertificates } from '../../hooks/useCertificates';
import { Certificate } from '../../types';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ShieldCheck, ShieldAlert, Award, Calendar, User, BookOpen, ArrowLeft, Loader2 } from 'lucide-react';
import { formatDate } from '../../utils/helpers';

export const VerifyCertificate: React.FC = () => {
  const { certificateId } = useParams<{ certificateId?: string }>();
  const navigate = useNavigate();
  const { verifyCertificate } = useCertificates();

  const [searchId, setSearchId] = useState(certificateId || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Certificate | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const performVerification = async (idToSearch: string) => {
    if (!idToSearch.trim()) return;
    setLoading(true);
    setHasSearched(true);
    try {
      const data = await verifyCertificate(idToSearch);
      setResult(data);
    } catch (err) {
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (certificateId) {
      setSearchId(certificateId);
      performVerification(certificateId);
    }
  }, [certificateId]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performVerification(searchId);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex bg-brand-50 text-brand-600 rounded-full p-2 border border-brand-100 shadow-sm">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            LMS Credential Verification
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Verify the authenticity of vocational course credentials.
          </p>
        </div>

        {/* Verification Card */}
        <Card className="shadow-lg border border-slate-200">
          <CardContent className="p-6 md:p-8 space-y-6">
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <Input
                label="Enter Certificate ID"
                placeholder="e.g. CERT-2026-001"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                required
                disabled={loading}
              />
              <Button
                type="submit"
                isLoading={loading}
                className="w-full font-bold"
              >
                Verify Certificate
              </Button>
            </form>

            {/* Results Panel */}
            {hasSearched && !loading && (
              <div className="pt-6 border-t border-slate-100 space-y-4 animate-in fade-in duration-200">
                {result ? (
                  // Valid Certificate Layout
                  <div className="space-y-4">
                    <div className="flex gap-2.5 p-3.5 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-100 text-xs font-semibold leading-relaxed">
                      <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
                      <div>
                        <span className="font-bold text-sm block">Certificate Verified</span>
                        <span className="text-emerald-700 block mt-0.5">This credential ID is authentic and matches internal databases.</span>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3.5 text-xs text-slate-650">
                      <div className="flex items-start justify-between gap-4 border-b border-slate-200/50 pb-2">
                        <span className="text-slate-450 font-bold uppercase tracking-wider text-[10px]">Certificate ID:</span>
                        <span className="font-mono font-bold text-slate-900 text-right">{result.id}</span>
                      </div>
                      
                      <div className="flex items-start gap-3 border-b border-slate-200/50 pb-2">
                        <User className="w-4 h-4 text-slate-400 shrink-0" />
                        <div>
                          <span className="text-slate-450 font-medium block">Employee Name</span>
                          <span className="font-bold text-slate-950 block mt-0.5">{result.employeeName}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 border-b border-slate-200/50 pb-2">
                        <BookOpen className="w-4 h-4 text-slate-400 shrink-0" />
                        <div>
                          <span className="text-slate-450 font-medium block">Certified Course</span>
                          <span className="font-bold text-slate-950 block mt-0.5">{result.courseName}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                        <div>
                          <span className="text-slate-450 font-medium block">Completion Date</span>
                          <span className="font-bold text-slate-950 block mt-0.5">{formatDate(result.completionDate)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Invalid Certificate Layout
                  <div className="flex gap-2.5 p-3.5 bg-rose-50 text-rose-800 rounded-xl border border-rose-100 text-xs font-semibold leading-relaxed">
                    <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
                    <div>
                      <span className="font-bold text-sm block">Certificate Not Found</span>
                      <span className="text-rose-700 block mt-0.5">The credential ID entered could not be verified. Please double-check characters or query dates.</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {loading && (
              <div className="pt-8 flex items-center justify-center gap-2 text-sm text-slate-500 font-medium">
                <Loader2 className="w-5 h-5 animate-spin text-brand-600" />
                <span>Checking records database...</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Back Link */}
        <div className="text-center">
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 focus:outline-none"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Sign In</span>
          </button>
        </div>
      </div>
    </div>
  );
};
export default VerifyCertificate;
