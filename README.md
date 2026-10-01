# REQUIREMENT & ALUR APLIKASI KANTEK

## 1. Gambaran Umum

**Kantek (Kantin Teknik)** adalah aplikasi mobile untuk memudahkan mahasiswa/dosen melakukan pemesanan makanan dari warung-warung yang ada di Kantin Teknik.

Pengguna melakukan **scan QR yang tersedia di meja**, kemudian sistem otomatis mengetahui nomor meja pengguna. Pengguna dapat memilih warung, memilih menu, memasukkan beberapa menu dari warung yang berbeda ke dalam satu keranjang, kemudian melakukan checkout dan pembayaran secara online menggunakan QRIS.

Setelah makanan diantarkan ke meja, customer dapat melakukan **konfirmasi bahwa pesanan sudah diterima**. Konfirmasi dilakukan **per item/pesanan**, bukan berdasarkan satu checkout secara keseluruhan.

Terdapat 2 jenis pengguna utama:

1. **Mahasiswa/Dosen (Customer)**
2. **Owner/Pemilik Warung**

---

# 2. Role Pengguna

## A. Mahasiswa / Dosen

Mahasiswa dan dosen memiliki fungsi yang sama sebagai customer.

### Fitur utama

- Login/Register
- Scan QR meja
- Melihat nomor meja
- Melihat daftar warung
- Melihat menu warung
- Memilih menu
- Menambahkan menu ke keranjang
- Memesan dari beberapa warung sekaligus
- Checkout
- Melakukan pembayaran QRIS
- Melihat detail pesanan
- Mengonfirmasi pesanan telah diterima

### Konfirmasi Pesanan

Setelah makanan sampai di meja, customer dapat menekan tombol:

> **Pesanan Diterima**

Konfirmasi dilakukan **per item/pesanan**.

Contoh:

```text
Pesanan #105

Warung Bu Ani

✓ Nasi Goreng × 1
  Pesanan Diterima

[Es Teh × 1]
  [Pesanan Diterima]
```

Jika makanan dari warung lain belum datang, item tersebut tetap belum dikonfirmasi.

---

## B. Owner Warung

Owner memiliki akun khusus dengan username dan password.

Fitur utama owner hanya terdiri dari:

### 1. Dashboard Pesanan

Owner dapat melihat pesanan yang masuk ke warungnya.

Informasi yang ditampilkan:

- Nomor pesanan
- Nomor meja
- Daftar makanan/minuman
- Jumlah setiap menu
- Catatan pesanan jika ada
- Total harga
- Waktu pesanan

**Owner tidak perlu mengubah status pesanan.**

Owner cukup melihat pesanan yang masuk, kemudian menyiapkan dan mengantarkan makanan ke meja customer.

### 2. Kelola Menu

Owner dapat melakukan:

- Melihat daftar menu
- Menambahkan menu
- Mengedit menu
- Menghapus menu

Data menu:

- Nama menu
- Gambar menu
- Harga menu

---

# 3. Alur Customer

## Step 1 — Scan QR Meja

Customer datang ke Kantin Teknik dan memilih meja.

Customer melakukan scan QR yang terdapat pada meja.

```text
Scan QR Meja
      ↓
Sistem membaca ID meja
      ↓
Nomor meja tersimpan
```

Contoh:

> Meja 07

Nomor meja tersebut akan digunakan pada pesanan.

---

## Step 2 — Login

Customer login sebagai:

- Mahasiswa
- Dosen

Jika belum memiliki akun, customer dapat melakukan registrasi.

Setelah login, customer masuk ke halaman utama.

---

## Step 3 — Dashboard Customer

Dashboard menampilkan:

- Nomor meja
- Daftar warung
- Keranjang
- Pesanan aktif

Contoh:

```text
Selamat datang!

Meja Anda
Meja 07

Pilih Warung:

[ Warung Bu Ani ]
[ Warung Pak Budi ]
[ Warung Nasi Goreng ]
[ Warung Mie Ayam ]

Pesanan Aktif: 2
```

---

# 4. Memilih Warung

Customer memilih salah satu warung.

Contoh:

> Warung Bu Ani

Kemudian sistem menampilkan menu yang tersedia.

```text
Warung Bu Ani

Nasi Goreng
Rp15.000

Ayam Geprek
Rp17.000

Es Teh
Rp5.000
```

Customer dapat memilih menu dan menentukan jumlahnya.

---

# 5. Menambahkan ke Keranjang

Customer menambahkan menu ke keranjang.

Contoh:

```text
Keranjang

Warung Bu Ani
- Nasi Goreng × 1
- Es Teh × 1

Subtotal: Rp20.000
```

Customer **tidak langsung checkout**.

Customer masih dapat kembali ke daftar warung dan memilih makanan dari warung lain.

---

# 6. Memesan dari Warung Lain

Contoh customer kemudian memilih:

> Warung Pak Budi

Lalu memilih:

```text
Ayam Geprek × 1
Jus Alpukat × 1
```

Keranjang akhirnya menjadi:

```text
KERANJANG

Warung Bu Ani
- Nasi Goreng × 1
- Es Teh × 1
Subtotal: Rp20.000

Warung Pak Budi
- Ayam Geprek × 1
- Jus Alpukat × 1
Subtotal: Rp24.000

TOTAL: Rp44.000

[Checkout]
```

Jadi **satu keranjang dapat berisi pesanan dari beberapa warung.**

---

# 7. Checkout

Customer melakukan checkout.

Sistem menampilkan:

- Nomor meja
- Daftar pesanan
- Warung
- Jumlah item
- Subtotal setiap warung
- Total pembayaran

Contoh:

```text
Checkout

Meja: 07

Warung Bu Ani
Nasi Goreng × 1     Rp15.000
Es Teh × 1           Rp5.000

Warung Pak Budi
Ayam Geprek × 1     Rp17.000
Jus Alpukat × 1      Rp7.000

---------------------------
Total                 Rp44.000

[Bayar Sekarang]
```

---

# 8. Pembayaran QRIS

Customer memilih pembayaran QRIS.

Sistem menampilkan QRIS untuk pembayaran.

```text
Total Pembayaran

Rp44.000

      [ QRIS ]

Scan QR untuk membayar

[Sudah Bayar]
```

Setelah pembayaran berhasil, sistem mencatat transaksi.

Pesanan kemudian diteruskan kepada masing-masing owner berdasarkan warung.

---

# 9. Pesanan Masuk ke Owner

Setelah pembayaran berhasil, sistem membagi informasi pesanan berdasarkan warung.

Misalnya customer membeli:

```text
Warung Bu Ani
- Nasi Goreng
- Es Teh

Warung Pak Budi
- Ayam Geprek
- Jus Alpukat
```

Owner Warung Bu Ani hanya menerima:

```text
Pesanan #105
Meja 07

Nasi Goreng × 1
Es Teh × 1

Total Rp20.000
```

Owner Warung Pak Budi menerima:

```text
Pesanan #105
Meja 07

Ayam Geprek × 1
Jus Alpukat × 1

Total Rp24.000
```

Dengan demikian, setiap owner hanya melihat pesanan yang berasal dari warungnya.

Owner kemudian menyiapkan dan mengantarkan makanan ke nomor meja yang tertera.

**Owner tidak perlu mengubah status pesanan.**

---

# 10. Konfirmasi Pesanan Diterima oleh Customer

Setelah makanan sampai di meja, customer membuka detail pesanan.

Setiap item memiliki tombol **Pesanan Diterima**.

Contoh:

```text
Pesanan #105
Meja 07

Warung Bu Ani

Nasi Goreng × 1
[Pesanan Diterima]

Es Teh × 1
[Pesanan Diterima]

--------------------

Warung Pak Budi

Ayam Geprek × 1
[Pesanan Diterima]

Jus Alpukat × 1
[Pesanan Diterima]
```

Customer dapat mengonfirmasi setiap item secara terpisah.

Contoh kondisi:

```text
Warung Bu Ani
✓ Nasi Goreng — Diterima
✓ Es Teh — Diterima

Warung Pak Budi
✓ Ayam Geprek — Diterima
[ Jus Alpukat — Pesanan Diterima ]
```

Artinya makanan dari Warung Bu Ani sudah diterima seluruhnya, Ayam Geprek dari Warung Pak Budi sudah diterima, tetapi Jus Alpukat belum diterima.

### Aturan penting

Status **Pesanan Diterima** berlaku pada level **item pesanan**, bukan level checkout.

```text
1 Checkout
│
├── Warung A
│   ├── Nasi Goreng → Diterima ✓
│   └── Es Teh → Diterima ✓
│
└── Warung B
    ├── Ayam Geprek → Diterima ✓
    └── Jus Alpukat → Belum Diterima
```

Dengan begitu, setiap makanan dapat dikonfirmasi secara independen.

---

# 11. Alur Owner

## Login Owner

Owner masuk menggunakan:

```text
Username
Password
```

Kemudian masuk ke dashboard owner.

---

## Dashboard Owner

Dashboard langsung menampilkan daftar pesanan yang masuk.

Contoh:

```text
PESANAN MASUK

#105
Meja 07

Nasi Goreng × 1
Es Teh × 1

Rp20.000
12:35

-----------------

#104
Meja 03

Ayam Geprek × 2

Rp34.000
12:28
```

Owner cukup melihat informasi tersebut dan menyiapkan/mengantarkan makanan.

**Tidak terdapat fitur perubahan status pesanan oleh owner.**

---

# 12. Kelola Menu Owner

Owner dapat masuk ke halaman **Kelola Menu**.

### Tambah Menu

Data yang dimasukkan:

```text
Nama Menu
Gambar
Harga
```

### Edit Menu

Owner dapat mengubah:

- Nama
- Gambar
- Harga

### Hapus Menu

Owner dapat menghapus menu yang sudah tidak dijual.

---

# 13. Struktur Navigasi

## Customer

```text
Login
  ↓
Dashboard
  ├── Scan / Nomor Meja
  ├── Daftar Warung
  │      ↓
  │   Detail Warung
  │      ↓
  │   Detail Menu
  │      ↓
  ├── Keranjang
  │      ↓
  │   Checkout
  │      ↓
  │    QRIS
  │      ↓
  │  Pembayaran
  │      ↓
  └── Detail Pesanan
          ↓
   Konfirmasi Pesanan
       per Item
```

## Owner

```text
Login
  ↓
Dashboard
  ├── Pesanan Masuk
  │
  └── Kelola Menu
        ├── Tambah
        ├── Edit
        └── Hapus
```

---

# 14. Ringkasan Fitur

| Fitur                       | Mahasiswa/Dosen |     Owner     |
| --------------------------- | :-------------: | :-----------: |
| Login                       |        ✓        |       ✓       |
| Registrasi                  |        ✓        |       -       |
| Scan QR Meja                |        ✓        |       -       |
| Mengetahui Nomor Meja       |        ✓        |       ✓       |
| Melihat Warung              |        ✓        |       -       |
| Melihat Menu                |        ✓        |       ✓       |
| Pilih Menu                  |        ✓        |       -       |
| Keranjang                   |        ✓        |       -       |
| Pesanan Multi-Warung        |        ✓        |       -       |
| Checkout                    |        ✓        |       -       |
| Pembayaran QRIS             |        ✓        |       -       |
| Melihat Pesanan Masuk       |        -        |       ✓       |
| Konfirmasi Pesanan Diterima |        ✓        |       -       |
| Konfirmasi per Item         |        ✓        |       -       |
| Tambah Menu                 |        -        |       ✓       |
| Edit Menu                   |        -        |       ✓       |
| Hapus Menu                  |        -        |       ✓       |
| Mengubah Status Pesanan     |        -        | **Tidak ada** |

---

# 15. Konsep Inti Sistem

### Customer

> **Scan meja → pilih warung → pilih menu → masukkan keranjang → bisa memilih warung lain → checkout → bayar QRIS → makanan diantar → konfirmasi pesanan diterima per item.**

### Owner

> **Login → melihat pesanan + nomor meja → menyiapkan makanan → mengantarkan ke meja → mengelola menu.**

Satu checkout customer dapat berisi menu dari **beberapa warung**, tetapi masing-masing owner hanya menerima bagian pesanan yang berasal dari warungnya sendiri.

Konfirmasi penerimaan makanan dilakukan oleh **customer**, bukan owner.

Konfirmasi juga dilakukan **per item pesanan**, sehingga pesanan dari beberapa warung dapat memiliki waktu penerimaan yang berbeda.
