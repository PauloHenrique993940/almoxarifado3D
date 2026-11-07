(function () {
'use strict';

/* ---------- Defini��es dos modelos ---------- */
const DEFS = {
  shelf_p: { cat: 'Prateleiras', label: 'Prateleira pequena', kind: 'shelf', w: 1.0, d: 0.45, levels: 4, slots: 2, lh: 0.45, color: 0x3b6fb6 },
  shelf_m: { cat: 'Prateleiras', label: 'Prateleira media', kind: 'shelf', w: 1.8, d: 0.5, levels: 4, slots: 4, lh: 0.5, color: 0x3b6fb6 },
  shelf_g: { cat: 'Prateleiras', label: 'Prateleira grande', kind: 'shelf', w: 2.6, d: 0.6, levels: 5, slots: 6, lh: 0.45, color: 0x3b6fb6 },
  shelf_c: { cat: 'Prateleiras', label: 'Prateleira compacta', kind: 'shelf', w: 1.4, d: 0.4, levels: 3, slots: 3, lh: 0.5, color: 0x3b6fb6 },
  shelf_t: { cat: 'Prateleiras', label: 'Estante alta', kind: 'shelf', w: 1.2, d: 0.4, levels: 6, slots: 2, lh: 0.38, color: 0x6a7f3a },
  rack:    { cat: 'Prateleiras', label: 'Porta-pallet', kind: 'shelf', w: 2.6, d: 1.0, levels: 3, slots: 3, lh: 0.85, color: 0xe07b1a, big: true },
  fridge_1:{ cat: 'Geladeiras', label: 'Geladeira', kind: 'closed', w: 0.8, d: 0.75, levels: 4, slots: 2, lh: 0.42, color: 0xeceff3, doors: 1, handle: true },
  fridge_2:{ cat: 'Geladeiras', label: 'Geladeira industrial', kind: 'closed', w: 1.4, d: 0.85, levels: 4, slots: 4, lh: 0.48, color: 0xcfd6de, doors: 2, handle: true },
  fridge_3:{ cat: 'Geladeiras', label: 'Frigobar', kind: 'closed', w: 0.55, d: 0.55, levels: 2, slots: 1, lh: 0.3, color: 0x2f343d, doors: 1, handle: true },
  fridge_4:{ cat: 'Geladeiras', label: 'Freezer vertical', kind: 'closed', w: 0.7, d: 0.7, levels: 5, slots: 2, lh: 0.36, color: 0xf2f4f7, doors: 1, handle: true },
  cab_3: { cat: 'Armarios', label: 'Armario de aco', kind: 'closed', w: 1.2, d: 0.5, levels: 4, slots: 3, lh: 0.45, color: 0x7d8794, doors: 2 },
  cab_1: { cat: 'Armarios', label: 'Armario baixo', kind: 'closed', w: 1.0, d: 0.5, levels: 2, slots: 2, lh: 0.45, color: 0x8a5a33, doors: 2 },
  cab_2: { cat: 'Armarios', label: 'Armario alto', kind: 'closed', w: 0.9, d: 0.5, levels: 5, slots: 2, lh: 0.4, color: 0x8a5a33, doors: 1 },
  desk: { cat: 'Moveis', label: 'Escrivaninha', kind: 'desk', w: 1.4, d: 0.7, h: 0.75, color: 0xb98a55 },
  table: { cat: 'Moveis', label: 'Mesa', kind: 'desk', w: 1.8, d: 0.9, h: 0.76, color: 0xd9d2c3 },
  bench: { cat: 'Moveis', label: 'Bancada', kind: 'bench', w: 2.0, d: 0.7, h: 0.92, color: 0x7d8794 },
  chair: { cat: 'Moveis', label: 'Cadeira', kind: 'chair', w: 0.5, d: 0.5, color: 0x333a47 },
  pallet: { cat: 'Moveis', label: 'Pallet', kind: 'pallet', w: 1.2, d: 0.8, color: 0xc9a46a },
  cart: { cat: 'Moveis', label: 'Carrinho de carga', kind: 'cart', w: 1.0, d: 0.6, h: 1.0, color: 0x3b6fb6 },
  ext:     { cat: 'M�veis', label: 'Extintor', kind: 'ext', w: 0.3, d: 0.3, h: 0.6, color: 0xc62828 },
  plant: { cat: 'Moveis', label: 'Planta', kind: 'plant', w: 0.5, d: 0.5, h: 1.0, color: 0x3f8f4a },
  window:  { cat: 'Portas', label: 'Janela', kind: 'window', w: 1.4, d: 0.16, h: 2.1, color: 0x9ed0f0 },
  door_1:  { cat: 'Portas', label: 'Porta simples', kind: 'door', w: 1.0, d: 0.16, h: 2.1, color: 0x8a5a33 },
  door_2:  { cat: 'Portas', label: 'Porta dupla', kind: 'door', w: 1.8, d: 0.16, h: 2.1, color: 0x6e7a88, double: true },
  door_roll: { cat: 'Portas', label: 'Portao de enrolar', kind: 'door', w: 3.0, d: 0.2, h: 2.6, color: 0x9aa3af, roll: true }
};
const ROOM = { w: 14, d: 22, wallH: 3, floor: '#dfe5eb', wall: '#d8dde4' };
const KEY = 'almox3d_v6';
const PALETTE = ['#c8924a', '#d8a35c', '#7aa6d6', '#8ec07c', '#e0807a', '#b79ae0', '#e5cf6a', '#6fc3c3'];
const $ = id => document.getElementById(id);

/* ---------- Estado ---------- */
let state = load() || defaultState();
const ROOM_DEFAULT = Object.assign({}, ROOM);
function applyRoom(r) { Object.assign(ROOM, ROOM_DEFAULT, r || {}); }
applyRoom(state.room);
const ui = { uid: null, boxId: null, target: { level: 0, slot: 0 }, search: '' };
const groups = new Map();

function defaultState() {
  const s = { nextId: 1, units: [] };
  const add = (type, x, z, r) => { const u = { id: s.nextId++, type, x, z, r, boxes: [] }; s.units.push(u); return u; };
  let codeSeq = 1;
  const put = (u, name, qty, category, level, weightKg, color) => u.boxes.push({ id: 'b' + Math.random().toString(36).slice(2, 9), name, description: name, code: 'MAT-' + String(codeSeq++).padStart(3, '0'), category, status: 'Ativo', minQty: 5, weightKg, qty, color, level, slot: 0 });
  const lanes = [
    { x: -5.1, category: 'Ferragens e fixadores', color: PALETTE[0], frameColor: '#3569a8', items: [['Parafusos M6', 500, 18], ['Porcas M6', 800, 14], ['Arruelas', 1200, 12], ['Buchas 8 mm', 200, 8], ['Pregos', 400, 10], ['Abracadeiras', 150, 2], ['Chapas metalicas', 25, 20], ['Pecas de reposicao', 18, 16]] },
    { x: -1.7, category: 'Material de escritorio', color: PALETTE[6], frameColor: '#43845d', items: [['Papel A4', 30, 4], ['Canetas', 120, 2], ['Toner HP', 6, 2], ['Pastas suspensas', 40, 3], ['Clips', 500, 1], ['Grampos', 300, 1], ['Etiquetas', 100, 1], ['Envelopes', 80, 2]] },
    { x: 1.7, category: 'Eletrica e informatica', color: PALETTE[7], frameColor: '#bd7c25', items: [['Cabo de rede', 25, 5], ['Conectores RJ45', 300, 2], ['Lampadas LED', 48, 2], ['Tomadas', 60, 3], ['Extensoes', 12, 4], ['Fusiveis', 80, 1], ['Mouse USB', 15, 1], ['Teclados USB', 10, 2]] },
    { x: 5.1, category: 'EPI e ferramentas', color: PALETTE[3], frameColor: '#92515a', items: [['Luvas de protecao', 40, 3], ['Fita isolante', 60, 2], ['Chaves de fenda', 24, 3], ['Oculos de protecao', 20, 2], ['Mascaras PFF2', 100, 1], ['Alicates', 12, 4], ['Capacetes', 10, 3], ['Trenas', 8, 1]] }
  ];
  const zRows = [-3.3, -1.1, 1.1, 3.3];
  const shelfPositions = lanes.flatMap(lane => zRows.map(z => ({ lane, z }))).slice(0, 15);
  const defaultItems = lanes.flatMap(lane => lane.items.map(item => ({ lane, item })));
  shelfPositions.forEach(({ lane, z }, index) => {
    const shelf = add('shelf_m', lane.x, z, 1);
    shelf.color = lane.frameColor;
    const { item, lane: itemLane } = defaultItems[index];
    put(shelf, item[0], item[1], itemLane.category, item[2] >= 15 ? 0 : 1, item[2], itemLane.color);
  });
  const cold = add('fridge_1', 6.2, -9.5, 0);
  put(cold, 'Reagentes refrigerados', 12, 'Itens refrigerados', 1, 2, '#9fd0ff');
  add('cab_3', -6.2, -9.5, 0);
  add('door_2', -ROOM.w / 2 + 0.08, 0, 1);
  add('window', 0, -ROOM.d / 2 + 0.08, 0);
  add('ext', -6.65, -0.8, 0);
  add('bench', 0, 9.8, 0);
  return s;
}
function migrateState(previous) {
  const next = defaultState();
  const shelves = next.units.filter(u => DEFS[u.type].kind === 'shelf');
  const cold = next.units.find(u => u.type === 'fridge_1');
  shelves.forEach(u => { u.boxes = []; });
  if (cold) cold.boxes = [];
  const groups = [[], [], [], []], refrigerated = [];
  const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  (previous.units || []).forEach(u => (u.boxes || []).forEach(b => {
    const category = normalize(b.category), name = normalize(b.name);
    const item = { ...b, description: b.description || b.name, code: b.code || '', category: b.category || 'Materiais diversos', status: b.status || 'Ativo', minQty: b.minQty ?? 5, weightKg: Number(b.weightKg) || 0 };
    if ((category + ' ' + name).includes('refriger') || (category + ' ' + name).includes('vacina')) refrigerated.push(item);
    else if (category.includes('escrit') || category.includes('office') || name.includes('papel')) groups[1].push(item);
    else if (category.includes('eletric') || category.includes('informat') || name.includes('cabo') || name.includes('conector')) groups[2].push(item);
    else if (category.includes('epi') || category.includes('ferrament') || name.includes('luva') || name.includes('mascara')) groups[3].push(item);
    else groups[0].push(item);
  }));
  const laneXs = [-5.1, -1.7, 1.7, 5.1], laneColors = ['#3569a8', '#43845d', '#bd7c25', '#92515a'];
  let targetDepth = ROOM.d;
  groups.forEach((items, lane) => {
    const laneShelves = shelves.filter(u => Math.abs(u.x - laneXs[lane]) < 0.01).sort((a, b) => a.z - b.z);
    const heavy = items.filter(b => b.weightKg > 15), light = items.filter(b => b.weightKg <= 15);
    let shelfIndex = 0, heavyIndex = 0, lightIndex = 0;
    while (heavyIndex < heavy.length || lightIndex < light.length) {
      let shelf = laneShelves[shelfIndex];
      if (!shelf) {
        const z = 6.3 + 1.8 * (shelfIndex - 7);
        shelf = { id: next.nextId++, type: 'shelf_m', x: laneXs[lane], z, r: 1, color: laneColors[lane], boxes: [] };
        laneShelves.push(shelf); shelves.push(shelf); next.units.push(shelf);
        targetDepth = Math.max(targetDepth, Math.ceil(2 * (Math.abs(z) + 1.4)));
      }
      const def = DEFS[shelf.type], bottom = heavy.slice(heavyIndex, heavyIndex + def.slots);
      heavyIndex += bottom.length;
      bottom.forEach((b, slot) => { b.level = 0; b.slot = slot; shelf.boxes.push(b); });
      const remainingCapacity = def.levels * def.slots - bottom.length;
      const lightCount = Math.min(remainingCapacity, light.length - lightIndex);
      for (let i = 0; i < lightCount; i++) {
        const b = light[lightIndex++];
        let placed = false;
        for (let level = 0; level < def.levels && !placed; level++) for (let slot = 0; slot < def.slots && !placed; slot++) {
          if (!shelf.boxes.some(existing => existing.level === level && existing.slot === slot)) {
            b.level = level; b.slot = slot; shelf.boxes.push(b); placed = true;
          }
        }
      }
      shelfIndex++;
    }
  });
  const coldUnits = cold ? [cold] : [];
  let coldIndex = 0;
  while (coldIndex < refrigerated.length) {
    let unit = coldUnits[coldUnits.length - 1];
    if (!unit || unit.boxes.length >= DEFS[unit.type].levels * DEFS[unit.type].slots) {
      const z = -9.5 - coldUnits.length * 0.95;
      unit = { id: next.nextId++, type: 'fridge_1', x: 6.2, z, r: 0, boxes: [] };
      coldUnits.push(unit); next.units.push(unit);
      targetDepth = Math.max(targetDepth, Math.ceil(2 * (Math.abs(z) + 0.75)));
    }
    const def = DEFS[unit.type], index = unit.boxes.length, b = refrigerated[coldIndex++];
    b.level = Math.floor(index / def.slots); b.slot = index % def.slots; unit.boxes.push(b);
  }
  const windowUnit = next.units.find(u => u.type === 'window');
  if (windowUnit) windowUnit.z = -targetDepth / 2 + 0.08;
  const migratedCodes = new Set(); let codeSeq = 1;
  next.units.forEach(u => u.boxes.forEach(b => {
    let code = String(b.code || '').trim().toUpperCase();
    if (!code || migratedCodes.has(code)) { do { code = 'MAT-' + String(codeSeq++).padStart(3, '0'); } while (migratedCodes.has(code)); }
    b.code = code; migratedCodes.add(code);
  }));
  next.room = { w: ROOM.w, d: targetDepth, floor: previous.room?.floor || ROOM.floor, wall: previous.room?.wall || ROOM.wall };
  return next;
}
function load() {
  try {
    const current = JSON.parse(localStorage.getItem(KEY));
    if (current) return current;
    for (const oldKey of ['almox3d_v5', 'almox3d_v4', 'almox3d_v3', 'almox3d_v2', 'almox3d_v1']) {
      const old = JSON.parse(localStorage.getItem(oldKey));
      if (old && Array.isArray(old.units)) {
        const migrated = migrateState(old);
        localStorage.setItem(KEY, JSON.stringify(migrated));
        return migrated;
      }
    }
    return null;
  } catch (e) { return null; }
}
function save() { state.room = { w: ROOM.w, d: ROOM.d, floor: ROOM.floor, wall: ROOM.wall }; localStorage.setItem(KEY, JSON.stringify(state)); if (typeof buildRoom === 'function' && roomGroup) buildRoom(); }
const U = id => state.units.find(u => u.id === id);
const newBoxId = () => 'b' + Math.random().toString(36).slice(2, 9);
const isStorage = u => DEFS[u.type].kind === 'shelf' || DEFS[u.type].kind === 'closed';
const uLabel = u => DEFS[u.type].label + ' #' + u.id;
const shelfCode = u => 'E' + String(u.id).padStart(2, '0');
const cellCode = (u, b) => shelfCode(u) + '-P' + String(b.level + 1).padStart(2, '0') + '-C' + String(b.slot + 1).padStart(2, '0');
const normalizeText = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
function footprint(u) { const d = DEFS[u.type], w = Number(u.w) || d.w, depth = Number(u.d) || d.d; return u.r % 2 ? { w: depth, d: w } : { w, d: depth }; }
function overlapsUnit(unit, x, z, rotation = unit.r) {
  const w = Number(unit.w) || DEFS[unit.type].w, d = Number(unit.d) || DEFS[unit.type].d;
  const fp = rotation % 2 ? { w: d, d: w } : { w, d };
  return state.units.some(other => {
    if (other.id === unit.id) return false;
    const of = footprint(other);
    return Math.abs(other.x - x) < (of.w + fp.w) / 2 - 0.01 && Math.abs(other.z - z) < (of.d + fp.d) / 2 - 0.01;
  });
}
/* ---------- Cena ---------- */
const view = document.getElementById('view');
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
view.appendChild(renderer.domElement);
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x20252d);
const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
camera.position.set(12, 18, 24);
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0.5, 0);
controls.maxPolarAngle = Math.PI / 2.02;
controls.minDistance = 1.2; controls.maxDistance = 45;

scene.add(new THREE.HemisphereLight(0xffffff, 0x445566, 0.75));
const sun = new THREE.DirectionalLight(0xffffff, 0.7);
sun.position.set(6, 12, 8); sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left: -10, right: 10, top: 15, bottom: -15, near: 1, far: 40 });
scene.add(sun);

let roomGroup = null, gridHelper = null;
function buildRoom() {
  if (roomGroup) { scene.remove(roomGroup); roomGroup.traverse(o => { if (o.isMesh) { o.geometry.dispose(); if (o.material.map) o.material.map.dispose(); o.material.dispose(); } }); }
  roomGroup = new THREE.Group(); scene.add(roomGroup);
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d'); g.fillStyle = ROOM.floor; g.fillRect(0, 0, 128, 128);
  g.strokeStyle = 'rgba(0,0,0,0.12)'; g.lineWidth = 2; g.strokeRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(ROOM.w, ROOM.d);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(ROOM.w, ROOM.d), new THREE.MeshLambertMaterial({ map: t }));
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; roomGroup.add(floor);
  const wm = new THREE.MeshLambertMaterial({ color: ROOM.wall });
  const openings = { back: [], left: [] };
  state.units.forEach(u => {
    const d = DEFS[u.type]; if (d.kind !== 'door' && d.kind !== 'window') return;
    const f = footprint(u), y0 = d.kind === 'window' ? 0.9 : 0, y1 = d.h;
    if (u.r % 2 === 0 && Math.abs(u.z + ROOM.d / 2) < 0.3) openings.back.push([u.x - f.w / 2, u.x + f.w / 2, y0, y1]);
    else if (u.r % 2 === 1 && Math.abs(u.x + ROOM.w / 2) < 0.3) openings.left.push([u.z - f.d / 2, u.z + f.d / 2, y0, y1]);
  });
  const wallPieces = (len, ops, place) => {
    const half = len / 2, H = ROOM.wallH;
    const seg = (a, b, y0, y1) => { if (b - a > 0.01 && y1 - y0 > 0.01) place(a, b, y0, y1); };
    const sorted = ops.map(o => [Math.max(-half, o[0]), Math.min(half, o[1]), o[2], o[3]]).sort((p, q) => p[0] - q[0]);
    let cur = -half;
    sorted.forEach(o => { seg(cur, o[0], 0, H); seg(o[0], o[1], 0, o[2]); seg(o[0], o[1], o[3], H); cur = Math.max(cur, o[1]); });
    seg(cur, half, 0, H);
  };
  wallPieces(ROOM.w, openings.back, (a, b, y0, y1) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(b - a, y1 - y0, 0.1), wm);
    m.position.set((a + b) / 2, (y0 + y1) / 2, -ROOM.d / 2 - 0.05); m.receiveShadow = true; roomGroup.add(m);
  });
  wallPieces(ROOM.d, openings.left, (a, b, y0, y1) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(0.1, y1 - y0, b - a), wm);
    m.position.set(-ROOM.w / 2 - 0.05, (y0 + y1) / 2, (a + b) / 2); m.receiveShadow = true; roomGroup.add(m);
  });
  if (gridHelper) scene.remove(gridHelper);
  const n = Math.max(ROOM.w, ROOM.d);
  gridHelper = new THREE.GridHelper(n, n, 0x000000, 0x000000);
  gridHelper.material.opacity = 0.08; gridHelper.material.transparent = true; gridHelper.position.y = 0.002;
  gridHelper.visible = $('showGrid') ? $('showGrid').checked : true; scene.add(gridHelper);
}
buildRoom();

/* ---------- Constru��o dos m�veis ---------- */
const mats = {};
function lam(color) { return mats[color] || (mats[color] = new THREE.MeshLambertMaterial({ color })); }
function mk(parent, w, h, d, color, x, y, z) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), color && color.isMaterial ? color : lam(color));
  m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; parent.add(m); return m;
}
function geom(def) {
  const H = def.levels * def.lh + 0.04;
  const inner = def.kind === 'closed' ? def.w - 0.08 : def.w - 0.08;
  const slotW = inner / def.slots;
  return { H, slotW, bw: slotW - 0.04, bh: Math.max(0.15, def.lh - (def.big ? 0.15 : 0.12)), bd: def.d - (def.kind === 'closed' ? 0.12 : 0.1) };
}
function slotX(def, slot) { const g = geom(def); return -(def.w - 0.08) / 2 + g.slotW * (slot + 0.5); }

function labelTexture(box, u) {
  const c = document.createElement('canvas'); c.width = 256; c.height = 190;
  const g = c.getContext('2d');
  g.fillStyle = box.color; g.fillRect(0, 0, 256, 190);
  g.fillStyle = 'rgba(0,0,0,0.18)'; g.fillRect(0, 0, 256, 10);
  g.fillStyle = '#fff'; g.fillRect(14, 16, 228, 164);
  g.strokeStyle = '#555'; g.lineWidth = 3; g.strokeRect(14, 16, 228, 164);
  g.fillStyle = '#111'; g.textAlign = 'center'; g.textBaseline = 'middle';
  let size = 36, lines;
  for (; size >= 18; size -= 2) {
    g.font = 'bold ' + size + 'px Arial'; lines = wrap(g, box.name, 210);
    if (lines.length * size * 1.1 <= 78) break;
  }
  const startY = 62 - ((lines.length - 1) * size * 1.1) / 2;
  lines.forEach((l, i) => g.fillText(l, 128, startY + i * size * 1.1));
  g.font = 'bold 28px Arial'; g.fillStyle = '#b00020'; g.fillText('Qtd: ' + box.qty, 128, 120);
  g.font = 'bold 15px Arial'; g.fillStyle = '#334155'; g.fillText(box.code || 'SEM CODIGO', 128, 142);
  g.font = 'bold 12px Arial'; g.fillStyle = '#475569'; g.fillText(cellCode(u, box), 128, 164);
  const t = new THREE.CanvasTexture(c); t.anisotropy = 4; return t;
}
function wrap(g, text, maxW) {
  const words = String(text).split(/\s+/), lines = []; let cur = '';
  words.forEach(w => { const t = cur ? cur + ' ' + w : w; if (g.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; });
  if (cur) lines.push(cur); return lines;
}
function shelfTagTexture(u) {
  const c = document.createElement('canvas'); c.width = 320; c.height = 140;
  const g = c.getContext('2d');
  g.fillStyle = '#f8fafc'; g.fillRect(0, 0, c.width, c.height);
  g.fillStyle = u.color || '#2563eb'; g.fillRect(0, 0, 105, c.height);
  g.fillStyle = '#fff'; g.font = 'bold 42px Arial'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(shelfCode(u), 52, 70);
  g.fillStyle = '#172033'; g.textAlign = 'left'; g.font = 'bold 22px Arial';
  const category = (u.boxes[0] && u.boxes[0].category) || 'SEM CATEGORIA';
  wrap(g, category.toUpperCase(), 185).slice(0, 2).forEach((line, i) => g.fillText(line, 122, 55 + i * 27));
  g.fillStyle = '#475569'; g.font = '16px Arial'; g.fillText('NIVEIS P01-P04', 122, 116);
  return new THREE.CanvasTexture(c);
}

function addBoxes(group, u, def) {
  const g = geom(def);
  const match = ui.search && ui.search.length > 0;
  u.boxes.forEach(b => {
    const base = new THREE.Color(b.color).multiplyScalar(0.8);
    const side = new THREE.MeshLambertMaterial({ color: base });
    const front = new THREE.MeshLambertMaterial({ map: labelTexture(b, u) });
    const hit = match && normalizeText([b.name, b.code, b.category, cellCode(u, b)].join(' ')).includes(normalizeText(ui.search));
    const selected = ui.boxId === b.id;
    [side, front].forEach(m => { if (selected) m.emissive.set(0x2255aa); else if (hit) m.emissive.set(0x888800); });
    const top = new THREE.MeshLambertMaterial({ color: new THREE.Color(b.color) });
    if (selected) top.emissive.set(0x2255aa); else if (hit) top.emissive.set(0x888800);
    const m = new THREE.Mesh(new THREE.BoxGeometry(g.bw, g.bh, g.bd), [side, side, top, side, front, side]);
    m.position.set(slotX(def, b.slot), 0.04 + b.level * def.lh + g.bh / 2, 0);
    if (def.kind === 'shelf') m.position.z = 0;
    m.castShadow = m.receiveShadow = true; m.userData.boxId = b.id; group.add(m);
  });
}

function buildUnit(u) {
  const def = Object.assign({}, DEFS[u.type], { w: Number(u.w) || DEFS[u.type].w, d: Number(u.d) || DEFS[u.type].d }), grp = new THREE.Group();
  if (u.color) def.color = parseInt(u.color.slice(1), 16);
  grp.userData.uid = u.id;
  const k = def.kind, w = def.w, d = def.d;
  if (k === 'shelf') {
    const g = geom(def);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) mk(grp, 0.05, g.H, 0.05, def.color, sx * (w / 2 - 0.025), g.H / 2, sz * (d / 2 - 0.025));
    for (let i = 0; i <= def.levels; i++) mk(grp, w, 0.04, d, i === def.levels ? def.color : 0xb9c2cc, 0, i * def.lh + 0.02, 0);
    if (def.big) for (const sz of [-1, 1]) for (let i = 1; i < def.levels; i++) mk(grp, w, 0.08, 0.05, def.color, 0, i * def.lh - 0.04, sz * (d / 2 - 0.025));
    const tag = new THREE.Mesh(new THREE.PlaneGeometry(0.58, 0.26), new THREE.MeshLambertMaterial({ map: shelfTagTexture(u) }));
    tag.position.set(0, 0.34, d / 2 + 0.012); tag.castShadow = true; grp.add(tag);
    addBoxes(grp, u, def);
  } else if (k === 'closed') {
    const g = geom(def), H = g.H;
    mk(grp, w, H, 0.03, def.color, 0, H / 2, -d / 2 + 0.015);
    mk(grp, 0.04, H, d, def.color, -w / 2 + 0.02, H / 2, 0);
    mk(grp, 0.04, H, d, def.color, w / 2 - 0.02, H / 2, 0);
    mk(grp, w, 0.04, d, def.color, 0, H - 0.02, 0);
    for (let i = 0; i < def.levels; i++) mk(grp, w - 0.08, 0.03, d - 0.05, 0xdfe6ee, 0, i * def.lh + 0.015, -0.01);
    addBoxes(grp, u, def);
    const open = ui.uid === u.id;
    const pw = w / def.doors, dm = lam(def.color === 0x8a5a33 ? 0x9a6a3f : def.color);
    for (let i = 0; i < def.doors; i++) {
      const left = (i === 0), pivot = new THREE.Group();
      pivot.position.set(left ? -w / 2 : w / 2, 0, d / 2 - 0.02);
      const dir = left ? 1 : -1;
      mk(pivot, pw, H, 0.04, dm, dir * pw / 2, H / 2, 0);
      if (def.handle || true) mk(pivot, 0.03, H * (def.handle ? 0.35 : 0.08), 0.04, 0x555b66, dir * (pw - 0.07), def.handle ? H * 0.6 : H * 0.5, 0.045);
      pivot.rotation.y = open ? (left ? -1.9 : 1.9) : 0;
      grp.add(pivot);
    }
  } else if (k === 'desk') {
    mk(grp, w, 0.04, d, def.color, 0, def.h, 0);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) mk(grp, 0.05, def.h, 0.05, 0x444b57, sx * (w / 2 - 0.05), def.h / 2, sz * (d / 2 - 0.05));
    if (u.type === 'desk') mk(grp, 0.45, 0.4, d - 0.1, 0x9b7143, w / 2 - 0.3, def.h - 0.22, 0);
  } else if (k === 'bench') {
    mk(grp, w, 0.05, d, def.color, 0, def.h, 0);
    mk(grp, w - 0.1, 0.03, d - 0.1, 0x9aa3af, 0, 0.25, 0);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) mk(grp, 0.05, def.h, 0.05, 0x3d4450, sx * (w / 2 - 0.04), def.h / 2, sz * (d / 2 - 0.04));
  } else if (k === 'chair') {
    mk(grp, w, 0.05, d, def.color, 0, 0.46, 0);
    mk(grp, w, 0.45, 0.05, def.color, 0, 0.72, -d * 0.45);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) mk(grp, 0.04, 0.46, 0.04, 0x222, sx * (w / 2 - 0.04), 0.23, sz * (d / 2 - 0.04));
  } else if (k === 'door') {
    const fc = 0x4a4f58, h = def.h, t = 0.08;
    mk(grp, t, h, d, fc, -w / 2 + t / 2, h / 2, 0);
    mk(grp, t, h, d, fc, w / 2 - t / 2, h / 2, 0);
    mk(grp, w, t, d, fc, 0, h - t / 2, 0);
    if (def.roll) {
      mk(grp, w - 2 * t, h - t, 0.06, def.color, 0, (h - t) / 2, 0);
      for (let y = 0.15; y < h - t; y += 0.15) mk(grp, w - 2 * t, 0.012, 0.075, 0x777f8b, 0, y, 0);
    } else {
      const n = def.double ? 2 : 1, lw = (w - 2 * t) / n;
      for (let i = 0; i < n; i++) {
        const left = i === 0, pivot = new THREE.Group(), dir = left ? 1 : -1;
        pivot.position.set(left ? -w / 2 + t : w / 2 - t, 0, 0);
        mk(pivot, lw, h - t, 0.05, def.color, dir * lw / 2, (h - t) / 2, 0);
        mk(pivot, 0.04, 0.04, 0.12, 0xd0d4da, dir * (lw - 0.1), 1.0, 0.04);
        pivot.rotation.y = left ? -0.9 : 0.9;
        grp.add(pivot);
      }
    }
  } else if (k === 'window') {
    const fc = 0xf0f0f0, t = 0.05;
    mk(grp, w, t, d, fc, 0, 0.9 + t / 2, 0); mk(grp, w, t, d, fc, 0, 2.1 - t / 2, 0);
    mk(grp, t, 1.2, d, fc, -w / 2 + t / 2, 1.5, 0); mk(grp, t, 1.2, d, fc, w / 2 - t / 2, 1.5, 0);
    mk(grp, t, 1.2, d * 0.5, fc, 0, 1.5, 0);
    const gl = new THREE.MeshLambertMaterial({ color: def.color, transparent: true, opacity: 0.45 });
    mk(grp, w - 2 * t, 1.1, 0.02, gl, 0, 1.5, 0);
  } else if (k === 'cart') {
    mk(grp, w, 0.05, d, def.color, 0, 0.18, 0);
    mk(grp, 0.05, 0.8, d, 0x555b66, -w / 2 + 0.03, 0.6, 0);
    mk(grp, 0.05, 0.05, d, 0x555b66, -w / 2 + 0.03, 1.0, 0);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) mk(grp, 0.1, 0.1, 0.06, 0x222, sx * (w / 2 - 0.1), 0.05, sz * (d / 2 - 0.06));
  } else if (k === 'ext') {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.45, 16), lam(def.color)); m.position.y = 0.25; m.castShadow = true; grp.add(m);
    mk(grp, 0.05, 0.08, 0.05, 0x222, 0, 0.52, 0); mk(grp, 0.12, 0.03, 0.12, 0x222, 0, 0.02, 0);
  } else if (k === 'plant') {
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.15, 0.3, 16), lam(0xa0643c)); pot.position.y = 0.15; pot.castShadow = true; grp.add(pot);
    for (let i = 0; i < 4; i++) { const l = new THREE.Mesh(new THREE.SphereGeometry(0.2 - i * 0.02, 12, 10), lam(def.color)); l.position.set(Math.sin(i * 2) * 0.1, 0.5 + i * 0.17, Math.cos(i * 2) * 0.1); l.castShadow = true; grp.add(l); }
  } else if (k === 'pallet') {
    for (let i = -1; i <= 1; i++) mk(grp, w, 0.03, Math.min(0.18, d / 3), def.color, 0, 0.145, i * (d / 2 - 0.09));
    for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) mk(grp, 0.14, 0.1, 0.14, 0xa8854f, j * (w / 2 - 0.08), 0.065, i * (d / 2 - 0.09));
  }
  if (k === 'ext' || k === 'plant') { grp.scale.x = w / DEFS[u.type].w; grp.scale.z = d / DEFS[u.type].d; }
  grp.position.set(u.x, 0, u.z); grp.rotation.y = u.r * Math.PI / 2;
  return grp;
}
function disposeGroup(grp) {
  grp.traverse(o => { if (o.isMesh) { o.geometry.dispose(); const ms = Array.isArray(o.material) ? o.material : [o.material]; ms.forEach(m => { if (m.map) m.map.dispose(); if (!Object.values(mats).includes(m)) m.dispose(); }); } });
}
let outline = null;
function rebuild(u) {
  const old = groups.get(u.id);
  if (old) { scene.remove(old); disposeGroup(old); }
  const g = buildUnit(u); scene.add(g); groups.set(u.id, g);
  if (ui.uid === u.id) updateOutline();
}
function rebuildAll() {
  groups.forEach(g => { scene.remove(g); disposeGroup(g); }); groups.clear();
  state.units.forEach(u => { const g = buildUnit(u); scene.add(g); groups.set(u.id, g); });
  updateOutline();
}
function updateOutline() {
  if (outline) { scene.remove(outline); outline = null; }
  const g = groups.get(ui.uid);
  if (g) {
    const u = U(ui.uid), def = DEFS[u.type], f = footprint(u);
    const hh = (def.levels ? geom(def).H : (def.h || 0.9) + 0.05);
    const box = new THREE.Box3(new THREE.Vector3(u.x - f.w / 2, 0, u.z - f.d / 2), new THREE.Vector3(u.x + f.w / 2, hh, u.z + f.d / 2));
    outline = new THREE.Box3Helper(box, 0xffd84a); scene.add(outline);
  }
}

/* ---------- Sele��o / intera��o 3D ---------- */
const ray = new THREE.Raycaster(), mouse = new THREE.Vector2();
const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
let drag = null;

function setMouse(e) { const r = renderer.domElement.getBoundingClientRect(); mouse.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); ray.setFromCamera(mouse, camera); }
function pick() {
  const hits = ray.intersectObjects([...groups.values()], true);
  if (!hits.length) return null;
  let o = hits[0].object, boxId = null;
  while (o && o.userData.uid === undefined) { if (o.userData.boxId) boxId = o.userData.boxId; o = o.parent; }
  return o ? { uid: o.userData.uid, boxId } : null;
}
function floorPoint() { const p = new THREE.Vector3(); return ray.ray.intersectPlane(floorPlane, p) ? p : null; }

renderer.domElement.addEventListener('pointerdown', e => {
  if (e.button !== 0) return;
  setMouse(e);
  const p = pick();
  drag = { sx: e.clientX, sy: e.clientY, moved: false, hit: p, unit: null };
  if (p) {
    const u = U(p.uid), fp = floorPoint();
    if (!document.getElementById('lockMove').checked && fp) { drag.unit = u; drag.off = { x: u.x - fp.x, z: u.z - fp.z }; controls.enabled = false; }
  }
});
window.addEventListener('pointermove', e => {
  if (!drag || !drag.unit) return;
  if (!drag.moved && Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) < 5) return;
  drag.moved = true;
  setMouse(e); const fp = floorPoint(); if (!fp) return;
  const u = drag.unit, dk = DEFS[u.type].kind;
  if (dk === 'door' || dk === 'window') {
    const toBack = (fp.z + ROOM.d / 2) < (fp.x + ROOM.w / 2);
    u.r = toBack ? 0 : 1; const f2 = footprint(u);
    if (toBack) { u.z = -ROOM.d / 2 + f2.d / 2; u.x = clamp(Math.round(fp.x * 10) / 10, -ROOM.w / 2 + f2.w / 2, ROOM.w / 2 - f2.w / 2); }
    else { u.x = -ROOM.w / 2 + f2.w / 2; u.z = clamp(Math.round(fp.z * 10) / 10, -ROOM.d / 2 + f2.d / 2, ROOM.d / 2 - f2.d / 2); }
    const g2 = groups.get(u.id); g2.position.set(u.x, 0, u.z); g2.rotation.y = u.r * Math.PI / 2;
    if (ui.uid === u.id) updateOutline();
    return;
  }
  const f = footprint(u);
  let x = fp.x + drag.off.x, z = fp.z + drag.off.z;
  if (document.getElementById('snap').checked) { x = Math.round(x * 10) / 10; z = Math.round(z * 10) / 10; }
  const nextX = clamp(x, -ROOM.w / 2 + f.w / 2, ROOM.w / 2 - f.w / 2);
  const nextZ = clamp(z, -ROOM.d / 2 + f.d / 2, ROOM.d / 2 - f.d / 2);
  if (overlapsUnit(u, nextX, nextZ)) return;
  u.x = nextX; u.z = nextZ;
  const g = groups.get(u.id); g.position.set(u.x, 0, u.z);
  if (ui.uid === u.id) updateOutline();
});
window.addEventListener('pointerup', () => {
  if (!drag) return;
  const d = drag; drag = null; controls.enabled = true;
  if (d.moved) { save(); return; }
  if (Math.hypot(0, 0) === 0 && !d.hit) { if (!d.orbited) select(null); return; }
  if (d.hit) select(d.hit.uid, d.hit.boxId);
});
renderer.domElement.addEventListener('pointermove', e => { if (drag && !drag.unit && Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) > 5) drag.orbited = true; });
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

function select(uid, boxId) {
  const prev = ui.uid;
  ui.uid = uid || null; ui.boxId = boxId || null;
  if (ui.uid && ui.uid !== prev) ui.target = { level: 0, slot: 0 };
  const u = U(ui.uid);
  if (u && ui.boxId) { const b = u.boxes.find(x => x.id === ui.boxId); if (b) { ui.target = { level: b.level, slot: b.slot }; fillForm(b); } }
  else if (u && isStorage(u)) autoTarget(u, true);
  if (prev && prev !== ui.uid && U(prev)) rebuild(U(prev));
  if (u) rebuild(u);
  updateOutline(); renderPanel();
}

/* ---------- Painel ---------- */
function toast(msg) { const t = $('toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 2200); }
const cellBox = (u, l, s) => u.boxes.find(b => b.level === l && b.slot === s);
function autoTarget(u, keepIfFree) {
  const def = DEFS[u.type];
  if (keepIfFree && !cellBox(u, ui.target.level, ui.target.slot) && ui.target.level < def.levels && ui.target.slot < def.slots) return;
  for (let l = 0; l < def.levels; l++) for (let s = 0; s < def.slots; s++) if (!cellBox(u, l, s)) { ui.target = { level: l, slot: s }; return; }
}
function fillForm(b) {
  $('pName').value = b.name || ''; $('pDescription').value = b.description || b.name || '';
  $('pQty').value = b.qty || 0; $('pMinQty').value = b.minQty ?? 5; $('pWeight').value = b.weightKg ?? 1;
  $('pColor').value = b.color || '#c8924a'; $('pCode').value = b.code || '';
  $('pCategory').value = b.category || ''; $('pStatus').value = b.status || 'Ativo';
}

function renderCatalog() {
  const c = $('catalog'); let cat = '';
  Object.entries(DEFS).forEach(([id, d]) => {
    if (d.cat !== cat) { cat = d.cat; const h = document.createElement('div'); h.className = 'cat'; h.textContent = cat; c.appendChild(h); }
    const b = document.createElement('button'); b.textContent = '+ ' + d.label; b.onclick = () => addUnit(id); c.appendChild(b);
  });
}
function renderSummary() {
  const boxes = state.units.flatMap(u => (u.boxes || []).map(b => ({ u, b })));
  const qty = boxes.reduce((sum, x) => sum + (Number(x.b.qty) || 0), 0);
  const alerts = boxes.filter(x => (x.b.status || 'Ativo') !== 'Ativo' || Number(x.b.qty) <= Number(x.b.minQty ?? 5)).length;
  $('inventorySummary').innerHTML = '<div><b>' + boxes.length + '</b><small>itens</small></div><div><b>' + qty.toLocaleString('pt-BR') + '</b><small>unidades</small></div><div><b>' + alerts + '</b><small>alertas</small></div>';
}
function renderPanel() {
  renderSummary();
  const u = U(ui.uid);
  $('empty').hidden = !!u; $('detail').hidden = !u;
  updateDatalist();
  if (!u) return;
  const def = DEFS[u.type];
  $('uName').textContent = uLabel(u) + (isStorage(u) ? ' | ' + shelfCode(u) : '');
  $('uColor').value = u.color || '#' + def.color.toString(16).padStart(6, '0');
  $('uWidth').value = (Number(u.w) || def.w).toFixed(2);
  $('uDepth').value = (Number(u.d) || def.d).toFixed(2);
  const sel = $('uVariant'); sel.innerHTML = '';
  Object.entries(DEFS).filter(([, d]) => d.cat === def.cat).forEach(([id, d]) => { const o = document.createElement('option'); o.value = id; o.textContent = d.label; o.selected = id === u.type; sel.appendChild(o); });
  const st = isStorage(u);
  $('storage').hidden = !st; $('noStorage').hidden = st;
  if (!st) return;
  $('cap').textContent = '(' + u.boxes.length + '/' + def.levels * def.slots + ' caixas)';
  const grid = $('grid'); grid.innerHTML = '';
  for (let l = def.levels - 1; l >= 0; l--) {
    const row = document.createElement('div'); row.className = 'glevel';
      row.innerHTML = '<div class="ln">P' + String(l + 1).padStart(2, '0') + '</div>';
    for (let s = 0; s < def.slots; s++) {
      const b = cellBox(u, l, s), c = document.createElement('div');
      c.className = 'cell' + (b ? ' full' : '') + (ui.target.level === l && ui.target.slot === s ? ' target' : '') + (b && b.id === ui.boxId ? ' sel' : '');
      c.title = cellCode(u, b || { level: l, slot: s });
      if (b) { c.style.background = b.color; c.innerHTML = '<b>' + esc(b.name) + '</b><small>' + cellCode(u, b) + '</small><small>' + b.qty + ' un.</small>'; }
      else c.innerHTML = '<small>' + cellCode(u, { level: l, slot: s }) + '</small><small>Livre</small>';
      c.onclick = () => { ui.target = { level: l, slot: s }; const nb = b ? b.id : null; if (nb !== ui.boxId) { ui.boxId = nb; if (b) fillForm(b); rebuild(u); } renderPanel(); };
      row.appendChild(c);
    }
    grid.appendChild(row);
  }
  fillSelect('pLevel', def.levels, ui.target.level, i => 'P' + String(i + 1).padStart(2, '0') + (i === 0 ? ' (inferior)' : i === def.levels - 1 ? ' (superior)' : ''));
  fillSelect('pSlot', def.slots, ui.target.slot, i => 'C' + String(i + 1).padStart(2, '0'));
  const b = u.boxes.find(x => x.id === ui.boxId);
  $('boxActions').hidden = !b;
  $('formTitle').textContent = b ? 'Novo / editar caixa' : 'Adicionar caixa';
  if (b) $("boxInfo").innerHTML = "<b>" + esc(b.name) + "</b><br>" + esc(b.description || b.name) + "<br>Codigo: " + esc(b.code || "SEM CODIGO") + " | Categoria: " + esc(b.category || "Sem categoria") + "<br>Quantidade: " + b.qty + " | Minimo: " + (b.minQty ?? 5) + " | Peso: " + (b.weightKg ?? 0) + " kg<br>Status: " + esc(b.status || "Ativo") + "<br>Endereco: <strong>" + cellCode(u, b) + "</strong>";
}
function fillSelect(id, n, val, lab) { const s = $(id); s.innerHTML = ''; for (let i = 0; i < n; i++) { const o = document.createElement('option'); o.value = i; o.textContent = lab(i); o.selected = i === val; s.appendChild(o); } }
function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
function updateDatalist() { const names = new Set(); state.units.forEach(u => u.boxes.forEach(b => names.add(b.name))); $('prodList').innerHTML = [...names].map(n => '<option value="' + esc(n) + '">').join(''); }

function syncPlannerUI() {
  const shelves = state.units.filter(u => DEFS[u.type].kind === 'shelf');
  $('planShelfCount').value = shelves.length || 15;
  $('planShelfW').value = (Number(shelves[0]?.w) || DEFS.shelf_m.w).toFixed(2);
  $('planShelfD').value = (Number(shelves[0]?.d) || DEFS.shelf_m.d).toFixed(2);
}
function makeLayoutSuggestions() {
  const count = Math.floor(Number($('planShelfCount').value));
  const width = Number($('planShelfW').value), depth = Number($('planShelfD').value);
  if (!Number.isInteger(count) || count < 1 || count > 100 || !Number.isFinite(width) || !Number.isFinite(depth) || width < 0.2 || depth < 0.2) return toast('Informe quantidade e medidas validas para as estantes.');
  const shelves = state.units.filter(u => DEFS[u.type].kind === 'shelf');
  const fixed = state.units.filter(u => DEFS[u.type].kind !== 'shelf');
  const boxes = shelves.flatMap(u => u.boxes || []), capacity = DEFS.shelf_m.levels * DEFS.shelf_m.slots;
  if (boxes.length > count * capacity) return toast('Essa quantidade nao comporta todas as caixas cadastradas nas estantes.');
  const candidates = [];
  for (let x = -ROOM.w / 2 + 0.1; x <= ROOM.w / 2 - 0.1; x += 0.5) for (let z = -ROOM.d / 2 + 0.1; z <= ROOM.d / 2 - 0.1; z += 0.5) candidates.push([x, z]);
  const modes = [
    { name: 'Fileiras longitudinais', sort: (a, b) => a[1] - b[1] || a[0] - b[0], rotation: () => 0 },
    { name: 'Fileiras transversais', sort: (a, b) => a[0] - b[0] || a[1] - b[1], rotation: () => 1 },
    { name: 'Distribuicao central', sort: (a, b) => Math.hypot(a[0], a[1]) - Math.hypot(b[0], b[1]), rotation: i => i % 2 }
  ];
  const plans = [];
  modes.forEach(mode => {
    const ordered = candidates.slice().sort(mode.sort), placed = [];
    for (let i = 0; i < count; i++) {
      const r = mode.rotation(i), fp = r ? { w: depth, d: width } : { w: width, d: depth };
      const pos = ordered.find(([x, z]) => {
        if (Math.abs(x) + fp.w / 2 > ROOM.w / 2 || Math.abs(z) + fp.d / 2 > ROOM.d / 2) return false;
        return ![...fixed, ...placed].some(u => { const f = footprint(u); return Math.abs(u.x - x) < (f.w + fp.w) / 2 + 0.08 && Math.abs(u.z - z) < (f.d + fp.d) / 2 + 0.08; });
      });
      if (!pos) break;
      placed.push({ x: pos[0], z: pos[1], r, w: width, d: depth });
    }
    if (placed.length !== count) return;
    const next = placed.map((p, i) => ({ id: shelves[i]?.id || null, type: 'shelf_m', ...p, color: shelves[i]?.color, boxes: [] }));
    boxes.forEach((box, i) => next[Math.floor(i / capacity)].boxes.push({ ...box, level: Math.floor((i % capacity) / DEFS.shelf_m.slots), slot: i % DEFS.shelf_m.slots }));
    plans.push({ name: mode.name, shelves: next, fixed });
  });
  const root = $('layoutSuggestions'); root.innerHTML = '';
  if (!plans.length) return toast('Nao foi possivel acomodar essa quantidade e medida neste ambiente.');
  plans.forEach(plan => {
    const card = document.createElement('div'); card.className = 'layout-option';
    const title = document.createElement('b'); title.textContent = plan.name + ' · ' + count + ' estantes'; card.appendChild(title);
    const preview = document.createElement('div'); preview.className = 'layout-plan';
    [...fixed.map(u => ({ ...u, fixed: true })), ...plan.shelves].forEach(u => {
      const f = footprint(u), block = document.createElement('i'); block.className = 'layout-plan-item' + (u.fixed ? ' fixed' : '');
      block.style.left = ((u.x - f.w / 2 + ROOM.w / 2) / ROOM.w * 100) + '%';
      block.style.bottom = ((u.z - f.d / 2 + ROOM.d / 2) / ROOM.d * 100) + '%';
      block.style.width = Math.max(1, f.w / ROOM.w * 100) + '%'; block.style.height = Math.max(1, f.d / ROOM.d * 100) + '%'; preview.appendChild(block);
    });
    card.appendChild(preview);
    const button = document.createElement('button'); button.textContent = 'Aplicar organizacao';
    button.onclick = () => applyLayoutSuggestion(plan); card.appendChild(button); root.appendChild(card);
  });
  toast(plans.length + ' sugestoes prontas.');
}
function applyLayoutSuggestion(plan) {
  let id = state.nextId;
  const shelves = plan.shelves.map(u => ({ ...u, id: u.id || id++ }));
  state.nextId = id; state.units = plan.fixed.concat(shelves);
  ui.uid = ui.boxId = null; save(); rebuildAll(); renderPanel(); syncPlannerUI(); toast('Organizacao aplicada.');
}

/* ---------- A��es ---------- */
function commit(u) { save(); rebuild(u); renderPanel(); }
function addUnit(type) {
  const def = DEFS[type], u = { id: state.nextId++, type, x: 0, z: 0, r: 0, boxes: [] };
  const f = footprint(u), cands = [];
  if (def.kind === 'door' || def.kind === 'window') {
    const z = -ROOM.d / 2 + f.d / 2;
    for (let x = -ROOM.w / 2 + f.w / 2; x <= ROOM.w / 2 - f.w / 2; x += 0.5) cands.push([x, z]);
    cands.sort((a, b) => Math.abs(a[0]) - Math.abs(b[0]));
  } else for (let x = -ROOM.w / 2 + f.w / 2; x <= ROOM.w / 2 - f.w / 2; x += 0.5) for (let z = -ROOM.d / 2 + f.d / 2; z <= ROOM.d / 2 - f.d / 2; z += 0.5) cands.push([x, z]);
  cands.sort((a, b) => Math.hypot(a[0], a[1] - 1) - Math.hypot(b[0], b[1] - 1));
  const free = cands.find(([x, z]) => !state.units.some(o => { const g = footprint(o); return Math.abs(o.x - x) < (g.w + f.w) / 2 + 0.1 && Math.abs(o.z - z) < (g.d + f.d) / 2 + 0.1; }));
  if (!free) { toast('Nao ha espaco livre para adicionar este movel.'); return; }
  u.x = Math.round(free[0] * 10) / 10; u.z = Math.round(free[1] * 10) / 10;
  state.units.push(u); save(); rebuild(u); select(u.id); toast(def.label + ' adicionado(a). Arraste para posicionar.');
}
function deleteUnit() {
  const u = U(ui.uid); if (!u) return;
  if (u.boxes.length && !confirm('Excluir ' + uLabel(u) + ' e as ' + u.boxes.length + ' caixas dentro?')) return;
  const g = groups.get(u.id); scene.remove(g); disposeGroup(g); groups.delete(u.id);
  state.units = state.units.filter(x => x !== u); ui.uid = null; ui.boxId = null; save(); updateOutline(); renderPanel();
}
function rotate(dir) {
  const u = U(ui.uid); if (!u || ['door', 'window'].includes(DEFS[u.type].kind)) return;
  const w = Number(u.w) || DEFS[u.type].w, d = Number(u.d) || DEFS[u.type].d;
  const nextR = (u.r + dir + 4) % 4, f = nextR % 2 ? { w: d, d: w } : { w, d };
  const nextX = clamp(u.x, -ROOM.w / 2 + f.w / 2, ROOM.w / 2 - f.w / 2), nextZ = clamp(u.z, -ROOM.d / 2 + f.d / 2, ROOM.d / 2 - f.d / 2);
  if (overlapsUnit(u, nextX, nextZ, nextR)) return toast('Nao e possivel girar: espaco ocupado.');
  u.r = nextR; u.x = nextX; u.z = nextZ;
  commit(u);
}
function duplicate() {
  const u = U(ui.uid); if (!u) return;
  const n = { id: state.nextId++, type: u.type, x: u.x, z: u.z, r: u.r, w: u.w, d: u.d, boxes: [] };
  const f = footprint(n), cands = [];
  for (let x = -ROOM.w / 2 + f.w / 2; x <= ROOM.w / 2 - f.w / 2; x += 0.5) for (let z = -ROOM.d / 2 + f.d / 2; z <= ROOM.d / 2 - f.d / 2; z += 0.5) cands.push([x, z]);
  cands.sort((a, b) => Math.hypot(a[0] - u.x, a[1] - u.z) - Math.hypot(b[0] - u.x, b[1] - u.z));
  const free = cands.find(([x, z]) => !overlapsUnit(n, x, z));
  if (!free) { toast('Nao ha espaco livre para duplicar este movel.'); return; }
  n.x = free[0]; n.z = free[1];
  state.units.push(n); save(); rebuild(n); select(n.id); toast('Duplicado (vazio).');
}
function changeVariant(type) {
  const u = U(ui.uid), nd = DEFS[type]; if (!u || type === u.type) return;
  if (nd.levels && u.boxes.length > nd.levels * nd.slots) { toast('O novo modelo nao tem capacidade para todo o estoque.'); renderPanel(); return; }
  const original = { type: u.type, x: u.x, z: u.z, slots: u.boxes.map(b => [b, b.level, b.slot]) };
  if (isStorage(u) && !nd.levels && u.boxes.length) { toast('Esvazie antes de trocar para m�vel sem prateleiras.'); renderPanel(); return; }
  const moved = [], occupied = new Set();
  if (nd.levels) {
    const pending = [];
    u.boxes.forEach(b => { if (b.level < nd.levels && b.slot < nd.slots) { occupied.add(b.level + ',' + b.slot); moved.push(b); } else pending.push(b); });
    for (const b of pending) {
      let ok = false;
      for (let l = 0; l < nd.levels && !ok; l++) for (let s = 0; s < nd.slots && !ok; s++) if (!occupied.has(l + ',' + s)) { occupied.add(l + ',' + s); b.level = l; b.slot = s; moved.push(b); ok = true; }
      if (!ok) { toast('Nao cabem todas as caixas no novo modelo.'); renderPanel(); return; }
    }
  }
  u.type = type; const f = footprint(u);
  u.x = clamp(u.x, -ROOM.w / 2 + f.w / 2, ROOM.w / 2 - f.w / 2); u.z = clamp(u.z, -ROOM.d / 2 + f.d / 2, ROOM.d / 2 - f.d / 2);
  if (overlapsUnit(u, u.x, u.z)) {
    u.type = original.type; u.x = original.x; u.z = original.z;
    original.slots.forEach(([box, level, slot]) => { box.level = level; box.slot = slot; });
    toast('A alteracao bloquearia outro movel.'); renderPanel(); return;
  }
  autoTarget(u, true); commit(u);
}
function readForm() {
  const name = $('pName').value.trim();
  return {
    name, description: $('pDescription').value.trim() || name,
    qty: Math.max(1, parseInt($('pQty').value, 10) || 1),
    minQty: Math.max(0, parseInt($('pMinQty').value, 10) || 0),
    weightKg: Math.max(0, parseFloat($('pWeight').value) || 0),
    color: $('pColor').value, code: $('pCode').value.trim(),
    category: $('pCategory').value.trim() || 'Sem categoria', status: $('pStatus').value
  };
}
function nextMaterialCode() {
  const codes = new Set(state.units.flatMap(u => (u.boxes || []).map(b => String(b.code || '').toUpperCase())));
  let n = 1, code;
  do { code = 'MAT-' + String(n++).padStart(3, '0'); } while (codes.has(code));
  return code;
}
function codeInUse(code, exceptId) {
  const normalized = String(code || '').trim().toUpperCase();
  return state.units.some(u => u.boxes.some(b => b.id !== exceptId && String(b.code || '').trim().toUpperCase() === normalized));
}
function addBox() {
  const u = U(ui.uid); if (!u || !isStorage(u)) return;
  const f = readForm(); if (!f.name) { toast('Informe o nome do produto.'); return; }
  const { level, slot } = ui.target;
  if (!f.code) f.code = nextMaterialCode();
  if (codeInUse(f.code)) { toast('Este codigo ja esta cadastrado.'); return; }
  if (f.weightKg > 15 && level !== 0) { toast('Caixas acima de 15 kg devem ficar no nivel inferior P01.'); return; }
  if (cellBox(u, level, slot)) { toast('Posi��o ocupada. Escolha uma c�lula vazia.'); return; }
  const b = { id: newBoxId(), ...f, level, slot };
  u.boxes.push(b); ui.boxId = b.id; save(); rebuild(u); renderPanel(); toast('Caixa colocada.');
  $('pColor').value = PALETTE[Math.floor(Math.random() * PALETTE.length)];
}
const curBox = () => { const u = U(ui.uid); return u && u.boxes.find(b => b.id === ui.boxId); };
function changeQty(sign) {
  const b = curBox(); if (!b) return;
  const n = Math.max(1, parseInt($('qtyDelta').value) || 1);
  if (sign < 0 && n >= b.qty) { if (confirm('Retirar tudo remove a caixa "' + b.name + '". Continuar?')) removeBox(true); return; }
  b.qty += sign * n; commit(U(ui.uid)); fillForm(b);
}
function removeBox(skipConfirm) {
  const u = U(ui.uid), b = curBox(); if (!b) return;
  if (!skipConfirm && !confirm('Remover a caixa "' + b.name + '"?')) return;
  u.boxes = u.boxes.filter(x => x !== b); ui.boxId = null; autoTarget(u, false); commit(u);
}
function saveBox() {
  const b = curBox(); if (!b) return; const f = readForm(); if (!f.name) return toast('Informe o nome.');
  if (!f.code) f.code = b.code || nextMaterialCode();
  if (codeInUse(f.code, b.id)) return toast('Este codigo ja esta cadastrado.');
  if (f.weightKg > 15 && b.level !== 0) return toast('Mova a caixa para P01 antes de salvar este peso.');
  Object.assign(b, f); commit(U(ui.uid)); toast('Caixa atualizada.');
}
function moveBox() {
  const u = U(ui.uid), b = curBox(); if (!b) return;
  const { level, slot } = ui.target;
  if ((b.weightKg || 0) > 15 && level !== 0) return toast('Caixas acima de 15 kg devem ficar no nivel inferior P01.');
  if (b.level === level && b.slot === slot) return toast('Escolha outra c�lula vazia.');
  if (cellBox(u, level, slot)) return toast('C�lula ocupada.');
  b.level = level; b.slot = slot; commit(u);
}

/* ---------- C�mera ---------- */
let tween = null;
function focusUnit(u) {
  const def = DEFS[u.type], f = footprint(u), H = def.levels ? geom(def).H : (def.h || 0.9);
  const th = u.r * Math.PI / 2, nx = Math.sin(th), nz = Math.cos(th);
  const dist = Math.max(f.w, f.d, H) * 1.1 + 1.2;
  const target = new THREE.Vector3(u.x, H * 0.5, u.z);
  const pos = new THREE.Vector3(u.x + nx * dist, H * 0.6 + 0.6, u.z + nz * dist);
  tween = { t: 0, fp: camera.position.clone(), ft: controls.target.clone(), tp: pos, tt: target };
}

/* ---------- Busca ---------- */
$('search').addEventListener('input', e => {
  ui.search = e.target.value.trim(); const box = $('searchResults'); box.innerHTML = '';
  if (ui.search) {
    const q = normalizeText(ui.search);
    state.units.forEach(u => u.boxes.filter(b => normalizeText([b.name, b.description, b.code, b.category, b.status, cellCode(u, b)].join(' ')).includes(q)).forEach(b => {
      const d = document.createElement('div'); d.className = 'sr';
      d.innerHTML = '<b>' + esc(b.name) + '</b> (x' + b.qty + ')<br><small>' + esc(uLabel(u)) + ' | ' + cellCode(u, b) + '</small>';
      d.onclick = () => { select(u.id, b.id); focusUnit(u); };
      box.appendChild(d);
    }));
    if (!box.children.length) box.innerHTML = '<div class="hint">Nenhum produto encontrado.</div>';
  }
  rebuildAll();
});

/* ---------- Eventos de UI ---------- */
$('bRotL').onclick = () => rotate(-1); $('bRotR').onclick = () => rotate(1);
$('bDup').onclick = duplicate; $('bDel').onclick = deleteUnit;
$('uVariant').onchange = e => changeVariant(e.target.value);
$('bFocus').onclick = () => { const u = U(ui.uid); if (u) focusUnit(u); };
$('bAdd').onclick = addBox; $('bQtyP').onclick = () => changeQty(1); $('bQtyM').onclick = () => changeQty(-1);
$('bRemoveBox').onclick = () => removeBox(false); $('bMoveBox').onclick = moveBox; $('bSave').onclick = saveBox;
$('pLevel').onchange = e => { ui.target.level = +e.target.value; renderPanel(); };
$('pSlot').onchange = e => { ui.target.slot = +e.target.value; renderPanel(); };
$('btnExport').onclick = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })); a.download = 'almoxarifado.json'; a.click(); };
$('btnImport').onclick = () => $('fileIn').click();
$('fileIn').onchange = e => {
  const f = e.target.files[0]; if (!f) return; const r = new FileReader();
  r.onload = () => { try { const s = JSON.parse(r.result); if (!Array.isArray(s.units)) throw 0; state = s; applyRoom(s.room); ui.uid = ui.boxId = null; buildRoom(); syncRoomUI(); save(); rebuildAll(); renderPanel(); toast('Importado.'); } catch (x) { toast('Arquivo inv�lido.'); } };
  r.readAsText(f); e.target.value = '';
};
function syncRoomUI() { $('rW').value = ROOM.w; $('rD').value = ROOM.d; $('rFloor').value = ROOM.floor; $('rWall').value = ROOM.wall; }
function applyRoomUI() {
  const nextW = clamp(Number($('rW').value) || ROOM.w, 1, 100), nextD = clamp(Number($('rD').value) || ROOM.d, 1, 100);
  const minW = Math.max(1, Math.max(...state.units.map(u => Math.abs(u.x) + footprint(u).w / 2)) * 2);
  const minD = Math.max(1, Math.max(...state.units.map(u => Math.abs(u.z) + footprint(u).d / 2)) * 2);
  if (nextW < minW || nextD < minD) { toast('O ambiente precisa ter ao menos ' + minW + ' x ' + minD + ' m para acomodar os moveis.'); syncRoomUI(); return; }
  ROOM.w = nextW; ROOM.d = nextD;
  ROOM.floor = $('rFloor').value; ROOM.wall = $('rWall').value;
  buildRoom(); syncRoomUI(); save(); rebuildAll(); toast('Ambiente atualizado.');
}
function applyUnitDimensions() {
  const u = U(ui.uid); if (!u) return;
  const w = Number($('uWidth').value), d = Number($('uDepth').value);
  if (!Number.isFinite(w) || !Number.isFinite(d) || w < 0.2 || d < 0.2) return toast('As medidas devem ser de pelo menos 0,2 m.');
  const oldW = u.w, oldD = u.d;
  u.w = w; u.d = d;
  const f = footprint(u);
  const outside = Math.abs(u.x) + f.w / 2 > ROOM.w / 2 || Math.abs(u.z) + f.d / 2 > ROOM.d / 2;
  if (outside || overlapsUnit(u, u.x, u.z)) {
    if (oldW === undefined) delete u.w; else u.w = oldW;
    if (oldD === undefined) delete u.d; else u.d = oldD;
    $('uWidth').value = (Number(u.w) || DEFS[u.type].w).toFixed(2);
    $('uDepth').value = (Number(u.d) || DEFS[u.type].d).toFixed(2);
    return toast('Essas medidas nao cabem na posicao atual ou sobrepoem outro movel.');
  }
  commit(u); toast('Medidas atualizadas.');
}
$('rApply').onclick = applyRoomUI;
$('bDimensions').onclick = applyUnitDimensions;
$('planGenerate').onclick = makeLayoutSuggestions;
$('showGrid').onchange = e => { gridHelper.visible = e.target.checked; };
$('vTop').onclick = () => { tween = { t: 0, fp: camera.position.clone(), ft: controls.target.clone(), tp: new THREE.Vector3(0.01, Math.max(ROOM.w, ROOM.d) * 1.1, 0.01), tt: new THREE.Vector3(0, 0, 0) }; };
$('vIso').onclick = () => { tween = { t: 0, fp: camera.position.clone(), ft: controls.target.clone(), tp: new THREE.Vector3(ROOM.w * 0.55, ROOM.d * 0.68, ROOM.d * 0.9), tt: new THREE.Vector3(0, 0.5, 0) }; };
$('uColor').oninput = e => { const u = U(ui.uid); if (u) { u.color = e.target.value; save(); rebuild(u); } };
$('bColorReset').onclick = () => { const u = U(ui.uid); if (u) { delete u.color; commit(u); } };
syncRoomUI();
syncPlannerUI();
$('btnReset').onclick = () => { if (confirm('Voltar ao layout inicial? Isso apaga seu almoxarifado atual.')) { state = defaultState(); applyRoom(); ui.uid = ui.boxId = null; buildRoom(); syncRoomUI(); syncPlannerUI(); save(); rebuildAll(); renderPanel(); } };
window.addEventListener('keydown', e => {
  if (/INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName)) return;
  if (e.key === 'r' || e.key === 'R') rotate(e.shiftKey ? -1 : 1);
  else if (e.key === 'Delete') deleteUnit();
  else if (e.key === 'Escape') select(null);
});

/* ---------- Loop ---------- */
function resize() { const w = view.clientWidth, h = view.clientHeight; renderer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix(); }
new ResizeObserver(resize).observe(view); resize();
(function loop() {
  requestAnimationFrame(loop);
  if (tween) {
    tween.t = Math.min(1, tween.t + 0.04); const k = 1 - Math.pow(1 - tween.t, 3);
    camera.position.lerpVectors(tween.fp, tween.tp, k); controls.target.lerpVectors(tween.ft, tween.tt, k);
    if (tween.t >= 1) tween = null;
  }
  controls.update(); renderer.render(scene, camera);
})();

renderCatalog(); rebuildAll(); renderPanel();
})();
