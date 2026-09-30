import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Lock, Mail, Phone, User, CheckCircle2, ShieldCheck, ArrowRight, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { seoApi } from './api';

interface LeadCaptureModalProps {
  isOpen: boolean;
  jobId: string;
  onVerified: () => void;
}

export function LeadCaptureModal({ isOpen, jobId, onVerified }: LeadCaptureModalProps) {
  const [step, setStep] = useState<'info' | 'otp'>('info');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!phone || phone.trim().length < 7) {
      setError('Please enter a valid phone number with area code.');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const res = await seoApi.sendOtp({ email: email.trim(), phone: phone.trim(), jobId });
      toast.success('Verification code sent to your email!');
      if (res.dev_otp) {
        setDevOtpHint(res.dev_otp);
      }
      setStep('otp');
    } catch (err: any) {
      setError(err.message || 'Failed to send verification code. Please try again.');
      toast.error(err.message || 'Failed to send OTP code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!otpCode || otpCode.length < 6) {
      setError('Please enter the full 6-digit OTP verification code.');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await seoApi.verifyOtp({
        email: email.trim(),
        phone: phone.trim(),
        code: otpCode.trim(),
        name: name.trim(),
        jobId,
      });

      localStorage.setItem(`seo_verified_${jobId}`, 'true');
      localStorage.setItem('seo_verified_global', 'true');
      localStorage.setItem('seo_user_email', email);

      toast.success('Access verified! Unlocking SEO Audit Report.');
      onVerified();
    } catch (err: any) {
      setError(err.message || 'Invalid or expired OTP code. Please check and try again.');
      toast.error('OTP Verification Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[460px] p-0 overflow-hidden border-amber-200/50 shadow-2xl rounded-2xl [&>button]:hidden">
        {/* Header Branding */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 text-white text-center relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="w-12 h-12 bg-amber-500/20 border border-amber-400/30 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Lock className="w-6 h-6 text-amber-400" />
          </div>
          <DialogTitle className="text-xl font-bold text-white tracking-tight">
            Unlock Full SEO Audit Report
          </DialogTitle>
          <DialogDescription className="text-slate-300 text-xs mt-1.5 max-w-xs mx-auto">
            This report contains proprietary search performance insights. Enter your contact info to verify access.
          </DialogDescription>
        </div>

        <div className="p-6 space-y-5 bg-background">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
              <span className="font-semibold">Error:</span> {error}
            </div>
          )}

          {step === 'info' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="lead-name" className="text-xs font-semibold text-slate-700">Your Name (Optional)</Label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    id="lead-name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-9 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="lead-email" className="text-xs font-semibold text-slate-700">Email Address <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    id="lead-email"
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="lead-phone" className="text-xs font-semibold text-slate-700">Phone Number <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    id="lead-phone"
                    type="tel"
                    required
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-9 text-sm"
                  />
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium h-11 text-sm shadow-md mt-2">
                {loading ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <>
                    Send OTP Verification Code <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-5 text-center">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> OTP Code Sent to <span className="font-semibold">{email}</span>
                </div>
                <p className="text-xs text-muted-foreground">Check your inbox and enter the 6-digit verification code below.</p>
              </div>

              {devOtpHint && (
                <div className="p-2.5 bg-amber-50 border border-amber-300 text-amber-900 text-xs rounded-lg font-mono flex items-center justify-between">
                  <span>Dev Mode OTP Code: <strong className="text-sm text-amber-700 tracking-widest">{devOtpHint}</strong></span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 text-[10px] px-2 bg-amber-200/60 hover:bg-amber-300 text-amber-900"
                    onClick={() => { setOtpCode(devOtpHint); }}
                  >
                    Auto-fill
                  </Button>
                </div>
              )}

              <div className="flex justify-center py-2">
                <InputOTP
                  maxLength={6}
                  value={otpCode}
                  onChange={(val) => setOtpCode(val)}
                  onComplete={() => handleVerifyOtp()}
                >
                  <InputOTPGroup className="gap-2">
                    <InputOTPSlot index={0} className="w-10 sm:w-11 h-12 text-lg font-bold border-2 rounded-md" />
                    <InputOTPSlot index={1} className="w-10 sm:w-11 h-12 text-lg font-bold border-2 rounded-md" />
                    <InputOTPSlot index={2} className="w-10 sm:w-11 h-12 text-lg font-bold border-2 rounded-md" />
                    <InputOTPSlot index={3} className="w-10 sm:w-11 h-12 text-lg font-bold border-2 rounded-md" />
                    <InputOTPSlot index={4} className="w-10 sm:w-11 h-12 text-lg font-bold border-2 rounded-md" />
                    <InputOTPSlot index={5} className="w-10 sm:w-11 h-12 text-lg font-bold border-2 rounded-md" />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setStep('info')}
                  className="flex-1 text-xs"
                >
                  Change Email / Phone
                </Button>
                <Button
                  type="submit"
                  disabled={loading || otpCode.length < 6}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold h-9"
                >
                  {loading ? <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <ShieldCheck className="w-4 h-4 mr-1.5" />}
                  Verify & Unlock
                </Button>
              </div>
            </form>
          )}

          <div className="text-[11px] text-center text-muted-foreground pt-2 border-t flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" /> Your information is encrypted and securely stored.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
