import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Flame, Plus, Pencil, Trash2, Save, X, LogOut, KeyRound, Settings, Package, Eye, EyeOff } from "lucide-react";
import { useApp, type Product } from "@/context/AppContext";
import { formatNaira } from "@/context/AppContext";

const API = (path: string) => path;

function useAdminAuth() {
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem("julizen_admin_token"));
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
      const { token: t } = await res.json();
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

function authHeaders(token: string) {
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

export default function Admin() {
  const [, navigate] = useLocation();
  const { token, login, logout } = useAdminAuth();
  const { refetch } = useApp();
  const [tab, setTab] = useState<"products" | "settings" | "password">("products");

  if (!token) {
    return <LoginPage onLogin={login} onBack={() => navigate("/")} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AdminNav tab={tab} setTab={setTab} onLogout={logout} />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        {tab === "products" && <ProductsTab token={token} onRefetch={refetch} />}
        {tab === "settings" && <SettingsTab token={token} />}
        {tab === "password" && <PasswordTab token={token} />}
      </main>
    </div>
  );
}

function LoginPage({ onLogin, onBack }: { onLogin: (p: string) => Promise<string | null>; onBack: () => void }) {
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
        <button onClick={onBack} className="mt-5 text-xs text-gray-400 hover:text-gray-600 w-full text-center transition-colors">
          ← Back to website
        </button>
      </div>
    </div>
  );
}

function AdminNav({ tab, setTab, onLogout }: { tab: string; setTab: (t: any) => void; onLogout: () => void }) {
  const tabs = [
    { id: "products", label: "Products", icon: Package },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "password", label: "Password", icon: KeyRound },
  ];
  return (
    <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/images/julizen-logo.png" alt="Julizen" className="h-10 w-auto object-contain" />
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider hidden sm:block">Admin Panel</span>
        </div>
        <nav className="flex items-center gap-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === id ? "bg-red-50 text-red-600" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
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

function ProductsTab({ token, onRefetch }: { token: string; onRefetch: () => void }) {
  const { products } = useApp();
  const [editing, setEditing] = useState<Product | null>(null);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const emptyProduct: Omit<Product, "id"> = {
    name: "",
    category: "",
    price: 1500,
    description: "",
    image: "/images/product-chicken.png",
    status: "available",
  };
  const [form, setForm] = useState<Partial<Product>>(emptyProduct);

  const startEdit = (p: Product) => { setEditing(p); setForm(p); setAdding(false); setError(""); };
  const startAdd = () => { setAdding(true); setEditing(null); setForm({ ...emptyProduct, id: Date.now().toString() }); setError(""); };
  const cancel = () => { setEditing(null); setAdding(false); setError(""); };

  const save = async () => {
    if (!form.name?.trim() || !form.category?.trim() || !form.description?.trim() || !form.image?.trim()) {
      setError("All fields are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const isNew = adding;
      const url = isNew ? "/api/products" : `/api/products/${editing!.id}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(API(url), { method, headers: authHeaders(token), body: JSON.stringify(form) });
      if (!res.ok) { const d = await res.json(); setError(d.error ?? "Save failed"); return; }
      cancel();
      onRefetch();
    } catch { setError("Network error."); }
    finally { setSaving(false); }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      const res = await fetch(API(`/api/products/${id}`), { method: "DELETE", headers: authHeaders(token) });
      if (!res.ok) { alert("Failed to delete product."); return; }
      onRefetch();
    } catch { alert("Network error."); }
  };

  const imageOptions = [
    { label: "Chicken", value: "/images/product-chicken.png" },
    { label: "Fried Rice", value: "/images/product-fried-rice.png" },
    { label: "Crayfish", value: "/images/product-crayfish.png" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Products</h2>
          <p className="text-sm text-gray-500 mt-0.5">Manage your product catalog</p>
        </div>
        {!adding && !editing && (
          <button onClick={startAdd} className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-colors">
            <Plus className="w-4 h-4" /> Add Product
          </button>
        )}
      </div>

      {(adding || editing) && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">{adding ? "Add New Product" : "Edit Product"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Product Name" value={form.name ?? ""} onChange={(v) => setForm((f) => ({ ...f, name: v }))} placeholder="e.g. Julizen Chicken Seasoning Powder" />
            <Field label="Category" value={form.category ?? ""} onChange={(v) => setForm((f) => ({ ...f, category: v }))} placeholder="e.g. Chicken" />
            <Field label="Price (₦)" type="number" value={String(form.price ?? 1500)} onChange={(v) => setForm((f) => ({ ...f, price: Number(v) }))} placeholder="1500" />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
              <select
                value={form.status ?? "available"}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as any }))}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="available">Available</option>
                <option value="coming_soon">Coming Soon</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Image</label>
            <div className="flex gap-2 flex-wrap mb-2">
              {imageOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, image: opt.value }))}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-colors ${form.image === opt.value ? "border-red-500 bg-red-50 text-red-600" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
                >
                  <img src={opt.value} alt={opt.label} className="w-6 h-6 object-cover rounded" />
                  {opt.label}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={form.image ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Or enter a custom image URL / path"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea
              value={form.description ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              placeholder="Product description…"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex gap-3">
            <button onClick={save} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-60">
              <Save className="w-4 h-4" /> {saving ? "Saving…" : "Save Product"}
            </button>
            <button onClick={cancel} className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-colors">
              <X className="w-4 h-4" /> Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
            <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-xl flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-gray-900 text-sm truncate">{product.name}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${product.status === "available" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                  {product.status === "available" ? "Available" : "Coming Soon"}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{product.category} · {formatNaira(product.price)}</p>
              <p className="text-xs text-gray-500 mt-1 line-clamp-1">{product.description}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => startEdit(product)} className="p-2 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => remove(product.id)} className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <Package className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No products yet. Add one above.</p>
          </div>
        )}
      </div>
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
    fetch(API("/api/admin/settings"), { headers: authHeaders(token) })
      .then((r) => r.json())
      .then((d) => {
        setWhatsapp(d.whatsapp_number ?? "");
        setEmail(d.contact_email ?? "");
        setPhone(d.contact_phone ?? "");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  const save = async () => {
    if (!whatsapp.trim()) { setError("WhatsApp number is required."); return; }
    setSaving(true); setError(""); setSuccess(false);
    try {
      const res = await fetch(API("/api/admin/settings"), {
        method: "PUT",
        headers: authHeaders(token),
        body: JSON.stringify({ whatsapp_number: whatsapp, contact_email: email, contact_phone: phone }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error ?? "Save failed"); return; }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch { setError("Network error."); }
    finally { setSaving(false); }
  };

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Contact Settings</h2>
        <p className="text-sm text-gray-500 mt-0.5">These details appear on the website and power the WhatsApp order buttons.</p>
      </div>
      {loading ? (
        <div className="text-sm text-gray-400">Loading…</div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">WhatsApp Number</label>
            <p className="text-xs text-gray-400 mb-2">Include country code, no spaces or dashes (e.g. 2348012345678)</p>
            <input type="text" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="2348000000000" />
          </div>
          <Field label="Contact Email" value={email} onChange={setEmail} placeholder="info@julizen.com" type="email" />
          <Field label="Contact Phone (display)" value={phone} onChange={setPhone} placeholder="+234 800 000 0000" />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm font-medium">Settings saved successfully.</p>}
          <button onClick={save} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-60">
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
    if (!current || !next || !confirm) { setError("All fields are required."); return; }
    if (next !== confirm) { setError("New passwords do not match."); return; }
    if (next.length < 6) { setError("New password must be at least 6 characters."); return; }
    setSaving(true); setError(""); setSuccess(false);
    try {
      const res = await fetch(API("/api/admin/password"), {
        method: "PUT",
        headers: authHeaders(token),
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error ?? "Update failed"); return; }
      setSuccess(true); setCurrent(""); setNext(""); setConfirm("");
      setTimeout(() => setSuccess(false), 3000);
    } catch { setError("Network error."); }
    finally { setSaving(false); }
  };

  return (
    <div className="max-w-md space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Change Password</h2>
        <p className="text-sm text-gray-500 mt-0.5">You must enter your current password to set a new one.</p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
          <input type={showPw ? "text" : "password"} value={current} onChange={(e) => setCurrent(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 pr-10" placeholder="Current password" />
          <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3 bottom-2.5 text-gray-400 hover:text-gray-600">
            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <Field label="New Password" type="password" value={next} onChange={setNext} placeholder="At least 6 characters" />
        <Field label="Confirm New Password" type="password" value={confirm} onChange={setConfirm} placeholder="Repeat new password" />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm font-medium">Password updated successfully.</p>}
        <button onClick={save} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-60">
          <KeyRound className="w-4 h-4" /> {saving ? "Updating…" : "Update Password"}
        </button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
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
