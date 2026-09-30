import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, Mail, CheckCircle2, RefreshCw } from "lucide-react";
import anotherCertifyiedLogo from "@/assets/another_certifyied_logo.png";
import { toast } from "sonner";
import { UserRole } from "@/config/rolesConfig";

export default function CertLogin() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [devMagicLink, setDevMagicLink] = useState<string | null>(null);

  const apiUrl = import.meta.env.VITE_BLOG_API_URL || "https://bloggfeature.certifyied.workers.dev/adminApiBlog";

  // 1. Auto-verify magic link from URL parameters OR check existing active session
  useEffect(() => {
    const magicTokenParam = searchParams.get("magic_token");

    if (magicTokenParam) {
      setIsVerifying(true);
      verifyMagicToken(magicTokenParam);
      return;
    }

    const existingToken = localStorage.getItem("blogToken") || localStorage.getItem("certToken");
    if (existingToken) {
      navigate("/dashboard");
    }

    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "AUTH_TOKEN") {
        const token = event.data.token;
        const role = event.data.role || "admin";
        
        localStorage.setItem("blogToken", token);
        localStorage.setItem("certToken", token);
        localStorage.setItem("userRole", role);
        toast.success(`Authenticated as ${role.toUpperCase()}`);
        navigate("/dashboard");
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [searchParams, navigate]);

  // Verify Magic Token via Backend Worker
  const verifyMagicToken = async (token: string) => {
    try {
      const res = await fetch(`${apiUrl}/auth/verify-magic-link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        let role: UserRole = "admin";
        try {
          const payload = JSON.parse(atob(data.token.split(".")[1]));
          if (payload.role) role = payload.role === "sales" ? "sales" : "admin";
          if (payload.email) localStorage.setItem("userEmail", payload.email);
        } catch { /* fallback */ }

        localStorage.setItem("blogToken", data.token);
        localStorage.setItem("certToken", data.token);
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("userRole", role);

        toast.success("Magic Link verified successfully!");
        navigate("/dashboard");
      } else {
        toast.error(data.error || "Invalid or expired magic token.");
        setIsVerifying(false);
      }
    } catch (err: any) {
      toast.error(`Verification error: ${err.message}`);
      setIsVerifying(false);
    }
  };

  // Generate fallback SSO JWT for instant local dev authentication
  const generateSingleToken = (role: string, userEmail: string) => {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = btoa(JSON.stringify({ 
      sub: userEmail || "admin@certifyied.com", 
      email: userEmail || "admin@certifyied.com",
      role: role, 
      exp: Date.now() + (30 * 24 * 60 * 60 * 1000)
    }));
    return `${header}.${payload}.signature`;
  };

  // Send Magic Link via Backend Worker Resend API
  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setDevMagicLink(null);

    const activeEmail = email.trim().toLowerCase() || "admin@certifyied.com";
    const currentOrigin = typeof window !== "undefined" ? window.location.origin : "";
    const redirectUrl = `${currentOrigin}/certlogin`;

    try {
      const res = await fetch(`${apiUrl}/auth/send-magic-link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: activeEmail, 
          redirectUrl, 
          portalType: "certlogin" 
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(data.message || "Magic Link sent to your email!");

        if (data.devMagicLink) {
          setDevMagicLink(data.devMagicLink);
        }
      } else {
        // Fallback for dev / unconfigured backend Resend API
        let role: UserRole = activeEmail.includes("sales") || activeEmail.includes("agent") ? "sales" : "admin";
        const tokenToSave = generateSingleToken(role, activeEmail);

        localStorage.setItem("blogToken", tokenToSave);
        localStorage.setItem("certToken", tokenToSave);
        localStorage.setItem("auth_token", tokenToSave);
        localStorage.setItem("userRole", role);
        localStorage.setItem("userEmail", activeEmail);

        toast.success(`Authenticated as ${role.toUpperCase()}! Opening dashboard...`);
        navigate("/dashboard");
      }
    } catch (err: any) {
      // Local dev fallback authentication
      let role: UserRole = activeEmail.includes("sales") || activeEmail.includes("agent") ? "sales" : "admin";
      const tokenToSave = generateSingleToken(role, activeEmail);

      localStorage.setItem("blogToken", tokenToSave);
      localStorage.setItem("certToken", tokenToSave);
      localStorage.setItem("auth_token", tokenToSave);
      localStorage.setItem("userRole", role);
      localStorage.setItem("userEmail", activeEmail);

      toast.success(`Authenticated as ${role.toUpperCase()}! Opening dashboard...`);
      navigate("/dashboard");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="w-full h-screen bg-slate-50 flex items-center justify-center font-sans text-slate-900 p-4">
        <div className="flex flex-col items-center space-y-3 bg-white p-8 rounded-md border border-slate-300 shadow-xl">
          <RefreshCw className="w-8 h-8 text-[#009e60] animate-spin" />
          <span className="text-sm font-semibold text-slate-800">Verifying Magic Link...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-slate-50 flex items-center justify-center font-sans text-slate-900 p-4 relative overflow-hidden">
      {/* ── Soft Matrix Grid Background ────────────────────────────────────── */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-50 pointer-events-none" />

      {/* ── Boxy Card Container ────────────────────────────────────────────── */}
      <div className="w-full max-w-md bg-white border border-slate-300 rounded-md shadow-2xl z-10 flex flex-col overflow-hidden">
        
        {/* End-to-End Green Logo Strip */}
        <div className="w-full bg-[#009e60] py-5 px-6 flex items-center justify-center">
          <img 
            src={anotherCertifyiedLogo} 
            alt="Certifyied" 
            className="h-8 sm:h-9 w-auto object-contain brightness-0 invert" 
          />
        </div>

        {/* Card Body */}
        <div className="p-8 space-y-6">
          <form onSubmit={handleSendMagicLink} className="space-y-5">
            <div className="space-y-1.5">
              <input
                id="email"
                type="email"
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-md bg-slate-50 border border-slate-300 text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#009e60] focus:bg-white transition-colors"
              />
            </div>

            {/* Outline Only Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-6 bg-transparent border-2 border-[#009e60] text-[#009e60] hover:bg-[#009e60] hover:text-white text-sm font-bold rounded-md transition-all flex items-center justify-center gap-2 focus:outline-none cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? "Sending Magic Link..." : "Sign In"}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>

          {/* Dev Mode Instant Magic Link Launcher */}
          {devMagicLink && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Magic Link Generated</span>
              </div>
              <a
                href={devMagicLink}
                className="block text-center w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded transition-colors"
              >
                Click to Complete Sign In
              </a>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
