export const registrationEmail = (name, pid, test, packName, amount, email) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>IGTS Dhanak 2027 · Registration Confirmed</title>
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
                Registration Successful!
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:#334155;">
                Hello <strong>${name}</strong>, your enrollment for the <strong>IGTS GATE 2027 Mock Test Series</strong> has been confirmed.
              </p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px 20px;margin-bottom:24px;">
                <tr>
                  <td style="padding:6px 0;font-size:14px;color:#475569;"><strong>Participant:</strong></td>
                  <td style="padding:6px 0;font-size:14px;color:#0f172a;text-align:right;">${name}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:14px;color:#475569;"><strong>Email:</strong></td>
                  <td style="padding:6px 0;font-size:14px;color:#0f172a;text-align:right;">${email}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:14px;color:#475569;"><strong>Branch / Stream:</strong></td>
                  <td style="padding:6px 0;font-size:14px;color:#0f172a;text-align:right;">${test}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:14px;color:#475569;"><strong>Package:</strong></td>
                  <td style="padding:6px 0;font-size:14px;color:#0f172a;text-align:right;">${packName}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:14px;color:#475569;"><strong>Amount Paid:</strong></td>
                  <td style="padding:6px 0;font-size:14px;color:#15803d;font-weight:700;text-align:right;">₹ ${amount}/-</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:14px;color:#475569;"><strong>Payment ID:</strong></td>
                  <td style="padding:6px 0;font-size:13px;color:#0f172a;font-family:monospace;text-align:right;">${pid}</td>
                </tr>
              </table>
              <p style="margin:0;font-size:14px;line-height:1.6;color:#475569;text-align:center;">
                Visit your Dashboard &rarr; <strong>Your Tests</strong> on a laptop or tablet before your scheduled test window.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#f8fafc;padding:20px 32px;text-align:center;border-top:1px solid #e2e8f0;">
              <p style="margin:0 0 6px;font-size:13px;color:#334155;">
                Questions? Reach us at
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
};
