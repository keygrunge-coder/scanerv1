// Inisialisasi variabel global
let html5QrCode = null;

// Fungsi saat halaman selesai dimuat
window.onload = function() {
    // Jalankan fungsi dashboard saja, jangan start kamera di sini
    if (typeof muatDataDashboardAwal === 'function') {
        muatDataDashboardAwal();
    }
};

// Event Listener untuk tombol aktivasi kamera
document.getElementById('startBtn').addEventListener('click', function() {
    startCamera();
});

function startCamera() {
    const statusMessage = document.getElementById('status-message');
    
    // Pastikan instance kamera bersih sebelum memulai
    if (html5QrCode) {
        html5QrCode.stop().catch(err => console.log("Gagal menghentikan kamera sebelumnya"));
    }

    html5QrCode = new Html5Qrcode("reader");

    const config = { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0 
    };

    html5QrCode.start(
        { facingMode: "environment" }, // Paksa kamera belakang
        config,
        (decodedText) => {
            // Berhasil Scan
            handleScanSuccess(decodedText);
        },
        (errorMessage) => {
            // Error scan (biasanya diabaikan karena terjadi setiap frame)
        }
    ).catch((err) => {
        console.error("Error akses kamera: ", err);
        alert("Gagal membuka kamera: " + err + ". Pastikan Anda menggunakan HTTPS.");
    });
}

function handleScanSuccess(decodedText) {
    // Tambahkan logika pemrosesan resi Anda di sini
    console.log("Resi discan: " + decodedText);
    
    // Contoh: berikan feedback visual
    document.getElementById('status-message').innerText = "Berhasil scan: " + decodedText;
    
    // Opsional: Stop kamera setelah scan berhasil
    // html5QrCode.stop();
}
