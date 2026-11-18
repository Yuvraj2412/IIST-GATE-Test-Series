export function signupOtp(otp) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>IGTS Dhanak 2027 · Verification OTP</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f1f5f9;padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:10px;overflow:hidden;border:1px solid #cbd5e1;">
          <tr>
            <td style="background-color:#0b1526;padding:24px 32px;text-align:center;">
              <p style="margin:0 0 6px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#cbd5e1;font-weight:700;">
                IIST · DHANAK 2027
              </p>
              <h1 style="margin:0;font-size:22px;line-height:1.3;color:#ffffff;font-weight:700;">
                IGTS GATE 2027 Test Series
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;text-align:center;">
              <h2 style="margin:0 0 12px;font-size:19px;color:#0f172a;">Verify Your Email Address</h2>
              <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#475569;">
                Use the one-time verification code below to finish creating your IGTS account. This OTP expires in <strong>10 minutes</strong>.
              </p>
              <div style="display:inline-block;padding:14px 32px;background-color:#f8fafc;border:1px solid #cbd5e1;border-radius:8px;margin-bottom:24px;">
                <span style="font-size:30px;font-weight:700;letter-spacing:8px;color:#0f4c81;font-family:monospace;">${otp}</span>
              </div>
              <p style="margin:0;font-size:13px;line-height:1.5;color:#64748b;">
                If you did not request this code, you can safely ignore this email.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#f8fafc;padding:18px 32px;text-align:center;border-top:1px solid #e2e8f0;">
              <p style="margin:0 0 6px;font-size:13px;color:#334155;">
                Need help? Contact us at
                <a href="mailto:dhanak2k25@gmail.com" style="color:#0f4c81;text-decoration:underline;">dhanak2k25@gmail.com</a>
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
