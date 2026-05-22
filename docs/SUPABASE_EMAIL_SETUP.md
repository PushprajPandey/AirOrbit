# Supabase email setup for AirOrbit (step by step)

## 1. Open the correct project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Open your **FBA** project (`xqkefyodckoxszqmlpnp`)

## 2. Enable Email auth provider

1. Left sidebar → **Authentication** → **Sign In / Providers**
2. Under **Email**, turn **Enable Email provider** ON
3. Choose one:
   - **Confirm email** ON — users must click a link before first sign-in (recommended for production)
   - **Confirm email** OFF — instant sign-in after signup (easier for demos)

## 3. Set site URL and redirects

1. **Authentication** → **URL Configuration**
2. **Site URL:** your production URL, e.g. `https://your-app.vercel.app`
3. **Redirect URLs** — add all of these (one per line):
   - `http://localhost:3000/auth/callback`
   - `https://your-app.vercel.app/auth/callback`
4. Save

## 4. Customize email templates (optional but recommended)

1. **Authentication** → **Emails** → tab **Templates**
2. Edit each template and brand for **AirOrbit**:

| Template | When it sends |
|----------|----------------|
| **Confirm sign up** | After registration (if confirm email is ON) |
| **Magic link** | Passwordless sign-in link |
| **Reset password** | Forgot password flow |
| **Change email address** | User changes email |

3. In each template you can change:
   - Subject line, e.g. `Confirm your AirOrbit account`
   - Body HTML — add your tagline: *Your journey, our mission*

## 5. Custom SMTP (required for production)

Supabase’s built-in email has **low rate limits**. For real users:

1. **Authentication** → **Emails** → tab **SMTP Settings**
2. Turn **Enable custom SMTP** ON
3. Pick a provider and create credentials:

### Option A — Resend (simple)

1. Sign up at [resend.com](https://resend.com)
2. Verify your domain (or use their test domain for dev)
3. Create an API key
4. In Supabase SMTP:
   - **Host:** `smtp.resend.com`
   - **Port:** `465` (SSL) or `587` (TLS)
   - **Username:** `resend`
   - **Password:** your Resend API key
   - **Sender email:** `noreply@yourdomain.com`
   - **Sender name:** `AirOrbit`

### Option B — SendGrid / Gmail / AWS SES

Use the host, port, username, and password from your provider’s SMTP docs.

5. Click **Save** — Supabase sends a test email if configured correctly

## 6. Test the flow in AirOrbit

1. Run the app: `npm run dev`
2. Open `/auth/signup` — register with a real inbox you control
3. Check email for **Confirm sign up** (if enabled)
4. Open `/auth/login` — test sign-in and **magic link** if enabled in UI

## 7. Vercel environment variables

In Vercel → Project → **Settings** → **Environment Variables**, set:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL` = `https://your-app.vercel.app`
- `SUPABASE_SERVICE_ROLE_KEY` (server only — never expose to browser)

Redeploy after changing env vars.

## Troubleshooting

| Problem | Fix |
|---------|-----|
| No email received | Check spam; use custom SMTP; confirm template is enabled |
| Redirect error after click | Add exact callback URL in **URL Configuration** |
| “Invalid login credentials” | Confirm email first, or disable confirm in Providers |
| Rate limit | Enable custom SMTP |
