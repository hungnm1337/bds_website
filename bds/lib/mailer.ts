import nodemailer from 'nodemailer'

interface NotifyNewFormOptions {
  fullName: string
  phoneNumber: string
  message?: string | null
}

export async function sendNewFormNotification({ fullName, phoneNumber, message }: NotifyNewFormOptions) {
  const to = process.env.NOTIFY_EMAIL || process.env.GMAIL_USER

  if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS || !to) {
    console.warn('[mailer] Thiếu GMAIL_USER / GMAIL_PASS – bỏ qua gửi email.')
    return
  }

  const now = new Date().toLocaleString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const html = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f4f6fb; margin: 0; padding: 0; }
    .wrapper { max-width: 520px; margin: 32px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #0F4C81, #1e6fb5); padding: 28px 32px; text-align: center; }
    .header h1 { margin: 0; color: #fff; font-size: 20px; font-weight: 700; }
    .header p { margin: 6px 0 0; color: #93c5fd; font-size: 13px; }
    .badge { display: inline-block; background: #ef4444; color: #fff; font-size: 11px; font-weight: 700; border-radius: 20px; padding: 3px 10px; margin-top: 10px; letter-spacing: 0.5px; }
    .body { padding: 28px 32px; }
    .row { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 18px; }
    .icon-wrap { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 18px; }
    .icon-blue { background: #EFF6FF; }
    .icon-green { background: #ECFDF5; }
    .icon-orange { background: #FFF7ED; }
    .label { font-size: 11px; color: #9ca3af; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; }
    .value { font-size: 15px; color: #111827; font-weight: 600; }
    .phone-link { color: #0F4C81; text-decoration: none; font-size: 17px; font-weight: 700; }
    .message-box { background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 10px; padding: 14px 16px; color: #374151; font-size: 14px; line-height: 1.6; margin-top: 4px; white-space: pre-wrap; }
    .footer { background: #f8fafc; border-top: 1px solid #f1f5f9; padding: 16px 32px; text-align: center; color: #9ca3af; font-size: 12px; }
    .cta { display: inline-block; margin-top: 20px; padding: 12px 28px; background: linear-gradient(135deg, #0F4C81, #1e6fb5); color: #fff; border-radius: 10px; font-weight: 700; font-size: 14px; text-decoration: none; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>🔔 Form liên hệ mới</h1>
      <p>Đại Đô CĐT – Bất động sản cao cấp</p>
      <span class="badge">Chưa đọc</span>
    </div>

    <div class="body">
      <!-- Tên -->
      <div class="row">
        <div class="icon-wrap icon-blue">👤</div>
        <div>
          <div class="label">Họ và tên</div>
          <div class="value">${fullName}</div>
        </div>
      </div>

      <!-- Điện thoại -->
      <div class="row">
        <div class="icon-wrap icon-green">📞</div>
        <div>
          <div class="label">Số điện thoại</div>
          <div class="value">
            <a href="tel:${phoneNumber}" class="phone-link">${phoneNumber}</a>
          </div>
        </div>
      </div>

      <!-- Nội dung -->
      <div class="row">
        <div class="icon-wrap icon-orange">💬</div>
        <div style="flex:1">
          <div class="label">Nội dung</div>
          <div class="message-box">${message || '<em style="color:#9ca3af">Không có nội dung</em>'}</div>
        </div>
      </div>

      <!-- Thời gian -->
      <div class="row" style="margin-bottom:0">
        <div class="icon-wrap" style="background:#F5F3FF">🕐</div>
        <div>
          <div class="label">Thời gian gửi</div>
          <div class="value" style="font-weight:500;color:#6b7280">${now}</div>
        </div>
      </div>

      <div style="text-align:center">
        <a href="https://www.daidocdt.com/admin/forms" class="cta" style="color: #ffffff;">Xem trong Admin →</a>
      </div>
    </div>

    <div class="footer">
      Email này được gửi tự động bởi hệ thống Đại Đô CĐT.<br/>
      Vui lòng không trả lời email này.
    </div>
  </div>
</body>
</html>
`

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS?.replace(/\s/g, ''), // Xóa dấu cách nếu có
    },
  })

  await transporter.sendMail({
    from: `"Đại Đô CĐT" <${process.env.GMAIL_USER}>`,
    to,
    subject: `[Form mới] ${fullName} – ${phoneNumber}`,
    html,
  })
}
