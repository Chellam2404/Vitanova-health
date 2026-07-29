// VitaNova Health Monitoring App - Interactive Prototype Logic

// Screen Metadata & UX Designer Notes (Human-Designed Reflections)
const screenNotes = {
  'screen-splash': {
    title: 'VitaNova Splash Experience',
    body: 'Designed as a warm welcome. The heartbeat line is clean, and the terracotta-to-sage gradient introduces a calming, organic visual identity immediately.'
  },
  'screen-onboarding-1': {
    title: 'Onboarding - Calm Tracking',
    body: 'Introduces the core vitals monitor. I avoided the standard hospital layouts and instead designed simple, relaxing descriptions that focus on natural wellness.'
  },
  'screen-onboarding-2': {
    title: 'Onboarding - Care Circle',
    body: 'Highlights telemedicine consultations. Shows that scheduling secure virtual appointments with specialists is a simple, stress-free process.'
  },
  'screen-onboarding-3': {
    title: 'Onboarding - Crisis Dispatch',
    body: 'Explains the Emergency SOS feature. The muted clay-red illustration indicates urgency without causing visual panic.'
  },
  'screen-login': {
    title: 'Biometric Access Gateway',
    body: 'During high blood pressure alerts, typing password fields can cause critical delays. FaceID biometric entry allows patients to access the platform in under a second.'
  },
  'screen-signup': {
    title: 'Profile Registration',
    body: 'A quick entry form. We defer detailed medical history to the setup flow to prevent onboarding friction and keep cognitive load low.'
  },
  'screen-home': {
    title: 'Asymmetric Home Dashboard',
    body: 'I designed an asymmetrical grid layout. Blood pressure (the primary hypertension metric) sits at the top as a full-width card with a built-in sparkline, while heart rate and oxygen sit split below it to establish a clear visual hierarchy.'
  },
  'screen-health-details': {
    title: 'Vitals Charting Matrix',
    body: 'Displays detailed vital trends. Time buttons (W, M, Y) trigger clean SVG graph drawings, displaying target thresholds to help patients evaluate readings clearly.'
  },
  'screen-reports': {
    title: 'Clinical Reports Locker',
    body: 'A quiet, secure area to manage PDFs. Uses clean file indicators and simple download/share actions. Supports instant report syncing from lab systems.'
  },
  'screen-doctors': {
    title: 'Practitioners Directory',
    body: 'Displays online specialist listings. Shows certifications, pricing, and ratings clearly, allowing patients to schedule virtual slots with confidence.'
  },
  'screen-booking': {
    title: 'Appointment Scheduler',
    body: 'A simple calendar grid that avoids scheduling confusion. Integrates responsive slot modules to make booking a consult quick and clear.'
  },
  'screen-video-call': {
    title: 'Clinical Video Consult',
    body: 'Mocks standard FaceTime screen layouts. Doctor video takes up the full screen while the patient floats in the top right. Features microphone/camera controls and a prominent end button.'
  },
  'screen-medicine-reminder': {
    title: 'Medication Agenda',
    body: 'Tracks daily doses. Checking a pill logs the time and updates the dashboard compliance progress tracker, encouraging consistent medication habits.'
  },
  'screen-sos': {
    title: 'Emergency SOS Countdown',
    body: 'A vital safety interface. Tapping SOS starts a 3-second breathing countdown to prevent accidental alerts. Displays live coordinate sharing and nearby hospital availability.'
  },
  'screen-notifications': {
    title: 'System Alerts Inbox',
    body: 'A clean notifications center. Alerts are color-coded: red for immediate vitals alerts, blue for booked consults, and green for system confirmations.'
  },
  'screen-profile': {
    title: 'Patient Health Card',
    body: 'Displays crucial patient card details. The digital insurance card uses premium dark wood-charcoal gradients so parameters can be scanned by paramedics during crisis dispatch.'
  },
  'screen-settings': {
    title: 'Preferences & Themes',
    body: 'Houses settings for biometrics and alerts. Features a dark mode toggle that applies a dark CSS inversion filter to demonstrate high-contrast layouts.'
  },
  'screen-payment': {
    title: 'Secure Checkout Gateway',
    body: 'Mocks standard credit card payments. Selecting saved methods updates invoice totals, leading to checkout confirmation.'
  },
  'screen-success': {
    title: 'Verification Feedback',
    body: 'A positive UX page using checkmark animations. Returning to home resets the scheduling wizard.'
  },
  'screen-empty': {
    title: 'Empty State Layouts',
    body: 'Displays when lists are clear of entries. Clean vector layouts prevent confusion, keeping interfaces organized and clear.'
  },
  'screen-error': {
    title: 'System Error State',
    body: 'Handles server disconnects. Displays clean offline indicators and simple retry options to help patients re-establish secure database sync.'
  }
};

// Global App States
let activeScreenId = 'screen-splash';
let callTimerInterval = null;
let callDuration = 0;
let sosCountdownTimer = null;
let sosCountdownValue = 3;
let sosActive = false;
let currentChartTimeframe = 'weekly';
let currentVitalType = 'bp'; // bp, hr, oxygen, temp, weight, bmi

// Dynamic island states (VitaNova Theme)
const islandStates = {
  default: { width: '110px', height: '30px', content: '' },
  call: { width: '180px', height: '30px', content: '<span style="font-size:11px;color:var(--success);font-weight:600;display:flex;align-items:center;gap:4px;">● Active Call</span>' },
  sos: { width: '160px', height: '30px', content: '<span style="font-size:11px;color:var(--danger);font-weight:700;display:flex;align-items:center;gap:4px;animation:spin 2s linear infinite;">⚠ SOS BROADCAST</span>' }
};

// --- Vitals Datasets Matrix ---
const vitalsDatasets = {
  bp: {
    title: 'Blood Pressure Trend',
    minVal: 60,
    maxVal: 140,
    unit: 'mmHg',
    weekly: { y1: [120, 118, 122, 115, 118, 119, 118], y2: [80, 78, 82, 75, 78, 77, 78], labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    monthly: { y1: [124, 122, 120, 119, 118, 120, 121, 117, 118, 119], y2: [82, 80, 78, 77, 78, 80, 81, 76, 77, 78], labels: ['1', '4', '7', '10', '13', '16', '19', '22', '25', '28'] },
    yearly: { y1: [126, 124, 122, 121, 120, 118, 119, 118, 117, 119, 120, 118], y2: [84, 82, 80, 79, 78, 76, 78, 77, 76, 78, 79, 78], labels: ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'] },
    metrics: [
      { label: 'Systolic Avg', value: '119 mmHg', status: 'Optimal' },
      { label: 'Diastolic Avg', value: '77 mmHg', status: 'Optimal' },
      { label: 'BP Status', value: 'Healthy Range', status: 'Healthy' }
    ]
  },
  hr: {
    title: 'Heart Rate Trend',
    minVal: 50,
    maxVal: 130,
    unit: 'BPM',
    weekly: { y1: [72, 75, 70, 82, 71, 73, 72], labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    monthly: { y1: [75, 74, 76, 72, 73, 75, 74, 78, 72, 71], labels: ['1', '4', '7', '10', '13', '16', '19', '22', '25', '28'] },
    yearly: { y1: [78, 76, 74, 73, 72, 70, 71, 73, 72, 74, 73, 72], labels: ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'] },
    metrics: [
      { label: 'Average HR', value: '73 BPM', status: 'Optimal' },
      { label: 'Resting Avg', value: '68 BPM', status: 'Optimal' },
      { label: 'Max HR', value: '105 BPM', status: 'Caution' }
    ]
  },
  oxygen: {
    title: 'Blood Oxygen Saturation (SpO2)',
    minVal: 90,
    maxVal: 100,
    unit: '%',
    weekly: { y1: [98, 97, 98, 99, 98, 98, 98], labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    monthly: { y1: [97, 98, 98, 98, 99, 98, 98, 97, 98, 98], labels: ['1', '4', '7', '10', '13', '16', '19', '22', '25', '28'] },
    yearly: { y1: [98, 98, 98, 97, 98, 99, 98, 98, 98, 98, 98, 98], labels: ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'] },
    metrics: [
      { label: 'Average SpO2', value: '98%', status: 'Optimal' },
      { label: 'Minimum Saturation', value: '97%', status: 'Optimal' },
      { label: 'Oxygen Status', value: 'Healthy Saturation', status: 'Optimal' }
    ]
  },
  temp: {
    title: 'Body Temperature Trend',
    minVal: 35.5,
    maxVal: 38.5,
    unit: '°C',
    weekly: { y1: [36.8, 36.6, 36.9, 36.7, 36.8, 36.8, 36.8], labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    monthly: { y1: [36.7, 36.8, 36.8, 36.9, 36.7, 36.8, 36.8, 36.6, 36.7, 36.8], labels: ['1', '4', '7', '10', '13', '16', '19', '22', '25', '28'] },
    yearly: { y1: [36.8, 36.8, 36.7, 36.7, 36.8, 36.8, 36.8, 36.8, 36.7, 36.8, 36.8, 36.8], labels: ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'] },
    metrics: [
      { label: 'Average Temp', value: '36.8 °C', status: 'Normal' },
      { label: 'Peak Temp', value: '37.1 °C', status: 'Normal' },
      { label: 'Fever State', value: 'Normal', status: 'Normal' }
    ]
  },
  weight: {
    title: 'Body Weight Tracking',
    minVal: 65,
    maxVal: 75,
    unit: 'kg',
    weekly: { y1: [68.5, 68.6, 68.4, 68.5, 68.3, 68.2, 68.5], labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    monthly: { y1: [69.2, 69.0, 68.8, 68.7, 68.5, 68.6, 68.4, 68.5, 68.3, 68.5], labels: ['1', '4', '7', '10', '13', '16', '19', '22', '25', '28'] },
    yearly: { y1: [71.5, 71.0, 70.4, 70.0, 69.5, 69.2, 68.9, 68.8, 68.7, 68.5, 68.5, 68.5], labels: ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'] },
    metrics: [
      { label: 'Current Weight', value: '68.5 kg', status: 'Healthy' },
      { label: 'Target weight', value: '68.0 kg', status: 'Healthy' },
      { label: 'Total Change', value: '-3.0 kg (12 Mo)', status: 'Healthy' }
    ]
  },
  bmi: {
    title: 'Body Mass Index (BMI)',
    minVal: 18,
    maxVal: 28,
    unit: 'points',
    weekly: { y1: [23.4, 23.4, 23.3, 23.4, 23.3, 23.3, 23.4], labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    monthly: { y1: [23.7, 23.6, 23.5, 23.5, 23.4, 23.4, 23.3, 23.4, 23.3, 23.4], labels: ['1', '4', '7', '10', '13', '16', '19', '22', '25', '28'] },
    yearly: { y1: [24.5, 24.3, 24.1, 23.9, 23.8, 23.7, 23.6, 23.5, 23.5, 23.4, 23.4, 23.4], labels: ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'] },
    metrics: [
      { label: 'Current BMI', value: '23.4 BMI', status: 'Normal' },
      { label: 'Classification', value: 'Healthy Range', status: 'Normal' },
      { label: 'Target BMI', value: '22.0 BMI', status: 'Normal' }
    ]
  }
};

// --- Navigation Controller ---
function navigateTo(screenId) {
  if (!screenId) return;

  // Clear call timers if leaving video screen
  if (activeScreenId === 'screen-video-call' && screenId !== 'screen-video-call') {
    stopCallTimer();
  }

  // Clear SOS countdown if leaving SOS screen
  if (activeScreenId === 'screen-sos' && screenId !== 'screen-sos') {
    resetSosState();
  }

  // Hide current active screen
  const currentScreen = document.getElementById(activeScreenId);
  if (currentScreen) {
    currentScreen.classList.remove('active');
  }

  // Show new active screen
  const newScreen = document.getElementById(screenId);
  if (newScreen) {
    newScreen.classList.add('active');
    activeScreenId = screenId;
  }

  // Update Sidebar Controllers
  const jumpButtons = document.querySelectorAll('.screen-jump-btn');
  jumpButtons.forEach(btn => btn.classList.remove('active'));
  
  // Find matching jump button and activate it
  const matchBtn = document.getElementById(`btn-${screenId}`);
  if (matchBtn) {
    matchBtn.classList.add('active');
    matchBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // Update Designer Notes Pane
  const note = screenNotes[screenId] || { title: 'Health Screen', body: 'Realistic mobile screen UI showcasing premium healthcare metrics.' };
  document.getElementById('note-title').textContent = note.title;
  document.getElementById('note-body').textContent = note.body;

  // Manage Dynamic Island states
  if (screenId === 'screen-video-call') {
    updateDynamicIsland('call');
    startCallTimer();
  } else if (screenId === 'screen-sos' && sosActive) {
    updateDynamicIsland('sos');
  } else {
    updateDynamicIsland('default');
  }

  // Update bottom navigation bar selections
  updateBottomNavBar(screenId);

  // Redraw charts if navigating to health details
  if (screenId === 'screen-health-details') {
    setTimeout(() => {
      renderVitalsChart(currentChartTimeframe);
    }, 100);
  }
}

// Redirect dashboard vital card click directly to chart selector
function openVitalDetailsDirect(vitalType) {
  currentVitalType = vitalType;
  navigateTo('screen-health-details');
  
  // Update selection button tabs
  const vitalBtns = document.querySelectorAll('.vital-select-btn');
  vitalBtns.forEach(btn => {
    btn.classList.remove('badge-primary');
    btn.style.backgroundColor = 'var(--grey-100)';
    btn.style.color = 'var(--grey-600)';
  });
  
  const selectBtn = document.getElementById(`vital-btn-${vitalType}`);
  if (selectBtn) {
    selectBtn.classList.add('badge-primary');
    selectBtn.style.backgroundColor = '';
    selectBtn.style.color = '';
  }
}

// Select vital type inside charts panel
function selectVitalType(vitalType) {
  currentVitalType = vitalType;
  
  const vitalBtns = document.querySelectorAll('.vital-select-btn');
  vitalBtns.forEach(btn => {
    btn.classList.remove('badge-primary');
    btn.style.backgroundColor = 'var(--grey-100)';
    btn.style.color = 'var(--grey-600)';
  });
  
  event.target.classList.add('badge-primary');
  event.target.style.backgroundColor = '';
  event.target.style.color = '';
  
  renderVitalsChart(currentChartTimeframe);
}

// Update bottom nav highlighting based on screen routing
function updateBottomNavBar(screenId) {
  const bottomNavs = document.querySelectorAll('.mobile-bottom-nav');
  bottomNavs.forEach(nav => {
    const items = nav.querySelectorAll('.nav-item');
    items.forEach(item => item.classList.remove('active'));
    
    if (screenId === 'screen-home') {
      nav.querySelector('button[onclick*="screen-home"]').classList.add('active');
    } else if (screenId === 'screen-doctors' || screenId === 'screen-booking') {
      const docBtn = nav.querySelector('button[onclick*="screen-doctors"]');
      if (docBtn) docBtn.classList.add('active');
    } else if (screenId === 'screen-reports') {
      const repBtn = nav.querySelector('button[onclick*="screen-reports"]');
      if (repBtn) repBtn.classList.add('active');
    } else if (screenId === 'screen-notifications') {
      const notifBtn = nav.querySelector('button[onclick*="screen-notifications"]');
      if (notifBtn) notifBtn.classList.add('active');
    } else if (screenId === 'screen-profile' || screenId === 'screen-settings') {
      const profBtn = nav.querySelector('button[onclick*="screen-profile"]');
      if (profBtn) profBtn.classList.add('active');
    }
  });
}

// Update Dynamic Island size and content
function updateDynamicIsland(stateKey) {
  const island = document.getElementById('island-container');
  if (!island) return;
  const state = islandStates[stateKey] || islandStates['default'];
  island.style.width = state.width;
  island.style.height = state.height;
  island.innerHTML = state.content;
}

// Dynamic Status Bar Clock
function startStatusBarClock() {
  const timeDisp = document.getElementById('status-time');
  if (!timeDisp) return;
  
  function updateTime() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    timeDisp.textContent = `${hours}:${minutes}`;
  }
  
  updateTime();
  setInterval(updateTime, 15000);
}

// --- Dynamic SVG Vitals Chart Drawer ---
function renderVitalsChart(timeframe) {
  const container = document.getElementById('svg-chart-container');
  if (!container) return;

  const dataset = vitalsDatasets[currentVitalType] || vitalsDatasets.bp;
  const timeData = dataset[timeframe] || dataset.weekly;
  
  const y1Points = timeData.y1;
  const y2Points = timeData.y2 || null;
  
  const width = container.clientWidth || 320;
  const height = 160;
  const padding = 16;
  const graphHeight = height - padding * 2;
  const graphWidth = width - padding * 2;
  
  const minVal = dataset.minVal;
  const maxVal = dataset.maxVal;
  const valRange = maxVal - minVal;

  // Update headings
  document.getElementById('chart-sub-heading').textContent = dataset.title;
  
  // Populate metrics summary lists
  const metricLabels = [
    document.getElementById('metric-label-1'),
    document.getElementById('metric-label-2'),
    document.getElementById('metric-label-3')
  ];
  const metricVals = [
    document.getElementById('metric-val-1'),
    document.getElementById('metric-val-2'),
    document.getElementById('metric-val-3')
  ];
  const metricBadges = [
    document.getElementById('metric-badge-1'),
    document.getElementById('metric-badge-2'),
    document.getElementById('metric-badge-3')
  ];

  dataset.metrics.forEach((m, idx) => {
    if (metricLabels[idx]) metricLabels[idx].textContent = m.label;
    if (metricVals[idx]) metricVals[idx].textContent = m.value;
    if (metricBadges[idx]) {
      metricBadges[idx].textContent = m.status;
      metricBadges[idx].className = `mobile-badge badge-${m.status === 'Optimal' || m.status === 'Normal' || m.status === 'Healthy' ? 'success' : 'primary'}`;
    }
  });

  // Map values to coordinates
  function getCoords(arr) {
    return arr.map((val, index) => {
      const x = padding + (index / (arr.length - 1)) * graphWidth;
      const y = height - padding - ((val - minVal) / valRange) * graphHeight;
      return { x, y };
    });
  }

  const coords1 = getCoords(y1Points);
  const coords2 = y2Points ? getCoords(y2Points) : null;

  // Generate SVG path code strings
  function getPathD(coords) {
    if (coords.length === 0) return '';
    let d = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 1; i < coords.length; i++) {
      const cpX1 = coords[i-1].x + (coords[i].x - coords[i-1].x) / 3;
      const cpY1 = coords[i-1].y;
      const cpX2 = coords[i-1].x + 2 * (coords[i].x - coords[i-1].x) / 3;
      const cpY2 = coords[i].y;
      d += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${coords[i].x} ${coords[i].y}`;
    }
    return d;
  }

  const pathD1 = getPathD(coords1);
  const pathD2 = coords2 ? getPathD(coords2) : '';

  // Gradient definitions based on Vital Color (VitaNova Scandinavian Palette)
  // BP uses Terracotta highlight, others use clean forest/sage/dark elements
  let strokeColor1 = 'var(--brand-terracotta)';
  let strokeColor2 = 'var(--accent)';
  let fillColorKey = 'brand-grad';

  if (currentVitalType === 'hr') {
    strokeColor1 = 'var(--danger)'; // Blush Rose
    fillColorKey = 'hr-grad';
  } else if (currentVitalType === 'temp') {
    strokeColor1 = 'var(--success)'; // Forest Green
    fillColorKey = 'temp-grad';
  } else if (currentVitalType === 'oxygen') {
    strokeColor1 = 'var(--accent-hover)'; // Sage Grey Accent
    fillColorKey = 'ox-grad';
  } else if (currentVitalType === 'weight') {
    strokeColor1 = 'var(--primary)'; // Forest Charcoal
    fillColorKey = 'w-grad';
  }

  // Build full SVG elements block
  let svgContent = `
    <svg class="svg-chart" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="brand-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--brand-terracotta)" stop-opacity="0.15"/>
          <stop offset="100%" stop-color="var(--brand-terracotta)" stop-opacity="0.0"/>
        </linearGradient>
        <linearGradient id="hr-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--danger)" stop-opacity="0.15"/>
          <stop offset="100%" stop-color="var(--danger)" stop-opacity="0.0"/>
        </linearGradient>
        <linearGradient id="temp-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--success)" stop-opacity="0.15"/>
          <stop offset="100%" stop-color="var(--success)" stop-opacity="0.0"/>
        </linearGradient>
        <linearGradient id="ox-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--accent-hover)" stop-opacity="0.15"/>
          <stop offset="100%" stop-color="var(--accent-hover)" stop-opacity="0.0"/>
        </linearGradient>
        <linearGradient id="w-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--primary)" stop-opacity="0.15"/>
          <stop offset="100%" stop-color="var(--primary)" stop-opacity="0.0"/>
        </linearGradient>
        
        <linearGradient id="dia-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--accent)" stop-opacity="0.15"/>
          <stop offset="100%" stop-color="var(--accent)" stop-opacity="0.0"/>
        </linearGradient>
      </defs>

      <!-- Fill areas -->
      <path d="${pathD1} L ${coords1[coords1.length-1].x} ${height - padding} L ${coords1[0].x} ${height - padding} Z" fill="url(#${fillColorKey})"/>
  `;

  if (coords2) {
    svgContent += `
      <path d="${pathD2} L ${coords2[coords2.length-1].x} ${height - padding} L ${coords2[0].x} ${height - padding} Z" fill="url(#dia-grad)"/>
      <path d="${pathD2}" fill="none" stroke="${strokeColor2}" stroke-width="3" stroke-linecap="round"/>
    `;
  }

  svgContent += `
      <path d="${pathD1}" fill="none" stroke="${strokeColor1}" stroke-width="3" stroke-linecap="round"/>
  `;

  // Draw points circles
  coords1.forEach(c => {
    svgContent += `<circle cx="${c.x}" cy="${c.y}" r="4" fill="var(--white)" stroke="${strokeColor1}" stroke-width="2"/>`;
  });

  if (coords2) {
    coords2.forEach(c => {
      svgContent += `<circle cx="${c.x}" cy="${c.y}" r="4" fill="var(--white)" stroke="${strokeColor2}" stroke-width="2"/>`;
    });
  }

  svgContent += `</svg>`;
  container.innerHTML = svgContent;
}

function updateChartTimeframe(timeframe) {
  currentChartTimeframe = timeframe;
  
  // Highlight active chart header tab button
  const btns = event.target.parentNode.querySelectorAll('.chart-tab-btn');
  btns.forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  
  renderVitalsChart(timeframe);
}

// --- Telehealth Call Timer Functions ---
function startCallTimer() {
  const timerDisp = document.getElementById('call-timer');
  if (!timerDisp) return;
  
  callDuration = 0;
  timerDisp.textContent = '00:00';
  
  clearInterval(callTimerInterval);
  callTimerInterval = setInterval(() => {
    callDuration++;
    let mins = Math.floor(callDuration / 60);
    let secs = callDuration % 60;
    mins = mins < 10 ? '0' + mins : mins;
    secs = secs < 10 ? '0' + secs : secs;
    timerDisp.textContent = `${mins}:${secs}`;
  }, 1000);
}

// stop Call
function stopCallTimer() {
  clearInterval(callTimerInterval);
  callDuration = 0;
}

function toggleCallControl(btnId) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  btn.classList.toggle('inactive');
}

// Termination Call
function endConsultationCall() {
  stopCallTimer();
  updateDynamicIsland('default');
  alert('Video Consultation ended. Summary report synced.');
  navigateTo('screen-home');
}

// --- Emergency SOS Countdown Mechanisms ---
function triggerSosCountdown() {
  const btn = document.getElementById('sos-main-trigger');
  const disp = document.getElementById('sos-countdown-disp');
  const info = document.getElementById('sos-info-text');
  const alertBox = document.getElementById('sos-alert-box');

  if (sosActive) {
    resetSosState();
    return;
  }

  sosActive = true;
  sosCountdownValue = 3;
  btn.textContent = 'CANCEL';
  btn.style.backgroundColor = 'var(--dark)';
  btn.style.boxShadow = 'var(--shadow-md)';
  disp.textContent = sosCountdownValue;
  info.textContent = 'SOS triggered! Transmitting telemetry in 3s. Press CANCEL to stop.';
  
  updateDynamicIsland('sos');

  sosCountdownTimer = setInterval(() => {
    sosCountdownValue--;
    if (sosCountdownValue > 0) {
      disp.textContent = sosCountdownValue;
    } else {
      clearInterval(sosCountdownTimer);
      disp.textContent = 'BROADCASTING';
      info.textContent = 'GPS location, HealthID file, and insurance details sent to local Emergency dispatch.';
      alertBox.style.display = 'flex';
      
      // Inject alert notice into homepage dashboard
      const homeSosAlert = document.createElement('div');
      homeSosAlert.id = 'home-sos-warning-header';
      homeSosAlert.style.cssText = 'background-color: var(--danger-light); color: var(--danger); font-size:12px; font-weight:700; padding:10px 20px; border-bottom:1px solid rgba(197,125,113,0.2); display:flex; align-items:center; gap:8px;';
      homeSosAlert.innerHTML = `
        <span style="animation: logoPulse 1s infinite ease-in-out;">🔴</span>
        <span>VitaNova Alert: Ambulance dispatched. Contact spouse immediately.</span>
      `;
      const homeScreen = document.getElementById('screen-home');
      if (homeScreen && !document.getElementById('home-sos-warning-header')) {
        homeScreen.insertBefore(homeSosAlert, homeScreen.children[1]);
      }
    }
  }, 1000);
}

function resetSosState() {
  clearInterval(sosCountdownTimer);
  sosActive = false;
  sosCountdownValue = 3;
  
  const btn = document.getElementById('sos-main-trigger');
  const disp = document.getElementById('sos-countdown-disp');
  const info = document.getElementById('sos-info-text');
  const alertBox = document.getElementById('sos-alert-box');
  
  if (btn) {
    btn.textContent = 'SOS';
    btn.style.backgroundColor = 'var(--danger)';
    btn.style.boxShadow = 'var(--shadow-danger)';
  }
  if (disp) disp.textContent = 'Tap SOS';
  if (info) info.textContent = 'Pressing SOS triggers a 3-second countdown to broadcast your medical card and GPS coordinates.';
  if (alertBox) alertBox.style.display = 'none';

  updateDynamicIsland('default');
}

// --- Medication Tracker checklist toggles & Compliance calculations ---
function toggleMedTaken(btnId) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  
  if (btn.classList.contains('taken')) {
    btn.classList.remove('taken');
    btn.style.backgroundColor = 'var(--primary-light)';
    btn.style.color = 'var(--primary)';
    btn.textContent = 'Mark Taken';
  } else {
    btn.classList.add('taken');
    btn.style.backgroundColor = 'var(--success-light)';
    btn.style.color = 'var(--success)';
    btn.textContent = 'Taken ✓';
  }
  
  // Recalculate Compliance Tracker
  recalculateMedAdherence();
}

function recalculateMedAdherence() {
  const medBtns = [
    document.getElementById('med-btn-1'),
    document.getElementById('med-btn-2')
  ];
  
  let total = 0;
  let taken = 0;
  
  medBtns.forEach(btn => {
    if (btn) {
      total++;
      if (btn.classList.contains('taken')) {
        taken++;
      }
    }
  });
  
  if (total === 0) return;
  const percentage = Math.round((taken / total) * 100);
  
  const fillBar = document.getElementById('compliance-fill-bar');
  const label = document.getElementById('home-adherence-percentage');
  
  if (fillBar) {
    fillBar.style.width = `${percentage}%`;
  }
  if (label) {
    label.textContent = `${percentage}% Adherence`;
  }
}

// --- Bookings & Slots Selectors ---
let selectedDoctorName = 'Dr. Marcus Vance';
let selectedDoctorSpecialty = 'Cardiologist';

function selectDoctor(name, specialty) {
  selectedDoctorName = name;
  selectedDoctorSpecialty = specialty;
  
  const docNameField = document.getElementById('booking-doc-name');
  const docSpecField = document.getElementById('booking-doc-specialty');
  const docAvatarField = document.getElementById('booking-doc-avatar');
  
  if (docNameField) docNameField.textContent = name;
  if (docSpecField) docSpecField.textContent = specialty;
  
  if (docAvatarField) {
    const avatarUrl = name.includes('Marcus') 
      ? 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=150'
      : 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=150';
    docAvatarField.style.backgroundImage = `url('${avatarUrl}')`;
  }
  
  navigateTo('screen-booking');
}

function selectTimeSlot(btn) {
  const slots = document.querySelectorAll('.time-slot-btn');
  slots.forEach(s => s.classList.remove('active'));
  btn.classList.add('active');
}

// --- Payment & Confirmations ---
function processPaymentMock() {
  const originalContent = event.target.textContent;
  const payBtn = event.target;
  payBtn.disabled = true;
  payBtn.textContent = 'Processing Secure Check...';
  
  setTimeout(() => {
    payBtn.disabled = false;
    payBtn.textContent = originalContent;
    navigateTo('screen-success');
  }, 1500);
}

// --- Medical PDF Sync Mock functions ---
function addNewReportMock() {
  const container = document.getElementById('reports-list-container');
  if (!container) return;
  
  const reports = [
    { title: 'Lipid Profile Test', source: 'Quest Diagnostics', date: 'July 28, 2026' },
    { title: 'Thyroid Function Panel', source: 'LabCorp Labs', date: 'July 27, 2026' },
    { title: 'Urinalysis Diagnostics', source: 'City Clinic Health', date: 'July 26, 2026' }
  ];
  
  const randomReport = reports[Math.floor(Math.random() * reports.length)];
  
  const reportCard = document.createElement('div');
  reportCard.className = 'mobile-card';
  reportCard.style.padding = '16px';
  reportCard.style.animation = 'screenFadeIn 0.3s forwards';
  reportCard.innerHTML = `
    <div style="display: flex; align-items: flex-start; gap: 12px;">
      <div style="width: 40px; height: 40px; border-radius: var(--radius-md); background-color: var(--success-light); display: flex; align-items: center; justify-content: center; color: var(--success); font-weight: 700; font-size:12px;">PDF</div>
      <div style="flex-grow: 1;">
        <div style="font-weight: 600; font-size: 14px;">${randomReport.title}</div>
        <div style="font-size: 11px; color: var(--grey-600); margin-top: 2px;">${randomReport.source} • ${randomReport.date}</div>
      </div>
    </div>
    <div style="display: flex; gap: 8px; margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--grey-200);">
      <button class="mobile-btn mobile-btn-outline" style="flex: 1; padding: 8px; font-size: 12px;" onclick="simulatePdfAction('download', 'Report_Sync.pdf')">Download</button>
      <button class="mobile-btn mobile-btn-secondary" style="flex: 1; padding: 8px; font-size: 12px;" onclick="simulatePdfAction('share', 'Report_Sync.pdf')">Share</button>
    </div>
  `;
  
  container.insertBefore(reportCard, container.children[0]);
  alert(`Synced successfully! Added new report: ${randomReport.title}`);
}

function simulatePdfAction(action, filename) {
  if (action === 'download') {
    alert(`Downloaded PDF successfully! Saved "${filename}" file to local device storage.`);
  } else {
    alert(`Generated sharing link: "vitanova-telehealth.secure.link/share/${Math.random().toString(36).substring(7)}" successfully copied to clipboard.`);
  }
}

// --- Settings Toggles & Preferences ---
function toggleDarkThemeMock() {
  const viewport = document.querySelector('.phone-viewport');
  if (!viewport) return;
  
  const isDark = event.target.checked;
  if (isDark) {
    viewport.style.filter = 'invert(0.9) hue-rotate(180deg)';
    document.getElementById('status-bar').style.color = '#FFFFFF';
  } else {
    viewport.style.filter = 'none';
    document.getElementById('status-bar').style.color = 'var(--dark)';
  }
}

// Clear alerts box
function clearNotifications() {
  const container = document.getElementById('notifications-list-container');
  if (container) {
    container.innerHTML = `
      <div style="text-align:center; padding: 40px 20px; color: var(--grey-400); font-size:13px;">
        <span>No unread notifications alerts.</span>
      </div>
    `;
  }
}

// Add Mock Medications
function addNewMedicineMock() {
  const container = document.getElementById('medicine-reminder-container');
  if (!container) return;

  const meds = [
    { name: 'Amlodipine 5mg', schedule: 'Once Daily • 08:00 AM', color: 'var(--success-light)', svgColor: 'var(--success)' },
    { name: 'Simvastatin 40mg', schedule: 'Once Daily • 09:00 PM', color: 'var(--warning-light)', svgColor: 'var(--warning-dark)' },
    { name: 'Metoprolol 25mg', schedule: 'Twice Daily • With Meals', color: 'var(--primary-light)', svgColor: 'var(--primary)' }
  ];

  const randMed = meds[Math.floor(Math.random() * meds.length)];
  const mId = 'med-rand-' + Math.floor(Math.random()*1000);
  
  const medCard = document.createElement('div');
  medCard.className = 'mobile-card medication-card';
  medCard.style.animation = 'screenSlideUp 0.35s forwards';
  medCard.innerHTML = `
    <div class="med-info-left">
      <div class="med-icon-box" style="background-color: ${randMed.color}; color: ${randMed.svgColor};">
        <svg class="icon-svg" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M6 21V3M10 21V3M14 21V3M18 21V3"/></svg>
      </div>
      <div>
        <div class="med-name">${randMed.name}</div>
        <div class="med-details">${randMed.schedule}</div>
      </div>
    </div>
    <button class="med-action-btn" id="${mId}" onclick="toggleMedTaken('${mId}')">Mark Taken</button>
  `;
  
  container.appendChild(medCard);
  alert(`Added new medicine to schedule: ${randMed.name}`);
}

// --- State controllers switcher overrides (Supports Multi-Empty-States) ---
function toggleScreenState(state, category) {
  const btns = document.querySelectorAll('.state-toggle-btn');
  btns.forEach(b => b.classList.remove('active'));

  if (state === 'empty') {
    let activeBtnId = 'btn-state-empty';
    if (category === 'notifications') activeBtnId = 'btn-state-empty-notif';
    if (category === 'appointments') activeBtnId = 'btn-state-empty-appt';
    
    const activeBtn = document.getElementById(activeBtnId);
    if (activeBtn) activeBtn.classList.add('active');

    const emptyTitle = document.getElementById('empty-screen-title');
    const emptyDesc = document.getElementById('empty-screen-desc');
    const emptyHeader = document.getElementById('empty-screen-header-title');
    const emptyIllustration = document.getElementById('empty-screen-illustration');

    if (category === 'reports') {
      if (emptyHeader) emptyHeader.textContent = 'Reports Locker';
      if (emptyTitle) emptyTitle.textContent = 'No Medical Reports';
      if (emptyDesc) emptyDesc.textContent = 'There are currently no lab test reports uploaded to your secure cloud locker. Ask your practitioner to sync them.';
      if (emptyIllustration) {
        emptyIllustration.innerHTML = `
          <svg width="140" height="140" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="70" cy="70" r="50" fill="var(--primary-light)"/>
            <path d="M55 50h30v40H55z" fill="var(--accent)"/>
            <path d="M60 60h20M60 70h12" stroke="var(--grey-400)" stroke-width="3" stroke-linecap="round"/>
          </svg>
        `;
      }
    } else if (category === 'notifications') {
      if (emptyHeader) emptyHeader.textContent = 'System Alerts';
      if (emptyTitle) emptyTitle.textContent = 'No Alerts Recorded';
      if (emptyDesc) emptyDesc.textContent = 'Your health warnings history is clean. Continuous tracking will notify you of vital anomalies here.';
      if (emptyIllustration) {
        emptyIllustration.innerHTML = `
          <svg width="140" height="140" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="70" cy="70" r="50" fill="var(--warning-light)"/>
            <path d="M70 45v35" stroke="var(--warning)" stroke-width="5" stroke-linecap="round"/>
            <circle cx="70" cy="95" r="4" fill="var(--warning)"/>
          </svg>
        `;
      }
    } else if (category === 'appointments') {
      if (emptyHeader) emptyHeader.textContent = 'Sessions Agenda';
      if (emptyTitle) emptyTitle.textContent = 'No Scheduled Appointments';
      if (emptyDesc) emptyDesc.textContent = 'You have no clinical video consultations scheduled. Tap the Doctors directory tab to make a booking.';
      if (emptyIllustration) {
        emptyIllustration.innerHTML = `
          <svg width="140" height="140" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="70" cy="70" r="50" fill="var(--success-light)"/>
            <rect x="50" y="50" width="40" height="40" rx="6" fill="var(--success-light)" stroke="var(--success)" stroke-width="1"/>
            <circle cx="70" cy="70" r="10" fill="var(--success)"/>
            <path d="M67 70l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        `;
      }
    }

    navigateTo('screen-empty');
  } else if (state === 'error') {
    const activeBtn = document.getElementById('btn-state-error');
    if (activeBtn) activeBtn.classList.add('active');
    navigateTo('screen-error');
  } else {
    const activeBtn = document.getElementById('btn-state-default');
    if (activeBtn) activeBtn.classList.add('active');
    navigateTo('screen-home');
  }
}

// --- Web App tab switcher tabs ---
function switchTab(tabId, menuBtn) {
  const menuItems = document.querySelectorAll('.menu-item');
  menuItems.forEach(item => item.classList.remove('active'));
  
  menuBtn.classList.add('active');
  
  const panels = document.querySelectorAll('.tab-panel');
  panels.forEach(p => {
    p.style.display = 'none';
    p.classList.remove('active');
  });
  
  const activePanel = document.getElementById(tabId);
  if (activePanel) {
    activePanel.style.display = 'block';
    setTimeout(() => {
      activePanel.classList.add('active');
    }, 50);
  }
}

// --- Initialize App components on window load ---
window.onload = function() {
  startStatusBarClock();
  renderVitalsChart('weekly');
  
  // Calculate initial compliance bar
  recalculateMedAdherence();
  
  window.addEventListener('resize', () => {
    if (activeScreenId === 'screen-health-details') {
      renderVitalsChart(currentChartTimeframe);
    }
  });
};
