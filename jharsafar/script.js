/* ==== AUTH SYSTEM ==== */
let selectedAuth = 'login';
let currentUser = null;

function setAuth(type) {
  selectedAuth = type;
  document.getElementById('loginTab').classList.toggle('active', type === 'login');
  document.getElementById('signupTab').classList.toggle('active', type === 'signup');
  document.getElementById('loginForm').style.display = type === 'login' ? '' : 'none';
  document.getElementById('signupForm').style.display = type === 'signup' ? '' : 'none';
}

function fillDemo() {
  document.getElementById('loginUser').value = 'tourist';
  document.getElementById('loginPass').value = 'tourist';
}

(function ensureDemoUser() {
  const raw = localStorage.getItem('jh_users');
  let arr = raw ? JSON.parse(raw) : [];
  if (!arr.find(u => u.username === 'tourist')) {
    arr.push({ username: 'tourist', password: 'tourist', name: 'Demo Tourist', role: 'tourist', email: 'demo@jharsafar.local' });
    localStorage.setItem('jh_users', JSON.stringify(arr));
  }
})();

function handleAuth(action) {
  if (action === 'login') {
    const user = document.getElementById('loginUser').value.trim();
    const pass = document.getElementById('loginPass').value;
    if (!user || !pass) return alert('Please fill in all login fields.');
    const arr = JSON.parse(localStorage.getItem('jh_users') || '[]');
    const found = arr.find(u => u.username === user && u.password === pass);
    if (!found) return alert('Invalid credentials. Try demo: tourist / tourist or signup.');
    currentUser = found;
    document.getElementById('welcomeText').textContent = `Hi, ${found.name} (${found.role})`;
    document.getElementById('authOverlay').style.display = 'none';
    document.getElementById('mainHeader').style.display = '';
    document.getElementById('mainApp').style.display = '';
    document.getElementById('mainFooter').style.display = '';
    showScreen('menuScreen');
    sessionStorage.setItem('jh_current_user', JSON.stringify(found));
  } else if (action === 'signup') {
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const username = document.getElementById('signupUser').value.trim();
    const pass = document.getElementById('signupPass').value;
    const confirm = document.getElementById('signupConfirm').value;
    if (!name || !email || !username || !pass || !confirm) return alert('Please fill in all signup fields.');
    if (pass !== confirm) return alert('Passwords do not match!');
    let arr = JSON.parse(localStorage.getItem('jh_users') || '[]');
    if (arr.find(u => u.username === username)) return alert('Username already exists.');
    const u = { username, password: pass, name, email, role: 'tourist' };
    arr.push(u);
    localStorage.setItem('jh_users', JSON.stringify(arr));
    alert('Signup successful. Please login with your new credentials.');
    setAuth('login');
  }
}

document.getElementById('logoutBtn').addEventListener('click', () => {
  sessionStorage.removeItem('jh_current_user');
  currentUser = null;
  document.getElementById('authOverlay').style.display = '';
  document.getElementById('mainHeader').style.display = 'none';
  document.getElementById('mainApp').style.display = 'none';
  document.getElementById('mainFooter').style.display = 'none';
  document.getElementById('loginUser').value = '';
  document.getElementById('loginPass').value = '';
});

(function tryRestore() {
  const s = sessionStorage.getItem('jh_current_user');
  if (s) {
    currentUser = JSON.parse(s);
    document.getElementById('authOverlay').style.display = 'none';
    document.getElementById('mainHeader').style.display = '';
    document.getElementById('mainApp').style.display = '';
    document.getElementById('mainFooter').style.display = '';
    document.getElementById('welcomeText').textContent = `Hi, ${currentUser.name} (${currentUser.role})`;
  }
})();

/* ==== MENU & SCREEN ROUTING ==== */
const screens = Array.from(document.querySelectorAll('.screen'));
const backBtn = document.getElementById('backBtn');

function showScreen(id) {
  screens.forEach(s => s.id === id ? s.classList.add('active') : s.classList.remove('active'));
  if (id !== 'menuScreen') { backBtn.style.display = 'inline-block'; window.scrollTo(0, 0); }
  else backBtn.style.display = 'none';
}

document.querySelectorAll('.tile').forEach(t => {
  t.addEventListener('click', () => showScreen(t.getAttribute('data-target')));
  t.addEventListener('keypress', (e) => { if (e.key === 'Enter') showScreen(t.getAttribute('data-target')); });
});

backBtn.addEventListener('click', () => showScreen('menuScreen'));

/* ==== DATA: PLACES, HOTELS, CRAFTS, GUIDES ==== */
const JH_PLACES = [
  { id: 'ranchi', name: 'Ranchi', lat: 23.3441, lon: 85.3096 },
  { id: 'netarhat', name: 'Netarhat', lat: 23.0800, lon: 84.4000 },
  { id: 'patratu', name: 'Patratu', lat: 24.2629, lon: 85.4160 },
  { id: 'hundru', name: 'Hundru Falls', lat: 23.6220, lon: 85.3450 },
  { id: 'deoghar', name: 'Deoghar', lat: 24.4861, lon: 86.6819 },
  { id: 'palamu', name: 'Palamu / Betla', lat: 24.0200, lon: 84.4350 }
];

const HOTELS = [
  { id: 1, name: 'Netarhat Sunrise Homestay', place: 'Netarhat', price: 1200, rating: 4.6, img: 'https://images.unsplash.com/photo-1501117716987-c8e6d4ef6b60?auto=format&fit=crop&w=1200&q=60', desc: 'Cozy homestay near viewpoints. Family-run, local breakfast.', features: ['Mountain view', 'Complimentary breakfast', 'Free parking', 'Wi-Fi'], contact: '+91-70000-10001' },
  { id: 2, name: 'Ranchi Comfort Lodge', place: 'Ranchi', price: 1800, rating: 4.4, img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=60', desc: 'Comfortable mid-range hotel in Ranchi with modern amenities.', features: ['AC rooms', 'Room service', 'In-house restaurant', 'Airport pickup'], contact: '+91-70000-10002' },
  { id: 3, name: 'Patratu Hill Cottage', place: 'Patratu', price: 1500, rating: 4.5, img: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=60', desc: 'Cottage with valley views, ideal for weekend getaways.', features: ['Scenic views', 'Bonfire', 'Local cuisine', 'Pet friendly'], contact: '+91-70000-10003' },
  { id: 4, name: 'Betla Forest Lodge', place: 'Palamu / Betla', price: 2200, rating: 4.7, img: 'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&w=1200&q=60', desc: 'Eco-lodge near Betla National Park for safari-goers.', features: ['Close to safari', 'Wildlife guide', 'Eco amenities', 'Meals included'], contact: '+91-70000-10004' },
  { id: 5, name: 'Deoghar Pilgrim Stay', place: 'Deoghar', price: 1400, rating: 4.3, img: 'https://images.unsplash.com/photo-1533777324565-a040eb52fac0?auto=format&fit=crop&w=1200&q=60', desc: 'Budget-friendly hotel for pilgrims, near the temple complex.', features: ['Near temple', 'Vegetarian food', 'Family rooms', 'Guide assistance'], contact: '+91-70000-10005' }
];

const CRAFTS = [
  { item: 'Tussar Silk Stole', details: 'Handwoven tussar silk — lightweight, breathable and slightly textured. A popular artisanal textile in Jharkhand.', shops: [{ name: 'Dumka Silk House', price: 1500, note: 'Traditional handloom, good finish' }, { name: 'Ranchi Handloom Emporium', price: 1650, note: 'Better finishing and packing' }, { name: 'Deoghar Silk Corner', price: 1400, note: 'Bargain / budget option' }] },
  { item: 'Tribal Painted Plate', details: 'Terracotta plate decorated with tribal motifs and pigments — mainly decorative but functional.', shops: [{ name: 'Ranchi Handicrafts', price: 900, note: 'Authentic tribal motifs' }, { name: 'Palamu Clay Works', price: 950, note: 'Detailed painting, slightly premium' }, { name: 'Jamshedpur Tribal Art', price: 850, note: 'Budget pick' }] },
  { item: 'Terracotta Pot', details: 'Locally fired terracotta with natural earthy finish — useful for decor and small planters.', shops: [{ name: 'Palamu Clay Works', price: 350, note: 'Handmade, rustic' }, { name: 'Netarhat Crafts', price: 400, note: 'Slightly polished finish' }, { name: 'Ranchi Bazaar Pots', price: 320, note: 'Mass-produced / cheapest' }] },
  { item: 'Bamboo Basket', details: 'Handwoven bamboo basket suitable for storage or decorative use; lightweight and eco-friendly.', shops: [{ name: 'Netarhat Crafts', price: 250, note: 'Locally made, sturdy' }, { name: 'Dumka Bamboo Works', price: 280, note: 'Fine weaving' }, { name: 'Ranchi Handloom', price: 300, note: 'Decorative variants' }] },
  { item: 'Dokra Metal Figurine', details: 'Traditional Dokra lost-wax metalcraft figurine; makes a distinctive decorative piece.', shops: [{ name: 'Dhalbhum Artisans', price: 1200, note: 'Authentic handcast' }, { name: 'Jamshedpur Bazaar', price: 1300, note: 'Curated collection' }, { name: 'Ranchi Handicraft Emporium', price: 1150, note: 'Affordable artisan pieces' }] }
];

const GUIDES = [
  { id: 'g1', name: 'Ramesh Kumar', city: 'Ranchi', phone: '+91-7000000001', verified: true, languages: 'Hindi, English', bio: 'Local guide with 10+ years experience, specialises in waterfalls and short hikes.' },
  { id: 'g2', name: 'Anita Devi', city: 'Netarhat', phone: '+91-7000000002', verified: true, languages: 'Hindi, Santhali', bio: 'Experienced nature guide, excellent knowledge of Netarhat viewpoints and tribal culture.' },
  { id: 'g3', name: 'Suresh Yadav', city: 'Deoghar', phone: '+91-7000000003', verified: true, languages: 'Hindi, English', bio: 'Pilgrimage guide, helps with temple logistics and local history.' }
];

/* ==== RENDER FUNCTIONS ==== */
function escapeHtml(s) { return (s || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

function renderHotelsShort() {
  const grid = document.getElementById('hotelGrid_short');
  grid.innerHTML = HOTELS.map(h => `
    <div class="hotel-card">
      <img src="${h.img}" alt="${h.name}" onerror="this.src='https://via.placeholder.com/400x250?text=Hotel'"/>
      <div>
        <h3 style="margin:0">${h.name}</h3>
        <div class="muted" style="font-size:13px">${h.place} • ⭐ ${h.rating} • ₹${h.price}/night</div>
        <p style="margin:6px 0 0">${h.desc}</p>
        <div class="hotel-feats">
          ${h.features.map(f => `<div class="feat">${f}</div>`).join('')}
        </div>
        <div style="margin-top:8px;display:flex;gap:8px">
          <button class="btn" onclick="alert('Mock booking for ${h.name}')">Book</button>
          <button class="btn alt" onclick="alert('Contact: ${h.contact}')">Contact</button>
        </div>
      </div>
    </div>
  `).join('');
}

function renderCraftsShort() {
  const container = document.getElementById('craftList_big');
  container.innerHTML = CRAFTS.map(c => {
    const shopsHtml = c.shops.map(s => `<div style="display:flex;justify-content:space-between;padding:6px 8px;border-radius:6px;background:rgba(255,255,255,0.02)"><div><strong>${escapeHtml(s.name)}</strong><div class="smallmuted" style="font-size:12px">${escapeHtml(s.note || '')}</div></div><div style="text-align:right">₹${s.price}</div></div>`).join('');
    return `
      <div class="craft-card">
        <div style="display:flex;justify-content:space-between;align-items:flex-start">
          <div>
            <strong>${escapeHtml(c.item)}</strong>
            <div class="smallmuted" style="margin-top:6px">${escapeHtml(c.details)}</div>
          </div>
          <div style="text-align:right">
            <button class="btn alt" onclick="alert('Search local shops for ${escapeHtml(c.item)}')">Find</button>
          </div>
        </div>
        <div class="craft-shops">${shopsHtml}</div>
      </div>
    `;
  }).join('');
}

function renderGuidesShort() {
  document.getElementById('guideList_short').innerHTML = GUIDES.map(g => {
    return `<div style="padding:10px;border-radius:8px;background:rgba(255,255,255,0.01);margin-bottom:8px;display:flex;justify-content:space-between;align-items:center">
      <div>
        <strong style="cursor:pointer" onclick="openGuideProfile('${g.id}')">${g.name}</strong>
        <div class="muted">${g.city} • ${g.languages} • ${g.phone}</div>
      </div>
      <div style="display:flex;gap:8px;align-items:center">
        <button class="btn" onclick="openGuideProfile('${g.id}')">Profile</button>
      </div>
    </div>`;
  }).join('');
  document.getElementById('fbGuideSelect_short').innerHTML = `<option value="">(No guide)</option>` + GUIDES.map(g => `<option value="${g.id}">${g.name} — ${g.city}</option>`).join('');
}

renderHotelsShort();
renderCraftsShort();
renderGuidesShort();

/* ==== FEEDBACK & FORUM ==== */
let forum = JSON.parse(localStorage.getItem('js_forum') || '[]');

function getGuideReviews() { return JSON.parse(localStorage.getItem('guide_reviews') || '[]'); }
function saveGuideReview(review) {
  const arr = getGuideReviews();
  arr.unshift(review);
  localStorage.setItem('guide_reviews', JSON.stringify(arr));
}

function populateForumShort() {
  const list = forum || [];
  document.getElementById('forumList_short').innerHTML = list.length ? list.map(f => `<div style="padding:8px;border-radius:8px;background:rgba(0,0,0,0.06);margin-bottom:8px"><strong>${escapeHtml(f.name)}</strong> <span class="muted" style="margin-left:8px">${new Date(f.t).toLocaleString()}</span><div style="margin-top:6px">${escapeHtml(f.text)}</div></div>`).join('') : '<div class="muted">No feedback yet.</div>';
}

populateForumShort();

document.getElementById('submitFeedback_short').addEventListener('click', () => {
  const name = document.getElementById('fbName_short').value.trim() || 'Anonymous';
  const text = document.getElementById('fbText_short').value.trim();
  const guideId = document.getElementById('fbGuideSelect_short').value || '';
  const rating = document.getElementById('fbRating').value ? Number(document.getElementById('fbRating').value) : null;
  if (!text) return alert('Enter feedback text');
  const rec = { id: 'fb_' + Date.now(), name, text, guideId, rating, t: Date.now() };
  forum.unshift(rec);
  localStorage.setItem('js_forum', JSON.stringify(forum));
  if (guideId) saveGuideReview({ guideId, name, text, rating, t: Date.now() });
  document.getElementById('fbText_short').value = '';
  document.getElementById('fbName_short').value = '';
  document.getElementById('fbRating').value = '';
  populateForumShort();
  alert('Thank you — feedback posted.');
});

document.getElementById('refreshForum_short').addEventListener('click', populateForumShort);

/* ==== MAP & ROUTING ==== */
let map, routeControl, vehicleTimer, lastRoute = null;

function initMapOnce() {
  if (map) return;
  map = L.map('map').setView([23.8, 85.3], 7);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OpenStreetMap' }).addTo(map);
}

document.getElementById('routeBtn_short').addEventListener('click', async () => {
  initMapOnce();
  const fromRaw = document.getElementById('fromInput_short').value.trim();
  const toRaw = document.getElementById('toInput_short').value.trim();
  if (!toRaw) return alert('Enter destination');
  const origin = fromRaw ? await geocodeShort(fromRaw) : map.getCenter();
  const dest = await geocodeShort(toRaw);
  if (!origin || !dest) return alert('Could not resolve addresses');
  if (routeControl) { map.removeControl(routeControl); routeControl = null; lastRoute = null; }
  routeControl = L.Routing.control({
    router: L.Routing.osrmv1({ serviceUrl: 'https://router.project-osrm.org/route/v1' }),
    waypoints: [L.latLng(origin.lat, origin.lon), L.latLng(dest.lat, dest.lon)],
    show: false, fitSelectedRoutes: true, lineOptions: { addWaypoints: false },
    createMarker: function (i, wp, nWps) { if (i === 0) return L.marker(wp.latLng).bindPopup('Origin').addTo(map); if (i === nWps - 1) return L.marker(wp.latLng).bindPopup('Destination').addTo(map); return null; }
  }).addTo(map);

  routeControl.on('routesfound', e => {
    const r = e.routes[0];
    lastRoute = r;
    const distKm = (r.summary.totalDistance / 1000).toFixed(2);
    const etaMin = Math.round(r.summary.totalTime / 60);
    document.getElementById('routeSummary_short').innerText = `Distance: ${distKm} km • ETA: ${etaMin} min`;
    spawnVehiclesNearDestination(dest.lat, dest.lon);
    document.getElementById('driverList_short').innerHTML = '';
  });
});

async function geocodeShort(q) {
  const coord = q.match(/(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)/);
  if (coord) return { lat: +coord[1], lon: +coord[2] };
  try {
    const res = await fetch('https://nominatim.openstreetmap.org/search?format=json&limit=1&q=' + encodeURIComponent(q));
    const j = await res.json();
    if (j && j[0]) return { lat: +j[0].lat, lon: +j[0].lon };
  } catch (e) { console.warn(e); }
  return null;
}

/* ==== VEHICLES SIMULATION ==== */
const DRIVERS = [
  { id: 'T1', type: 'taxi', name: 'Ramesh', base: 60, per_km: 14, pos: null },
  { id: 'T2', type: 'taxi', name: 'Anita', base: 50, per_km: 13, pos: null },
  { id: 'A1', type: 'auto', name: 'Suresh', base: 35, per_km: 8, pos: null }
];

let driverLayer;

function spawnVehiclesNearDestination(lat, lon) {
  if (!map) initMapOnce();
  DRIVERS.forEach(d => { d.pos = { lat: lat + (Math.random() - 0.5) * 0.05, lon: lon + (Math.random() - 0.5) * 0.05 }; });
  renderVehiclesShort();
  if (vehicleTimer) clearInterval(vehicleTimer);
  vehicleTimer = setInterval(() => { DRIVERS.forEach(d => { d.pos.lat += (Math.random() - 0.5) * 0.004; d.pos.lon += (Math.random() - 0.5) * 0.004; }); renderVehiclesShort(); }, 6000);
}

function renderVehiclesShort() {
  if (driverLayer) driverLayer.clearLayers();
  else driverLayer = L.layerGroup().addTo(map);
  DRIVERS.forEach(d => {
    if (!d.pos) return;
    const m = L.circleMarker([d.pos.lat, d.pos.lon], { radius: 8, color: d.type === 'taxi' ? '#60a5fa' : '#f59e0b' });
    m.bindPopup(`${d.name} • ${d.type.toUpperCase()} • base ₹${d.base} • ${d.per_km}/km`);
    m.addTo(driverLayer);
  });
  document.getElementById('vehList_short').innerHTML = DRIVERS.map(d => `<div style="padding:8px;border-radius:8px;background:rgba(255,255,255,0.01);margin-bottom:8px"><b>${d.name}</b> • ${d.type.toUpperCase()}</div>`).join('');
}

/* ==== FARE MATCHMAKING ==== */
function driverMinFare(driver, km) {
  if (!km || isNaN(km)) km = 1;
  return Math.max(Math.round(driver.base + driver.per_km * km), 30);
}

document.getElementById('proposeFareBtn_short').addEventListener('click', () => {
  const pf = Number(document.getElementById('proposedFare_short').value);
  if (!pf || isNaN(pf)) return alert('Enter a numeric proposed fare (₹).');
  if (!lastRoute) return alert('Please compute a route first so distance can be calculated.');
  const km = lastRoute.summary.totalDistance / 1000;
  const results = DRIVERS.map(d => ({ driver: d, minFare: driverMinFare(d, km), accept: pf >= driverMinFare(d, km) }));
  const container = document.getElementById('driverList_short');
  container.innerHTML = '';
  results.forEach(r => {
    const div = document.createElement('div');
    div.style = 'padding:8px;border-radius:8px;background:rgba(255,255,255,0.01);margin-bottom:8px;display:flex;justify-content:space-between;align-items:center';
    div.innerHTML = `<div><b>${r.driver.name}</b> • ${r.driver.type.toUpperCase()} • requires ₹${r.minFare}</div><div style="display:flex;gap:8px;align-items:center">${r.accept ? '<span style="color:#22c55e">ACCEPTED</span>' : '<span style="color:#ef4444">REJECTED</span>'}</div>`;
    if (r.accept) {
      const btn = document.createElement('button');
      btn.className = 'btn';
      btn.textContent = 'Book';
      btn.addEventListener('click', () => confirmCabBooking(r.driver, pf));
      div.querySelector('div').appendChild(btn);
    }
    container.appendChild(div);
  });
});

function confirmCabBooking(driver, fare) {
  let cabBookings = JSON.parse(localStorage.getItem('js_cab_bookings') || '[]');
  const rec = { id: 'cab_' + Date.now(), driver: driver.name, price: fare, eta: (Math.floor(Math.random() * 12) + 3) + ' mins', at: Date.now(), type: driver.type };
  cabBookings.push(rec);
  localStorage.setItem('js_cab_bookings', JSON.stringify(cabBookings));
  document.getElementById('driverList_short').innerHTML = `<div style="padding:10px;border-radius:8px;background:rgba(255,255,255,0.02)">Booking confirmed with <b>${driver.name}</b> — ₹${fare} — ETA ${rec.eta}</div>`;
  alert('Cab booked (mock) with ' + driver.name + ' for ₹' + fare);
}

/* ==== AR/VR MODALS ==== */
/* A-Frame modal */
document.getElementById('open360').addEventListener('click', () => {
  const modal = document.getElementById('aframeModal');
  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden', 'false');
});

document.getElementById('aframeClose').addEventListener('click', () => {
  document.getElementById('aframeModal').style.display = 'none';
  document.getElementById('aframeModal').setAttribute('aria-hidden', 'true');
});

document.getElementById('aframeFullscreen').addEventListener('click', () => {
  const el = document.querySelector('#aframeModal a-scene');
  if (!el) return;
  if (el.requestFullscreen) el.requestFullscreen();
  else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
});

/* Pannellum modal */
const PANORAMA_URL = 'https://upload.wikimedia.org/wikipedia/commons/7/73/Taj_Mahal_panoramic_view.jpg';
let panoViewer = null;

document.getElementById('openPano').addEventListener('click', () => {
  const modal = document.getElementById('panoModal');
  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden', 'false');
  if (!panoViewer) {
    panoViewer = pannellum.viewer('panoContainer', {
      "type": "equirectangular",
      "panorama": PANORAMA_URL,
      "autoLoad": true,
      "autoRotate": -2,
      "hfov": 110,
      "showZoomCtrl": true,
      "preview": PANORAMA_URL,
      "title": "Taj Mahal",
      "author": "Wikimedia Commons contributor"
    });
  } else {
    try { panoViewer.resize(); } catch (e) { }
  }
});

document.getElementById('panoClose').addEventListener('click', () => {
  document.getElementById('panoModal').style.display = 'none';
  document.getElementById('panoModal').setAttribute('aria-hidden', 'true');
});

document.getElementById('panoFullscreen').addEventListener('click', () => {
  const el = document.getElementById('panoContainer');
  if (el.requestFullscreen) el.requestFullscreen();
  else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
});

window.addEventListener('resize', () => { if (panoViewer) try { panoViewer.resize(); } catch (e) { } });

/* ==== GUIDE PROFILE MODAL ==== */
function openGuideProfile(guideId) {
  const g = GUIDES.find(x => x.id === guideId);
  if (!g) return alert('Guide not found');
  const reviews = getGuideReviews().filter(r => r.guideId === guideId);
  const avg = reviews.length ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1) : 'N/A';
  const container = document.getElementById('guideProfileContent');
  container.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center">
      <div>
        <h3>${g.name}</h3>
        <div class="smallmuted">${g.city} • ${g.languages} • ${g.phone}</div>
      </div>
      <div style="text-align:right">
        <div style="font-size:18px">${avg !== 'N/A' ? avg + ' ★' : 'No ratings yet'}</div>
        <div class="smallmuted">Verified: ${g.verified ? 'Yes' : 'No'}</div>
      </div>
    </div>
    <p style="margin-top:8px">${g.bio}</p>
    <div style="margin-top:12px">
      <strong>Reviews</strong>
      ${reviews.length ? reviews.map(r => `<div class="review"><strong>${escapeHtml(r.name)}</strong> ${r.rating ? `• ${r.rating} ★` : ''} <div class="smallmuted">${new Date(r.t).toLocaleString()}</div><div style="margin-top:6px">${escapeHtml(r.text)}</div></div>`).join('') : '<div class="smallmuted" style="margin-top:8px">No reviews yet for this guide.</div>'}
    </div>
    <div style="margin-top:12px">
      <strong>Leave a review for ${g.name}</strong>
      <div style="display:flex;gap:8px;margin-top:6px">
        <input id="reviewerName" placeholder="Your name" style="flex:1" />
        <select id="reviewRating" style="width:120px">
          <option value="">Rating</option><option value="5">5</option><option value="4">4</option><option value="3">3</option><option value="2">2</option><option value="1">1</option>
        </select>
      </div>
      <div style="margin-top:8px"><textarea id="reviewText" placeholder="Write your review..."></textarea></div>
      <div style="margin-top:8px"><button class="btn" onclick="submitGuideReview('${g.id}')">Submit review</button></div>
    </div>
  `;
  document.getElementById('guideModal').style.display = 'flex';
  document.getElementById('guideModal').setAttribute('aria-hidden', 'false');
}

document.getElementById('guideClose').addEventListener('click', () => {
  document.getElementById('guideModal').style.display = 'none';
  document.getElementById('guideModal').setAttribute('aria-hidden', 'true');
});

function submitGuideReview(guideId) {
  const name = document.getElementById('reviewerName').value.trim() || 'Anonymous';
  const text = document.getElementById('reviewText').value.trim();
  const rating = document.getElementById('reviewRating').value ? Number(document.getElementById('reviewRating').value) : null;
  if (!text) return alert('Please enter review text');
  saveGuideReview({ guideId, name, text, rating, t: Date.now() });
  alert('Review saved');
  renderGuidesShort();
  openGuideProfile(guideId);
}

/* ==== TRANSLATOR / VOICE ==== */
let recognition = null, listening = false;

document.getElementById('micBtn_short').addEventListener('click', () => {
  if (listening) { try { recognition.stop(); } catch (e) { } listening = false; document.getElementById('micBtn_short').textContent = '🎤 Listen'; return; }
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return alert('Speech recognition not supported');
  recognition = new SR();
  recognition.lang = document.getElementById('speechLang_short').value === 'en' ? 'en-IN' : 'hi-IN';
  recognition.interimResults = true;
  recognition.onresult = (e) => { let t = ''; for (const r of e.results) t += r[0].transcript; document.getElementById('assistantText_short').value = t; };
  recognition.onend = () => { listening = false; document.getElementById('micBtn_short').textContent = '🎤 Listen'; };
  recognition.onerror = (e) => { listening = false; document.getElementById('micBtn_short').textContent = '🎤 Listen'; alert('Speech error: ' + e.error); };
  recognition.start();
  listening = true;
  document.getElementById('micBtn_short').textContent = '■ Stop';
});

document.getElementById('speakBtn_short').addEventListener('click', () => {
  const text = document.getElementById('assistantText_short').value || 'Hello';
  const u = new SpeechSynthesisUtterance(text);
  u.lang = document.getElementById('speechLang_short').value === 'en' ? 'en-IN' : 'hi-IN';
  speechSynthesis.speak(u);
});

document.getElementById('translateBtn_short').addEventListener('click', async () => {
  const text = document.getElementById('assistantText_short').value.trim();
  if (!text) return alert('Enter text to translate');
  const src = document.getElementById('speechLang_short').value === 'en' ? 'en' : 'hi';
  const tgt = src === 'en' ? 'hi' : 'en';
  try {
    const res = await fetch('https://libretranslate.de/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: text, source: src, target: tgt, format: 'text' })
    });
    if (!res.ok) throw new Error('Translate failed');
    const j = await res.json();
    if (j && j.translatedText) {
      document.getElementById('assistantText_short').value = j.translatedText;
      const u = new SpeechSynthesisUtterance(j.translatedText);
      u.lang = tgt === 'hi' ? 'hi-IN' : 'en-IN';
      speechSynthesis.speak(u);
    }
  } catch (e) {
    window.open('https://translate.google.com/?sl=' + src + '&tl=' + tgt + '&text=' + encodeURIComponent(text) + '&op=translate', '_blank');
  }
});

/* ==== CHATBOT Q&A ==== */
const QA_PAIRS = [
  { qKeywords: ['best time', 'best season', 'when to visit', 'season'], a: 'Best time: October to March — pleasant weather for most Jharkhand destinations.' },
  { qKeywords: ['hundru', 'hundru falls'], a: 'Hundru Falls: Best to visit during monsoon & post-monsoon (July–Nov) for strong flow; Oct–Feb pleasant.' },
  { qKeywords: ['netarhat', 'netarhat sunrise'], a: 'Netarhat: Famous for sunrise & sunset viewpoints, forest walks and quiet mornings. Best: Oct–Mar.' },
  { qKeywords: ['patratu', 'patratu valley'], a: 'Patratu: Scenic valley and dam; enjoy hill drives and picnic spots. Best: Oct–Mar.' },
  { qKeywords: ['betla', 'palamu', 'palamu national park'], a: 'Betla (Palamu): Wildlife safaris available; check park office for safari timings. Best: Oct–Mar.' },
  { qKeywords: ['deoghar', 'baidyanath'], a: 'Deoghar: Important pilgrimage center with Baidyanath Temple. Comfortable season: Oct–Mar.' },
  { qKeywords: ['ranchi', 'ranchi attractions'], a: 'Ranchi: City with nearby waterfalls, markets and cultural spots — use it as a base for nearby nature visits.' },
  { qKeywords: ['entry fee', 'ticket', 'fees'], a: 'Entry Fees: Most natural viewpoints are free; parks and safaris often have small fees.' },
  { qKeywords: ['things to do', 'highlights', 'what to do'], a: 'Things to do: Visit Netarhat viewpoints, Hundru Falls, Betla safaris, Deoghar temples, and shop local crafts.' },
  { qKeywords: ['safety', 'is it safe', 'safety tips'], a: 'Safety tips: Generally safe. Avoid slippery areas during heavy rains, follow park guidelines.' },
  { qKeywords: ['how to reach', 'reach', 'directions'], a: 'How to reach: Major towns (Ranchi, Deoghar) have rail/road access; use local taxis for last-mile travel.' }
];

const PLACE_FAQ = {
  'netarhat': { title: 'Netarhat', best_season: 'October to March', opening: 'Open all day', entry_fee: 'No formal fee', highlights: 'Sunrise/sunset points, forest walks' },
  'patratu': { title: 'Patratu', best_season: 'October to March', opening: 'Open all day', entry_fee: 'Usually free', highlights: 'Valley views, dam, scenic drives' },
  'palamu': { title: 'Betla / Palamu', best_season: 'October to March', opening: 'Daytime (check safari office)', entry_fee: 'Small safari/park fee', highlights: 'Wildlife safaris, sal forests' },
  'hundru': { title: 'Hundru Falls', best_season: 'July–Nov (strong flow), Oct–Feb pleasant', opening: 'Open daily', entry_fee: 'Generally free', highlights: 'Scenic waterfall, photography' },
  'deoghar': { title: 'Deoghar', best_season: 'October to March', opening: 'Temple timings vary', entry_fee: 'Temple visit usually free', highlights: 'Baidyanath Temple, pilgrim services' },
  'ranchi': { title: 'Ranchi', best_season: 'Oct–Mar', opening: 'City attractions vary', entry_fee: 'Varies', highlights: 'Waterfalls nearby, markets' }
};

const chatWindow = document.getElementById('chatWindow');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');

function appendChat(role, text) {
  const msg = document.createElement('div');
  msg.className = 'msg ' + (role === 'user' ? 'user' : 'bot');
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.textContent = text;
  msg.appendChild(bubble);
  chatWindow.appendChild(msg);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function findAnswerFor(text) {
  const t = (text || '').toLowerCase();
  for (const pid in PLACE_FAQ) {
    const info = PLACE_FAQ[pid];
    if (t.includes(pid) || t.includes(info.title.toLowerCase())) {
      if (/best time|best season|when to visit/.test(t)) return `${info.title}: ${info.best_season}`;
      if (/open|opening|hours|timing/.test(t)) return `${info.title}: ${info.opening}`;
      if (/entry|ticket|fee|price|cost/.test(t)) return `${info.title}: ${info.entry_fee}`;
      if (/what to do|things to do|highlights|attractions/.test(t)) return `${info.title}: ${info.highlights}`;
      return `${info.title} — Best: ${info.best_season}. Highlights: ${info.highlights}. Entry: ${info.entry_fee}.`;
    }
  }
  for (const item of QA_PAIRS) {
    for (const kw of item.qKeywords) {
      if (t.includes(kw)) return item.a;
    }
  }
  return null;
}

chatSend.onclick = () => {
  const raw = chatInput.value.trim();
  if (!raw) return;
  appendChat('user', raw);
  chatInput.value = '';
  const typing = document.createElement('div');
  typing.className = 'msg bot';
  typing.innerHTML = `<div class="bubble">Typing...</div>`;
  chatWindow.appendChild(typing);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  setTimeout(() => {
    typing.remove();
    const ans = findAnswerFor(raw);
    if (ans) appendChat('bot', ans);
    else appendChat('bot', "I don't have an exact answer for that. Try 'Best time to visit Netarhat', 'Highlights of Hundru Falls', or 'Are there entry fees?'");
  }, 350);
};

chatInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); chatSend.click(); } });

appendChat('bot', "Hi! I'm a simple Jharkhand Q&A assistant. Try: 'Best time to visit Netarhat', 'What to do in Betla', or 'Are there entry fees for Hundru Falls?'");

/* ==== INIT ==== */
document.getElementById('year').textContent = new Date().getFullYear();
showScreen('menuScreen');

const lazyInit = { map: false, feedback: false };
const observer = new MutationObserver(() => {
  const active = document.querySelector('.screen.active');
  if (!active) return;
  if (active.id === 'transportScreen' && !lazyInit.map) { initMapOnce(); lazyInit.map = true; }
  if (active.id === 'feedbackScreen' && !lazyInit.feedback) { renderGuidesShort(); populateForumShort(); lazyInit.feedback = true; }
});
observer.observe(document.body, { attributes: true, childList: true, subtree: true });