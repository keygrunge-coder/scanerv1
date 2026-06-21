// retur-script.js
let html5QrCode = null;
let scanHistory = JSON.parse(localStorage.getItem("returHistory") || "[]");
renderHistory();

window.onload = startCamera;

function robotBicara(teks) { 
    if ('speechSynthesis' in window) { 
        window.speechSynthesis.cancel(); 
        let tts = new SpeechSynthesisUtterance(teks); 
        tts.lang = 'id-ID'; tts.rate = 1.2; window.speechSynthesis.speak(tts); 
    } 
}

function setLampu(warna, pesan) { 
    const ind = document.getElementById('bca-indicator');
    ind.style.backgroundColor = warna === 'ijo' ? '#00cc44' : (warna === 'kuning' ? '#ffcc00' : '#ff3333');
    document.getElementById('status-message').innerText = pesan; 
}

function startCamera() {
    html5QrCode = new Html5Qrcode("reader");
    html5QrCode.start({ facingMode: "environment" }, { fps: 10, qrbox: 200 }, (decodedText) => {
        html5QrCode.pause(true);
        prosesScan(decodedText.trim());
    }).then(() => {
        setLampu('ijo', 'Siap Scan Returan!');
        robotBicara("Sistem Retur Siap");
    });
}
document.getElementById("startBtn").onclick = startCamera;

async function prosesScan(resi) {
    setLampu('kuning', 'Mengirim...');
    try {
        const r = await fetch(APP_URL, {
            method: "POST",
            body: JSON.stringify({ resi: resi, source: "retur" })
        });
        const json = await r.json();
        
        if(json.status === "success") {
            setLampu('ijo', "Sukses! Retur Masuk");
            robotBicara("Retur Sukses Masuk");
            scanHistory.unshift({ resi, status: "RETUR" });
        } else if(json.status === "duplicate") {
            setLampu('merah', "Resi Dobel!");
            robotBicara("Retur Dobel");
            scanHistory.unshift({ resi, status: "DOBEL" });
        } else {
            setLampu('merah', "Gagal");
            robotBicara("Resi Gagal");
            scanHistory.unshift({ resi, status: "GAGAL" });
        }
        localStorage.setItem("returHistory", JSON.stringify(scanHistory.slice(0, 15)));
        renderHistory();
    } catch(e) { 
        setLampu('merah', "Error Sinyal");
        robotBicara("Gagal Koneksi");
    }
    setTimeout(() => { html5QrCode.resume(); }, 1500);
}

function renderHistory() {
    const body = document.getElementById("historyBody");
    body.innerHTML = scanHistory.map(item => `
        <tr><td>${item.resi}</td><td><span class="badge">${item.status}</span></td></tr>
    `).join("");
}
