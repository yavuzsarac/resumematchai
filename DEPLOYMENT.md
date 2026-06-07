# Canliya Alma Rehberi

Bu proje icin en kolay kurulum, Railway uzerinde uc servis kullanmaktir:

- `frontend`: Next.js
- `backend`: FastAPI
- `Postgres`: kullanicilar ve analiz gecmisi

Railway'in ucretsiz plani deneme ve kucuk testler icin uygundur. Ozel alan adi
ve daha guvenilir bir canli ortam icin Hobby plani kullanilabilir. Haziran 2026
itibariyla Hobby plani aylik en az 5 USD'dir ve ilk 5 USD kaynak kullanimi bu
tutara dahildir.

## 1. Projeyi GitHub'a yukleyin

GitHub'da bos bir depo olusturun ve proje klasorunun tamamini bu depoya
gonderin. `.env` dosyalarini depoya eklemeyin. Yalnizca `.env.example`
dosyalari GitHub'da bulunmalidir.

## 2. Railway projesini olusturun

1. Railway'de `New Project > Empty Project` secenegini acin.
2. Projeye `Postgres` adinda bir PostgreSQL servisi ekleyin.
3. `frontend` ve `backend` adinda iki bos servis ekleyin.

## 3. Backend servisini kurun

`backend` servisinin ayarlarinda GitHub deponuzu baglayin.

- Root Directory: `/backend`
- Healthcheck Path: `/health`

Variables bolumune su degerleri ekleyin:

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET_KEY=GUCLU_VE_UZUN_RASTGELE_BIR_DEGER
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
APP_ENV=production
CORS_ORIGINS=https://${{frontend.RAILWAY_PUBLIC_DOMAIN}}
OPENAI_API_KEY=
ENABLE_EMBEDDING_MODEL=false
```

`JWT_SECRET_KEY` icin en az 32 karakterlik rastgele bir deger kullanin.
OpenAI analizi kullanilacaksa `OPENAI_API_KEY` doldurulmalidir. Bos birakilirsa
uygulama yerel analiz motoruyla calisir.

Backend servisine Railway uzerinden bir public domain olusturun. Ornek:

```text
https://backend-production.up.railway.app
```

## 4. Frontend servisini kurun

`frontend` servisinin ayarlarinda ayni GitHub deponuzu baglayin.

- Root Directory: `/frontend`

Variables bolumune backend adresini ekleyin:

```env
NEXT_PUBLIC_API_URL=https://${{backend.RAILWAY_PUBLIC_DOMAIN}}
```

Iki servise de `Settings > Networking > Generate Domain` ile public domain
olusturun ve yeniden dagitin. Bu referanslar servis adreslerini otomatik olarak
birbirine baglar.

## 5. Alan adi baglayin

Railway'de ilgili servisin `Settings > Networking > Custom Domain` bolumunden:

- Ana alan adini frontend'e baglayin: `uygulamaniz.com`
- Isterseniz backend'i alt alan adina baglayin: `api.uygulamaniz.com`

DNS kayitlarini Railway'in gosterdigi sekilde alan adi saglayicinizda ekleyin.
HTTPS sertifikasi Railway tarafindan otomatik olusturulur.

Alan adlari aktif olduktan sonra:

```env
# frontend
NEXT_PUBLIC_API_URL=https://api.uygulamaniz.com

# backend
CORS_ORIGINS=https://uygulamaniz.com,https://www.uygulamaniz.com
```

degerlerini kullanip iki servisi yeniden dagitin.

## 6. Yayin sonrasi kontrol

Su islemleri gercek bir kullanici gibi deneyin:

1. Yeni hesap olusturma
2. Giris yapma
3. Analiz baslatma
4. Analiz gecmisini goruntuleme
5. Cikis yapip tekrar girme

Backend saglik kontrolu:

```text
https://api.uygulamaniz.com/health
```

Yanitta `status: ok` gorulmesi hem API'nin hem de veritabani baglantisinin
calistigini gosterir.

## Uretim notlari

- Railway PostgreSQL yedeklerini etkinlestirin.
- `.env` ve gizli anahtarlari GitHub'a yuklemeyin.
- Ilk yayin oncesi benzersiz bir `JWT_SECRET_KEY` olusturun.
- Sonraki veritabani sema degisiklikleri icin Alembic migration sistemi ekleyin.
- Kullanici sayisi arttiginda hata izleme ve log takibi ekleyin.
