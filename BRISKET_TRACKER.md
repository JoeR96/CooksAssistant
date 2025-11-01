# 🔥 Brisket Smoking Tracker

A comprehensive brisket smoking tracker with adaptive learning to help you perfect your brisket over time!

## Features

### 📊 Real-Time Tracking
- Live timer showing elapsed time vs target duration
- Progress bar visualization
- Status tracking: Smoking → Wrapped → Finishing → Resting → Completed
- Temperature monitoring at each stage

### 🎯 Customizable Parameters
- **Weight**: Track brisket size (kg)
- **Smoking Temperature**: Target temp for initial smoke phase
- **Wrap Temperature**: When to wrap in butcher paper/foil
- **Finish Temperature**: Final internal temp target
- **Duration**: Expected total cooking time
- **Rest Time**: Post-cook resting period

### 📸 Post-Cook Review
- 5-star rating system
- Detailed text review
- Photo upload of finished brisket
- Track what worked and what didn't

### 🤖 AI-Powered Suggestions
Based on your review, get intelligent suggestions:
- **"Dry"** → Wrap earlier, reduce smoking temp
- **"Tough/Chewy"** → Increase finish temp, extend cooking time
- **"Weak bark"** → Delay wrapping
- **"Too smoky"** → Reduce smoking temperature
- **"Not enough smoke"** → Increase smoking temperature

### 🔧 Adaptive Learning
- Adjust parameters for next session
- Visual indicators showing changes (↑ increase, ↓ decrease)
- Automatic defaults from your last adjusted session
- Track improvements over time

### 📱 Quick Access
- Floating action button (FAB) on main page
- Pulsing indicator when session is active
- Direct navigation to `/brisket`

## Usage

### Starting a Session
1. Click the floating fire icon or navigate to `/brisket`
2. Click "Start New Session"
3. Enter your parameters (defaults from last session if available)
4. Click "Start Smoking 🔥"

### During the Cook
- Monitor elapsed time and progress
- Click status buttons to advance through stages:
  - "Mark as Wrapped" (when reaching wrap temp)
  - "Mark as Finishing" (after wrapping)
  - "Start Resting" (when reaching finish temp)
  - "Complete & Review" (after resting)

### After the Cook
1. Add your rating (1-5 stars)
2. Write a review about texture, bark, flavor
3. Upload a photo (optional)
4. Submit review

### Adjusting for Next Time
1. After reviewing, click "Adjust for Next Time"
2. Review AI suggestions based on your feedback
3. Modify temperatures, timing, or rest period
4. Add notes for next session
5. Save adjustments

Your next session will automatically use these adjusted values as defaults!

## Database Schema

```typescript
brisketSessions {
  id: uuid
  userId: string
  weight: decimal
  
  // Targets
  targetSmokeTemp: integer
  targetWrapTemp: integer
  targetFinishTemp: integer
  targetDuration: integer
  targetRestTime: integer
  
  // Actuals
  actualWrapTemp: integer
  actualFinishTemp: integer
  actualDuration: integer
  actualRestTime: integer
  
  // Status
  status: 'smoking' | 'wrapped' | 'finishing' | 'resting' | 'completed'
  startedAt: timestamp
  wrappedAt: timestamp
  finishedAt: timestamp
  completedAt: timestamp
  
  // Review
  rating: integer (1-5)
  review: text
  imageUrl: string
  
  // Learning
  adjustments: json {
    smokeTemp?: number
    wrapTemp?: number
    finishTemp?: number
    duration?: number
    restTime?: number
    notes?: string
  }
}
```

## API Endpoints

- `GET /api/brisket` - Get all sessions
- `GET /api/brisket?active=true` - Get active session
- `GET /api/brisket/latest` - Get latest completed session
- `POST /api/brisket` - Start new session
- `GET /api/brisket/[id]` - Get specific session
- `PATCH /api/brisket/[id]` - Update session (status, review, adjustments)

## Components

- `BrisketTracker` - Main tracking interface with live timer
- `StartBrisketModal` - Session creation with smart defaults
- `BrisketReviewModal` - Post-cook review with photo upload
- `BrisketAdjustmentsModal` - Parameter adjustment with AI suggestions
- `BrisketFab` - Floating action button with active indicator

## Tips for Best Results

1. **Be Consistent**: Use similar brisket sizes for better comparison
2. **Detailed Reviews**: More detail = better AI suggestions
3. **Track Everything**: Note bark quality, tenderness, moisture
4. **Adjust Gradually**: Make small changes (5°C, 30 min) between sessions
5. **Rest Properly**: Don't skip the resting phase!

## Example Workflow

**Session 1**: 2kg brisket, 110°C smoke, wrap at 72°C, finish at 94°C
- Result: Slightly dry, good bark
- Review: "Bark was perfect but a bit dry inside"
- Adjustment: Wrap at 70°C (earlier), reduce smoke temp to 105°C

**Session 2**: Uses adjusted values automatically
- Result: Perfect moisture, great bark
- Review: "Nailed it! Tender and juicy"
- No adjustments needed - keep these settings!

Happy smoking! 🔥🥩
