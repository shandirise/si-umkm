# syntax=docker/dockerfile:1

# === Tahap 1: Build tahap dependensi ===
FROM node:20-alpine AS deps
# Set working directory di dalam container
WORKDIR /app
# Salin package.json dan package-lock.json (atau yarn.lock / pnpm-lock.yaml)
COPY package.json package-lock.json ./
# Instal dependensi produksi (tanpa devDependencies)
RUN npm install --omit=dev

# === Tahap 2: Build tahap development (untuk kompilasi) ===
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
# Salin seluruh kode aplikasi
COPY . .
# Kompilasi aplikasi Next.js untuk produksi
# NEXT_TELEMETRY_DISABLED=1 mencegah pengiriman data telemetri ke Vercel saat build
# npm run build akan menghasilkan output di folder .next/
RUN NEXT_TELEMETRY_DISABLED=1 npm run build

# === Tahap 3: Final tahap produksi ===
FROM node:20-alpine AS runner
WORKDIR /app

# Nonaktifkan telemetri Next.js di runtime juga
ENV NEXT_TELEMETRY_DISABLED 1

# Tambahkan user 'nextjs' untuk menjalankan aplikasi dengan hak akses non-root
# Ini adalah praktik keamanan yang baik
RUN addgroup --system --gid 1001 nextjs
RUN adduser --system --uid 1001 nextjs

# Salin folder .next/standalone yang berisi server dan dependensi
# Ini adalah fitur Next.js yang membuat aplikasi dapat berjalan secara mandiri
COPY --from=builder /app/.next/standalone ./
# Salin folder public
COPY --from=builder /app/public ./public
# Salin .next/static untuk aset statis
COPY --from=builder /app/.next/static ./.next/static

# Jika Anda menggunakan `db.json` sebagai database, Anda perlu menyalinnya.
# INGAT: Ini TIDAK akan membuat data persisten. Data akan hilang saat kontainer di-restart.
# Untuk data persisten, Anda HARUS beralih ke database eksternal.
COPY --from=builder /app/src/lib/db.json ./src/lib/db.json


# Set hak akses yang sesuai
RUN chown -R nextjs:nextjs .next
USER nextjs

EXPOSE 3000

# Jalankan aplikasi Next.js dalam mode produksi
CMD ["node", "server.js"]