/** Normalize usernames so sign-up and sign-in use the same account id. */
export function normalizeUsername(raw: string): string {
  return raw.trim().toLowerCase();
}

const USERNAME_PATTERN = /^[a-z0-9_]{3,20}$/;

export function isValidUsername(username: string): boolean {
  return USERNAME_PATTERN.test(username);
}

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const apiUrl = process.env.BREVO_API_URL!
  const apiKey = process.env.BREVO_API_KEY!

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      sender: {
        name: "ASys",
        email: "noreply@asys.com",
      },
      to: [
        {
          email: to,
        },
      ],
      subject,
      htmlContent: html,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("Brevo error:", data);
    throw new Error("Email sending failed");
  }

  return data;
}
