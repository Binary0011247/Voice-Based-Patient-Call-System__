import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Set to true if you want headers on your screens
      }}
    />
  );
}
