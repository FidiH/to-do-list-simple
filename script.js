// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('/sw.js')
//     .then(registration => {
//       console.log('Service worker terdaftar');
//     })
//     .catch(error => {
//       console.error('Service worker gagal terdaftar', error);
//     });
// }

// ambil element yang dibutuhkan
// variabel global
// ambil data yang ada di localstorage atau membuat localstorage
let dataItems =
  JSON.parse(
    storage({
      tipe: "get",
      key: "data",
    })
  ) ||
  storage({
    tipe: "set",
    key: "data",
    value: JSON.stringify([]),
  });

// form input global
let dataForm = Object.fromEntries(new FormData(formInput));
// tombol form
let tombolForm = document.querySelector(".tombolForm");

// id aktif
let idAktif;

// update Dom jika ada data baru
updateDOM();

window.addEventListener("click", e => {
  // menambahkan item
  if (e.target.textContent == "Tambahkan") {
    // dataForm untuk tambah
    let dataInputForm = Object.fromEntries(new FormData(formInput));
    // buat id untuk tiap items
    let buatIdItem = "id_" + Math.round(new Date().getTime() / 2);

    // cek apakah input ada isinya
    if (dataInputForm.inputJudul && dataInputForm.inputDeskripsi) {
      // push data ke dataItems
      dataItems.push({
        id: buatIdItem,
        judul: dataInputForm.inputJudul,
        deskripsi: dataInputForm.inputDeskripsi,
        status: false,
      });
      // masukan ke local storage
      storage({
        tipe: "set",
        key: "data",
        value: JSON.stringify(dataItems),
      });
      // kosongkan input form
      formInput.reset();
      // updateData DOM
      updateDOM();
    } else {
      alert("masih ada input yang kosong");
    }
    // #### end tombolTambahkanitem ####
  }

  // menghapus item
  if (e.target.closest(".tombolHapus")) {
    if (confirm("yakin hapus?")) {
      // ambil id terdekat dari tombolHapus
      let idDiKlik = e.target.closest(".item").id;
      // hapus data berdasarkan id
      hapusDataItem(idDiKlik);
      // updateDOM
      updateDOM();
    }
    // #### end tombolHapus ####
  }

  // tombol selesai saat di klik
  if (e.target.closest(".tombolSelesai")) {
    let idItemDiKlik = e.target.closest(".item");
    // ubah statusnya
    ubahStatusItem(idItemDiKlik.id);
    // update dom
    updateDOM();
    // #### end tombol selesai ####
  }

  // tombol untuk edit item
  if (e.target.closest(".tombolEdit")) {
    // idItemDiKlik
    let idItem = e.target.closest(".item");
    // ganti id aktif
    idAktif = idItem;
    // ambil data berdasarkan id yang ingin di ubah
    // ambil form dulu
    formInput.classList.remove("d-none");
    document.querySelector(".tombolTambahItem").textContent = "Tutup";
    tombolForm.textContent = "Ubah";
    // isi form data sebelumnya
    inputJudul.value = idItem.querySelector(".infoItem .judul").textContent;
    inputDeskripsi.value = idItem.querySelector(
      ".infoItem .deskripsi"
    ).textContent;
    // #### end ####
  }

  // ubah item berdsarkan id
  if (e.target.textContent == "Ubah") {
    if (inputJudul.value && inputDeskripsi.value) {
      updateData({
        id: idAktif.id,
        judul: inputJudul.value,
        deskripsi: inputDeskripsi.value,
      });
      // updateDOM
      updateDOM();
      // bersihkan form
      formInput.reset();
    } else {
      alert("input ada yang kosong");
    }
  }

  // tombol untuk memunculkam form
  if (e.target.closest(".tombolTambahItem")) {
    let tombolIni = e.target.closest(".tombolTambahItem");
    // kembalika ke awan jika berubah text nya
    tombolForm.textContent = "Tambahkan";
    // ubah text contentnnya
    tombolIni.textContent =
      tombolIni.textContent == "Tambah" ? "Tutup" : "Tambah";
    if (tombolIni.textContent == "Tambah") {
      formInput.classList.add("d-none");
      formInput.reset();
    } else {
      formInput.classList.remove("d-none");
    }
    // end
  }

  if (e.target.closest("#tutupInfo")) {
    // hilangkan element
    document
      .querySelector(".tawarkanInstallApp")
      .classList.add("installAppHilang");
      // set data 
    storage({
      tipe: "set",
      key: "tutupInfo",
      value: true,
    });
  }
});

// tampilkan info  untuk install pwa
if (!storage({ tipe: "get", key: "tutupInfo" })) {
  setTimeout(function () {
    document
      .querySelector(".tawarkanInstallApp")
      .classList.remove("installAppHilang");
  }, 10000);
}
// hilangkan tawaran info pwa jika user telah klik tutup

// fungsi

// fungsi untuk set dan get localStorage
function storage({ tipe, key, value }) {
  if (tipe == "set") {
    localStorage.setItem(key, value);
  } else if (tipe == "get") {
    return localStorage.getItem(key);
  }
}

// ubah status pada item apakah sudah selesai atau belum
function ubahStatusItem(id) {
  dataItems = dataItems.map(item => {
    if (item.id == id) {
      return { ...item, status: !item.status };
    }
    return item;
  });
  storage({
    tipe: "set",
    key: "data",
    value: JSON.stringify(dataItems),
  });
}

// fungsi update data
function updateData({ id, judul, deskripsi }) {
  // loop tiap data untuk dicari mana yang sesuai dengan id
  dataItems = dataItems.map(item => {
    if (item.id == id) {
      return {
        ...item,
        judul: judul,
        deskripsi: deskripsi,
      };
    }
    return item;
  });
  storage({
    tipe: "set",
    key: "data",
    value: JSON.stringify(dataItems),
  });
}
// fungsi hapus data berdasarkan id
function hapusDataItem(id) {
  // filter item untuk mengecualikan id yang diberikan
  dataItems = dataItems.filter(item => item.id !== id);

  // updatedata yang baru
  storage({
    tipe: "set",
    key: "data",
    value: JSON.stringify(dataItems),
  });
}

// funsi updateDOM
function updateDOM() {
  console.log("update jalan");
  dataItems = JSON.parse(storage({ tipe: "get", key: "data" }));
  let kumpulanItems = dataItems
    .map(
      data => ` <div class="item ${data.status ? "sudahSelesai" : ""}" id="${
        data.id
      }"> 
      <section class="infoItem"> 
        <h3 class="judul">${data.judul}</h3>
        <pre class="deskripsi">${data.deskripsi}</pre> 
      </section> 
      <section class="aksiItem"> 
        <button class="tombolSelesai">${
          data.status ? "Urungkan" : "Selesai"
        }</button> 
        <button class="tombolEdit">Edit</button> 
        <button class="tombolHapus">Hapus</button> 
      </section> 
    </div> `
    )
    .join(" ");

  let boxItems = document.querySelector(".boxItems");
  kumpulanItems
    ? (boxItems.innerHTML = kumpulanItems)
    : (boxItems.innerHTML =
        '<div class="boxKosong">Masih Kosong <br> klik tambah...</div>');
}

// huhhh cape om
