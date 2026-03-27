import { useState, useEffect, useCallback } from "react";
import { StoreSettings } from "@/lib/githubStorage";

const STORE_URL = import.meta.env.BASE_URL + "data/store.json";

const DEFAULT_SETTINGS: StoreSettings = {
  whatsapp_number: "2348033975366",
  contact_email: "Julifemid@yahoo.com",
  contact_phone: "+234 803 397 5366",
  contact_phone_2: "+234 803 423 7281",
};

export function useSettings(): StoreSettings {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);

  const load = useCallback(async () => {
    try {
      const res = await fetch(STORE_URL + "?t=" + Date.now());
      if (!res.ok) return;
      const data = await res.json();
      if (data?.settings && typeof data.settings === "object") {
        setSettings({ ...DEFAULT_SETTINGS, ...data.settings });
      }
    } catch {
      // keep defaults
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return settings;
}
