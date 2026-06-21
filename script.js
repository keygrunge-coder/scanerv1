// script.js
window.onload = function() { startCamera(); muatDataDashboardAwal(); };
let html5QrCode = null;
let isProcessing = false;
let localData = JSON.parse(localStorage.getItem('harian_offline_cache')) || [];
document.getElementById('local-slot').innerText = localData.length;
let scanHistory = JSON.parse(localStorage.getItem("scanHistory") || "[]");
renderHistory();

// ... (fungsi beep, robotBicara, setLampuBca, showNotif tetap sama) ...

function muatDataDashboardAwal() {
    fetch(`${APP_URL}?action=getDashboard`)
    .then(res => res.json())
    .then(data => { if(data.status === 'success') { document.getElementById('load-hari-ini').innerText = data.hariIni; document.getElementById('load-kemarin').innerText = data.kemarin; document.getElementById('load-minggu').innerText = data.mingguIni; } }).catch(e => {});
}

// ... (fungsi startCamera, saveResi, renderHistory, downloadOfflineData tetap sama) ...
