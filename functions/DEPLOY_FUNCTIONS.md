# Cloud Functions Deployment Guide

This project uses Firebase Cloud Functions to send real-time emergency healthcare alerts.

## Prerequisites
- Firebase CLI installed (`npm install -g firebase-tools`)
- A Gmail account with an **App Password** generated.

## Setup
1.  **Configure Secrets**:
    Run these commands in your terminal to securely store your Gmail credentials:
    ```bash
    firebase functions:secrets:set GMAIL_USER
    firebase functions:secrets:set GMAIL_PASS
    ```
    *(When prompted, enter your Gmail address for GMAIL_USER and your 16-character App Password for GMAIL_PASS)*

2.  **Deploy**:
    Deploy only the functions from the project root:
    ```bash
    firebase deploy --only functions
    ```

## Testing
Once deployed, perform a triage in the app that results in a **CRITICAL** priority. 
1. Check the `alerts` collection in Firestore.
2. Verify the Cloud Function logs in the Firebase Console.
3. Check the guardian's email for the alert message.

## Troubleshooting
- **No email received**: Ensure your Gmail App Password is correct and the account has "Less secure apps" or App Passwords enabled.
- **Function Error**: Check the Firebase Console logs for specific errors.
- **Secret not found**: Ensure you ran the `secrets:set` command before deploying.
