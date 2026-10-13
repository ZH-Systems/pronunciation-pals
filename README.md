# Pronunciation Pals

Parent-guided articulation practice for iPhone, built with Expo and React Native.

## Features implemented
- Parent-managed child profiles with local persistence
- Sound/word articulation curriculum for /s/, /l/, /r/, /sh/, and /ch/
- Child-friendly practice cards and animated participation rewards
- Microphone recording and local playback using expo-audio
- Adult ratings (accurate, emerging, not yet, skipped) plus cueing levels
- Parent dashboard with practice history and accuracy summaries
- Optional Supabase schema for authenticated multi-device synchronization (not wired into the app yet)

**Important:** App evaluations are adult observations, not diagnoses. Recordings are transient by default; audio is not uploaded.

## Quick start
```bash
npm install
npx expo start
```
Scan the Expo QR code from an iPhone running Expo Go. Microphone recording requires a physical device for best results.

## Project configuration
Copy `.env.example` to `.env` to configure future Supabase integration. No credentials are needed for the local-first demo. You must create your own Supabase project and apply `supabase/migrations/0001_initial.sql` before implementing account-based synchronization.

## Known limits
- Current persistence uses AsyncStorage, not encrypted storage, and should not hold sensitive data.
- Audio is held only in recorder-generated temporary files; recordings are not durable or cloud-backed.
- Parent gate uses a simple arithmetic challenge and is not a strong security boundary.
- Example words and cues are demonstration content, not SLP-validated clinical material.
- Authentication, therapist portal, cloud sync, production privacy review and accessibility verification remain unfinished.
