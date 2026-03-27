import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, LogOut, Plus, Trash2, Edit3, Eye, EyeOff, Save, RotateCcw,
  ChevronDown, ChevronUp, ImageIcon, Package, CheckCircle2, AlertCircle,
  GripVertical, ArrowLeft
} from "lucide-react";
import { useAdmin } from "./AdminProvider";
import {
  AdminProduct, AdminProductSize, SizeKey,
  getProducts, saveProducts, resetToDefaults, DEFAULT_PRODUCTS
} from "@/lib/productStorage";
import { getImageUrl } from "@/lib/imageUrl";

const SIZE_KEYS: SizeKey[] = ["10g", "100g", "400g"];

function generateId(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Date.now();
}

function makeDefaultSize(size: SizeKey): AdminProductSize {
  return {
    packLabel: size === "10g" ? "Sachet" : size === "100g" ? "Pouch" : "Value Pack",
    packDetail: size === "10g" ? "10g × 10 × 42 rolls (carton)" : size === "100g" ? "100g × 5 × 60 sachets (carton)" : "400g × 20 sachets (carton)",
    frontImage: "",
    backImage: "",
    whatsappMessage: "",
  };
}

function makeBlankProduct(): AdminProduct {
  return {
    id: "new-" + Date.now(),
    name: "",
    tagline: "",
    fullDescription: "",
    cookingTips: [""],
    foodImage: "",
    foodCaption: "",
    accentColor: "#D97706",
    enabled: true,
    sizes: {
      "10g": makeDefaultSize("10g"),
      "100g": makeDefaultSize("100g"),
      "400g": makeDefaultSize("400g"),
    },
  };
}

function ImageInput({
  value,
  onChange,
  label,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  placeholder?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const isData = value.startsWith("data:");
  const hasValue = value.trim().length > 0;

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => onChange(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  const previewSrc = hasValue
    ? (value.startsWith("/") ? getImageUrl(value) : value)
    : "";

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={isData ? "(uploaded image)" : value}
          onChange={e => onChange(e.target.value)}
          readOnly={isData}
          placeholder={placeholder || "Image URL or upload below"}
          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex-shrink-0 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
        >
          <ImageIcon className="w-3.5 h-3.5" />
          Upload
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
      {hasValue && (
        <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
          <img
            src={previewSrc}
            alt="preview"
            className="w-full h-full object-contain"
            onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        </div>
      )}
    </div>
  );
}

function ProductEditor({
  product,
  onSave,
  onCancel,
  isNew,
}: {
  product: AdminProduct;
  onSave: (p: AdminProduct) => void;
  onCancel: () => void;
  isNew?: boolean;
}) {
  const [draft, setDraft] = useState<AdminProduct>(() => JSON.parse(JSON.stringify(product)));
  const [activeSize, setActiveSize] = useState<SizeKey>("100g");
  const [saved, setSaved] = useState(false);

  function field<K extends keyof AdminProduct>(key: K, value: AdminProduct[K]) {
    setDraft(prev => ({ ...prev, [key]: value }));
  }

  function sizeField<K extends keyof AdminProductSize>(size: SizeKey, key: K, value: AdminProductSize[K]) {
    setDraft(prev => ({
      ...prev,
      sizes: { ...prev.sizes, [size]: { ...prev.sizes[size], [key]: value } },
    }));
  }

  function addTip() {
    setDraft(prev => ({ ...prev, cookingTips: [...prev.cookingTips, ""] }));
  }

  function updateTip(i: number, v: string) {
    setDraft(prev => {
      const tips = [...prev.cookingTips];
      tips[i] = v;
      return { ...prev, cookingTips: tips };
    });
  }

  function removeTip(i: number) {
    setDraft(prev => ({ ...prev, cookingTips: prev.cookingTips.filter((_, idx) => idx !== i) }));
  }

  function handleSave() {
    const id = isNew ? generateId(draft.name || "product") : draft.id;
    onSave({ ...draft, id });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const canSave = draft.name.trim().length > 0;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
        <button onClick={onCancel} className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-gray-900 text-sm truncate">{isNew ? "New Product" : `Edit: ${product.name}`}</h2>
        </div>
        <button
          onClick={handleSave}
          disabled={!canSave}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold shadow-sm shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? "Saved!" : "Save"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
          <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
            <Package className="w-4 h-4 text-primary" /> Product Info
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Product Name *</label>
              <input
                type="text"
                value={draft.name}
                onChange={e => field("name", e.target.value)}
                placeholder="e.g. Chicken Flavour"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Tagline</label>
              <input
                type="text"
                value={draft.tagline}
                onChange={e => field("tagline", e.target.value)}
                placeholder="Short compelling tagline..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Full Description</label>
              <textarea
                value={draft.fullDescription}
                onChange={e => field("fullDescription", e.target.value)}
                rows={4}
                placeholder="Full product description shown in detail modal..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Accent Colour</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={draft.accentColor}
                  onChange={e => field("accentColor", e.target.value)}
                  className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={draft.accentColor}
                  onChange={e => field("accentColor", e.target.value)}
                  className="w-28 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Visibility</label>
                <button
                  type="button"
                  onClick={() => field("enabled", !draft.enabled)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                    draft.enabled
                      ? "bg-green-50 border-green-200 text-green-700"
                      : "bg-gray-100 border-gray-200 text-gray-500"
                  }`}
                >
                  {draft.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  {draft.enabled ? "Visible on site" : "Hidden from site"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
          <h3 className="font-semibold text-gray-800 text-sm">Cooking Tips</h3>
          <div className="space-y-2">
            {draft.cookingTips.map((tip, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={tip}
                  onChange={e => updateTip(i, e.target.value)}
                  placeholder={`Tip ${i + 1}...`}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
                <button
                  type="button"
                  onClick={() => removeTip(i)}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addTip}
              className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium transition-colors"
            >
              <Plus className="w-4 h-4" /> Add tip
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
          <h3 className="font-semibold text-gray-800 text-sm">Food Image</h3>
          <ImageInput
            value={draft.foodImage}
            onChange={v => field("foodImage", v)}
            label="Food Photo"
            placeholder="/images/food-*.webp or image URL"
          />
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Image Caption</label>
            <input
              type="text"
              value={draft.foodCaption}
              onChange={e => field("foodCaption", e.target.value)}
              placeholder="Describe the food image..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
          <h3 className="font-semibold text-gray-800 text-sm">Size Variants</h3>
          <div className="flex gap-2 border-b border-gray-200 pb-3">
            {SIZE_KEYS.map(sz => (
              <button
                key={sz}
                type="button"
                onClick={() => setActiveSize(sz)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  activeSize === sz
                    ? "bg-primary text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {sz}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Pack Label</label>
                <input
                  type="text"
                  value={draft.sizes[activeSize].packLabel}
                  onChange={e => sizeField(activeSize, "packLabel", e.target.value)}
                  placeholder="e.g. Sachet, Pouch"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Pack Detail</label>
                <input
                  type="text"
                  value={draft.sizes[activeSize].packDetail}
                  onChange={e => sizeField(activeSize, "packDetail", e.target.value)}
                  placeholder="e.g. 42 rolls per carton"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                />
              </div>
            </div>

            <ImageInput
              value={draft.sizes[activeSize].frontImage}
              onChange={v => sizeField(activeSize, "frontImage", v)}
              label="Front Image"
              placeholder="/images/product-*-front.webp"
            />
            <ImageInput
              value={draft.sizes[activeSize].backImage}
              onChange={v => sizeField(activeSize, "backImage", v)}
              label="Back Image"
              placeholder="/images/product-*-back.webp"
            />

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">WhatsApp Order Message</label>
              <textarea
                value={draft.sizes[activeSize].whatsappMessage}
                onChange={e => sizeField(activeSize, "whatsappMessage", e.target.value)}
                rows={2}
                placeholder="Message sent when customer clicks Order..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductRow({
  product,
  onEdit,
  onToggle,
  onDelete,
}: {
  product: AdminProduct;
  onEdit: () => void;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const frontImg = product.sizes["100g"]?.frontImage || product.sizes["10g"]?.frontImage || "";
  const src = frontImg.startsWith("/") ? getImageUrl(frontImg) : frontImg;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
      className={`flex items-center gap-4 p-4 bg-white rounded-xl border transition-all ${
        product.enabled ? "border-gray-200" : "border-gray-100 opacity-60"
      }`}
    >
      <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
        {src ? (
          <img src={src} alt={product.name} className="w-full h-full object-contain" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <Package className="w-6 h-6" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900 text-sm truncate">{product.name}</h3>
          {!product.enabled && (
            <span className="flex-shrink-0 text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">Hidden</span>
          )}
        </div>
        <p className="text-xs text-gray-500 truncate mt-0.5">{product.tagline}</p>
        <div className="flex items-center gap-1 mt-1.5">
          {(["10g", "100g", "400g"] as SizeKey[]).map(sz => (
            <span key={sz} className="text-xs px-1.5 py-0.5 bg-primary/8 text-primary/70 rounded font-medium" style={{backgroundColor: product.accentColor + "15", color: product.accentColor}}>
              {sz}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={onToggle}
          title={product.enabled ? "Hide from site" : "Show on site"}
          className={`p-2 rounded-lg transition-colors ${
            product.enabled
              ? "text-green-600 hover:bg-green-50"
              : "text-gray-400 hover:bg-gray-100"
          }`}
        >
          {product.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>
        <button
          onClick={onEdit}
          className="p-2 rounded-lg text-gray-500 hover:text-primary hover:bg-primary/5 transition-colors"
        >
          <Edit3 className="w-4 h-4" />
        </button>
        <button
          onClick={onDelete}
          className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

export function AdminDashboard() {
  const { showDashboard, closeDashboard, handleLogout } = useAdmin();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [editing, setEditing] = useState<AdminProduct | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (showDashboard) setProducts(getProducts());
  }, [showDashboard]);

  useEffect(() => {
    if (!showDashboard) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && !editing) closeDashboard(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [showDashboard, editing, closeDashboard]);

  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  function persistAndUpdate(updated: AdminProduct[]) {
    setProducts(updated);
    saveProducts(updated);
  }

  function handleSaveProduct(product: AdminProduct) {
    setProducts(prev => {
      const idx = prev.findIndex(p => p.id === product.id);
      const updated = idx >= 0
        ? prev.map(p => p.id === product.id ? product : p)
        : [...prev, product];
      saveProducts(updated);
      return updated;
    });
    setEditing(null);
    setIsNewProduct(false);
    showToast(isNewProduct ? "Product added successfully!" : "Product saved!");
  }

  function handleToggle(id: string) {
    const updated = products.map(p =>
      p.id === id ? { ...p, enabled: !p.enabled } : p
    );
    persistAndUpdate(updated);
  }

  function handleDelete(id: string) {
    if (deleteConfirm !== id) { setDeleteConfirm(id); return; }
    const updated = products.filter(p => p.id !== id);
    persistAndUpdate(updated);
    setDeleteConfirm(null);
    showToast("Product deleted.");
  }

  function handleReset() {
    const fresh = resetToDefaults();
    setProducts(fresh);
    setShowResetConfirm(false);
    showToast("Products reset to defaults.");
  }

  function startEdit(product: AdminProduct) {
    setIsNewProduct(false);
    setEditing(JSON.parse(JSON.stringify(product)));
  }

  function startNew() {
    setIsNewProduct(true);
    setEditing(makeBlankProduct());
  }

  if (typeof window === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {showDashboard && (
        <motion.div
          key="admin-dashboard"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[99998] bg-gray-50 flex flex-col overflow-hidden"
        >
          {!editing ? (
            <>
              <header className="bg-white border-b border-gray-200 px-4 py-4 flex items-center gap-4 flex-shrink-0">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                    <Package className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h1 className="font-bold text-gray-900 text-base leading-none">Admin Dashboard</h1>
                    <p className="text-xs text-gray-500 mt-0.5">{products.filter(p => p.enabled).length} of {products.length} products visible</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowResetConfirm(true)}
                    className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    title="Reset to defaults"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                  <button
                    onClick={closeDashboard}
                    className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </header>

              <div className="flex-1 overflow-y-auto">
                <div className="max-w-2xl mx-auto p-4 space-y-3">
                  <div className="flex items-center justify-between py-2">
                    <h2 className="font-semibold text-gray-800 text-sm">Products</h2>
                    <button
                      onClick={startNew}
                      className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold shadow-sm shadow-primary/20 hover:bg-primary/90 transition-all"
                    >
                      <Plus className="w-4 h-4" /> Add Product
                    </button>
                  </div>

                  {products.length === 0 && (
                    <div className="text-center py-16 text-gray-400">
                      <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p className="text-sm">No products yet.</p>
                      <button onClick={startNew} className="mt-3 text-primary text-sm font-medium">Add your first product</button>
                    </div>
                  )}

                  <AnimatePresence>
                    {products.map(product => (
                      <div key={product.id} className="relative">
                        <ProductRow
                          product={product}
                          onEdit={() => startEdit(product)}
                          onToggle={() => handleToggle(product.id)}
                          onDelete={() => handleDelete(product.id)}
                        />
                        {deleteConfirm === product.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mx-1 px-4 py-3 bg-red-50 border border-red-200 rounded-b-xl border-t-0 flex items-center justify-between gap-3"
                          >
                            <p className="text-sm text-red-700 font-medium">Delete this product?</p>
                            <div className="flex gap-2">
                              <button onClick={() => setDeleteConfirm(null)} className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                              <button onClick={() => handleDelete(product.id)} className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors">Delete</button>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    ))}
                  </AnimatePresence>

                  <div className="pt-4 pb-8 text-center">
                    <p className="text-xs text-gray-400">Changes save instantly and reflect on the site immediately.</p>
                    <p className="text-xs text-gray-400 mt-1">Data is stored locally in this browser.</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <ProductEditor
              product={editing}
              onSave={handleSaveProduct}
              onCancel={() => { setEditing(null); setIsNewProduct(false); }}
              isNew={isNewProduct}
            />
          )}

          {showResetConfirm && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4 z-10">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">Reset all products?</h3>
                    <p className="text-xs text-gray-500">This will restore all default products and discard any changes.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowResetConfirm(false)} className="flex-1 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                  <button onClick={handleReset} className="flex-1 py-2 text-sm bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors">Reset</button>
                </div>
              </motion.div>
            </div>
          )}

          <AnimatePresence>
            {toast && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-xl text-sm font-semibold shadow-xl flex items-center gap-2 ${
                  toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
                }`}
              >
                {toast.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                {toast.msg}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
