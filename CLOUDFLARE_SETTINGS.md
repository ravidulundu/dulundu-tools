# Cloudflare Optimum Ayarları (Dulundu.tools)

Kendi sunucunuzu kullandığınız için Cloudflare panelinde yapmanız gereken en kritik ayarlar aşağıdadır. Bu ayarlar sitenizin hızını ve güvenliğini maksimize edecektir.

## 1. SSL/TLS
*   **Mod:** `Full (Strict)`
    *   *Neden?* Sunucunuzda (Nginx) SSL sertifikası olduğu için bu mod en güvenlisidir.
*   **Edge Certificates:**
    *   **Always Use HTTPS:** `On` (Açık)
    *   **HSTS:** `Enable` (Açık) -> Max Age: `12 months`, Include Subdomains: `On`, Preload: `Off`.
    *   **Minimum TLS Version:** `1.2`
    *   **TLS 1.3:** `On` (Açık)

## 2. Speed (Hız)
*   **Optimization > Auto Minify:**
    *   JavaScript: `On` (Açık)
    *   CSS: `On` (Açık)
    *   HTML: `On` (Açık)
    *   *Not:* Kodunuz zaten minify edilmiş olsa bile Cloudflare'in üzerinden geçmesi ekstra sıkıştırma sağlar.
*   **Optimization > Brotli:** `On` (Açık)
*   **Optimization > Early Hints:** `On` (Açık)
*   **Optimization > Rocket Loader:** `Off` (Kapalı)
    *   *Önemli:* React uygulamalarında Rocket Loader bazen hidrasyon (hydration) sorunlarına yol açabilir. Kapalı kalması daha güvenlidir.

## 3. Caching (Önbellekleme)
*   **Configuration > Caching Level:** `Standard`
*   **Configuration > Browser Cache TTL:** `1 Year`
    *   *Neden?* Nginx ayarlarımızda statik dosyalar için hash (örn: `index-XyZ.js`) kullandığımızdan, tarayıcı önbelleğini maksimuma çekmek güvenlidir.

## 4. Network (Ağ)
*   **HTTP/2:** `On` (Açık)
*   **HTTP/3 (QUIC):** `On` (Açık)
*   **0-RTT Connection Resumption:** `On` (Açık)

## 5. Scrape Shield
*   **Email Address Obfuscation:** `On` (Açık)
*   **Hotlink Protection:** `On` (Açık)

## 6. Page Rules (Sayfa Kuralları) - Opsiyonel ama Önerilir
Eğer API kullanmıyorsanız ve siteniz tamamen statik bir React uygulamasıysa, HTML dosyasını hariç tutup diğer her şeyi agresif bir şekilde önbellekleyebilirsiniz.

**Kural 1 (Statik Dosyalar):**
*   **URL:** `dulundu.tools/assets/*`
*   **Ayarlar:**
    *   Cache Level: `Cache Everything`
    *   Edge Cache TTL: `1 Month`

**Kural 2 (Anasayfa/HTML):**
*   **URL:** `dulundu.tools/*`
*   **Ayarlar:**
    *   Cache Level: `Standard` (Varsayılan)
    *   *Not:* HTML dosyasını "Cache Everything" yapmayın, yoksa yeni versiyonları kullanıcılar göremez.
