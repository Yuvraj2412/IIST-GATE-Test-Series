export function signupOtp(otp) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>IGTS Dhanak 2027 · Verification OTP</title>
</head>
<body style="margin:0;padding:0;background-color:#0b1020;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#0b1020;padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #1e293b;">
          <tr>
            <td style="background:linear-gradient(135deg,#070b18 0%,#1a1040 65%,#4338ca 100%);padding:28px 32px;text-align:center;">
              <p style="margin:0 0 6px;font-size:12px;letter-spacing:2.5px;text-transform:uppercase;color:#fbbf24;font-weight:700;">
                IIST · DHANAK 2027
              </p>
              <h1 style="margin:0;font-size:24px;line-height:1.3;color:#ffffff;font-weight:700;">
                IGTS GATE 2027 Test Series
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 32px;text-align:center;">
              <h2 style="margin:0 0 12px;font-size:20px;color:#0f172a;">Verify Your Email Address</h2>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#475569;">
                Use the one-time verification code below to finish creating your IGTS · Dhanak 2027 account. This OTP expires in <strong>10 minutes</strong>.
              </p>
              <div style="display:inline-block;padding:16px 36px;background-color:#f8fafc;border:2px dashed #674cee;border-radius:12px;margin-bottom:24px;">
                <span style="font-size:32px;font-weight:800;letter-spacing:10px;color:#4f46e5;">${otp}</span>
              </div>
              <p style="margin:0;font-size:13px;line-height:1.5;color:#64748b;">
                If you did not request this code, you can safely ignore this email.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#f8fafc;padding:20px 32px;text-align:center;border-top:1px solid #e2e8f0;">
              <p style="margin:0 0 6px;font-size:13px;color:#334155;">
                Need help? Contact us at
                <a href="mailto:dhanak2k25@gmail.com" style="color:#4f46e5;text-decoration:underline;">dhanak2k25@gmail.com</a>
              </p>
              <p style="margin:0;font-size:12px;color:#64748b;">
                © 2027 Dhanak · Indian Institute of Space Science and Technology (IIST), Thiruvananthapuram
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
