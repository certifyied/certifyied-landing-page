export interface ServiceDefinition {
  id: string;
  label: string;
  badge: string;
  iconName: "FileEdit" | "Search" | "PhoneCall" | "Shield";
  category: string;
}

export type UserRole = "admin" | "sales" | "manager";

export const SERVICES: Record<string, ServiceDefinition> = {
  blog: {
    id: "blog",
    label: "Blog CMS Admin",
    badge: "CMS",
    iconName: "FileEdit",
    category: "Content"
  },
  seo: {
    id: "seo",
    label: "SEO Audit Engine",
    badge: "v1.0",
    iconName: "Search",
    category: "Analytics"
  },
  autodialer: {
    id: "autodialer",
    label: "Sales Autodialer",
    badge: "Pro",
    iconName: "PhoneCall",
    category: "Sales"
  },
  seoadmin: {
    id: "seoadmin",
    label: "SEO Admin Metrics",
    badge: "Admin",
    iconName: "Shield",
    category: "System"
  }
};

/**
 * Manage what services each role can access in the dashboard.
 * Unified Auth System for Blog CMS, SEO Engine, Sales Autodialer, and SEO Admin.
 * (Excludes Review Manager)
 */
export const ROLES_CONFIG: Record<string, string[]> = {
  admin: ["blog", "seo", "autodialer", "seoadmin"],
  sales: ["autodialer", "seo"],
  manager: ["blog", "seo"],
};

export function getServicesForRole(role: string): ServiceDefinition[] {
  const normalizedRole = (role || "").toLowerCase();
  const allowedIds = ROLES_CONFIG[normalizedRole] || ROLES_CONFIG["sales"];
  return allowedIds.map((id) => SERVICES[id]).filter(Boolean);
}
