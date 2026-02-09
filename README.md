# Internship Project

This repository contains the source code for the Internship application, structured as a monorepo with separate `frontend` and `backend` directories.

## Project Structure

- **frontend/**: React Native Expo project.
- **backend/**: Node.js/Express backend (TypeScript).

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- Expo CLI (`npm install -g eas-cli`)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the app:
   ```bash
   npx expo start
   ```

## Building the Android APK

This project is configured to generate an APK file using EAS Build (Preview Profile).

1. Ensure you are logged in to EAS:
   ```bash
   eas login
   ```
2. Run the build command in the `frontend` directory:
   ```bash
   cd frontend
   eas build --platform android --profile preview
   ```
3. Follow the prompts to generate credentials (keystore).
4. Once the build is complete, you will receive a link to download the `.apk` file.

## License

This project is licensed under the terms of the license found in the `LICENSE` file.
