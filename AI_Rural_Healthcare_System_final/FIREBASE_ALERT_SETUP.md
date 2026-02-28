# Firebase Gmail + PDF Sharing Setup

## 1) Get Firebase web keys (for frontend)
1. Open Firebase Console.
2. Select your project.
3. Go to `Project settings` -> `General`.
4. In `Your apps`, create/select a Web app.
5. Copy values into root `.env` using `.env.example`:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_FIREBASE_MEASUREMENT_ID`
   - `VITE_FIREBASE_FUNCTIONS_REGION`

## 2) Configure Gmail for Cloud Functions
1. Use a Google account that will send alerts.
2. Enable 2-Step Verification in that account.
3. Generate an App Password:
   - Google Account -> Security -> App passwords.
4. In `functions/.env`, add:
   - `GMAIL_USER`
   - `GMAIL_APP_PASSWORD`

## 3) Deploy backend functions
1. Install dependencies:
   - `cd functions`
   - `npm install`
2. Build:
   - `npm run build`
3. Deploy:
   - `npm run deploy`

## 4) Frontend behavior after setup
- In `Manage Contacts`, keep guardian `name`, `phone`, and `email`.
- On critical result, app calls Firebase Function to send:
  - Email alerts (+ PDF attachment)
- In result page, use `Send PDF to specific Gmail` to send report to any address.
