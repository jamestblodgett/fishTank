# Idle Fish Tank

This is an interactive fish-tank simulator, with unique environment generation and unique fish with different personality sets, which are identifiable by simply checking the shape and color of the fish.

## How to run:

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
Download the zip file at the top of the page ( click the green ```code``` button, then click "download zip." Go into your
computer files and locate the zip file, and move it to wherever in your files you'd like. Unzip the file, into a folder in that location then go into the folder and then go into the folder named ```dist```. Once in there, double-click the ```index-portable.html``` file, and it will open in your browser! You can bookmark the tab if you'd like, and any time you want to update your file, simply come back here and download it again.

## Features

- **7 Fish Types**: Normal, Shy, Bold, Lazy, Hyper, Pair, and Big fish
- **Interactive buttons** Buttons to add fish, remove fish, and generate random setups.
- **Click Interaction**: Click the canvas to scare off nearby fish
- **Fullscreen Mode**: Click the fullscreen button for immersive viewing (**disclamer** does *not* allow you to use buttons while in fullscreen mode.
- **Responsive Design**: Works on different screen sizes

## Fish Personalities
#### Normal
Goes back and forth accross the screen, has a simple ordinary fish body and tail.
#### Shy
Moves slowly and sometimes pauses, runs off when frightened by other fish. Has a circular body with a tall triangular tail.
#### Bold
Moves quickly, stays near the top of the tank, and has a sick haircut with a flowy tail.
#### Lazy
Moves slowly and lethargically, has a very long body with a 3-pointed, flat tail. Doesn't do much.
#### Hyper
Moves randomly, fast, and unpredictibly. Absolutely bokers, it has a small body and a very, *very* triangular tail.
#### Pair
Pair fish are very small and have 2-pointed tails, and they travel together in groups. They regather themselves when scared, and they can make groups of up to 20 fish. P-probably.
#### Big
Big fish are big, round, and green. They're cool guys.

## Tank Design

The tank has a gradient blue background with piles of sand and rocks at the bottom, clustered with gently waving grass. The tank always features a "centerpiece", which randomly generates one from a list, you'll have to figure out which one's there are >:)

The fish almost always stay on screen, but if they go off-screen they'll be back shortly.

## How to Play

- **Add Fish**: Select a fish type from the dropdown and click "Add Fish"
- **Remove Fish**: Click "Remove Fish" to remove the most recently added fish
- **Reset Fish**: Regenerates the entire tank with a random setup
- **Click Canvas**: Frightens the fish near it and makes them scatter.
- **Fullscreen**: Immersive viewing mode (buttons hidden)

## Plans and Suggestions

I plan to add a diagnostics tab that shows you the number of each type of fish and the statistics about each of them, as well as more types of fish, and make the environment more interactible, such as the grass waving when fish pass it.

If you have any requests or suggestions, feel free to share!

# Boring Stuff (skip if you don't care about the boring parts).

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
