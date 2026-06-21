// upload-script.js
document.getElementById("uploadBtn").onclick = prosesTeks;

function prosesTeks() {
    const text = document.getElementById("rawText").value;
    const blocks = text.split("ID Pesanan:");
    let dataUpload = [];

    for (let i = 1; i < blocks.length; i++) {
        let block = blocks[i];
        let orderMatch = block.match(/\d{18}/);
        let orderId = orderMatch ? orderMatch[0] : null;
        let resiMatch = block.match(/(JX|JT|JZ)\d+/);
        let resi = resiMatch ? resiMatch[0] : null;

        if (orderId && resi) {
            dataUpload.push([orderId, resi]);
        }
    }

    if (dataUpload.length > 0) {
        uploadKeSheet(dataUpload);
    } else {
        alert("Data tidak ditemukan! Pastikan teks yang di-paste mencakup ID Pesanan dan Resi.");
    }
}

async function uploadKeSheet(data) {
    const statusDiv = document.getElementById("status");
    statusDiv.innerText = "Mengupload " + data.length + " data...";
    
    try {
        await fetch(APP_URL, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "uploadManual", data: data })
        });
        statusDiv.innerText = "✅ Selesai!";
        alert("Berhasil memproses " + data.length + " pesanan!");
    } catch (err) {
        alert("Error: " + err);
        statusDiv.innerText = "❌ Gagal Upload";
    }
}
