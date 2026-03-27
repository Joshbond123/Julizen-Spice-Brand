import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import {
  Eye,
  EyeOff,
  Flame,
  ImagePlus,
  KeyRound,
  LogOut,
  Save,
  Settings,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import { getImageUrl } from "@/lib/imageUrl";
import { useApp } from "@/context/AppContext";

type ProductSize = "10g" | "100g" | "400g";

type ManagedProduct = {
  id: string;
  slug: string;
  size: ProductSize;
  name: string;
  category: string;
  price: number;
  description: string;
  packagingDetails: string;
  imageFront: string;
  imageBack: string;
  foodImage: string;
  image: string;
  status: "available" | "coming_soon";
};

type PublicSettings = {
  whatsapp_number: string;
  contact_email: string;
  contact_phone: string;
};

const API = (path: string) => path;

function authHeaders(token: string) {
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

function useAdminAuth() {
  const [token, setToken] = useState<string | null>(null);

  const login = async (password: string): Promise<string | null> => {
    try {
      const res = await fetch(API("/api/admin/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json();
        return data.error ?? "Login failed";
      }
      const data = await res.json();
      setToken(data.token as string);
      return null;
    } catch {
      return "Network error. Please try again.";
    }
  };

  return {
    token,
    login,
    logout: () => setToken(null),
  };
}

export default function Admin() {
  const [, navigate] = useLocation();
  const { token, login, logout } = useAdminAuth();
  const { refetch } = useApp();
  const [tab, setTab] = useState<"products" | "settings" | "password">("products");

  if (!token) {
    return <LoginPage onBack={() => navigate("/")} onLogin={login} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav onLogout={logout} setTab={setTab} tab={tab} />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {tab === "products" && <ProductsTab token={token} onSaved={refetch} />}
        {tab === "settings" && <SettingsTab token={token} />}
        {tab === "password" && <PasswordTab token={token} />}
      </main>
    </div>
  );
}

function LoginPage({ onLogin, onBack }: { onLogin: (password: string) => Promise<string | null>; onBack: () => void }) {
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    const result = await onLogin(password);
    setLoading(false);
    if (result) setError(result);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-8 shadow-xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-orange-500">
            <Flame className="h-6 w-6 fill-white text-white" />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900 leading-tight">Julizen Admin</p>
            <p className="text-xs text-gray-400">Secure product management</p>
          </div>
        </div>

        <form className="space-y-5" onSubmit={submit}>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Admin Password</label>
            <div className="relative">
              <input
                autoFocus
                className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter password"
                required
                type={showPw ? "text" : "password"}
                value={password}
              />
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPw((value) => !value)}
                type="button"
              >
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
          </div>

          <button
            className="w-full rounded-xl bg-red-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
            disabled={loading}
            type="submit"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <button className="mt-5 w-full text-center text-xs text-gray-400 transition-colors hover:text-gray-600" onClick={onBack}>
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
  tab: "products" | "settings" | "password";
  setTab: (tab: "products" | "settings" | "password") => void;
  onLogout: () => void;
}) {
  const tabs = [
    { id: "products" as const, label: "Products", icon: ShoppingBag },
    { id: "settings" as const, label: "Settings", icon: Settings },
    { id: "password" as const, label: "Password", icon: KeyRound },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <img alt="Julizen" className="h-10 w-auto object-contain" src={getImageUrl("/images/julizen-logo.webp")} />
          <span className="hidden text-xs font-semibold uppercase tracking-wider text-gray-400 sm:block">Admin Panel</span>
        </div>
        <nav className="flex items-center gap-1">
          {tabs.map(({ id, icon: Icon, label }) => (
            <button
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                tab === id ? "bg-red-50 text-red-600" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              }`}
              key={id}
              onClick={() => setTab(id)}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
          <button
            className="ml-2 flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4" />
          </button>
        </nav>
      </div>
    </header>
  );
}

function ProductsTab({ token, onSaved }: { token: string; onSaved: () => void }) {
  const [products, setProducts] = useState<ManagedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [successId, setSuccessId] = useState<string | null>(null);

  const loadProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(API("/api/admin/products"), { headers: authHeaders(token) });
      const payload = await response.json();
      if (!response.ok) {
        setError(payload.error ?? "Failed to load products");
        setLoading(false);
        return;
      }
      setProducts(payload as ManagedProduct[]);
    } catch {
      setError("Network error while loading products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const groupedProducts = useMemo(() => {
    const groups: Record<string, ManagedProduct[]> = {};
    for (const product of products) {
      if (!groups[product.slug]) groups[product.slug] = [];
      groups[product.slug].push(product);
    }
    const order: ProductSize[] = ["10g", "100g", "400g"];
    return Object.entries(groups)
      .map(([slug, group]) => [slug, [...group].sort((a, b) => order.indexOf(a.size) - order.indexOf(b.size))] as const)
      .sort((a, b) => a[1][0].name.localeCompare(b[1][0].name));
  }, [products]);

  const updateProductField = (id: string, field: keyof ManagedProduct, value: string | number) => {
    setProducts((current) => current.map((product) => (product.id === id ? { ...product, [field]: value } : product)));
  };

  const readFileAsDataUrl = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result ?? ""));
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (id: string, field: "imageFront" | "imageBack" | "foodImage", file?: File) => {
    if (!file) return;
    const dataUrl = await readFileAsDataUrl(file);
    updateProductField(id, field, dataUrl);
    if (field === "foodImage") {
      updateProductField(id, "image", dataUrl);
    }
  };

  const saveProduct = async (product: ManagedProduct) => {
    setSavingId(product.id);
    setError("");
    setSuccessId(null);

    try {
      const response = await fetch(API(`/api/admin/products/${product.id}`), {
        method: "PUT",
        headers: authHeaders(token),
        body: JSON.stringify(product),
      });
      const payload = await response.json();
      if (!response.ok) {
        setError(payload.error ?? "Save failed");
        setSavingId(null);
        return;
      }
      setProducts((current) => current.map((item) => (item.id === product.id ? (payload as ManagedProduct) : item)));
      setSuccessId(product.id);
      onSaved();
    } catch {
      setError("Network error while saving");
    } finally {
      setSavingId(null);
    }
  };

  if (loading) {
    return <p className="text-sm text-gray-500">Loading product management data…</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Product Management</h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage each Julizen product independently across 10G, 100G and 400G sizes. Changes are written to persistent server storage.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      <div className="space-y-5">
        {groupedProducts.map(([slug, records]) => (
          <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6" key={slug}>
            <h3 className="mb-4 text-lg font-semibold text-gray-900">{records[0]?.category}</h3>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {records.map((product) => (
                <article className="rounded-2xl border border-gray-100 bg-gray-50 p-4" key={product.id}>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-600">
                      {product.size}
                    </span>
                    {successId === product.id && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600">
                        <ShieldCheck className="h-4 w-4" /> Saved
                      </span>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Field label="Product name" value={product.name} onChange={(value) => updateProductField(product.id, "name", value)} />
                    <Field label="Description" textarea value={product.description} onChange={(value) => updateProductField(product.id, "description", value)} />
                    <Field
                      label="Packaging details"
                      textarea
                      value={product.packagingDetails}
                      onChange={(value) => updateProductField(product.id, "packagingDetails", value)}
                    />
                    <Field label="Category" value={product.category} onChange={(value) => updateProductField(product.id, "category", value)} />
                    <Field
                      label="Price (₦)"
                      type="number"
                      value={String(product.price)}
                      onChange={(value) => updateProductField(product.id, "price", Number(value) || 0)}
                    />
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">Status</label>
                      <select
                        className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                        onChange={(event) => updateProductField(product.id, "status", event.target.value)}
                        value={product.status}
                      >
                        <option value="available">Available</option>
                        <option value="coming_soon">Coming soon</option>
                      </select>
                    </div>

                    <ImageEditor
                      label="Front pack image"
                      preview={product.imageFront}
                      onFileChange={(file) => handleImageUpload(product.id, "imageFront", file)}
                      onUrlChange={(value) => updateProductField(product.id, "imageFront", value)}
                    />

                    <ImageEditor
                      label="Back pack image"
                      preview={product.imageBack}
                      onFileChange={(file) => handleImageUpload(product.id, "imageBack", file)}
                      onUrlChange={(value) => updateProductField(product.id, "imageBack", value)}
                    />

                    <ImageEditor
                      label="Food display image"
                      preview={product.foodImage}
                      onFileChange={(file) => handleImageUpload(product.id, "foodImage", file)}
                      onUrlChange={(value) => {
                        updateProductField(product.id, "foodImage", value);
                        updateProductField(product.id, "image", value);
                      }}
                    />

                    <button
                      className="mt-2 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
                      disabled={savingId === product.id}
                      onClick={() => saveProduct(product)}
                      type="button"
                    >
                      <Save className="h-4 w-4" />
                      {savingId === product.id ? "Saving…" : "Save this size"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function ImageEditor({
  label,
  preview,
  onFileChange,
  onUrlChange,
}: {
  label: string;
  preview: string;
  onFileChange: (file?: File) => void;
  onUrlChange: (value: string) => void;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3">
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</label>
      <div className="mb-2 flex h-28 items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 p-2">
        {preview ? <img alt={label} className="h-full w-full object-contain" src={preview} /> : <span className="text-xs text-gray-400">No image</span>}
      </div>
      <div className="space-y-2">
        <label className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50">
          <ImagePlus className="h-4 w-4" />
          Upload image
          <input className="hidden" onChange={(event) => onFileChange(event.target.files?.[0])} type="file" accept="image/*" />
        </label>
        <input
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
          onChange={(event) => onUrlChange(event.target.value)}
          placeholder="Or paste image URL / data URI"
          type="text"
          value={preview}
        />
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  textarea = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  textarea?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</label>
      {textarea ? (
        <textarea
          className="w-full resize-none rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          onChange={(event) => onChange(event.target.value)}
          rows={3}
          value={value}
        />
      ) : (
        <input
          className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          onChange={(event) => onChange(event.target.value)}
          type={type}
          value={value}
        />
      )}
    </div>
  );
}

function SettingsTab({ token }: { token: string }) {
  const [settings, setSettings] = useState<PublicSettings>({
    whatsapp_number: "",
    contact_email: "",
    contact_phone: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch(API("/api/admin/settings"), { headers: authHeaders(token) })
      .then((response) => response.json())
      .then((payload) => setSettings(payload as PublicSettings))
      .catch(() => setError("Failed to load settings"))
      .finally(() => setLoading(false));
  }, [token]);

  const save = async () => {
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      const response = await fetch(API("/api/admin/settings"), {
        method: "PUT",
        headers: authHeaders(token),
        body: JSON.stringify(settings),
      });
      const payload = await response.json();
      if (!response.ok) {
        setError(payload.error ?? "Failed to save settings");
        setSaving(false);
        return;
      }
      setSuccess(true);
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-gray-500">Loading settings…</p>;

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900">Public Contact Settings</h2>
      <p className="mt-1 text-sm text-gray-500">These values are stored on the server and reflected on the public website.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label="WhatsApp number"
          value={settings.whatsapp_number}
          onChange={(value) => setSettings((current) => ({ ...current, whatsapp_number: value }))}
        />
        <Field
          label="Contact phone"
          value={settings.contact_phone}
          onChange={(value) => setSettings((current) => ({ ...current, contact_phone: value }))}
        />
        <div className="sm:col-span-2">
          <Field
            label="Contact email"
            value={settings.contact_email}
            onChange={(value) => setSettings((current) => ({ ...current, contact_email: value }))}
          />
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
      {success && <p className="mt-4 text-sm text-green-600">Settings updated successfully.</p>}

      <button
        className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
        disabled={saving}
        onClick={save}
      >
        <Save className="h-4 w-4" />
        {saving ? "Saving…" : "Save Settings"}
      </button>
    </section>
  );
}

function PasswordTab({ token }: { token: string }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const save = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All password fields are required.");
      return;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirm password must match.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      const response = await fetch(API("/api/admin/password"), {
        method: "PUT",
        headers: authHeaders(token),
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const payload = await response.json();
      if (!response.ok) {
        setError(payload.error ?? "Failed to update password");
        setSaving(false);
        return;
      }
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccess(true);
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900">Admin Password</h2>
      <p className="mt-1 text-sm text-gray-500">Update your admin login password. This is persisted to the server file storage.</p>

      <div className="mt-6 space-y-4">
        <div className="relative">
          <Field label="Current password" type={showPassword ? "text" : "password"} value={currentPassword} onChange={setCurrentPassword} />
        </div>
        <Field label="New password" type={showPassword ? "text" : "password"} value={newPassword} onChange={setNewPassword} />
        <Field label="Confirm new password" type={showPassword ? "text" : "password"} value={confirmPassword} onChange={setConfirmPassword} />
        <button
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-700"
          onClick={() => setShowPassword((value) => !value)}
          type="button"
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {showPassword ? "Hide password fields" : "Show password fields"}
        </button>
      </div>

      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
      {success && <p className="mt-4 text-sm text-green-600">Password updated successfully.</p>}

      <button
        className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
        disabled={saving}
        onClick={save}
      >
        <Save className="h-4 w-4" />
        {saving ? "Saving…" : "Update Password"}
      </button>
    </section>
  );
}
