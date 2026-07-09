// store/PlansStore.js
//
// Responsible for saving/removing/reading saved plans, persisted in
// localStorage so they survive a page reload.

class PlansStore {
  constructor(storageKey = "wanderlust_saved_plans") {
    this.storageKey = storageKey;
    this.plans = this._load();
    this.listeners = [];
  }

  _load() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      console.error("Error loading saved plans:", error);
      return [];
    }
  }

  _save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.plans));
    } catch (error) {
      console.error("Error saving plans:", error);
    }
  }

  onChange(callback) {
    this.listeners.push(callback);
  }

  _notify() {
    this.listeners.forEach((cb) => cb(this.plans));
  }

  isSaved(id) {
    return this.plans.some((p) => p.id === id);
  }

  add(plan) {
    if (this.isSaved(plan.id)) return;
    this.plans.unshift({...plan, savedAt: new Date().toISOString()});
    this._save();
    this._notify();
  }

  remove(id) {
    this.plans = this.plans.filter((p) => p.id !== id);
    this._save();
    this._notify();
  }

  toggle(plan) {
    if (this.isSaved(plan.id)) {
      this.remove(plan.id);
      return false;
    }
    this.add(plan);
    return true;
  }

  clearAll() {
    this.plans = [];
    this._save();
    this._notify();
  }

  getByType(type) {
    if (!type || type === "all") return this.plans;
    return this.plans.filter((p) => p.type === type);
  }

  count(type = "all") {
    return this.getByType(type).length;
  }
}

const plansStore = new PlansStore();
export default plansStore;
