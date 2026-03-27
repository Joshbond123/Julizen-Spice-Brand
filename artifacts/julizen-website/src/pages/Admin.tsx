import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import {
  Flame,
  Save,
  LogOut,
  KeyRound,
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
  GitCommit,
  ExternalLink,
} from "lucide-react";
import {
  AdminProduct,
  AdminProductSize,
  SizeKey,
} from "@/lib/productStorage";
import { getImageUrl } from "@/lib/imageUrl";
import {
  StoreData,
  verifyToken,
  readStore,
  writeStore,
  uploadImage,
  saveTokenToSession,
  getTokenFromSession,
  clearTokenFromSession,
} from "@/lib/githubStorage";
import { PRODUCTS_UPDATE_EVENT } from "@/hooks/useProducts";

const SIZES: SizeKey[] = ["10g", "100g", "400g"];

function useGitHubAuth() {
  const [token, setToken] = useState<string | null>(() => getTokenFromSession());

  const login = async (pat: string): Promise<string | null> => {
    const ok = await verifyToken(pat);
    if (!ok) return "Invalid token or no access to repository. Make sure it has 'Contents: read & write' permission.";
    saveTokenToSession(pat);
    setToken(pat);
    return null;
  };

  const logout = () => {
    clearTokenFromSession();
    setToken(null);
  };

  return { token, login, logout };
}

export default function Admin() {
  const [, navigate] = useLocation();
  const { token, login, logout } = useGitHubAuth();
  const [tab, setTab] = useState<"products" | "settings">("products");

  if (!token) {
    return <LoginPage onLogin={login} onBack={() => navigate("/")} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AdminNav tab={tab} setTab={setTab} onLogout={logout} />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        {tab === "products" && <ProductsTab token={token} />}
        {tab === "settings" && <SettingsTab token={token} />}
      </main>
    </div>
  );
}

function LoginPage({
  onLogin,
  onBack,
}: {
  onLogin: (p: string) => Promise<string | null>;
  onBack: () => void;
}) {
  const [pat, setPat] = useState("");
  const [showPat, setShowPat] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pat.trim()) { setError("Please enter your GitHub token."); return; }
    setLoading(true);
    setError("");
    const err = await onLogin(pat.trim());
    setLoading(false);
    if (err) setError(err);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center">
            <Flame className="w-6 h-6 text-white fill-white" />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-lg leading-tight">Julizen Admin</p>
            <p className="text-xs text-gray-400">GitHub-powered content editor</p>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              GitHub Personal Access Token
            </label>
            <p className="text-xs text-gray-400 mb-2">
              Create a fine-grained token at{" "}
              <a
                href="https://github.com/settings/tokens?type=beta"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                github.com/settings/tokens
              </a>
              {" "}with <strong>Contents: read &amp; write</strong> permission on the Julizen repo.
            </p>
            <div className="relative">
              <input
                type={showPat ? "text" : "password"}
                value={pat}
                onChange={(e) => setPat(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent pr-11 font-mono"
                placeholder="github_pat_..."
                autoFocus
                autoComplete="off"
                required
              />
              <button
                type="button"
                onClick={() => setShowPat((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPat ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && (
              <p className="text-red-500 text-xs mt-2 flex items-start gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                {error}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Verifying token…</>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
        <button
          onClick={onBack}
          className="mt-5 text-xs text-gray-400 hover:text-gray-600 w-full text-center transition-colors"
        >
          ← Back to website
        </button>
      </div>
    </div>
  );
}

function AdminNav({
  tab,
  setTab,
  onLogout,
}: {
  tab: string;
  setTab: (t: "products" | "settings") => void;
  onLogout: () => void;
}) {
  const tabs = [
    { id: "products" as const, label: "Products", icon: Package },
    { id: "settings" as const, label: "Settings", icon: Settings },
  ];
  return (
    <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={getImageUrl("/images/julizen-logo.webp")}
            alt="Julizen"
            className="h-10 w-auto object-contain"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider hidden sm:block">
            Admin Panel
          </span>
        </div>
        <div className="flex items-center gap-1">
          <a
            href="https://github.com/Joshbond123/Julizen-Spice-Brand/actions"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors mr-1"
            title="View GitHub Actions deployments"
          >
            <GitCommit className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Deployments</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <nav className="flex items-center gap-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  tab === id
                    ? "bg-red-50 text-red-600"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors ml-1"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}

function useStoreData(token: string) {
  const [store, setStore] = useState<StoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await readStore(token);
      setStore(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  return { store, setStore, loading, error, reload: load };
}

function ProductsTab({ token }: { token: string }) {
  const { store, setStore, loading, error, reload } = useStoreData(token);
  const [editState, setEditState] = useState<Record<string, AdminProduct>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [saveStatus, setSaveStatus] = useState<Record<string, "success" | "error" | null>>({});
  const [saveMsg, setSaveMsg] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState<Record<string, boolean>>({});

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
        sizes: {
          ...prev[id].sizes,
          [size]: { ...prev[id].sizes[size], [field]: value },
        },
      },
    }));
  };

  const saveProduct = async (id: string) => {
    if (!store) return;
    const updated = editState[id];
    if (!updated) return;
    setSaving((s) => ({ ...s, [id]: true }));
    setSaveStatus((s) => ({ ...s, [id]: null }));
    setSaveMsg((m) => ({ ...m, [id]: "" }));
    try {
      const newProducts = store.products.map((p) => (p.id === id ? updated : p));
      const newStore: StoreData = { ...store, products: newProducts };
      await writeStore(newStore, `admin: update product "${updated.name}"`);
      setStore(newStore);
      setSaveStatus((s) => ({ ...s, [id]: "success" }));
      setSaveMsg((m) => ({ ...m, [id]: "Saved & committed. Deploying in ~1 min." }));
      window.dispatchEvent(new CustomEvent(PRODUCTS_UPDATE_EVENT));
      setTimeout(() => setSaveStatus((s) => ({ ...s, [id]: null })), 6000);
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
    setSaveMsg((m) => ({ ...m, [id]: "" }));
  };

  const handleImageUpload = async (
    id: string,
    target: { size: SizeKey | "food"; field: "frontImage" | "backImage" | "foodImage" },
    file: File
  ) => {
    const key = `${id}-${target.size}-${target.field}`;
    setUploading((u) => ({ ...u, [key]: true }));
    try {
      const url = await uploadImage(token, file);
      if (target.size === "food") {
        updateCommon(id, "foodImage", url);
      } else {
        updateSize(id, target.size, target.field as keyof AdminProductSize, url);
      }
    } catch (e) {
      alert("Image upload failed: " + (e as Error).message);
    } finally {
      setUploading((u) => ({ ...u, [key]: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
        <p className="text-sm text-gray-500">Loading from GitHub…</p>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <AlertCircle className="w-8 h-8 text-red-500" />
        <p className="text-sm text-gray-700 font-medium">Failed to load store data</p>
        <p className="text-xs text-gray-400">{error}</p>
        <button
          onClick={reload}
          className="px-4 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 font-medium text-gray-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Products</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Changes are saved directly to the GitHub repository and deployed automatically.
          </p>
        </div>
        <a
          href="https://github.com/Joshbond123/Julizen-Spice-Brand/actions"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-blue-500 hover:underline"
        >
          <GitCommit className="w-3.5 h-3.5" /> View deployments
        </a>
      </div>

      {store.products.map((product) => {
        const edit = editState[product.id];
        if (!edit) return null;
        const isOpen = expandedId === product.id;

        return (
          <div
            key={product.id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
          >
            <button
              onClick={() => setExpandedId(isOpen ? null : product.id)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: edit.accentColor }}
                />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{edit.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{edit.tagline}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateCommon(product.id, "enabled", !edit.enabled);
                  }}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                    edit.enabled
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {edit.enabled ? "Enabled" : "Disabled"}
                </button>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </button>

            {isOpen && (
              <div className="border-t border-gray-100 px-5 py-5 space-y-6">
                <CommonFields
                  product={edit}
                  uploading={uploading}
                  productId={product.id}
                  onField={(f, v) => updateCommon(product.id, f, v)}
                  onImageUpload={(file) =>
                    handleImageUpload(product.id, { size: "food", field: "foodImage" }, file)
                  }
                />

                <div>
                  <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">
                    Size Variants
                  </h4>
                  <div className="space-y-5">
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

                <div className="flex items-center flex-wrap gap-3 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => saveProduct(product.id)}
                    disabled={saving[product.id]}
                    className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-60"
                  >
                    {saving[product.id] ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Committing to GitHub…</>
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
                    <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
                      <CheckCircle2 className="w-4 h-4" /> {saveMsg[product.id]}
                    </span>
                  )}
                  {saveStatus[product.id] === "error" && (
                    <span className="flex items-center gap-1.5 text-sm text-red-600 font-medium">
                      <AlertCircle className="w-4 h-4" /> {saveMsg[product.id] || "Failed to save"}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
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
      <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Product Info</h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          label="Product Name"
          value={product.name}
          onChange={(v) => onField("name", v)}
        />
        <InputField
          label="Tagline"
          value={product.tagline}
          onChange={(v) => onField("tagline", v)}
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
          Full Description
        </label>
        <textarea
          value={product.fullDescription}
          onChange={(e) => onField("fullDescription", e.target.value)}
          rows={4}
          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
          Cooking Tips (one per line)
        </label>
        <textarea
          value={product.cookingTips.join("\n")}
          onChange={(e) =>
            onField("cookingTips", e.target.value.split("\n"))
          }
          rows={4}
          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          label="Food Caption"
          value={product.foodCaption}
          onChange={(v) => onField("foodCaption", v)}
        />
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
            Accent Color
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={product.accentColor}
              onChange={(e) => onField("accentColor", e.target.value)}
              className="h-10 w-14 rounded-lg border border-gray-200 cursor-pointer p-0.5"
            />
            <input
              type="text"
              value={product.accentColor}
              onChange={(e) => onField("accentColor", e.target.value)}
              className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
          Food Image
        </label>
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
            {product.foodImage ? (
              <img
                src={resolvePreview(product.foodImage)}
                alt="Food"
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <ImagePlus className="w-6 h-6" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onImageUpload(f);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={isUploading}
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors disabled:opacity-60 mb-2"
            >
              {isUploading ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading…</>
              ) : (
                <><ImagePlus className="w-3.5 h-3.5" /> Upload to repo</>
              )}
            </button>
            <input
              type="text"
              value={product.foodImage}
              onChange={(e) => onField("foodImage", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
              placeholder="/images/food-example.webp"
            />
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

  const resolvePreview = (src: string) =>
    src.startsWith("/images/") ? getImageUrl(src) : src;

  return (
    <div className="rounded-xl border border-gray-100 p-4 bg-gray-50/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gray-800 text-white text-xs font-bold">
            {size}
          </span>
          <span className="text-sm font-semibold text-gray-700">{size} Variant</span>
        </div>
        <button
          onClick={() => onField("sizeEnabled", !data.sizeEnabled)}
          className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
            data.sizeEnabled
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-gray-200 text-gray-500 hover:bg-gray-300"
          }`}
        >
          {data.sizeEnabled ? "Shown" : "Hidden"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <InputField
          label="Pack Label"
          value={data.packLabel}
          onChange={(v) => onField("packLabel", v)}
          placeholder="e.g. Sachet"
        />
        <InputField
          label="Pack Detail"
          value={data.packDetail}
          onChange={(v) => onField("packDetail", v)}
          placeholder="e.g. 10g × 10 × 42 rolls"
        />
      </div>

      <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
          WhatsApp Order Message
        </label>
        <textarea
          value={data.whatsappMessage}
          onChange={(e) => onField("whatsappMessage", e.target.value)}
          rows={2}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ImageField
          label="Front Image"
          src={data.frontImage}
          uploading={uploading[`${productId}-${size}-frontImage`] ?? false}
          fileRef={frontRef}
          onUpload={onFrontUpload}
          onUrlChange={(url) => onField("frontImage", url)}
          resolvePreview={resolvePreview}
        />
        <ImageField
          label="Back Image"
          src={data.backImage}
          uploading={uploading[`${productId}-${size}-backImage`] ?? false}
          fileRef={backRef}
          onUpload={onBackUpload}
          onUrlChange={(url) => onField("backImage", url)}
          resolvePreview={resolvePreview}
        />
      </div>
    </div>
  );
}

function ImageField({
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
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
        {label}
      </label>
      <div className="flex items-start gap-3">
        <div className="w-16 h-20 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
          {src ? (
            <img
              src={resolvePreview(src)}
              alt={label}
              className="w-full h-full object-contain"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <ImagePlus className="w-5 h-5" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0 space-y-1.5">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onUpload(f);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors disabled:opacity-60 w-full justify-center"
          >
            {uploading ? (
              <><Loader2 className="w-3 h-3 animate-spin" /> Uploading…</>
            ) : (
              <><ImagePlus className="w-3 h-3" /> Upload</>
            )}
          </button>
          <input
            type="text"
            value={src}
            onChange={(e) => onUrlChange(e.target.value)}
            className="w-full px-2 py-1.5 rounded-lg border border-gray-200 text-[11px] focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
            placeholder="/images/product-..."
          />
        </div>
      </div>
    </div>
  );
}

function InputField({
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
      <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
      />
    </div>
  );
}

function SettingsTab({ token }: { token: string }) {
  const { store, setStore, loading, error, reload } = useStoreData(token);
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveResult, setSaveResult] = useState<{ ok: boolean; msg: string } | null>(null);

  useEffect(() => {
    if (!store) return;
    setWhatsapp(store.settings.whatsapp_number ?? "");
    setEmail(store.settings.contact_email ?? "");
    setPhone(store.settings.contact_phone ?? "");
  }, [store]);

  const save = async () => {
    if (!store) return;
    if (!whatsapp.trim()) { setSaveResult({ ok: false, msg: "WhatsApp number is required." }); return; }
    setSaving(true);
    setSaveResult(null);
    try {
      const newStore: StoreData = {
        ...store,
        settings: {
          whatsapp_number: whatsapp,
          contact_email: email,
          contact_phone: phone,
        },
      };
      await writeStore(newStore, "admin: update contact settings");
      setStore(newStore);
      setSaveResult({ ok: true, msg: "Settings saved & committed. Deploying in ~1 min." });
      setTimeout(() => setSaveResult(null), 6000);
    } catch (e) {
      setSaveResult({ ok: false, msg: (e as Error).message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 gap-4">
        <Loader2 className="w-6 h-6 animate-spin text-red-600" />
        <span className="text-sm text-gray-500">Loading…</span>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <AlertCircle className="w-8 h-8 text-red-500" />
        <p className="text-sm text-gray-700">{error || "Failed to load settings"}</p>
        <button onClick={reload} className="px-4 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 font-medium">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Contact Settings</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Changes are committed to GitHub and deployed automatically.
        </p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
          <p className="text-xs text-gray-400 mb-2">Country code included, no spaces (e.g. 2348012345678)</p>
          <input
            type="text"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="2348000000000"
          />
        </div>
        <InputField label="Contact Email" value={email} onChange={setEmail} type="email" placeholder="info@julizen.com" />
        <InputField label="Contact Phone (display)" value={phone} onChange={setPhone} placeholder="+234 800 000 0000" />

        {saveResult && (
          <p className={`text-sm font-medium flex items-center gap-1.5 ${saveResult.ok ? "text-green-600" : "text-red-600"}`}>
            {saveResult.ok ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {saveResult.msg}
          </p>
        )}

        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-60"
        >
          {saving ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Committing…</>
          ) : (
            <><Save className="w-4 h-4" /> Save & Deploy</>
          )}
        </button>
      </div>
    </div>
  );
}
