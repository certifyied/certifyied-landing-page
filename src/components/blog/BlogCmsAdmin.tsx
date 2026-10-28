import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  FileText,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  Copy,
  Check,
  Upload,
  ArrowLeft,
  Search,
  Code,
  Globe,
  Users,
  History,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  Eye,
  CheckCircle2
} from "lucide-react";
import { toast } from "sonner";

interface BlogCmsAdminProps {
  role?: string;
  userEmail?: string;
  token?: string;
}

interface Project {
  id: string;
  name: string;
  clientId?: string;
  domain?: string;
  defaultStyle?: string;
}

interface BlogClient {
  id: string;
  name: string;
  email: string;
  project_id: string;
  projects?: {
    name: string;
  };
}

interface ParagraphBlock {
  type: "p" | "img_row_2" | "img_row_3" | "img_text";
  subheading?: string;
  text?: string;
  imageUrl?: string;
  images?: string[];
}

interface BlogItem {
  id: string;
  title: string;
  subtitle?: string;
  slug?: string;
  main_image_url?: string;
  paragraphs?: ParagraphBlock[];
  created_at?: string;
  project_id?: string;
}

interface ConsoleUser {
  id: string;
  email: string;
  role: string;
  project_id?: string;
  projects?: {
    name: string;
  };
}

interface AuditLog {
  id: string;
  created_at: string;
  user_email: string;
  action: string;
  ip_address?: string;
  details?: string;
}

export const BlogCmsAdmin: React.FC<BlogCmsAdminProps> = ({
  role = "admin",
  userEmail = "",
  token: propToken = ""
}) => {
  const blogApiBaseUrl =
    import.meta.env.VITE_BLOG_API_URL ||
    "https://bloggfeature.certifyied.workers.dev/adminApiBlog";

  const authToken = useMemo(() => {
    if (propToken) return propToken;
    if (typeof localStorage !== "undefined") {
      return (
        localStorage.getItem("blogToken") ||
        localStorage.getItem("certToken") ||
        localStorage.getItem("auth_token") ||
        localStorage.getItem("certifyied_autodialer_token") ||
        ""
      );
    }
    return "";
  }, [propToken]);

  const [activePanel, setActivePanel] = useState<
    "clients" | "detail" | "editor" | "integrations" | "sitemaps" | "users" | "audit"
  >("clients");

  // Navigation History
  const [panelHistory, setPanelHistory] = useState<string[]>([]);

  const pushPanel = (panel: "clients" | "detail" | "editor" | "integrations" | "sitemaps" | "users" | "audit") => {
    setPanelHistory(prev => [...prev, activePanel]);
    setActivePanel(panel);
  };

  const goBack = () => {
    if (panelHistory.length > 0) {
      const prev = panelHistory[panelHistory.length - 1] as any;
      setPanelHistory(h => h.slice(0, -1));
      setActivePanel(prev);
    } else {
      setActivePanel("clients");
    }
  };

  // State: Projects & Clients
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogClients, setBlogClients] = useState<BlogClient[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [selectedProjectName, setSelectedProjectName] = useState<string>("");
  const [loadingProjects, setLoadingProjects] = useState<boolean>(false);

  // New Client Form
  const [newClientName, setNewClientName] = useState<string>("");
  const [newClientEmail, setNewClientEmail] = useState<string>("");
  const [newClientProjectId, setNewClientProjectId] = useState<string>("");
  const [creatingClient, setCreatingClient] = useState<boolean>(false);

  // New Project Modal
  const [showNewProjectModal, setShowNewProjectModal] = useState<boolean>(false);
  const [newProjName, setNewProjName] = useState<string>("");
  const [newProjDomain, setNewProjDomain] = useState<string>("");
  const [creatingProject, setCreatingProject] = useState<boolean>(false);

  // State: Blogs
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [blogSearchQuery, setBlogSearchQuery] = useState<string>("");
  const [loadingBlogs, setLoadingBlogs] = useState<boolean>(false);

  // State: Blog Editor
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [blogTitle, setBlogTitle] = useState<string>("");
  const [blogSubtitle, setBlogSubtitle] = useState<string>("");
  const [blogCoverUrl, setBlogCoverUrl] = useState<string>("");
  const [paragraphs, setParagraphs] = useState<ParagraphBlock[]>([]);
  const [savingBlog, setSavingBlog] = useState<boolean>(false);
  const [uploadingImageIndex, setUploadingImageIndex] = useState<string | null>(null);

  // State: Sitemaps
  const [staticLinks, setStaticLinks] = useState<{ id: string; url: string }[]>([]);
  const [newStaticLink, setNewStaticLink] = useState<string>("");
  const [loadingSitemaps, setLoadingSitemaps] = useState<boolean>(false);

  // State: Users & Permissions
  const [consoleUsers, setConsoleUsers] = useState<ConsoleUser[]>([]);
  const [newUserEmail, setNewUserEmail] = useState<string>("");
  const [newUserRole, setNewUserRole] = useState<string>("blogger");
  const [newUserProject, setNewUserProject] = useState<string>("");
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);

  // State: Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loadingAudit, setLoadingAudit] = useState<boolean>(false);

  // State: Clipboard copies
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Auth fetch helper
  const authFetch = useCallback(
    async (path: string, options: RequestInit = {}) => {
      const headers = new Headers(options.headers || {});
      if (authToken) {
        headers.set("Authorization", `Bearer ${authToken}`);
      }
      return fetch(`${blogApiBaseUrl}${path}`, {
        ...options,
        headers
      });
    },
    [blogApiBaseUrl, authToken]
  );

  // Load Projects & Blog Clients
  const loadProjectsAndClients = useCallback(async () => {
    setLoadingProjects(true);
    try {
      // 1. Projects
      const pRes = await authFetch("/api/projects");
      if (pRes.ok) {
        const pData = await pRes.json();
        const projs: Project[] = pData.projects || [];
        setProjects(projs);

        // If client role or single project, preselect
        if (projs.length === 1 && !selectedProjectId) {
          setSelectedProjectId(projs[0].id);
          setSelectedProjectName(projs[0].name);
        }
      }

      // 2. Blog Clients
      const cRes = await authFetch("/api/blog-clients");
      if (cRes.ok) {
        const cData = await cRes.json();
        setBlogClients(cData.blogClients || []);
      }
    } catch (err: any) {
      toast.error(`Failed to load projects: ${err.message}`);
    } finally {
      setLoadingProjects(false);
    }
  }, [authFetch, selectedProjectId]);

  useEffect(() => {
    loadProjectsAndClients();
  }, [loadProjectsAndClients]);

  // Load Blogs for Selected Project
  const loadBlogs = useCallback(
    async (projectId: string) => {
      if (!projectId) return;
      setLoadingBlogs(true);
      try {
        const res = await authFetch(`/api/blogs?projectId=${encodeURIComponent(projectId)}`);
        if (res.ok) {
          const data = await res.json();
          setBlogs(data.blogs || []);
        } else {
          toast.error("Failed to load stories for this project.");
        }
      } catch (err: any) {
        toast.error(`Error loading stories: ${err.message}`);
      } finally {
        setLoadingBlogs(false);
      }
    },
    [authFetch]
  );

  // Select project to view
  const openProjectDetail = (projectId: string, projectName: string) => {
    setSelectedProjectId(projectId);
    setSelectedProjectName(projectName);
    pushPanel("detail");
    loadBlogs(projectId);
  };

  // Create Project
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName.trim()) {
      toast.error("Project name is required");
      return;
    }
    setCreatingProject(true);
    try {
      const res = await authFetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newProjName.trim(),
          domain: newProjDomain.trim()
        })
      });
      if (res.ok) {
        toast.success("Project provisioned successfully!");
        setShowNewProjectModal(false);
        setNewProjName("");
        setNewProjDomain("");
        loadProjectsAndClients();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to create project");
      }
    } catch (err: any) {
      toast.error(`Error: ${err.message}`);
    } finally {
      setCreatingProject(false);
    }
  };

  // Create Blog Client
  const handleCreateBlogClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientProjectId || !newClientEmail.trim()) {
      toast.error("Please select a project and provide a blogger email.");
      return;
    }
    setCreatingClient(true);
    try {
      const res = await authFetch("/api/blog-clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: newClientProjectId,
          name: newClientName.trim() || "Editor",
          email: newClientEmail.trim().toLowerCase()
        })
      });
      if (res.ok) {
        toast.success("Blog client added successfully!");
        setNewClientName("");
        setNewClientEmail("");
        setNewClientProjectId("");
        loadProjectsAndClients();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to add blog client");
      }
    } catch (err: any) {
      toast.error(`Error: ${err.message}`);
    } finally {
      setCreatingClient(false);
    }
  };

  // Delete Blog Client
  const handleDeleteBlogClient = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove access for "${name}"?`)) return;
    try {
      const res = await authFetch(`/api/blog-clients/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        toast.success("Blog client removed");
        setBlogClients(prev => prev.filter(c => c.id !== id));
      } else {
        toast.error("Failed to delete client");
      }
    } catch (err: any) {
      toast.error(`Error: ${err.message}`);
    }
  };

  // Image Upload Handler
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onUploaded: (url: string) => void,
    uploadKey: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImageIndex(uploadKey);
    try {
      const res = await authFetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": file.type || "image/jpeg"
        },
        body: file
      });
      if (!res.ok) throw new Error("Upload request failed");
      const data = await res.json();
      if (data.url) {
        onUploaded(data.url);
        toast.success("Image uploaded successfully!");
      }
    } catch (err: any) {
      toast.error(`Image upload failed: ${err.message}`);
    } finally {
      setUploadingImageIndex(null);
      e.target.value = "";
    }
  };

  // Open New Blog Editor
  const handleNewBlog = () => {
    setEditingBlogId(null);
    setBlogTitle("");
    setBlogSubtitle("");
    setBlogCoverUrl("");
    setParagraphs([{ type: "p", subheading: "", text: "" }]);
    pushPanel("editor");
  };

  // Open Existing Blog for Editing
  const handleEditBlog = (blog: BlogItem) => {
    setEditingBlogId(blog.id);
    setBlogTitle(blog.title || "");
    setBlogSubtitle(blog.subtitle || "");
    setBlogCoverUrl(blog.main_image_url || "");
    setParagraphs(
      blog.paragraphs && blog.paragraphs.length > 0
        ? blog.paragraphs
        : [{ type: "p", subheading: "", text: "" }]
    );
    pushPanel("editor");
  };

  // Delete Blog
  const handleDeleteBlog = async (blogId: string) => {
    if (!confirm("Are you sure you want to delete this story?")) return;
    try {
      const res = await authFetch(`/api/blogs/${blogId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        toast.success("Story deleted");
        setBlogs(prev => prev.filter(b => b.id !== blogId));
      } else {
        toast.error("Failed to delete story");
      }
    } catch (err: any) {
      toast.error(`Error: ${err.message}`);
    }
  };

  // Add paragraph block in editor
  const addBlock = (type: "p" | "img_row_2" | "img_row_3" | "img_text") => {
    const newBlock: ParagraphBlock = {
      type,
      subheading: "",
      text: "",
      imageUrl: type === "img_text" ? "" : undefined,
      images: type === "img_row_2" ? ["", ""] : type === "img_row_3" ? ["", "", ""] : undefined
    };
    setParagraphs(prev => [...prev, newBlock]);
  };

  // Update paragraph block
  const updateBlock = (index: number, patch: Partial<ParagraphBlock>) => {
    setParagraphs(prev => {
      const next = [...prev];
      next[index] = { ...next[index], ...patch };
      return next;
    });
  };

  // Remove paragraph block
  const removeBlock = (index: number) => {
    setParagraphs(prev => prev.filter((_, i) => i !== index));
  };

  // Save Blog
  const handleSaveBlog = async () => {
    if (!blogTitle.trim()) {
      toast.error("Story title is required!");
      return;
    }
    if (!selectedProjectId) {
      toast.error("No project selected.");
      return;
    }

    setSavingBlog(true);
    const payload: any = {
      project_id: selectedProjectId,
      title: blogTitle.trim(),
      subtitle: blogSubtitle.trim(),
      main_image_url: blogCoverUrl.trim(),
      paragraphs: paragraphs
    };
    if (editingBlogId) {
      payload.id = editingBlogId;
    }

    try {
      const res = await authFetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        toast.success("Story published successfully!");
        goBack();
        loadBlogs(selectedProjectId);
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to save story");
      }
    } catch (err: any) {
      toast.error(`Save error: ${err.message}`);
    } finally {
      setSavingBlog(false);
    }
  };

  // Sitemaps Panel Logic
  const loadSitemaps = async () => {
    if (!selectedProjectId) return;
    setLoadingSitemaps(true);
    try {
      const res = await authFetch(
        `/api/sitemaps?projectId=${encodeURIComponent(selectedProjectId)}`
      );
      if (res.ok) {
        const data = await res.json();
        setStaticLinks(data.sitemaps || []);
      }
    } catch (err: any) {
      toast.error(`Error loading sitemaps: ${err.message}`);
    } finally {
      setLoadingSitemaps(false);
    }
  };

  const handleAddStaticLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaticLink.trim()) return;
    try {
      const res = await authFetch("/api/sitemaps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: selectedProjectId,
          url: newStaticLink.trim(),
          changefreq: "weekly",
          priority: "0.8"
        })
      });
      if (res.ok) {
        toast.success("Static link added to sitemap");
        setNewStaticLink("");
        loadSitemaps();
      } else {
        toast.error("Failed to add link");
      }
    } catch (err: any) {
      toast.error(`Error: ${err.message}`);
    }
  };

  const handleDeleteStaticLink = async (id: string) => {
    try {
      const res = await authFetch(`/api/sitemaps/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Static link removed");
        setStaticLinks(prev => prev.filter(l => l.id !== id));
      }
    } catch (err: any) {
      toast.error(`Error: ${err.message}`);
    }
  };

  // User Permissions Logic
  const loadConsoleUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await authFetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        setConsoleUsers(data.users || []);
      }
    } catch (err: any) {
      toast.error(`Error loading users: ${err.message}`);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleAddConsoleUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserEmail.trim()) {
      toast.error("Email is required");
      return;
    }
    try {
      const res = await authFetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newUserEmail.trim().toLowerCase(),
          role: newUserRole,
          project_id: newUserProject || null
        })
      });
      if (res.ok) {
        toast.success("User added successfully");
        setNewUserEmail("");
        loadConsoleUsers();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to add user");
      }
    } catch (err: any) {
      toast.error(`Error: ${err.message}`);
    }
  };

  const handleDeleteConsoleUser = async (email: string) => {
    if (!confirm(`Remove permissions for ${email}?`)) return;
    try {
      const res = await authFetch(`/api/users/${encodeURIComponent(email)}`, {
        method: "DELETE"
      });
      if (res.ok) {
        toast.success("User deleted");
        setConsoleUsers(prev => prev.filter(u => u.email !== email));
      }
    } catch (err: any) {
      toast.error(`Error: ${err.message}`);
    }
  };

  // Audit Logs Logic
  const loadAuditLogs = async () => {
    setLoadingAudit(true);
    try {
      const res = await authFetch("/api/audit-logs?limit=100");
      if (res.ok) {
        const data = await res.json();
        setAuditLogs(data.logs || []);
      }
    } catch (err: any) {
      toast.error(`Error loading audit logs: ${err.message}`);
    } finally {
      setLoadingAudit(false);
    }
  };

  // Filtered blogs
  const filteredBlogs = useMemo(() => {
    if (!blogSearchQuery.trim()) return blogs;
    const q = blogSearchQuery.toLowerCase();
    return blogs.filter(
      b =>
        b.title?.toLowerCase().includes(q) ||
        b.subtitle?.toLowerCase().includes(q)
    );
  }, [blogs, blogSearchQuery]);

  // Snippets
  const cdnHost = "https://bloggfeature.certifyied.workers.dev";
  const homeSnippet = `<!-- Certifyied SEO Blog Grid (Home Page) -->
<div id="certifyied-blog-feed" data-project-id="${selectedProjectId}" data-limit="9"></div>
<script src="${cdnHost}/blog-embed.js" async defer></script>`;

  const readerSnippet = `<!-- Certifyied SEO Blog Post Reader -->
<div id="certifyied-blog-reader" data-project-id="${selectedProjectId}"></div>
<script src="${cdnHost}/blog-embed.js" async defer></script>`;

  const sitemapCdnUrl = `${blogApiBaseUrl}/sitemap.xml?projectId=${selectedProjectId}`;

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-800 p-4 sm:p-6 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* ------------------------------------------------------------- */}
        {/* PANEL 1: CLIENTS & PROJECTS LIST                              */}
        {/* ------------------------------------------------------------- */}
        {activePanel === "clients" && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                  <FileText className="w-7 h-7 text-[#467222]" />
                  Certifyied Blog & Content Engine
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Manage SEO story publishing, client projects, dynamic CDN embeds, and Google sitemaps.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setShowNewProjectModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-slate-700 text-sm font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 transition shadow-sm"
                >
                  <Plus className="w-4 h-4 text-[#467222]" />
                  Provision Project
                </button>
                <button
                  onClick={loadProjectsAndClients}
                  className="p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition"
                  title="Refresh Projects"
                >
                  <Loader2 className={`w-5 h-5 ${loadingProjects ? "animate-spin" : ""}`} />
                </button>
              </div>
            </div>

            {/* Quick Actions / Add Client Box */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <h2 className="text-base font-semibold text-slate-900">Add Blog Client / Writer</h2>
              <form onSubmit={handleCreateBlogClient} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                <div className="sm:col-span-4">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Parent Project *</label>
                  <select
                    value={newClientProjectId}
                    onChange={e => setNewClientProjectId(e.target.value)}
                    required
                    className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#467222]/20 focus:border-[#467222]"
                  >
                    <option value="">-- Choose Project --</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Blogger Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Content Writer"
                    value={newClientName}
                    onChange={e => setNewClientName(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#467222]/20 focus:border-[#467222]"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Login Email *</label>
                  <input
                    type="email"
                    placeholder="editor@domain.com"
                    value={newClientEmail}
                    onChange={e => setNewClientEmail(e.target.value)}
                    required
                    className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#467222]/20 focus:border-[#467222]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    disabled={creatingClient}
                    className="w-full h-10 inline-flex items-center justify-center gap-2 px-4 bg-[#467222] hover:bg-[#3b601d] text-white text-sm font-semibold rounded-xl shadow-sm transition disabled:opacity-60"
                  >
                    {creatingClient ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    Add Client
                  </button>
                </div>
              </form>
            </div>

            {/* Blog Clients Table */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-semibold text-slate-900">Your Blog Clients</h3>
                <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">
                  {blogClients.length} registered
                </span>
              </div>

              {loadingProjects ? (
                <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-[#467222]" />
                  <span>Loading clients and projects...</span>
                </div>
              ) : blogClients.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  <p>No blog clients registered yet.</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Assign a project above to invite a blogger or content creator.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                        <th className="px-6 py-3.5">Blogger</th>
                        <th className="px-6 py-3.5">Project / Domain</th>
                        <th className="px-6 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {blogClients.map(client => {
                        const projectName = client.projects?.name || "Global Project";
                        return (
                          <tr key={client.id} className="hover:bg-slate-50/50 transition">
                            <td className="px-6 py-4">
                              <div className="font-semibold text-slate-900">{client.name || "Blogger"}</div>
                              <div className="text-xs text-slate-500 font-mono mt-0.5">{client.email}</div>
                            </td>
                            <td className="px-6 py-4 text-slate-700">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-medium">
                                <Globe className="w-3.5 h-3.5 text-slate-500" />
                                {projectName}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="inline-flex items-center gap-2">
                                <button
                                  onClick={() => openProjectDetail(client.project_id, projectName)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#467222] hover:bg-[#3b601d] text-white text-xs font-semibold rounded-lg shadow-sm transition"
                                >
                                  <FileText className="w-3.5 h-3.5" />
                                  Manage Blogs
                                </button>
                                {(role === "admin" || role === "developer") && (
                                  <button
                                    onClick={() => handleDeleteBlogClient(client.id, client.name || client.email)}
                                    className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                                    title="Delete Client"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Direct Projects Grid for Admins */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-slate-900">All Master Projects</h3>
                  <p className="text-xs text-slate-500">Access stories directly by project ID</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {projects.map(p => (
                  <div
                    key={p.id}
                    onClick={() => openProjectDetail(p.id, p.name)}
                    className="p-4 rounded-xl border border-slate-200 hover:border-[#467222] hover:shadow-md transition cursor-pointer group bg-slate-50/40"
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-semibold text-slate-900 group-hover:text-[#467222] transition">
                        {p.name}
                      </span>
                      <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-[#467222] transition" />
                    </div>
                    <div className="text-xs text-slate-500 font-mono mt-1 truncate">ID: {p.id}</div>
                    {p.domain && (
                      <div className="text-xs text-slate-600 mt-2 flex items-center gap-1">
                        <Globe className="w-3 h-3 text-slate-400" />
                        {p.domain}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* PANEL 2: PROJECT DETAIL & STORIES LIST                        */}
        {/* ------------------------------------------------------------- */}
        {activePanel === "detail" && (
          <div className="space-y-6">
            {/* Top Bar Navigation */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <button
                onClick={goBack}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Projects
              </button>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => pushPanel("integrations")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
                >
                  <Code className="w-3.5 h-3.5 text-slate-600" />
                  CDN Embed Snippet
                </button>
                <button
                  onClick={() => {
                    pushPanel("sitemaps");
                    loadSitemaps();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
                >
                  <Globe className="w-3.5 h-3.5 text-slate-600" />
                  Sitemap Links
                </button>
                <button
                  onClick={() =>
                    window.open(`https://www.reviewmanager.in/reviewdash?clientId=${selectedProjectId}`, "_blank")
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Review Manager
                </button>
                {(role === "admin" || role === "developer") && (
                  <>
                    <button
                      onClick={() => {
                        pushPanel("users");
                        loadConsoleUsers();
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
                    >
                      <Users className="w-3.5 h-3.5 text-slate-600" />
                      Permissions
                    </button>
                    <button
                      onClick={() => {
                        pushPanel("audit");
                        loadAuditLogs();
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
                    >
                      <History className="w-3.5 h-3.5 text-slate-600" />
                      Audit Logs
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Project Banner & Add Blog Button */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-[#467222]">Active Project</span>
                <h2 className="text-2xl font-bold text-slate-900 mt-0.5">{selectedProjectName}</h2>
                <p className="text-xs text-slate-400 font-mono mt-1">ID: {selectedProjectId}</p>
              </div>

              <button
                onClick={handleNewBlog}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#467222] hover:bg-[#3b601d] text-white text-sm font-semibold rounded-xl shadow-md transition"
              >
                <Plus className="w-4 h-4" />
                Add New Story
              </button>
            </div>

            {/* Search Stories */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search stories by title or excerpt..."
                  value={blogSearchQuery}
                  onChange={e => setBlogSearchQuery(e.target.value)}
                  className="w-full h-10 pl-9 pr-4 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#467222]/20 focus:border-[#467222]"
                />
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {filteredBlogs.length} {filteredBlogs.length === 1 ? "story" : "stories"}
              </span>
            </div>

            {/* Blogs Table */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              {loadingBlogs ? (
                <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-[#467222]" />
                  <span>Loading stories...</span>
                </div>
              ) : filteredBlogs.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="font-semibold text-slate-800">No stories found</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Click &quot;Add New Story&quot; above to publish your first blog post.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                        <th className="px-6 py-3.5">Cover</th>
                        <th className="px-6 py-3.5">Headline & Summary</th>
                        <th className="px-6 py-3.5">Published</th>
                        <th className="px-6 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredBlogs.map(blog => (
                        <tr key={blog.id} className="hover:bg-slate-50/50 transition">
                          <td className="px-6 py-4 w-20">
                            {blog.main_image_url ? (
                              <img
                                src={blog.main_image_url}
                                alt="cover"
                                className="w-16 h-12 rounded-lg object-cover border border-slate-200"
                              />
                            ) : (
                              <div className="w-16 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
                                <ImageIcon className="w-5 h-5" />
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-semibold text-slate-900">{blog.title}</div>
                            {blog.subtitle && (
                              <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">{blog.subtitle}</div>
                            )}
                            {blog.slug && (
                              <div className="text-[11px] text-[#467222] font-mono mt-1">/{blog.slug}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap">
                            {blog.created_at ? new Date(blog.created_at).toLocaleDateString() : "Live"}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                onClick={() => handleEditBlog(blog)}
                                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                                title="Edit Story"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteBlog(blog.id)}
                                className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                                title="Delete Story"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* PANEL 3: BLOG WRITER / EDITOR                                 */}
        {/* ------------------------------------------------------------- */}
        {activePanel === "editor" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <button
                onClick={goBack}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Cancel & Exit
              </button>

              <button
                onClick={handleSaveBlog}
                disabled={savingBlog}
                className="inline-flex items-center gap-2 px-5 py-2 bg-[#467222] hover:bg-[#3b601d] text-white text-sm font-semibold rounded-xl shadow-md transition disabled:opacity-60"
              >
                {savingBlog ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                {editingBlogId ? "Save Changes" : "Publish Story"}
              </button>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-slate-900">
                {editingBlogId ? "Edit Story" : "Craft New Story"}
              </h2>

              {/* Title & Subtitle */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Story Headline *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter an eye-catching headline..."
                    value={blogTitle}
                    onChange={e => setBlogTitle(e.target.value)}
                    className="w-full text-lg font-semibold px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#467222]/20 focus:border-[#467222]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Subtitle / Excerpt
                  </label>
                  <textarea
                    rows={2}
                    placeholder="A brief teaser or lead paragraph summarizing the post..."
                    value={blogSubtitle}
                    onChange={e => setBlogSubtitle(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#467222]/20 focus:border-[#467222]"
                  />
                </div>

                {/* Main Cover Image */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Cover Image
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Paste image URL or upload below..."
                      value={blogCoverUrl}
                      onChange={e => setBlogCoverUrl(e.target.value)}
                      className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#467222]/20 focus:border-[#467222]"
                    />
                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer transition">
                      {uploadingImageIndex === "cover" ? (
                        <Loader2 className="w-4 h-4 animate-spin text-[#467222]" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                      Upload Cover
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e =>
                          handleImageUpload(e, url => setBlogCoverUrl(url), "cover")
                        }
                      />
                    </label>
                  </div>
                  {blogCoverUrl && (
                    <div className="mt-3 relative w-full h-44 rounded-xl overflow-hidden border border-slate-200">
                      <img src={blogCoverUrl} alt="Cover preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              {/* Dynamic Content Paragraph Blocks */}
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-slate-900">Story Content Blocks</h3>
                  <span className="text-xs text-slate-500">{paragraphs.length} blocks</span>
                </div>

                <div className="space-y-4">
                  {paragraphs.map((block, idx) => (
                    <div
                      key={idx}
                      className="p-5 bg-slate-50/80 rounded-xl border border-slate-200 space-y-3 relative group"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#467222]">
                          Block {idx + 1}: {block.type === "p" ? "Text Only" : block.type === "img_text" ? "Image + Text" : block.type === "img_row_2" ? "2 Images Row" : "3 Images Row"}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeBlock(idx)}
                          className="text-xs text-rose-500 hover:text-rose-700 hover:underline flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Remove
                        </button>
                      </div>

                      {/* Subheading */}
                      <div>
                        <input
                          type="text"
                          placeholder="Section Subheading (Optional H2)..."
                          value={block.subheading || ""}
                          onChange={e => updateBlock(idx, { subheading: e.target.value })}
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#467222]"
                        />
                      </div>

                      {/* Image Block: Single image for img_text */}
                      {block.type === "img_text" && (
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Image URL..."
                              value={block.imageUrl || ""}
                              onChange={e => updateBlock(idx, { imageUrl: e.target.value })}
                              className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                            />
                            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-medium rounded-lg cursor-pointer">
                              {uploadingImageIndex === `block-${idx}` ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Upload className="w-3.5 h-3.5" />
                              )}
                              Upload
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={e =>
                                  handleImageUpload(
                                    e,
                                    url => updateBlock(idx, { imageUrl: url }),
                                    `block-${idx}`
                                  )
                                }
                              />
                            </label>
                          </div>
                          {block.imageUrl && (
                            <img
                              src={block.imageUrl}
                              alt="preview"
                              className="w-32 h-20 rounded object-cover border border-slate-200"
                            />
                          )}
                        </div>
                      )}

                      {/* Image Rows: img_row_2 or img_row_3 */}
                      {(block.type === "img_row_2" || block.type === "img_row_3") && (
                        <div className="space-y-2">
                          <label className="text-xs text-slate-600 font-medium">Row Images</label>
                          <div className={`grid gap-2 ${block.type === "img_row_2" ? "grid-cols-2" : "grid-cols-3"}`}>
                            {(block.images || []).map((imgUrl, imgIdx) => (
                              <div key={imgIdx} className="space-y-1">
                                <div className="flex gap-1">
                                  <input
                                    type="text"
                                    placeholder={`Img ${imgIdx + 1} URL`}
                                    value={imgUrl}
                                    onChange={e => {
                                      const nextImgs = [...(block.images || [])];
                                      nextImgs[imgIdx] = e.target.value;
                                      updateBlock(idx, { images: nextImgs });
                                    }}
                                    className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs"
                                  />
                                  <label className="p-1 bg-white border border-slate-200 hover:bg-slate-100 rounded cursor-pointer flex items-center justify-center">
                                    <Upload className="w-3 h-3 text-slate-600" />
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={e =>
                                        handleImageUpload(
                                          e,
                                          url => {
                                            const nextImgs = [...(block.images || [])];
                                            nextImgs[imgIdx] = url;
                                            updateBlock(idx, { images: nextImgs });
                                          },
                                          `block-${idx}-${imgIdx}`
                                        )
                                      }
                                    />
                                  </label>
                                </div>
                                {imgUrl && (
                                  <img
                                    src={imgUrl}
                                    alt="thumb"
                                    className="w-full h-16 rounded object-cover border border-slate-200"
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Text Editor Area */}
                      <div>
                        <textarea
                          rows={4}
                          placeholder="Write paragraph content (HTML or plain text supported)..."
                          value={block.text || ""}
                          onChange={e => updateBlock(idx, { text: e.target.value })}
                          className="w-full p-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#467222]"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Block Options */}
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-2">
                    + Insert Content Block
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => addBlock("p")}
                      className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-sm transition"
                    >
                      📝 Text Only
                    </button>
                    <button
                      type="button"
                      onClick={() => addBlock("img_text")}
                      className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-sm transition"
                    >
                      📷 Image + Text Block
                    </button>
                    <button
                      type="button"
                      onClick={() => addBlock("img_row_2")}
                      className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-sm transition"
                    >
                      🖼️ 2 Images Row
                    </button>
                    <button
                      type="button"
                      onClick={() => addBlock("img_row_3")}
                      className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-sm transition"
                    >
                      🖼️ 3 Images Row
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={goBack}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveBlog}
                  disabled={savingBlog}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#467222] hover:bg-[#3b601d] text-white text-sm font-semibold rounded-xl shadow-md transition disabled:opacity-60"
                >
                  {savingBlog ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  {editingBlogId ? "Save Story" : "Publish to Live Site"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* PANEL 4: INTEGRATIONS (CDN EMBED SNIPPETS)                    */}
        {/* ------------------------------------------------------------- */}
        {activePanel === "integrations" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <button
                onClick={goBack}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Blogs
              </button>
              <h2 className="text-base font-bold text-slate-900">Website Integration Snippets</h2>
            </div>

            {/* Home Page Snippet */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-slate-900">1. Home Page Integration (3x3 Grid View)</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Paste this snippet anywhere on your Home page to render an SEO-optimized responsive blog grid.
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(homeSnippet, "home")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#467222] hover:bg-[#3b601d] text-white text-xs font-semibold rounded-lg transition"
                >
                  {copiedKey === "home" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedKey === "home" ? "Copied!" : "Copy Snippet"}
                </button>
              </div>
              <pre className="p-4 bg-slate-900 text-emerald-300 font-mono text-xs rounded-xl overflow-x-auto whitespace-pre-wrap">
                {homeSnippet}
              </pre>
            </div>

            {/* Blog Post Reader Snippet */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-slate-900">2. Blog Post Detail Page (Single Post Reader)</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Place this on your dedicated blog route (e.g. <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">/blog/[slug]</code>) to automatically load full stories.
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(readerSnippet, "reader")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#467222] hover:bg-[#3b601d] text-white text-xs font-semibold rounded-lg transition"
                >
                  {copiedKey === "reader" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedKey === "reader" ? "Copied!" : "Copy Snippet"}
                </button>
              </div>
              <pre className="p-4 bg-slate-900 text-emerald-300 font-mono text-xs rounded-xl overflow-x-auto whitespace-pre-wrap">
                {readerSnippet}
              </pre>
            </div>

            {/* Contact Form API */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
              <h3 className="font-semibold text-slate-900">3. Contact Form Submission API</h3>
              <p className="text-xs text-slate-500">
                Send form submissions to this endpoint. Emails are delivered automatically.
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={`${blogApiBaseUrl}/api/contact?projectId=${selectedProjectId}`}
                  className="flex-1 p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-mono text-slate-800"
                />
                <button
                  onClick={() =>
                    copyToClipboard(
                      `${blogApiBaseUrl}/api/contact?projectId=${selectedProjectId}`,
                      "contact"
                    )
                  }
                  className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
                >
                  {copiedKey === "contact" ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* PANEL 5: SITEMAPS                                             */}
        {/* ------------------------------------------------------------- */}
        {activePanel === "sitemaps" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <button
                onClick={goBack}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Blogs
              </button>
              <h2 className="text-base font-bold text-slate-900">Dynamic XML Sitemap</h2>
            </div>

            {/* CDN Sitemap URL */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
              <h3 className="font-semibold text-slate-900">Live Dynamic Sitemap URL</h3>
              <p className="text-xs text-slate-500">
                Submit this dynamic URL directly into Google Search Console for automated indexing.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={sitemapCdnUrl}
                  className="flex-1 p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-mono text-slate-800"
                />
                <button
                  onClick={() => copyToClipboard(sitemapCdnUrl, "sitemap")}
                  className="px-4 py-2 bg-[#467222] hover:bg-[#3b601d] text-white text-xs font-semibold rounded-xl transition"
                >
                  {copiedKey === "sitemap" ? "Copied!" : "Copy Sitemap URL"}
                </button>
                <a
                  href={sitemapCdnUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition inline-flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View XML
                </a>
              </div>
            </div>

            {/* Static links manager */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="font-semibold text-slate-900">Add Static Pages</h3>
              <p className="text-xs text-slate-500">
                Include custom pages (e.g. /about, /services, /pricing) inside your dynamic sitemap.
              </p>
              <form onSubmit={handleAddStaticLink} className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://yourdomain.com/about"
                  value={newStaticLink}
                  onChange={e => setNewStaticLink(e.target.value)}
                  className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm"
                  required
                />
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#467222] hover:bg-[#3b601d] text-white text-xs font-semibold rounded-xl transition"
                >
                  Add Link
                </button>
              </form>

              {loadingSitemaps ? (
                <div className="p-4 text-center text-slate-400">Loading static links...</div>
              ) : staticLinks.length > 0 ? (
                <div className="space-y-2 mt-2">
                  {staticLinks.map(link => (
                    <div
                      key={link.id}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs"
                    >
                      <span className="font-mono text-slate-800 truncate">{link.url}</span>
                      <button
                        onClick={() => handleDeleteStaticLink(link.id)}
                        className="text-rose-500 hover:text-rose-700 ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-slate-400 italic">No static links added yet.</div>
              )}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* PANEL 6: USER PERMISSIONS (ADMIN ONLY)                        */}
        {/* ------------------------------------------------------------- */}
        {activePanel === "users" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <button
                onClick={goBack}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <h2 className="text-base font-bold text-slate-900">Console Users & Permissions</h2>
            </div>

            {/* Add User Form */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="font-semibold text-slate-900">Add User Access</h3>
              <form onSubmit={handleAddConsoleUser} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                <div className="sm:col-span-5">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">User Email *</label>
                  <input
                    type="email"
                    placeholder="user@example.com"
                    value={newUserEmail}
                    onChange={e => setNewUserEmail(e.target.value)}
                    required
                    className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Role</label>
                  <select
                    value={newUserRole}
                    onChange={e => setNewUserRole(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl text-sm"
                  >
                    <option value="blogger">Blogger</option>
                    <option value="developer">Developer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Project</label>
                  <select
                    value={newUserProject}
                    onChange={e => setNewUserProject(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl text-sm"
                  >
                    <option value="">Global (All)</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="w-full h-10 bg-[#467222] hover:bg-[#3b601d] text-white text-xs font-semibold rounded-xl transition"
                  >
                    Add User
                  </button>
                </div>
              </form>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 text-xs font-semibold uppercase">
                    <th className="px-6 py-3.5">Email</th>
                    <th className="px-6 py-3.5">Role</th>
                    <th className="px-6 py-3.5">Project Scope</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {consoleUsers.map(user => (
                    <tr key={user.id || user.email} className="hover:bg-slate-50/50 transition">
                      <td className="px-6 py-4 font-mono text-slate-900">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className="capitalize px-2 py-0.5 rounded-full text-xs bg-slate-100 font-semibold text-slate-700">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-600">
                        {user.projects?.name || "Global (All Projects)"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDeleteConsoleUser(user.email)}
                          className="text-rose-500 hover:text-rose-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* PANEL 7: AUDIT LOGS (ADMIN ONLY)                              */}
        {/* ------------------------------------------------------------- */}
        {activePanel === "audit" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <button
                onClick={goBack}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <h2 className="text-base font-bold text-slate-900">System Audit Trails & Login Logs</h2>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              {loadingAudit ? (
                <div className="p-8 text-center text-slate-400">Loading audit records...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-semibold uppercase">
                        <th className="px-6 py-3.5">Timestamp</th>
                        <th className="px-6 py-3.5">User</th>
                        <th className="px-6 py-3.5">Action</th>
                        <th className="px-6 py-3.5">IP Address</th>
                        <th className="px-6 py-3.5">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {auditLogs.map(log => (
                        <tr key={log.id} className="hover:bg-slate-50/50">
                          <td className="px-6 py-3 text-slate-500 whitespace-nowrap">
                            {new Date(log.created_at).toLocaleString()}
                          </td>
                          <td className="px-6 py-3 font-semibold text-slate-900">{log.user_email}</td>
                          <td className="px-6 py-3 font-mono text-emerald-700">{log.action}</td>
                          <td className="px-6 py-3 text-slate-500">{log.ip_address || "-"}</td>
                          <td className="px-6 py-3 text-slate-600 truncate max-w-xs">{log.details || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* PROVISION PROJECT MODAL                                       */}
        {/* ------------------------------------------------------------- */}
        {showNewProjectModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-md p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-900 text-lg">Provision New Project</h3>
                <button
                  onClick={() => setShowNewProjectModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateProject} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Project Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Acme Corporation"
                    value={newProjName}
                    onChange={e => setNewProjName(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Website Domain (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. acme.com"
                    value={newProjDomain}
                    onChange={e => setNewProjDomain(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNewProjectModal(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creatingProject}
                    className="px-5 py-2 bg-[#467222] hover:bg-[#3b601d] text-white text-xs font-semibold rounded-xl shadow-sm disabled:opacity-60"
                  >
                    {creatingProject ? "Provisioning..." : "Create Project"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
