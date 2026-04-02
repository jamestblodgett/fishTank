# Idle Fish Tank

An interactive fish tank simulation with different fish personalities.

## Development Workflow

### For Developers: Work with Source Files
1. **Edit source files** in the `src/` folder:
   - `src/index.html` - HTML structure and content
   - `src/styles.css` - Styling and layout
   - `src/background.js` - Scenery rendering
   - `src/idle-fish.js` - Fish logic and behaviors
2. **Test locally**: Open `src/index.html` in your browser to test changes
3. **Build portable version**: Run `build/build-portable.bat` or `build/build-portable.ps1`
4. **Share**: Distribute the generated `dist/index-portable.html` file

### For Users: Run the Portable Version
Simply double-click `dist/index-portable.html` in any web browser. This single file contains everything needed and works from any location on any device.

## Features

- **7 Fish Types**: Normal, Shy, Bold, Lazy, Hyper, Pair, and Big fish
- **Interactive Controls**: Add, remove, and reset fish
- **Click Interaction**: Click the canvas to nudge nearby fish
- **Fullscreen Mode**: Click the fullscreen button for immersive viewing
- **Responsive Design**: Works on different screen sizes

## Fish Personalities

- **Normal**: Balanced movement and appearance (Purple, Yellow, Light Blue)
- **Shy**: Stays low, pauses occasionally, darts when threatened (Orange)
- **Bold**: Fast and aggressive movement (Red)
- **Lazy**: Slow, wide movements (Dark Blue)
- **Hyper**: Erratic, unpredictable behavior (Yellow)
- **Pair**: School together in groups with matching colors (Pink/Cyan)
- **Big**: Large, slow-moving fish (Green)

## Tank Design

The tank features:
- Animated water with gradient background
- Sand, rocks, and swaying sea grass at the bottom
- Random centerpiece (large rock, driftwood, or treasure chest)
- Layered scenery for depth

## How to Play

- **Add Fish**: Select a fish type from the dropdown and click "Add Fish"
- **Remove Fish**: Click "Remove Fish" to remove the most recently added fish
- **Reset Fish**: Regenerates the entire tank with a random setup
- **Click Canvas**: Nudge nearby fish to scatter them
- **Fullscreen**: Immersive viewing mode (buttons hidden)

## Technical Details

The portable version (`index-portable.html`) embeds all CSS and JavaScript inline, making it completely self-contained and runnable from any location without dependencies.

## File Organization

```
fishTank/
├── 📁 src/                 # Source files (edit these)
│   ├── index.html          # HTML structure
│   ├── styles.css          # Styling and layout
│   ├── background.js       # Scenery rendering
│   └── idle-fish.js        # Fish logic and behaviors
│
├── 📁 build/               # Build automation
│   ├── build-portable.bat  # Windows batch build script
│   └── build-portable.ps1  # PowerShell build script
│
├── 📁 dist/                # Distribution files
│   └── index-portable.html # Portable version (auto-generated)
│
├── 📖 README.md            # This documentation
└── 📁 .git/               # Git repository
```

## Plans and Suggestions

Future enhancements may include:
- More fish interactions and behaviors
- Additional backgrounds and environments
- More fish types and animations
- Predatory fish that eat smaller ones

If you have any requests or suggestions, feel free to share!
