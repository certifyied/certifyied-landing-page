import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FileEdit, 
  PhoneCall, 
  Search, 
  Shield, 
  ChevronLeft, 
  ChevronRight, 
  Globe, 
  LogOut,
  UserCheck,
  CheckCircle2
} from "lucide-react";
import anotherCertifyiedLogo from "@/assets/another_certifyied_logo.png";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { getServicesForRole, ServiceDefinition } from "@/config/rolesConfig";

export default function Dashboard() {
  const navigate = useNavigate();
  const [role, setRole] = useState<string>("admin");
  const [allowedServices, setAllowedServices] = useState<ServiceDefinition[]>([]);
  const [activeServiceId, setActiveServiceId] = useState<string>("");
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>("");

  // Single Sign-In Session Authenticator
  useEffect(() => {
    const token = localStorage.getItem("blogToken") || localStorage.getItem("certToken") || localStorage.getItem("auth_token");
    if (!token) {
      toast.error("Please sign in at /certlogin.");
      navigate("/certlogin");
      return;
    }

    let detectedRole = localStorage.getItem("userRole") || "admin";
    let email = localStorage.getItem("userEmail") || "admin@certifyied.com";

    try {
      if (token.includes(".")) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.role) detectedRole = payload.role;
        if (payload.email || payload.sub) email = payload.email || payload.sub;
      }
    } catch {
      /* fallback */
    }

    // Normalize role: global/manager/admin -> "admin"
    const normalizedRole = (detectedRole === "sales") ? "sales" : "admin";

    setRole(normalizedRole);
    setUserEmail(email);

    // Get allowed services for this role from rolesConfig.ts (Blog CMS, SEO Engine, Autodialer, SEO Admin)
    const services = getServicesForRole(normalizedRole);
    setAllowedServices(services);
    if (services.length > 0) {
      setActiveServiceId(services[0].id);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("blogToken");
    localStorage.removeItem("certToken");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    toast.info("Logged out of Single Sign-On session.");
    navigate("/certlogin");
  };

  // URL Resolvers for Unified Microservices
  const blogUrl = import.meta.env.VITE_BLOG_API_URL || "https://bloggfeature.certifyied.workers.dev/adminApiBlog";
  const currentOrigin = typeof window !== "undefined" ? window.location.origin : "";
  const parentOrigin = currentOrigin;
  const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const magicToken = params.get("magic_token");

  const ssoToken = typeof localStorage !== "undefined" 
    ? (localStorage.getItem("blogToken") || localStorage.getItem("certToken") || localStorage.getItem("auth_token") || "")
    : "";

  let resolvedBlogUrl = `${blogUrl}${blogUrl.includes("?") ? "&" : "?"}parent_origin=${encodeURIComponent(parentOrigin)}`;
  if (ssoToken) {
    resolvedBlogUrl += `&token=${encodeURIComponent(ssoToken)}&sso_token=${encodeURIComponent(ssoToken)}&blog_auth_token=${encodeURIComponent(ssoToken)}`;
  }
  if (magicToken) {
    resolvedBlogUrl += `&magic_token=${encodeURIComponent(magicToken)}`;
  }

  // Icon Resolver
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "FileEdit": return FileEdit;
      case "Search": return Search;
      case "PhoneCall": return PhoneCall;
      case "Shield": return Shield;
      default: return Globe;
    }
  };

  // Determine if sidebar is required (Sales role: no sidebar; Admin: sidebar)
  const isSalesRole = role === "sales";
  const showSidebar = !isSalesRole;

  // ── SALES ROLE VIEW (NO SIDEBAR REQUIRED) ──────────────────────────────────
  if (!showSidebar) {
    return (
      <div className="w-full h-screen bg-slate-50 overflow-hidden flex flex-col font-sans text-slate-900">
        {/* Header Bar */}
        <header className="w-full bg-white border-b border-slate-200 py-3 px-6 flex justify-between items-center z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">
              <img src={anotherCertifyiedLogo} alt="Certifyied Logo" className="h-6 w-auto object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5 capitalize">
                <UserCheck className="w-4 h-4 text-blue-600" /> Sales Workspace
              </span>
              <span className="text-[10px] text-slate-400">{userEmail}</span>
            </div>
          </div>

          {/* Top Service Tabs for Sales */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 gap-1">
            {allowedServices.map((service) => {
              const Icon = getIcon(service.iconName);
              const isActive = activeServiceId === service.id;
              return (
                <button
                  key={service.id}
                  onClick={() => setActiveServiceId(service.id)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 focus:outline-none ${
                    isActive
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-emerald-400" : "text-slate-500"}`} />
                  <span>{service.label}</span>
                </button>
              );
            })}
          </div>

          {/* Header Action / Logout */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all focus:outline-none shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </header>

        {/* Sales Service Frame Area */}
        <div className="flex-1 w-full h-full relative bg-slate-50 overflow-auto">
          {activeServiceId === "autodialer" && (
            <iframe
              src="/autodialer"
              className="absolute inset-0 w-full h-full border-0 bg-white"
              title="Sales Autodialer"
            />
          )}
          {activeServiceId === "seo" && (
            <iframe
              src="/seo"
              className="absolute inset-0 w-full h-full border-0 bg-white"
              title="SEO Audit Report"
            />
          )}
        </div>
      </div>
    );
  }

  // ── ADMIN ROLE VIEW (WITH FULL COLLAPSIBLE SIDEBAR MENU) ───────────────────
  return (
    <div className="w-full h-screen bg-slate-50 overflow-hidden flex font-sans text-slate-900">
      {/* ── White Collapsible Sidebar ───────────────────────────────────── */}
      <aside 
        className={`h-full bg-white border-r border-slate-200 flex flex-col justify-between transition-all duration-300 z-20 relative shadow-sm ${
          isCollapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-3.5 border-b border-slate-200 flex items-center justify-between gap-2 bg-white">
          {!isCollapsed && (
            <div className="flex items-center gap-2.5 overflow-hidden">
              <img
                src={anotherCertifyiedLogo}
                alt="Certifyied Logo"
                className="h-7 w-auto object-contain shrink-0"
              />
              <div className="flex flex-col truncate">
                <span className="text-xs font-bold tracking-wide text-slate-900 uppercase truncate">Certifyied SSO</span>
                <span className="text-[10px] text-slate-500 capitalize truncate">{role} Portal</span>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="w-full flex justify-center py-1">
              <img src={anotherCertifyiedLogo} alt="Logo" className="h-6 w-auto" />
            </div>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors border border-slate-200 shrink-0"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* SSO Badge */}
        {!isCollapsed && (
          <div className="px-3.5 py-2.5 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between text-[11px] font-semibold text-emerald-800">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>SSO Authenticated (Admin)</span>
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        )}

        {/* Dynamic Navigation Items Configured by rolesConfig.ts */}
        <nav className="flex-1 px-2.5 py-4 space-y-1.5 overflow-y-auto">
          {allowedServices.map((service) => {
            const Icon = getIcon(service.iconName);
            const isActive = activeServiceId === service.id;

            const buttonContent = (
              <button
                key={service.id}
                onClick={() => setActiveServiceId(service.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 border ${
                  isActive 
                    ? "bg-slate-900 text-white border-slate-900 shadow-md shadow-slate-900/10" 
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-transparent"
                } ${isCollapsed ? "justify-center px-0" : ""}`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-emerald-400 scale-110" : "text-slate-500"}`} />
                {!isCollapsed && (
                  <div className="flex-1 flex items-center justify-between truncate">
                    <span className="truncate">{service.label}</span>
                    {service.badge && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                        isActive ? "bg-white/10 text-white" : "bg-slate-100 text-slate-500"
                      }`}>
                        {service.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );

            if (isCollapsed) {
              return (
                <Tooltip key={service.id} delayDuration={0}>
                  <TooltipTrigger asChild>
                    {buttonContent}
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-slate-900 text-white border-slate-800">
                    <p className="font-semibold text-xs">{service.label}</p>
                  </TooltipContent>
                </Tooltip>
              );
            }

            return buttonContent;
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-200 space-y-2 bg-slate-50">
          <a
            href="/"
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-white border border-slate-200 transition-all shadow-sm ${
              isCollapsed ? "justify-center px-0" : ""
            }`}
            title="Back to Website"
          >
            <Globe className="w-4 h-4 text-slate-500 shrink-0" />
            {!isCollapsed && <span>Certifyied Site</span>}
          </a>

          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 transition-all shadow-sm ${
              isCollapsed ? "justify-center px-0" : ""
            }`}
            title="Log Out"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>Log Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-full relative bg-slate-50 flex flex-col overflow-hidden">
        {/* Main Header bar */}
        <header className="w-full bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <h1 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span>{allowedServices.find(s => s.id === activeServiceId)?.label}</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
            <span className="hidden sm:inline-block bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200 font-semibold">
              Role: <span className="capitalize text-slate-900">{role}</span> ({userEmail})
            </span>
          </div>
        </header>

        {/* Service Frame Container */}
        <div className="flex-1 w-full h-full relative bg-slate-50 overflow-auto">
          {activeServiceId === "blog" && (
            <iframe
              src={resolvedBlogUrl}
              className="absolute inset-0 w-full h-full border-0 bg-white"
              title="Blog Admin Portal"
              allow="clipboard-read; clipboard-write; geolocation"
            />
          )}

          {activeServiceId === "seo" && (
            <iframe 
              src="/seo" 
              className="absolute inset-0 w-full h-full border-0 bg-white" 
              title="SEO Engine Portal"
            />
          )}

          {activeServiceId === "autodialer" && (
            <iframe 
              src="/autodialer" 
              className="absolute inset-0 w-full h-full border-0 bg-white" 
              title="Sales Autodialer Portal"
            />
          )}

          {activeServiceId === "seoadmin" && (
            <iframe 
              src="/seo/admin" 
              className="absolute inset-0 w-full h-full border-0 bg-white" 
              title="SEO Engine Admin Portal"
            />
          )}
        </div>
      </main>
    </div>
  );
}
