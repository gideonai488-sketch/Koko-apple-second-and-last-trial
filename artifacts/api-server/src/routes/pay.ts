import { Router } from "express";

const router = Router();

function esc(s: unknown): string {
  return String(s ?? "").replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] ?? c)
  );
}

router.get("/pay", (req, res) => {
  const { key, email, amount, ref, firstName, lastName, phone, scheme } = req.query as Record<string, string>;

  if (!key || !email || !amount || !ref) {
    res.status(400).send("Missing required payment parameters");
    return;
  }

  const safeScheme = esc(scheme || "firstkokospot");
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>1st Koko Spot — Secure Payment</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #FAF9F7;
      color: #1A1A1A;
    }
    #loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      gap: 20px;
      padding: 24px;
      text-align: center;
    }
    .logo {
      width: 72px; height: 72px;
      background: #FF5C35; border-radius: 20px;
      display: flex; align-items: center; justify-content: center;
      font-size: 28px; font-weight: 800; color: #fff;
      margin-bottom: 4px;
    }
    h1 { font-size: 22px; font-weight: 700; color: #1A1A1A; }
    p  { font-size: 15px; color: #9C9A96; line-height: 1.5; max-width: 300px; }
    .spinner {
      width: 44px; height: 44px;
      border: 3px solid #F0EDE8;
      border-top-color: #FF5C35;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    #error-box {
      display: none;
      background: #FFF0ED; border: 1px solid #FF5C35;
      border-radius: 12px; padding: 16px;
      color: #FF5C35; font-size: 14px;
      max-width: 320px; margin: 0 auto;
    }
  </style>
</head>
<body>
  <div id="loading">
    <div class="logo">KS</div>
    <h1>1st Koko Spot</h1>
    <div class="spinner"></div>
    <p>Opening secure payment…</p>
    <div id="error-box"></div>
  </div>

  <script src="https://js.paystack.co/v1/inline.js"></script>
  <script>
    window.onload = function () {
      try {
        var handler = PaystackPop.setup({
          key:       '${esc(key)}',
          email:     '${esc(email)}',
          amount:    ${Number(amount) || 0},
          currency:  'GHS',
          ref:       '${esc(ref)}',
          firstname: '${esc(firstName)}',
          lastname:  '${esc(lastName)}',
          phone:     '${esc(phone)}',
          callback: function (response) {
            window.location.href = '${safeScheme}://payment-success?ref=' + encodeURIComponent(response.reference || '${esc(ref)}');
          },
          onClose: function () {
            window.location.href = '${safeScheme}://payment-cancel';
          }
        });
        handler.openIframe();
        document.querySelector('.spinner').style.display = 'none';
        document.querySelector('p').textContent = 'Complete your payment in the popup above.';
      } catch (e) {
        var box = document.getElementById('error-box');
        box.style.display = 'block';
        box.textContent = 'Could not load payment: ' + e.message;
      }
    };
  </script>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(html);
});

export default router;
