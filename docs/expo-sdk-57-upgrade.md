# Expo SDK 57 upgrade

This branch upgrades Expo from SDK 54 to SDK 57, including React Native 0.86 and React 19.2.3.

## Validate before merging

Use Node 22.13+ and Xcode 26.4+ for native iOS builds.

```sh
npm install
npx expo install --fix
npx expo install --check
npx expo-doctor
npm run typecheck
npx expo start --clear
```

After running `expo install --fix`, commit any version corrections and the generated `package-lock.json`. The package lock was not present in the original repository.

Manual device regression tests:
- Launch child home screen and switch child profiles
- Open S / SH exercises and navigate between exercises
- Grant microphone permission, record, stop, and replay an attempt
- Rate an attempt, finish the session, and review it on the parent dashboard
- Force-close and restart, then verify profile and assessment persistence

## Limitations
This PR is not verified by a native iOS build, dependency installation, or a TypeScript compilation in the author's environment. Installed versions of secondary native modules should be confirmed by Expo's version checker prior to merge. No Supabase or production changes are involved.
