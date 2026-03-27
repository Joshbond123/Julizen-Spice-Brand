import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import {
  Flame,
  Save,
  X,
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
} from "lucide-react";
import { AdminProduct, AdminProductSize, SizeKey, PRODUCTS_UPDATE_EVENT } from "@/lib/productStorage";
import { getImageUrl } from "@/lib/imageUrl";

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "";
const api = (path: string) => `${API_BASE}${path}`;

function authHeaders(token: string) {
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

function useAdminAuth() {
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem("julizen_admin_token"));

  const login = async (password: string): Promise<string | null> => {
    try {
      const res = await fetch(api("/api/admin/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json();
        return (data.error as string) ?? "Login failed";
      }
      const { token: t } = (await res.json()) as { token: string };
      sessionStorage.setItem("julizen_admin_token", t);
      setToken(t);
      return null;
    } catch {
      return "Network error. Please try again.";
    }
  };

  const logout = () => {
    sessionStorage.removeItem("julizen_admin_token");
    setToken(null);
  };

  return { token, login, logout };
}

async function uploadImage(
  token: string,
  file: File
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      const res = await fetch(api("/api/upload"), {
        method: "POST",
        headers: authHeaders(token),
        body: JSON.stringify({ imageData: base64, filename: file.name }),
      });
      if (!res.ok) {
        const d = await res.json();
        reject(new Error((d.error as string) || "Upload failed"));
        return;
      }
      const { url } = (await res.json()) as { url: string };
      resolve(url);
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export default function Admin() {
  const [, navigate] = useLocation();
  const { token, login, logout } = useAdminAuth();
  const [tab, setTab] = useState<"products" | "settings" | "password">("products");

  if (!token) {
    return <LoginPage onLogin={login} onBack={() => navigate("/")} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AdminNav tab={tab} setTab={setTab} onLogout={logout} />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        {tab === "products" && <ProductsTab token={token} />}
        {tab === "settings" && <SettingsTab token={token} />}
        {tab === "password" && <PasswordTab token={token} />}
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
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const err = await onLogin(password);
    setLoading(false);
    if (err) setError(err);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center">
            <Flame className="w-6 h-6 text-white fill-white" />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-lg leading-tight">Julizen Admin</p>
            <p className="text-xs text-gray-400">Restricted access</p>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Admin Password</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent pr-11"
                placeholder="Enter password"
                autoFocus
                required
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-colors disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign In"}
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
  setTab: (t: "products" | "settings" | "password") => void;
  onLogout: () => void;
}) {
  const tabs = [
    { id: "products" as const, label: "Products", icon: Package },
    { id: "settings" as const, label: "Settings", icon: Settings },
    { id: "password" as const, label: "Password", icon: KeyRound },
  ];
  return (
    <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={getImageUrl("/images/julizen-logo.webp")}
            alt="Julizen"
            className="h-10 w-auto object-contain"
          />
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider hidden sm:block">
            Admin Panel
          </span>
        </div>
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
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors ml-2"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </nav>
      </div>
    </header>
  );
}

const SIZES: SizeKey[] = ["10g", "100g", "400g"];

function ProductsTab({ token }: { token: string }) {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editState, setEditState] = useState<Record<string, AdminProduct>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [saveStatus, setSaveStatus] = useState<Record<string, "success" | "error" | null>>({});
  const [uploading, setUploading] = useState<Record<string, boolean>>({});

  const load = useCallback(async () => {
    try {
      const res = await fetch(api("/api/products"));
      if (res.ok) {
        const data = (await res.json()) as AdminProduct[];
        setProducts(data);
        const init: Record<string, AdminProduct> = {};
        for (const p of data) init[p.id] = JSON.parse(JSON.stringify(p));
        setEditState(init);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const getEdit = (id: string): AdminProduct | undefined => editState[id];

  const updateCommon = (id: string, field: keyof AdminProduct, value: unknown) => {
    setEditState((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
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
    const p = editState[id];
    if (!p) return;
    setSaving((s) => ({ ...s, [id]: true }));
    setSaveStatus((s) => ({ ...s, [id]: null }));
    try {
      const res = await fetch(api(`/api/products/${id}`), {
        method: "PUT",
        headers: authHeaders(token),
        body: JSON.stringify(p),
      });
      if (!res.ok) {
        setSaveStatus((s) => ({ ...s, [id]: "error" }));
        return;
      }
      const updated = (await res.json()) as AdminProduct;
      setProducts((prev) => prev.map((x) => (x.id === id ? updated : x)));
      setEditState((prev) => ({ ...prev, [id]: JSON.parse(JSON.stringify(updated)) }));
      setSaveStatus((s) => ({ ...s, [id]: "success" }));
      window.dispatchEvent(new CustomEvent(PRODUCTS_UPDATE_EVENT));
      setTimeout(() => setSaveStatus((s) => ({ ...s, [id]: null })), 3000);
    } catch {
      setSaveStatus((s) => ({ ...s, [id]: "error" }));
    } finally {
      setSaving((s) => ({ ...s, [id]: false }));
    }
  };

  const resetProduct = (id: string) => {
    const original = products.find((p) => p.id === id);
    if (original) setEditState((prev) => ({ ...prev, [id]: JSON.parse(JSON.stringify(original)) }));
    setSaveStatus((s) => ({ ...s, [id]: null }));
  };

  const handleImageUpload = async (
    id: string,
    size: SizeKey | "food",
    imageType: "frontImage" | "backImage" | "foodImage",
    file: File
  ) => {
    const key = `${id}-${size}-${imageType}`;
    setUploading((u) => ({ ...u, [key]: true }));
    try {
      const url = await uploadImage(token, file);
      if (size === "food") {
        updateCommon(id, "foodImage", url);
      } else {
        updateSize(id, size, imageType as keyof AdminProductSize, url);
      }
    } catch {
    } finally {
      setUploading((u) => ({ ...u, [key]: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 rounded-full border-2 border-red-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Products</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Edit each product and its sizes independently. Changes are saved to the server immediately.
        </p>
      </div>

      {products.map((product) => {
        const edit = getEdit(product.id);
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
                  <p className="text-xs text-gray-400 mt-0.5">{edit.tagline}</p>
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
                  token={token}
                  onField={(f, v) => updateCommon(product.id, f, v)}
                  onImageUpload={(file) =>
                    handleImageUpload(product.id, "food", "foodImage", file)
                  }
                  uploading={uploading[`${product.id}-food-foodImage`] ?? false}
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
                        token={token}
                        uploading={uploading}
                        onField={(field, value) => updateSize(product.id, sz, field, value)}
                        onImageUpload={(type, file) =>
                          handleImageUpload(product.id, sz, type, file)
                        }
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => saveProduct(product.id)}
                    disabled={saving[product.id]}
                    className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-60"
                  >
                    <Save className="w-4 h-4" />
                    {saving[product.id] ? "Saving…" : "Save Changes"}
                  </button>
                  <button
                    onClick={() => resetProduct(product.id)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" /> Reset
                  </button>
                  {saveStatus[product.id] === "success" && (
                    <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
                      <CheckCircle2 className="w-4 h-4" /> Saved successfully
                    </span>
                  )}
                  {saveStatus[product.id] === "error" && (
                    <span className="flex items-center gap-1.5 text-sm text-red-600 font-medium">
                      <AlertCircle className="w-4 h-4" /> Failed to save
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
  token: _token,
  onField,
  onImageUpload,
  uploading,
}: {
  product: AdminProduct;
  token: string;
  onField: (field: keyof AdminProduct, value: unknown) => void;
  onImageUpload: (file: File) => void;
  uploading: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  const resolveImage = (src: string) =>
    src.startsWith("/api/images/") || src.startsWith("data:")
      ? src
      : src.startsWith("/")
      ? getImageUrl(src)
      : src;

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Product Info</h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          label="Product Name"
          value={product.name}
          onChange={(v) => onField("name", v)}
          placeholder="e.g. Chicken Flavour"
        />
        <InputField
          label="Tagline"
          value={product.tagline}
          onChange={(v) => onField("tagline", v)}
          placeholder="Short one-liner"
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
          placeholder="Detailed product description…"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
          Cooking Tips (one per line)
        </label>
        <textarea
          value={product.cookingTips.join("\n")}
          onChange={(e) =>
            onField(
              "cookingTips",
              e.target.value.split("\n").filter((l) => l.trim())
            )
          }
          rows={4}
          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
          placeholder="Enter each tip on a new line…"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
            Food Caption
          </label>
          <input
            type="text"
            value={product.foodCaption}
            onChange={(e) => onField("foodCaption", e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Caption shown on food image"
          />
        </div>
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
              placeholder="#D97706"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
          Food Image
        </label>
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
            {product.foodImage ? (
              <img
                src={resolveImage(product.foodImage)}
                alt="Food"
                className="w-full h-full object-cover"
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
              disabled={uploading}
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors disabled:opacity-60 mb-2"
            >
              <ImagePlus className="w-3.5 h-3.5" />
              {uploading ? "Uploading…" : "Upload Food Image"}
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
  onImageUpload,
}: {
  size: SizeKey;
  data: AdminProductSize;
  productId: string;
  token: string;
  uploading: Record<string, boolean>;
  onField: (field: keyof AdminProductSize, value: unknown) => void;
  onImageUpload: (type: "frontImage" | "backImage", file: File) => void;
}) {
  const frontRef = useRef<HTMLInputElement>(null);
  const backRef = useRef<HTMLInputElement>(null);

  const frontKey = `${productId}-${size}-frontImage`;
  const backKey = `${productId}-${size}-backImage`;

  const resolveImage = (src: string) =>
    src.startsWith("/api/images/") || src.startsWith("data:")
      ? src
      : src.startsWith("/")
      ? getImageUrl(src)
      : src;

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
          placeholder="e.g. 10g × 10 × 42 rolls (carton)"
        />
      </div>

      <div className="mb-3">
        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
          WhatsApp Order Message
        </label>
        <textarea
          value={data.whatsappMessage}
          onChange={(e) => onField("whatsappMessage", e.target.value)}
          rows={2}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
          placeholder="Message sent when customer clicks Order via WhatsApp"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ImageField
          label="Front Image"
          src={data.frontImage}
          uploading={uploading[frontKey] ?? false}
          fileRef={frontRef}
          onUpload={(file) => onImageUpload("frontImage", file)}
          onUrlChange={(url) => onField("frontImage", url)}
          resolveImage={resolveImage}
        />
        <ImageField
          label="Back Image"
          src={data.backImage}
          uploading={uploading[backKey] ?? false}
          fileRef={backRef}
          onUpload={(file) => onImageUpload("backImage", file)}
          onUrlChange={(url) => onField("backImage", url)}
          resolveImage={resolveImage}
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
  resolveImage,
}: {
  label: string;
  src: string;
  uploading: boolean;
  fileRef: React.RefObject<HTMLInputElement | null>;
  onUpload: (file: File) => void;
  onUrlChange: (url: string) => void;
  resolveImage: (src: string) => string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
        {label}
      </label>
      <div className="flex items-start gap-3">
        <div
          className="w-16 h-20 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200"
          style={{ aspectRatio: "3/4" }}
        >
          {src ? (
            <img
              src={resolveImage(src)}
              alt={label}
              className="w-full h-full object-contain"
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
            <ImagePlus className="w-3 h-3" />
            {uploading ? "Uploading…" : "Upload"}
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
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(api("/api/admin/settings"), { headers: authHeaders(token) })
      .then((r) => r.json())
      .then((d: { whatsapp_number?: string; contact_email?: string; contact_phone?: string }) => {
        setWhatsapp(d.whatsapp_number ?? "");
        setEmail(d.contact_email ?? "");
        setPhone(d.contact_phone ?? "");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  const save = async () => {
    if (!whatsapp.trim()) {
      setError("WhatsApp number is required.");
      return;
    }
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch(api("/api/admin/settings"), {
        method: "PUT",
        headers: authHeaders(token),
        body: JSON.stringify({ whatsapp_number: whatsapp, contact_email: email, contact_phone: phone }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError((d.error as string) ?? "Save failed");
        return;
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Network error.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Contact Settings</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          These details appear on the website and power the WhatsApp order buttons.
        </p>
      </div>
      {loading ? (
        <div className="text-sm text-gray-400">Loading…</div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              WhatsApp Number
            </label>
            <p className="text-xs text-gray-400 mb-2">
              Include country code, no spaces or dashes (e.g. 2348012345678)
            </p>
            <input
              type="text"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="2348000000000"
            />
          </div>
          <InputField
            label="Contact Email"
            value={email}
            onChange={setEmail}
            placeholder="info@julizen.com"
            type="email"
          />
          <InputField
            label="Contact Phone (display)"
            value={phone}
            onChange={setPhone}
            placeholder="+234 800 000 0000"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm font-medium">Settings saved successfully.</p>}
          <button
            onClick={save}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-60"
          >
            <Save className="w-4 h-4" /> {saving ? "Saving…" : "Save Settings"}
          </button>
        </div>
      )}
    </div>
  );
}

function PasswordTab({ token }: { token: string }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const save = async () => {
    if (!current || !next || !confirm) {
      setError("All fields are required.");
      return;
    }
    if (next !== confirm) {
      setError("New passwords do not match.");
      return;
    }
    if (next.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch(api("/api/admin/password"), {
        method: "PUT",
        headers: authHeaders(token),
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError((d.error as string) ?? "Update failed");
        return;
      }
      setSuccess(true);
      setCurrent("");
      setNext("");
      setConfirm("");
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Network error.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-md space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Change Password</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          You must enter your current password to set a new one.
        </p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
          <input
            type={showPw ? "text" : "password"}
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 pr-10"
            placeholder="Current password"
          />
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            className="absolute right-3 bottom-2.5 text-gray-400 hover:text-gray-600"
          >
            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <InputField
          label="New Password"
          type="password"
          value={next}
          onChange={setNext}
          placeholder="At least 6 characters"
        />
        <InputField
          label="Confirm New Password"
          type="password"
          value={confirm}
          onChange={setConfirm}
          placeholder="Repeat new password"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && (
          <p className="text-green-600 text-sm font-medium">Password updated successfully.</p>
        )}
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-60"
        >
          <KeyRound className="w-4 h-4" /> {saving ? "Updating…" : "Update Password"}
        </button>
      </div>
    </div>
  );
}
