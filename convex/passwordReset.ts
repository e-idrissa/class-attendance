import { Resend } from "resend";

const resend = new Resend(process.env.AUTH_RESEND_KEY!);

export const PasswordReset = {
  id: "password-reset",
  type: "email" as const,
  name: "Password Reset",

  async sendVerificationRequest({
    identifier: email,
    token,
  }: {
    identifier: string;
    token: string;
    expires: Date;
  }) {
    const logoUrl = "";
    const resetUrl = `${process.env.APP_URL}/reset-password?token=${token}&email=${email}`;

    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM ?? "ASys <onboarding@resend.dev>",
      to: email,
      subject: "Reset your password",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset your Password</title>
          </head>
          <body style="margin: 0; padding: 32px; background-color: ##ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
            
            <div style="padding: 24px; margin: 12px 0px; border: 1px solid #e2e8f0; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
              
              <!-- ENTÊTE -->
              <div style="margin-bottom: 30px; border-bottom: 1px solid #e2e8f0; padding-bottom: 16px;">
                <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                  <tr>
                    <td style="vertical-align: middle; width: 48px;">
                      ${
                        logoUrl
                          ? `
                        <img 
                          src="${logoUrl}" 
                          alt="logo" 
                          width="40" 
                          height="40" 
                          style="border-radius: 6px; display: block; object-fit: cover;"
                        />
                      `
                          : `
                        <div style="width: 40px; height: 40px; background-color: #2563eb; border-radius: 6px;"></div>
                      `
                      }
                    </td>
                    <td style="vertical-align: middle; padding-left: 8px;">
                      <h1 style="margin: 0; font-size: 30px; font-weight: 700; color: #0f172a; line-height: 1;">
                        A<span style="color: #1d4ed8;">S</span>ys
                      </h1>
                    </td>
                  </tr>
                </table>
                <div style="margin-top: 8px; font-size: 15px; color: #64748b;">
                  Teaching Management Platform
                </div>
              </div>

              <!-- CONTENU PRINCIPAL -->
              <div style="margin-bottom: 40px;">
                <h2 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 600; color: #1e293b;">
                  Reset your Password
                </h2>
                <p style="margin: 0 0 16px 0; font-size: 15px; color: #475569; line-height: 24px;">
                  We received a request for your password modification. Use the code below to set a new password:
                </p>
                
                <!-- BLOC CODE DE SÉCURITÉ -->
                <p style="margin: 0 0 24px 0;">
                  <code style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 15px; font-weight: 600; color: #1d4ed8; letter-spacing: 1px;">
                    ${token}
                  </code>
                </p>
                
                <p style="margin: 0; font-size: 15px; color: #475569; line-height: 24px;">
                  If this request does not come from you, safely ignore this email.
                </p>
              </div>

              <!-- PIED DE PAGE -->
              <div style="color: #0f172a;">
                <p style="margin: 0 0 20px 0; font-style: italic; font-weight: 600; font-size: 15px;">
                  Development Team
                </p>
                <p style="margin: 0; font-size: 14px; color: #64748b;">
                  Copyright © 2026 Idrissa
                </p>
              </div>

            </div>

          </body>
        </html>
      `,
    });

    if (error) {
      console.error("RESEND ERROR:", error);
      throw new Error(error.message);
    }
  },
};
