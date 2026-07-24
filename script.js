const darkModeBtn = document.getElementById('darkModeToggle');
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-bs-theme', 'dark');
    if (darkModeBtn) {
        darkModeBtn.innerText = 'Light Mode';
        darkModeBtn.classList.replace('btn-outline-warning', 'btn-outline-light');
    }
}
if (darkModeBtn) {
    darkModeBtn.addEventListener('click', function() {
        if (document.documentElement.getAttribute('data-bs-theme') === 'dark') {
            document.documentElement.setAttribute('data-bs-theme', 'light');
            localStorage.setItem('theme', 'light');
            darkModeBtn.innerText = 'Dark Mode';
            darkModeBtn.classList.replace('btn-outline-light', 'btn-outline-warning');
        } else {
            document.documentElement.setAttribute('data-bs-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            
            darkModeBtn.innerText = 'Light Mode';
            darkModeBtn.classList.replace('btn-outline-warning', 'btn-outline-light');
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const currentPath = window.location.pathname.split("/").pop();
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks.forEach(link => {
        const hrefValue = link.getAttribute('href');
        link.classList.remove('active');
        link.removeAttribute('style'); 
        if (currentPath === hrefValue || (currentPath === "" && hrefValue === "index.html")) {
            link.classList.add('active');
        }
    });
});

function hitungBMI() {
    let berat = parseFloat(document.getElementById('berat').value);
    let tinggi = parseFloat(document.getElementById('tinggi').value);
    let divHasil = document.getElementById('hasilBMI');
    
    if (berat > 0 && tinggi > 0) {
        let tinggiMeter = tinggi / 100;
        let bmi = (berat / (tinggiMeter * tinggiMeter)).toFixed(1);
        let status = "";
        let colorClass = "";

        if (bmi < 18.5) {
            status = "Kekurangan berat badan";
            colorClass = "text-warning";
        } else if (bmi >= 18.5 && bmi <= 24.9) {
            status = "Normal (Ideal)";
            colorClass = "text-success";
        } else if (bmi >= 25 && bmi <= 29.9) {
            status = "Kelebihan berat badan";
            colorClass = "text-warning";
        } else {
            status = "Obesitas";
            colorClass = "text-danger";
        }

        divHasil.innerHTML = `Skor BMI Anda: <span class="fw-bold ${colorClass}">${bmi}</span> <br> Kategori: <span class="fw-bold ${colorClass}">${status}</span>`;
    } else {
        divHasil.innerHTML = `<span class="text-danger fw-bold">Silakan masukkan angka berat dan tinggi yang valid!</span>`;
    }
}

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        let nama = document.getElementById('nama').value;
        let kategori = document.getElementById('kategori').value;
        
        alert(`Halo ${nama}! Pesan Anda mengenai "${kategori}" telah kami terima. Tim GYM Olympia akan segera membalas ke email Anda.`);
        contactForm.reset();
    });
}

let hargaPaketGlobal = 0;
let namaPaketGlobal = "";
let bootstrapModalInstance;
let riwayatTransaksi = JSON.parse(localStorage.getItem('riwayatGYM')) || [];

function bukaModalPembayaran(namaPaket, hargaPaket) {
    hargaPaketGlobal = hargaPaket;
    namaPaketGlobal = namaPaket;
    document.getElementById('textPaket').innerText = namaPaket;
    document.getElementById('textHarga').innerText = 'Rp ' + hargaPaket.toLocaleString('id-ID');
    document.getElementById('formCheckout').reset();
    
    var modalEl = document.getElementById('modalPembayaran');
    bootstrapModalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
    bootstrapModalInstance.show();
}

function tampilkanRiwayat() {
    const tabelRiwayat = document.getElementById('tabelRiwayat');
    
    tabelRiwayat.innerHTML = '';
    
    if (riwayatTransaksi.length === 0) {
        tabelRiwayat.innerHTML = `
            <tr id="noDataText">
                <td colspan="6" class="text-center py-4 text-muted">Belum ada riwayat pendaftaran.</td>
            </tr>
        `;
    } else {
        riwayatTransaksi.forEach((data, index) => {
            const barisBaru = document.createElement('tr');
            barisBaru.innerHTML = `
                <td><strong>${index + 1}</strong></td>
                <td>${data.nama}</td>
                <td>${data.hp}</td>
                <td><span class="badge bg-secondary">${data.paket}</span></td>
                <td>${data.metode}</td>
                <td><span class="badge bg-success">Sukses / Aktif</span></td>
            `;
            tabelRiwayat.insertBefore(barisBaru, tabelRiwayat.firstChild);
        });
    }
}

document.addEventListener('DOMContentLoaded', tampilkanRiwayat);

function prosesTransaksi(event) {
    event.preventDefault();
    
    const alertUtama = document.getElementById('alertUtama');
    const nama = document.getElementById('inputNama').value;
    const hp = document.getElementById('inputHp').value;
    const metode = document.getElementById('metodeBayar').value;

    bootstrapModalInstance.hide();
    
    let teksSukses = `<strong>Pembayaran Sukses!</strong> Terima kasih ${nama}. Akun membership Anda untuk paket ${namaPaketGlobal} segera aktif.`;

    alertUtama.innerHTML = `
        <div class="alert alert-success alert-dismissible fade show text-center" role="alert">
            ${teksSukses}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;

    const dataBaru = {
        nama: nama,
        hp: hp,
        paket: namaPaketGlobal,
        metode: metode
    };
    
    riwayatTransaksi.push(dataBaru); 
    localStorage.setItem('riwayatGYM', JSON.stringify(riwayatTransaksi)); 
    
    tampilkanRiwayat();

    window.scrollTo({ top: 0, behavior: 'smooth' });
}
