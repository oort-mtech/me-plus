# me-plus

A gamified body recomposition app inspired by Strava. Track your progress, scan your meals, and achieve your fitness goals.

## Features

- 📧 Sign up with email authentication
- 📊 Capture and track your body parameters (age, height, weight, gender)
- 🎯 Set goals and track progress
- 📸 Scan food plates and record macros
- 📈 Progress graphs and analytics
- 💳 RevenueCat integration for subscriptions

## Tech Stack

- **Frontend**: React Native with Expo
- **Backend**: Supabase
- **Payments**: RevenueCat
- **Camera**: Expo Camera
- **Navigation**: React Navigation

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your mobile device or an iOS simulator/Android emulator

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd me-plus
```

2. Install dependencies:
```bash
npm install
```

3. Configure services:
- Add your Supabase URL and keys in `src/services/supabase.ts`
- Add your RevenueCat API keys in `src/utils/constants.ts`:
  - iOS key: `REVENUECAT_API_KEY_APPLE`
  - Android key: `REVENUECAT_API_KEY_GOOGLE`

4. Start the development server:
```bash
npm start
```

### Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run on web

## Project Structure

```
me-plus/
├── src/
│   ├── components/     # Reusable UI components
│   ├── screens/         # Screen components
│   ├── navigation/     # Navigation setup
│   ├── services/       # API and business logic
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   └── hooks/          # Custom React hooks
├── assets/             # Images, fonts, etc.
├── App.tsx             # Main app component
└── app.json            # Expo configuration
```

## Supabase Setup

You'll need to create the following tables in Supabase:

### Users Table
```sql
create table users (
  id uuid references auth.users not null primary key,
  email text,
  age integer,
  height float,
  current_weight float,
  gender text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### Goals Table
```sql
create table goals (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  target_weight float not null,
  current_weight float not null,
  start_date date not null,
  target_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### Food Entries Table
```sql
create table food_entries (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  image_url text,
  calories float not null,
  protein float not null,
  carbs float not null,
  fat float not null,
  meal_type text not null,
  date date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

## RevenueCat Setup

1. Create a RevenueCat account at https://www.revenuecat.com
2. Create a new project and add your iOS and Android apps
3. Configure your products and offerings in the RevenueCat dashboard:
   - Set up a 7-day free trial
   - Monthly subscription: $9.69/month
   - Yearly subscription: $69.99/year
   - Lifetime purchase: $99.69
4. Set package identifiers in the RevenueCat dashboard to match `src/utils/constants.ts`
5. Add your API keys to `src/utils/constants.ts`

### Subscription Plans

- 7-day free trial
- $9.69/month
- $69.99/year
- $99.69 lifetime

## Development

Initialize RevenueCat in your app:
```typescript
import { useRevenueCat } from './src/hooks/useRevenueCat';

// In your component
const { isPremium, offerings, purchase, restore } = useRevenueCat();
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is private and proprietary.

