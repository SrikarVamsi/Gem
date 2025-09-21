const input = document.getElementById('apiBase');
const statusEl = document.getElementById('status');

const DEFAULT_API = 'http://127.0.0.1:8080';

async function load() {
  const { apiBase } = await chrome.storage.sync.get({ apiBase: DEFAULT_API });
  input.value = apiBase || DEFAULT_API;
}

async function save() {
  const apiBase = input.value.trim() || DEFAULT_API;
  await chrome.storage.sync.set({ apiBase });
  statusEl.textContent = 'Saved!';
  setTimeout(() => (statusEl.textContent = ''), 1200);
}

load();
document.getElementById('save').addEventListener('click', save);
