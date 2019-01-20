const Store = require("electron-store");
const store = new Store();

export function saveSetting(key: string, value: string) {
	store.set(key, value);
}
export function readSetting(key: string) {
	return store.get(key);
}
export function deleteSetting(key: string) {
	if (readSetting(key)) store.delete(key);
}
