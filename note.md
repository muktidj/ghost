## Prisma Migrasi 

1. Pastikan file skema Prisma Anda (biasanya prisma/schema.prisma) sudah benar. Anda bisa memeriksa validitasnya dengan perintah:

> npx prisma validate

Jika tidak ada error, lanjut ke langkah berikutnya.

2. Gunakan perintah berikut untuk membuat dan menjalankan migrasi:

> npx prisma migrate dev --name add_products_table

add_products_table adalah nama migrasi. Anda bisa menggantinya dengan nama yang relevan.
Perintah ini akan:
Membuat file migrasi di folder prisma/migrations.
Menjalankan migrasi di database yang dikonfigurasi pada DATABASE_URL.

3. Setelah migrasi selesai, Anda bisa memeriksa status migrasi dengan:

> npx prisma migrate status

Ini akan menunjukkan apakah migrasi sudah berhasil diterapkan atau masih ada migrasi yang belum dijalankan.

4. Setelah migrasi, jangan lupa untuk memperbarui Prisma Client agar perubahan pada skema tercermin dalam kode Anda:

> npx prisma generate
