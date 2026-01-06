# Testing Guide

## Starting the Project

The Expo development server is now starting. You should see:
- QR code in the terminal
- Options to press:
  - `a` - Open on Android emulator
  - `i` - Open on iOS simulator
  - `w` - Open in web browser

## Testing Checklist

### 1. Authentication Flow ✅
- [ ] **Welcome Screen**
  - App starts on Welcome screen
  - "Get Started" button navigates to SignUp
  - "Sign In" link navigates to SignIn

- [ ] **Sign Up**
  - Enter email and password (min 6 characters)
  - Successfully creates account
  - Navigates to Onboarding screen

- [ ] **Sign In**
  - Enter valid credentials
  - Successfully signs in
  - Navigates to Onboarding (if profile incomplete) or Home (if complete)

### 2. Standard Setup Features ✅

- [ ] **Onboarding Screen**
  - Capture age (1-120)
  - Capture height in cm (30-300)
  - Capture current weight in kg (20-500)
  - Select gender (male, female, other)
  - Form validation works
  - Saves to database and navigates to Home

- [ ] **Goals Screen**
  - Set current weight and target weight
  - Calculates weight to lose
  - Validates target < current weight
  - Saves goal successfully
  - Can update existing goal

### 3. Main Features ✅

- [ ] **Home Screen**
  - Displays user email
  - Shows goal progress if goal is set
  - Quick action buttons work:
    - Scan Food
    - View Progress
    - Photo Analysis
    - Profile
  - Shows AI diet recommendations component

- [ ] **Camera Screen (Food Scanning)**
  - Camera permissions requested
  - Can take photo with camera
  - Can pick image from gallery
  - Can select meal type (breakfast, lunch, dinner, snack)
  - Can enter macros:
    - Calories
    - Protein (g)
    - Carbs (g)
    - Fat (g)
  - Saves food entry successfully

- [ ] **Progress Screen**
  - Shows daily calories line chart (last 7 days)
  - Shows macros breakdown bar chart
  - Displays 7-day totals:
    - Total calories
    - Total protein
    - Total carbs
    - Total fat
  - Shows goal progress if goal exists
  - Handles empty state (no entries yet)

- [ ] **Photo Analysis Screen**
  - Can take photo with camera
  - Can upload from gallery
  - Shows instructions for good progress photos
  - Displays mock AI analysis after photo:
    - Body fat percentage
    - Muscle mass changes
    - Progress score
    - Measurements (chest, waist, hips)
    - AI recommendations
  - Can take new photo

- [ ] **AI Diet Recommendations**
  - Shows personalized recommendations
  - Based on user profile and current macros
  - Updates based on daily intake
  - Provides actionable advice

- [ ] **Profile Screen**
  - Displays account information (email)
  - Shows body metrics (age, height, weight, gender)
  - Link to complete profile if incomplete
  - Link to Subscription screen
  - Sign out functionality works

- [ ] **Subscription Screen**
  - Displays available subscription packages
  - Shows pricing (if RevenueCat configured)
  - Purchase functionality (if RevenueCat enabled)
  - Restore purchases functionality

### 4. Navigation Flow ✅

Test the complete user journey:
1. Start → Welcome Screen
2. Sign Up → Onboarding
3. Complete Onboarding → Home
4. Set Goal → Goals Screen → Back to Home
5. Scan Food → Camera Screen → Save → Back to Home
6. View Progress → Progress Screen → See graphs
7. Photo Analysis → PhotoAnalysisScreen → Take photo → See report
8. Profile → View/Edit profile → Sign out

### 5. Error Handling ✅

- [ ] Form validation messages display correctly
- [ ] Network errors handled gracefully
- [ ] Authentication errors show user-friendly messages
- [ ] Loading states display during async operations

## Known Issues / Notes

### Configuration Required

1. **Supabase Setup:**
   - Database tables need to be created (SQL in README.md)
   - Supabase URL and keys are configured in `src/services/supabase.ts`

2. **RevenueCat:**
   - Currently disabled in code (marked as "temporarily disabled")
   - API keys need to be configured in `src/utils/constants.ts`
   - Products need to be set up in RevenueCat dashboard

### Platform-Specific Testing

- **iOS Simulator:** Camera may not work, use image picker instead
- **Android Emulator:** Camera works, but may need permissions
- **Physical Device:** Best for testing camera features
- **Web:** Limited camera support, use image picker

## Troubleshooting

### If the app doesn't start:
1. Check Node.js version (v14+ required)
2. Run `npm install` to ensure all dependencies are installed
3. Clear Expo cache: `npx expo start --clear`

### If camera doesn't work:
1. Check permissions in device settings
2. On simulator, use image picker instead
3. Verify `expo-camera` is properly installed

### If database operations fail:
1. Verify Supabase credentials in `src/services/supabase.ts`
2. Ensure database tables are created
3. Check Supabase project dashboard for errors

### If navigation doesn't work:
1. Check that all screens are registered in `src/navigation/index.tsx`
2. Verify TypeScript types in `src/types/index.ts`

## Testing Platforms

Recommended testing order:
1. **Web** (`w`) - Quickest way to test UI and navigation
2. **iOS Simulator** (`i`) - Test mobile UI (camera limited)
3. **Android Emulator** (`a`) - Full feature testing
4. **Physical Device** - Best for camera and photo features

## Success Criteria

All features are working correctly when:
- ✅ Users can sign up and sign in
- ✅ All user parameters can be captured
- ✅ Goals can be set and progress tracked
- ✅ Food can be scanned and macros recorded
- ✅ Progress graphs display correctly
- ✅ Photo analysis shows progress report
- ✅ AI recommendations appear and update
- ✅ Navigation flows smoothly between screens

Happy testing! 🚀

