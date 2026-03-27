import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import {
  Flame,
  Save,
  LogOut,
  Settings,
  Package,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  ImagePlus,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  GitBranch,
  ExternalLink,
  Key,
  Pencil,
  Trash2,
  Plus,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  BadgeCheck,
  Zap,
  Globe,
  MessageSquare,
} from "lucide-react";
import { AdminProduct, AdminProductSize, SizeKey } from "@/lib/productStorage";
import { getImageUrl } from "@/lib/imageUrl";
import {
  StoreData,
  verifyPassword,
  savePat,
  getPat,
  deletePat,
  saveSession,
  hasSession,
  clearSession,
  verifyPat,
  readStore,
  writeStore,
  uploadImage,
} from "@/lib/githubStorage";
import { PRODUCTS_UPDATE_EVENT } from "@/hooks/useProducts";

const SIZES: SizeKey[] = ["10g", "100g", "400g"];
const STORE_URL = import.meta.env.BASE_URL + "data/store.json";

type TabId = "products" | "settings" | "github";

async function loadPublicStore(): Promise<StoreData> {
  const res = await fetch(STORE_URL + "?t=" + Date.now());
  if (!res.ok) throw new Error("Could not load store.json");
  return res.json() as Promise<StoreData>;
}

export default function Admin() {
  const [, navigate] = useLocation();
  const [authenticated, setAuthenticated] = useState(hasSession);

  const handleLogin = () => { saveSession(); setAuthenticated(true); };
  const handleLogout = () => { clearSession(); setAuthenticated(false); };

  if (!authenticated) {
    return <LoginPage onLogin={handleLogin} onBack={() => navigate("/")} />;
  }

  return <Dashboard onLogout={handleLogout} />;
}

function LoginPage({
  onLogin,
  onBack,
}: {
  onLogin: () => void;
  onBack: () => void;
}) {
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) { setError("Please enter your password."); return; }
    setLoading(true);
    setError("");
    try {
      const store = await loadPublicStore();
      const hash = store.admin_password_hash ?? "";
      if (!hash) { setError("Admin password not configured."); return; }
      const ok = await verifyPassword(password, hash);
      if (!ok) { setError("Incorrect password. Please try again."); return; }
      onLogin();
    } catch {
      setError("Failed to verify credentials. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }}>
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 shadow-lg shadow-red-500/30 mb-4">
              <Flame className="w-8 h-8 text-white fill-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Julizen Admin</h1>
            <p className="text-sm text-white/50 mt-1">Content Management System</p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Sign in to your account</h2>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Admin Password
                </label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent pr-11 transition-all"
                    placeholder="Enter admin password"
                    autoFocus
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {error && (
                  <div className="flex items-start gap-2 mt-2 p-2.5 bg-red-50 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-red-600">{error}</p>
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold text-sm hover:from-red-700 hover:to-red-600 transition-all shadow-lg shadow-red-500/25 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Verifying…</>
                ) : (
                  <><ShieldCheck className="w-4 h-4" /> Sign In</>
                )}
              </button>
            </form>
            <button
              onClick={onBack}
              className="mt-4 text-xs text-gray-400 hover:text-gray-600 w-full text-center transition-colors"
            >
              ← Back to website
            </button>
          </div>

          <p className="text-center text-white/30 text-xs mt-6">
            Julizen Spice Brand · Admin CMS
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 items-center justify-center p-12" style={{ background: "rgba(255,255,255,0.03)" }}>
        <div className="text-white max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-lg">GitHub-Powered CMS</p>
              <p className="text-white/50 text-sm">Zero database, zero server</p>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { icon: Package, title: "Product Management", desc: "Edit all 4 products with per-size variants" },
              { icon: Globe, title: "Instant Deployment", desc: "Changes go live in ~60 seconds via GitHub Actions" },
              { icon: ShieldCheck, title: "Secure by Design", desc: "Data stored in your private GitHub repository" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3 p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.05)" }}>
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-red-400" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{title}</p>
                  <p className="text-white/50 text-xs mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<TabId>("products");
  const pat = getPat();
  const hasPatConfigured = !!pat;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TopBar tab={tab} setTab={setTab} onLogout={onLogout} hasPat={hasPatConfigured} />
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6">
        {tab === "products" && <ProductsTab />}
        {tab === "settings" && <SettingsTab />}
        {tab === "github" && <GitHubPatTab onPatChange={() => {}} />}
      </div>
    </div>
  );
}

function TopBar({
  tab,
  setTab,
  onLogout,
  hasPat,
}: {
  tab: TabId;
  setTab: (t: TabId) => void;
  onLogout: () => void;
  hasPat: boolean;
}) {
  const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
    { id: "products", label: "Products", icon: Package },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "github", label: "GitHub Connection", icon: GitBranch },
  ];

  return (
    <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5">
              <img
                src={getImageUrl("/images/julizen-logo.webp")}
                alt="Julizen"
                className="h-9 w-auto object-contain"
                onError={(e) => {
                  const el = e.target as HTMLImageElement;
                  el.style.display = "none";
                }}
              />
              <div className="hidden sm:block">
                <p className="text-xs font-bold text-gray-800 leading-tight">Admin Panel</p>
                <p className="text-[10px] text-gray-400">Content Management System</p>
              </div>
            </div>
          </div>

          <nav className="flex items-center">
            <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 mr-3">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    tab === id
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">{label}</span>
                  {id === "github" && !hasPat && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border border-white" />
                  )}
                </button>
              ))}
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline text-xs">Sign Out</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}

function NoPat() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center mb-4">
        <Key className="w-8 h-8 text-amber-500" />
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-2">GitHub Connection Required</h3>
      <p className="text-sm text-gray-500 max-w-sm mb-4">
        You need to connect a GitHub Personal Access Token before you can save changes. 
        Changes won't be deployed without it.
      </p>
      <p className="text-xs text-gray-400">
        Go to the <strong>GitHub Connection</strong> tab to add your token.
      </p>
    </div>
  );
}

function useStoreData() {
  const [store, setStore] = useState<StoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const pat = getPat();
      let data: StoreData;
      if (pat) {
        data = await readStore(pat);
      } else {
        data = await loadPublicStore();
      }
      setStore(data);
    } catch (e) {
      try {
        const data = await loadPublicStore();
        setStore(data);
      } catch {
        setError((e as Error).message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);
  return { store, setStore, loading, error, reload: load };
}

function ProductsTab() {
  const { store, setStore, loading, error, reload } = useStoreData();
  const [editState, setEditState] = useState<Record<string, AdminProduct>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [saveStatus, setSaveStatus] = useState<Record<string, "success" | "error" | null>>({});
  const [saveMsg, setSaveMsg] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const pat = getPat();

  useEffect(() => {
    if (!store) return;
    const init: Record<string, AdminProduct> = {};
    for (const p of store.products) init[p.id] = JSON.parse(JSON.stringify(p));
    setEditState(init);
  }, [store]);

  const updateCommon = (id: string, field: keyof AdminProduct, value: unknown) => {
    setEditState((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  const updateSize = (id: string, size: SizeKey, field: keyof AdminProductSize, value: unknown) => {
    setEditState((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        sizes: { ...prev[id].sizes, [size]: { ...prev[id].sizes[size], [field]: value } },
      },
    }));
  };

  const saveProduct = async (id: string) => {
    if (!store || !pat) return;
    const updated = editState[id];
    if (!updated) return;
    setSaving((s) => ({ ...s, [id]: true }));
    setSaveStatus((s) => ({ ...s, [id]: null }));
    try {
      const newProducts = store.products.map((p) => (p.id === id ? updated : p));
      const newStore = { ...store, products: newProducts };
      await writeStore(newStore, `admin: update product "${updated.name}"`, pat);
      setStore(newStore);
      setSaveStatus((s) => ({ ...s, [id]: "success" }));
      setSaveMsg((m) => ({ ...m, [id]: "Saved & deploying — live in ~60 seconds" }));
      window.dispatchEvent(new CustomEvent(PRODUCTS_UPDATE_EVENT));
      setTimeout(() => setSaveStatus((s) => ({ ...s, [id]: null })), 7000);
    } catch (e) {
      setSaveStatus((s) => ({ ...s, [id]: "error" }));
      setSaveMsg((m) => ({ ...m, [id]: (e as Error).message }));
    } finally {
      setSaving((s) => ({ ...s, [id]: false }));
    }
  };

  const resetProduct = (id: string) => {
    if (!store) return;
    const original = store.products.find((p) => p.id === id);
    if (original) setEditState((prev) => ({ ...prev, [id]: JSON.parse(JSON.stringify(original)) }));
    setSaveStatus((s) => ({ ...s, [id]: null }));
  };

  const handleImageUpload = async (
    id: string,
    target: { size: SizeKey | "food"; field: "frontImage" | "backImage" | "foodImage" },
    file: File
  ) => {
    if (!pat) { alert("Add a GitHub token first."); return; }
    const key = `${id}-${target.size}-${target.field}`;
    setUploading((u) => ({ ...u, [key]: true }));
    try {
      const url = await uploadImage(pat, file);
      if (target.size === "food") {
        updateCommon(id, "foodImage", url);
      } else {
        updateSize(id, target.size, target.field as keyof AdminProductSize, url);
      }
    } catch (e) {
      alert("Upload failed: " + (e as Error).message);
    } finally {
      setUploading((u) => ({ ...u, [key]: false }));
    }
  };

  const enabledCount = store?.products.filter((p) => p.enabled).length ?? 0;
  const totalCount = store?.products.length ?? 0;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-red-500" />
        <p className="text-sm text-gray-500">Loading products…</p>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <AlertCircle className="w-8 h-8 text-red-500" />
        <p className="text-sm font-semibold text-gray-700">Could not load products</p>
        <p className="text-xs text-gray-400">{error}</p>
        <button onClick={reload} className="px-4 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 font-medium text-gray-700 transition-colors">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage all product listings, packaging, and order messages</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg border border-green-100">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-xs font-semibold text-green-700">{enabledCount} Active</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
            <span className="text-xs font-semibold text-gray-600">{totalCount} Total</span>
          </div>
          <a
            href="https://github.com/Joshbond123/Julizen-Spice-Brand/actions"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            <GitBranch className="w-3.5 h-3.5" /> Deployments <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {!pat && <NoPat />}

      <div className="space-y-3">
        {store.products.map((product) => {
          const edit = editState[product.id];
          if (!edit) return null;
          const isOpen = expandedId === product.id;

          return (
            <div key={product.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all">
              <button
                onClick={() => setExpandedId(isOpen ? null : product.id)}
                className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50/80 transition-colors text-left"
              >
                <div
                  className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center"
                  style={{ backgroundColor: edit.accentColor + "20", border: `2px solid ${edit.accentColor}30` }}
                >
                  <Flame className="w-5 h-5" style={{ color: edit.accentColor }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900 text-sm">{edit.name}</p>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                      edit.enabled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}>
                      {edit.enabled ? <><BadgeCheck className="w-3 h-3" /> Active</> : "Hidden"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{edit.tagline}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="hidden sm:flex items-center gap-1">
                    {SIZES.map((sz) => (
                      <span
                        key={sz}
                        className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                          edit.sizes[sz]?.sizeEnabled
                            ? "bg-gray-800 text-white"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {sz}
                      </span>
                    ))}
                  </div>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-gray-100">
                  <div className="px-5 py-5 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-gray-800">Product Details</h3>
                      <button
                        onClick={() => updateCommon(product.id, "enabled", !edit.enabled)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          edit.enabled
                            ? "bg-green-50 text-green-700 hover:bg-green-100"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {edit.enabled
                          ? <><ToggleRight className="w-4 h-4" /> Product Enabled</>
                          : <><ToggleLeft className="w-4 h-4" /> Product Disabled</>}
                      </button>
                    </div>

                    <CommonFields
                      product={edit}
                      productId={product.id}
                      uploading={uploading}
                      onField={(f, v) => updateCommon(product.id, f, v)}
                      onImageUpload={(file) =>
                        handleImageUpload(product.id, { size: "food", field: "foodImage" }, file)
                      }
                    />

                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <h3 className="text-sm font-bold text-gray-800">Size Variants</h3>
                        <div className="flex-1 h-px bg-gray-100" />
                      </div>
                      <div className="grid gap-4">
                        {SIZES.map((sz) => (
                          <SizeEditor
                            key={sz}
                            size={sz}
                            data={edit.sizes[sz]}
                            productId={product.id}
                            uploading={uploading}
                            onField={(field, value) => updateSize(product.id, sz, field, value)}
                            onFrontUpload={(file) =>
                              handleImageUpload(product.id, { size: sz, field: "frontImage" }, file)
                            }
                            onBackUpload={(file) =>
                              handleImageUpload(product.id, { size: sz, field: "backImage" }, file)
                            }
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => saveProduct(product.id)}
                        disabled={saving[product.id] || !pat}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-500 text-white text-sm font-semibold rounded-xl hover:from-red-700 hover:to-red-600 transition-all shadow-sm shadow-red-500/20 disabled:opacity-60"
                      >
                        {saving[product.id] ? (
                          <><Loader2 className="w-4 h-4 animate-spin" /> Committing…</>
                        ) : (
                          <><Save className="w-4 h-4" /> Save & Deploy</>
                        )}
                      </button>
                      <button
                        onClick={() => resetProduct(product.id)}
                        disabled={saving[product.id]}
                        className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-60"
                      >
                        <RotateCcw className="w-4 h-4" /> Reset
                      </button>
                      {saveStatus[product.id] === "success" && (
                        <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-xl">
                          <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span className="text-xs font-medium text-green-700">{saveMsg[product.id]}</span>
                        </div>
                      )}
                      {saveStatus[product.id] === "error" && (
                        <div className="flex items-center gap-2 px-3 py-2 bg-red-50 rounded-xl">
                          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                          <span className="text-xs font-medium text-red-700">{saveMsg[product.id]}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CommonFields({
  product,
  productId,
  uploading,
  onField,
  onImageUpload,
}: {
  product: AdminProduct;
  productId: string;
  uploading: Record<string, boolean>;
  onField: (field: keyof AdminProduct, value: unknown) => void;
  onImageUpload: (file: File) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const isUploading = uploading[`${productId}-food-foodImage`] ?? false;

  const resolvePreview = (src: string) =>
    src.startsWith("/images/") ? getImageUrl(src) : src;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Product Name" value={product.name} onChange={(v) => onField("name", v)} />
        <Field label="Tagline" value={product.tagline} onChange={(v) => onField("tagline", v)} />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Full Description</label>
        <textarea
          value={product.fullDescription}
          onChange={(e) => onField("fullDescription", e.target.value)}
          rows={4}
          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent resize-none transition-all"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Cooking Tips (one per line)</label>
        <textarea
          value={product.cookingTips.join("\n")}
          onChange={(e) => onField("cookingTips", e.target.value.split("\n"))}
          rows={4}
          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent resize-none transition-all"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Food Caption" value={product.foodCaption} onChange={(v) => onField("foodCaption", v)} />
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Accent Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={product.accentColor}
              onChange={(e) => onField("accentColor", e.target.value)}
              className="h-10 w-14 rounded-lg border border-gray-200 cursor-pointer p-1"
            />
            <input
              type="text"
              value={product.accentColor}
              onChange={(e) => onField("accentColor", e.target.value)}
              className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 text-sm font-mono text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Food / Hero Image</label>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
          <div className="w-20 h-20 rounded-xl bg-white border border-gray-200 overflow-hidden flex-shrink-0 shadow-sm">
            {product.foodImage ? (
              <img src={resolvePreview(product.foodImage)} alt="Food" className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <ImagePlus className="w-7 h-7" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0 space-y-2">
            <input ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) onImageUpload(f); e.target.value = ""; }} />
            <button type="button" onClick={() => fileRef.current?.click()} disabled={isUploading}
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg border border-dashed border-gray-300 bg-white hover:bg-gray-50 hover:border-red-400 transition-all disabled:opacity-60 w-full justify-center text-gray-600">
              {isUploading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading…</> : <><ImagePlus className="w-3.5 h-3.5" /> Upload image to repo</>}
            </button>
            <input type="text" value={product.foodImage} onChange={(e) => onField("foodImage", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs font-mono text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all"
              placeholder="/images/food-example.webp" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SizeEditor({
  size,
  data,
  productId,
  uploading,
  onField,
  onFrontUpload,
  onBackUpload,
}: {
  size: SizeKey;
  data: AdminProductSize;
  productId: string;
  uploading: Record<string, boolean>;
  onField: (field: keyof AdminProductSize, value: unknown) => void;
  onFrontUpload: (file: File) => void;
  onBackUpload: (file: File) => void;
}) {
  const frontRef = useRef<HTMLInputElement>(null);
  const backRef = useRef<HTMLInputElement>(null);
  const resolvePreview = (src: string) => src.startsWith("/images/") ? getImageUrl(src) : src;

  const sizeColors: Record<SizeKey, string> = {
    "10g": "#6366f1",
    "100g": "#0891b2",
    "400g": "#059669",
  };

  return (
    <div className="rounded-xl border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3" style={{ backgroundColor: sizeColors[size] + "08", borderBottom: `1px solid ${sizeColors[size]}20` }}>
        <div className="flex items-center gap-2.5">
          <span
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-white text-xs font-bold shadow-sm"
            style={{ backgroundColor: sizeColors[size] }}
          >
            {size}
          </span>
          <div>
            <p className="text-sm font-bold text-gray-800">{size} Pack</p>
            <p className="text-xs text-gray-400">{data.packDetail || "Configure packaging details"}</p>
          </div>
        </div>
        <button
          onClick={() => onField("sizeEnabled", !data.sizeEnabled)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            data.sizeEnabled
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-gray-200 text-gray-500 hover:bg-gray-300"
          }`}
        >
          {data.sizeEnabled ? <><ToggleRight className="w-4 h-4" /> Shown</> : <><ToggleLeft className="w-4 h-4" /> Hidden</>}
        </button>
      </div>

      <div className="p-4 space-y-3 bg-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Pack Label" value={data.packLabel} onChange={(v) => onField("packLabel", v)} placeholder="e.g. Sachet" />
          <Field label="Pack Detail" value={data.packDetail} onChange={(v) => onField("packDetail", v)} placeholder="e.g. 10g × 42 rolls" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-green-600" /> WhatsApp Order Message
          </label>
          <textarea
            value={data.whatsappMessage}
            onChange={(e) => onField("whatsappMessage", e.target.value)}
            rows={2}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent resize-none transition-all"
            placeholder="Message sent when customer taps Order via WhatsApp"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <PackageImageField
            label="Front Packaging"
            src={data.frontImage}
            uploading={uploading[`${productId}-${size}-frontImage`] ?? false}
            fileRef={frontRef}
            onUpload={onFrontUpload}
            onUrlChange={(url) => onField("frontImage", url)}
            resolvePreview={resolvePreview}
          />
          <PackageImageField
            label="Back Packaging"
            src={data.backImage}
            uploading={uploading[`${productId}-${size}-backImage`] ?? false}
            fileRef={backRef}
            onUpload={onBackUpload}
            onUrlChange={(url) => onField("backImage", url)}
            resolvePreview={resolvePreview}
          />
        </div>
      </div>
    </div>
  );
}

function PackageImageField({
  label,
  src,
  uploading,
  fileRef,
  onUpload,
  onUrlChange,
  resolvePreview,
}: {
  label: string;
  src: string;
  uploading: boolean;
  fileRef: React.RefObject<HTMLInputElement | null>;
  onUpload: (file: File) => void;
  onUrlChange: (url: string) => void;
  resolvePreview: (src: string) => string;
}) {
  return (
    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">{label}</p>
      <div className="flex items-start gap-3">
        <div className="w-14 h-[4.5rem] rounded-lg bg-white border border-gray-200 overflow-hidden flex-shrink-0">
          {src ? (
            <img src={resolvePreview(src)} alt={label} className="w-full h-full object-contain"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-200">
              <ImagePlus className="w-5 h-5" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0 space-y-1.5">
          <input ref={fileRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) onUpload(f); e.target.value = ""; }} />
          <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
            className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-semibold rounded-lg border border-dashed border-gray-300 bg-white hover:bg-gray-50 hover:border-red-400 transition-all disabled:opacity-60 w-full justify-center text-gray-600">
            {uploading ? <><Loader2 className="w-3 h-3 animate-spin" /> Uploading…</> : <><ImagePlus className="w-3 h-3" /> Upload</>}
          </button>
          <input type="text" value={src} onChange={(e) => onUrlChange(e.target.value)}
            className="w-full px-2 py-1.5 rounded-lg border border-gray-200 text-[10px] font-mono text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all"
            placeholder="/images/product..." />
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all"
      />
    </div>
  );
}

function SettingsTab() {
  const { store, setStore, loading, error, reload } = useStoreData();
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null);
  const pat = getPat();

  useEffect(() => {
    if (!store) return;
    setWhatsapp(store.settings.whatsapp_number ?? "");
    setEmail(store.settings.contact_email ?? "");
    setPhone(store.settings.contact_phone ?? "");
  }, [store]);

  const save = async () => {
    if (!store || !pat) return;
    if (!whatsapp.trim()) { setResult({ ok: false, msg: "WhatsApp number is required." }); return; }
    setSaving(true);
    setResult(null);
    try {
      const newStore: StoreData = {
        ...store,
        settings: { whatsapp_number: whatsapp, contact_email: email, contact_phone: phone },
      };
      await writeStore(newStore, "admin: update contact settings", pat);
      setStore(newStore);
      setResult({ ok: true, msg: "Settings saved & deployed — live in ~60 seconds" });
      setTimeout(() => setResult(null), 7000);
    } catch (e) {
      setResult({ ok: false, msg: (e as Error).message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-red-500" />
        <span className="text-sm text-gray-500">Loading…</span>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <AlertCircle className="w-8 h-8 text-red-500" />
        <p className="text-sm font-semibold text-gray-700">{error || "Failed to load"}</p>
        <button onClick={reload} className="px-4 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 font-medium">Retry</button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Contact Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">These appear on the website and power the WhatsApp order buttons</p>
      </div>

      {!pat && <NoPat />}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">WhatsApp & Contact Details</p>
            <p className="text-xs text-gray-400">Used on all order buttons and the contact page</p>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">WhatsApp Number</label>
            <p className="text-xs text-gray-400 mb-2">Include country code, no spaces (e.g. 2348012345678)</p>
            <input type="text" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all"
              placeholder="2348000000000" />
          </div>
          <Field label="Contact Email" value={email} onChange={setEmail} type="email" placeholder="info@julizen.com" />
          <Field label="Contact Phone (display)" value={phone} onChange={setPhone} placeholder="+234 800 000 0000" />

          {result && (
            <div className={`flex items-center gap-2 p-3 rounded-xl ${result.ok ? "bg-green-50" : "bg-red-50"}`}>
              {result.ok ? <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />}
              <span className={`text-xs font-medium ${result.ok ? "text-green-700" : "text-red-700"}`}>{result.msg}</span>
            </div>
          )}

          <button
            onClick={save}
            disabled={saving || !pat}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-500 text-white text-sm font-semibold rounded-xl hover:from-red-700 hover:to-red-600 transition-all shadow-sm shadow-red-500/20 disabled:opacity-60"
          >
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Deploying…</> : <><Save className="w-4 h-4" /> Save & Deploy</>}
          </button>
        </div>
      </div>
    </div>
  );
}

function GitHubPatTab({ onPatChange }: { onPatChange: () => void }) {
  const [stored, setStored] = useState<string | null>(getPat);
  const [inputPat, setInputPat] = useState("");
  const [showPat, setShowPat] = useState(false);
  const [showStored, setShowStored] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);

  const handleSave = async () => {
    if (!inputPat.trim()) { setStatus({ ok: false, msg: "Please enter a token." }); return; }
    setVerifying(true);
    setStatus(null);
    try {
      const ok = await verifyPat(inputPat.trim());
      if (!ok) {
        setStatus({ ok: false, msg: "Token is invalid or doesn't have access to the Julizen repository. Make sure it has Contents: read & write permission." });
        return;
      }
      savePat(inputPat.trim());
      setStored(inputPat.trim());
      setInputPat("");
      setEditMode(false);
      setStatus({ ok: true, msg: "GitHub token saved. You can now save and deploy changes." });
      onPatChange();
    } finally {
      setVerifying(false);
    }
  };

  const handleDelete = () => {
    if (!confirm("Remove the saved GitHub token? You won't be able to save changes until you add a new one.")) return;
    deletePat();
    setStored(null);
    setEditMode(false);
    setInputPat("");
    setShowStored(false);
    setStatus({ ok: false, msg: "GitHub token removed." });
    onPatChange();
  };

  const maskedPat = (pat: string) => {
    if (pat.length <= 12) return "•".repeat(pat.length);
    return pat.slice(0, 8) + "•".repeat(Math.min(20, pat.length - 12)) + pat.slice(-4);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">GitHub Connection</h1>
        <p className="text-sm text-gray-500 mt-0.5">Connect your GitHub token to enable saving and deploying content changes</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stored ? "bg-green-50" : "bg-amber-50"}`}>
            <GitBranch className={`w-4 h-4 ${stored ? "text-green-600" : "text-amber-600"}`} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-800">Personal Access Token (PAT)</p>
            <p className="text-xs text-gray-400">Stored securely in your browser only</p>
          </div>
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${stored ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
            {stored ? <><CheckCircle2 className="w-3.5 h-3.5" /> Connected</> : <><AlertCircle className="w-3.5 h-3.5" /> Not set</>}
          </div>
        </div>

        <div className="p-6 space-y-4">
          {stored && !editMode && (
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Saved Token</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowStored((v) => !v)}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {showStored ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    {showStored ? "Hide" : "Reveal"}
                  </button>
                  <button
                    onClick={() => { setEditMode(true); setInputPat(stored); setStatus(null); }}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Pencil className="w-3 h-3" /> Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-red-600 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-white border border-gray-200 rounded-lg font-mono text-xs text-gray-700 break-all">
                <Key className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                {showStored ? stored : maskedPat(stored)}
              </div>
            </div>
          )}

          {(!stored || editMode) && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  {editMode ? "Replace Token" : "Add GitHub Personal Access Token"}
                </label>
                <div className="relative">
                  <input
                    type={showPat ? "text" : "password"}
                    value={inputPat}
                    onChange={(e) => setInputPat(e.target.value)}
                    className="w-full px-3 py-2.5 pr-10 rounded-xl border border-gray-200 text-sm font-mono text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all"
                    placeholder="github_pat_..."
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPat((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPat ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {status && (
                <div className={`flex items-start gap-2 p-3 rounded-xl ${status.ok ? "bg-green-50" : "bg-red-50"}`}>
                  {status.ok ? <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />}
                  <span className={`text-xs font-medium ${status.ok ? "text-green-700" : "text-red-700"}`}>{status.msg}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSave}
                  disabled={verifying || !inputPat.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-500 text-white text-sm font-semibold rounded-xl hover:from-red-700 hover:to-red-600 transition-all shadow-sm disabled:opacity-60"
                >
                  {verifying ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Verifying…</>
                  ) : (
                    <><Plus className="w-4 h-4" /> {editMode ? "Update Token" : "Save Token"}</>
                  )}
                </button>
                {editMode && (
                  <button
                    onClick={() => { setEditMode(false); setInputPat(""); setStatus(null); }}
                    className="px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          )}

          {status && !editMode && !(!stored) && (
            <div className={`flex items-start gap-2 p-3 rounded-xl ${status.ok ? "bg-green-50" : "bg-red-50"}`}>
              {status.ok ? <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />}
              <span className={`text-xs font-medium ${status.ok ? "text-green-700" : "text-red-700"}`}>{status.msg}</span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <Key className="w-5 h-5 text-gray-400" />
          <p className="text-sm font-bold text-gray-800">How to create a GitHub token</p>
        </div>
        <ol className="space-y-3">
          {[
            <>Go to <a href="https://github.com/settings/tokens?type=beta" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline font-medium inline-flex items-center gap-1">github.com/settings/tokens <ExternalLink className="w-3 h-3" /></a></>,
            <>Click <strong>Generate new token</strong> → <strong>Fine-grained token</strong></>,
            <>Under <strong>Repository access</strong>, select <strong>Only select repositories</strong> → choose <em>Julizen-Spice-Brand</em></>,
            <>Under <strong>Permissions → Contents</strong>, set to <strong>Read and write</strong></>,
            <>Click <strong>Generate token</strong>, copy and paste it above</>,
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 text-xs font-bold text-gray-500 flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
        <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-100">
          <p className="text-xs text-amber-700 font-medium">
            ⚠️ The token is stored only in your browser. If you switch devices or clear storage, you'll need to re-enter it.
          </p>
        </div>
      </div>
    </div>
  );
}
