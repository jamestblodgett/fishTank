import BackgroundRenderer from "./background.js";

const canvas = document.getElementById("fishCanvas");
const ctx = canvas.getContext("2d");
const background = new BackgroundRenderer(canvas);

function animate() {
    // Draw background + back plants + sand + front plants
    background.draw();

    // Update and draw fish
    fishList.forEach(f => {
        updateFish(f);
        drawFish(f);
    });

    requestAnimationFrame(animate);
}

const fishList = [];
const schoolColors = {}; // schoolId → brightness offset

const zones = { // 0.0 is 0%, etc.
top:    [0.00, 0.15], 
high:   [0.15, 0.35], 
middle: [0.35, 0.50],  
low:    [0.50, 0.70], 
bottom: [0.90, 1.00]
}

// ----------------------------------------------------
// FISH PERSONALITY DEFINITIONS
// ----------------------------------------------------
const fishTypes = {
normal: {
colors: ["#5f27cd", "#feca57", "#48dbfb"],
speedRange: [1, 3],
wiggleRange: [10, 20],
turnBufferRange: [30, 140],
zones: ["high", "middle"]
},
shy: {
colors: ["#ff7b00"],
speedRange: [0.5, 1.2],
wiggleRange: [5, 12],
turnBufferRange: [10, 40],
lowY: true,
pauses: true,
zones: ["low", "bottom"]
},
bold: {
colors: ["#ff6b6b"],
speedRange: [2, 4],
wiggleRange: [20, 35],
turnBufferRange: [60, 160],
zones: ["top", "high", "middle"]
},
lazy: {
colors: ["#1e00a1"],
speedRange: [0.4, 1],
wiggleRange: [25, 40],
turnBufferRange: [80, 200],
zones: ["middle", "low"]
},
hyper: {
colors: ["#fffb00"],
speedRange: [3, 6],
wiggleRange: [5, 15],
turnBufferRange: [5, 20],
erratic: true,
zones: ["top", "high","middle","low"]
},
pair: {
colors: ["#ff9ff3", "#00d2d3"],
speedRange: [1, 2],
wiggleRange: [10, 20],
turnBufferRange: [20, 60],
small: true,
group: true,
zones: ["low", "middle", "high"]
},
big: {
colors: ["#10ac84"],
speedRange: [0.5, 1.2],
wiggleRange: [5, 10],
turnBufferRange: [100, 200],
big: true,
zones: ["low", "high"]
}
};

// ----------------------------------------------------
// HELPER FUNCTIONS
// ----------------------------------------------------
function pick(arr) {
return arr[Math.floor(Math.random() * arr.length)];
}

function randRange([min, max]) {
return min + Math.random() * (max - min);
}

function adjustHexBrightness(hex, amount) {
    const num = parseInt(hex.slice(1), 16);
    let r = (num >> 16) + amount;
    let g = ((num >> 8) & 0xff) + amount;
    let b = (num & 0xff) + amount;

    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));

    return `rgb(${r}, ${g}, ${b})`;
}

// ----------------------------------------------------
// CREATE FISH
// ----------------------------------------------------
function createFish(type = "normal", x, y) {
    const t = fishTypes[type];

    const speed = randRange(t.speedRange);
    const wiggle = randRange(t.wiggleRange);
    const turnBuffer = randRange(t.turnBufferRange);

    const startX = x ?? Math.random() * canvas.width;
    const startY = y ?? canvas.height / 2;

    // Create fish object FIRST
    const fish = {
        type,
        x: startX,
        y: startY,

        vx: 0,
        vy: 0,
        ax: 0,
        ay: 0,

        baseY: startY,

        speed,
        wiggleStrength: wiggle,
        turnBuffer,

        overrideY: null,
        shyAvoiding: false,

        direction: Math.random() < 0.5 ? -1 : 1,
        color: pick(t.colors),

        lowY: t.lowY || false,
        pauses: t.pauses || false,
        erratic: t.erratic || false,
        small: t.small || false,
        big: t.big || false,
        group: t.group || false,

        // Pair‑fish school properties
        schoolId: null,
        brightnessOffset: 0
    };

    // ----------------------------------------------------
    // APPLY ZONE-BASED SPAWNING
    // ----------------------------------------------------
    const allowedZones = t.zones;
    const chosenZone = pick(allowedZones);
    const [zMin, zMax] = zones[chosenZone];

    const zoneY = canvas.height * (zMin + Math.random() * (zMax - zMin));

    fish.baseY = zoneY;
    fish.y = zoneY;

    return fish;
}

// ----------------------------------------------------
// ADD / REMOVE / RESET / FULLSCREEN FISH BUTTONS
// ----------------------------------------------------
document.getElementById("addFishBtn").addEventListener("click", () => {
const type = document.getElementById("fishTypeSelect").value;
fishList.push(createFish(type));
});

document.getElementById("removeFishBtn").addEventListener("click", () => {
if (fishList.length > 0) fishList.pop();
});

document.getElementById("resetFishBtn").addEventListener("click", () => {
    fishList.length = 0;
    spawnInitialFish();   // <-- this now handles EVERYTHING
});

document.getElementById("fullscreenBtn").addEventListener("click", () => {
if (canvas.requestFullscreen) {
canvas.requestFullscreen();
} else if (canvas.webkitRequestFullscreen) {
canvas.webkitRequestFullscreen();
}
});

// ----------------------------------------------------
// INITIAL FISH SPAWN — wrapped into a function
// ----------------------------------------------------
function spawnInitialFish() {

    const allTypes = Object.keys(fishTypes);

    // 1. Spawn at least one of each type
    allTypes.forEach(type => {
        const x = Math.random() * canvas.width;
        const y = 80 + Math.random() * (canvas.height - 160);
        fishList.push(createFish(type, x, y));
    });

    // 2. Guaranteed pair group spawn
    const pairCount = 6;
    const centerX = Math.random() * canvas.width;

    for (let i = 0; i < pairCount; i++) {
        fishList.push(createFish("pair"));
    }

    // 3. Random extras
    const extraCount = Math.floor(Math.random() * 5);
    for (let i = 0; i < extraCount; i++) {
        const type = pick(allTypes);
        fishList.push(createFish(type));
    }

    // ----------------------------------------------------
    // FORCE PAIR FISH INTO A VISIBLE GROUP
    // ----------------------------------------------------
    const pairFish = fishList.filter(f => f.type === "pair");

if (pairFish.length > 0) {
    // --- vertical band with more variation (we'll tweak this in section 2) ---
    const sharedY = pairFish[0].y;

    pairFish.forEach(f => {
        const dy = (Math.random() - 0.5) * 80;   // more Y variation
        f.y = sharedY + dy;
        f.baseY = sharedY + dy;
    });

    // --- horizontal clustering stays as you like ---
    const clusterX = Math.random() * canvas.width;
    pairFish.forEach(f => {
        f.x = clusterX + (Math.random() - 0.5) * 80;
    });

    // --- COLOR GROUPING: give this group a shared brightness offset ---
    const schoolId = Date.now(); // simple unique id per spawn
    const brightness = (Math.random() - 1) * 80; // -20 to +20

    schoolColors[schoolId] = brightness;

    pairFish.forEach(f => {
        f.schoolId = schoolId;
        f.brightnessOffset = brightness;
    });
}

    // Debug
    console.log("Pair fish:", pairFish.length);
}
spawnInitialFish(); // Call the function to spawn fish on page load


// -----------------------------------------
// ENSURE AT LEAST N PAIR FISH EXIST
// -----------------------------------------
const MIN_PAIR = 6;

let currentPairs = fishList.filter(f => f.type === "pair").length;
while (currentPairs < MIN_PAIR) {
    fishList.push(createFish("pair"));
    currentPairs++;
}

function adjustBrightness(hex, factor) {
const num = parseInt(hex.slice(1), 16);
let r = (num >> 16) + factor;
let g = ((num >> 8) & 0xFF) + factor;
let b = (num & 0xFF) + factor;

r = Math.min(255, Math.max(0, r));
g = Math.min(255, Math.max(0, g));
b = Math.min(255, Math.max(0, b));

return `rgb(${r}, ${g}, ${b})`;
}

// ----------------------------------------------------
// DRAW FISH
// ----------------------------------------------------
function drawFish(f) {
ctx.save();

// Size scaling based on personality
let scale = 1;
if (f.small) scale = 0.6;
if (f.big) scale = 1.6;

ctx.translate(f.x, f.y);
if (f.direction === -1) ctx.scale(-1, 1);
ctx.scale(scale, scale);

ctx.fillStyle = f.color;


let color = f.color;

// Apply brightness shift
if (f.brightnessOffset) {
    color = adjustBrightness(color, f.brightnessOffset);
}

let bodyColor = f.color;

if (f.type === "pair" && typeof f.brightnessOffset === "number") {
    bodyColor = adjustHexBrightness(bodyColor, f.brightnessOffset);
}

ctx.fillStyle = bodyColor;

// then your existing shape code:
switch (f.type) {
    case "pair":
        ctx.ellipse(0, 0, 20, 10, 0, 0, Math.PI * 2);
        break;
    // ...
}
// ----------------------------------------------------
// BODY SHAPES (updated per your instructions)
// ----------------------------------------------------
ctx.beginPath();

switch (f.type) {

// NORMAL — same but sharper nose
case "normal":
ctx.moveTo(-25, 0);
ctx.quadraticCurveTo(10, -31, 30, 0);   // sharper nose
ctx.quadraticCurveTo(10, 25, -25, 0);
break;

// SHY — circle with a point at the back
case "shy":
ctx.moveTo(20, 0);
ctx.arc(0, 0, 20, -10, Math.PI * 2);      // circle body
ctx.lineTo(-30, 0);                     // point toward tail
break;

// BOLD — sharp front + sharp top, round bottom
case "bold":
ctx.moveTo(-25, 0);
ctx.lineTo(-5, -20);
ctx.lineTo(25, -25)
ctx.quadraticCurveTo(20, 0, 25, 0)                    // sharp top
ctx.quadraticCurveTo(15, 18, -25, 0);   // round bottom
break;

// LAZY — long, flat, rounded
case "lazy":
ctx.ellipse(-5, -2, 50, 8, 0, 1, Math.PI * 2);
break;

// HYPER — dart-like but round nose
case "hyper":
ctx.moveTo(-15, 0);
ctx.quadraticCurveTo(15, -10, 20, 3);   // round nose
ctx.quadraticCurveTo(10, 10, -15, 0);
break;

// PAIR — perfect as-is
case "pair":
ctx.ellipse(0, 0, 20, 10, 0, 0, Math.PI * 2);
break;

// BIG — perfect as-is
case "big":
ctx.ellipse(0, 0, 40, 22, 0, 0, Math.PI * 2);
break;

default:
ctx.ellipse(0, 0, 30, 15, 0, 0, Math.PI * 2);
break;
}

ctx.fill();

// ----------------------------------------------------
// TAIL SHAPES (updated where needed)
// ----------------------------------------------------
ctx.beginPath();

switch (f.type) {

// NORMAL — unchanged
case "normal":
ctx.moveTo(-20, 0);
ctx.lineTo(-43, -17);
ctx.lineTo(-40, 15);
ctx.closePath();
break;

// SHY — ordinary triangle tail
case "shy":
ctx.moveTo(-20, 0);
ctx.lineTo(-35, -25);
ctx.quadraticCurveTo(-33,0,-35,25)
ctx.lineTo(-35,25);
ctx.closePath();
break;

// BOLD — ordinary tail (per your request)
case "bold":
ctx.moveTo(-25, 0);
ctx.quadraticCurveTo(-30, -33,-47, -16);
ctx.lineTo(-48, 15);
ctx.closePath();
break;

// LAZY — ovular tail
case "lazy":
ctx.moveTo(-65, -2);
ctx.lineTo(-60, -12);
ctx.ellipse(-60, -2, 10, 20, 0, -Math.PI / 2, Math.PI / 2);
ctx.lineTo(-60, 8);
ctx.closePath();
break;

// HYPER — tiny triangle tail
case "hyper":
ctx.moveTo(-25, 0);
ctx.lineTo(-40, -8);
ctx.lineTo(-40, 8);
ctx.closePath();
break;

// PAIR — forked tail (unchanged)
case "pair":
ctx.moveTo(-25, 0);
ctx.lineTo(-40, -10);
ctx.lineTo(-35, 0);
ctx.lineTo(-40, 10);
ctx.closePath();
break;

// BIG — broad heavy tail (unchanged)
case "big":
ctx.moveTo(-45, 0);
ctx.lineTo(-70, -20);
ctx.lineTo(-70, 20);
ctx.closePath();
break;

default:
ctx.moveTo(-40, 0);
ctx.lineTo(-60, -15);
ctx.lineTo(-60, 15);
ctx.closePath();
break;
}

ctx.fill();

// ----------------------------------------------------
// EYE (same for all)
// ----------------------------------------------------
ctx.fillStyle = "white";
ctx.beginPath();
ctx.arc(10, -5, 5, 0, Math.PI * 2);
ctx.fill();

ctx.fillStyle = "black";
ctx.beginPath();
ctx.arc(12, -5, 2, 0, Math.PI * 2);
ctx.fill();

ctx.restore();
}

// ----------------------------------------------------
// UPDATE FISH (PERSONALITY + MOVEMENT)
// ----------------------------------------------------
function updateFish(f) {

    // ----------------------------------------------------
// SHY FISH — simple timid rhythm + speed-up when close
// ----------------------------------------------------
if (f.type === "shy") {

    // 1. Basic timid rhythm (slow → pause → fast → repeat)
    if (Math.random() < 0.01) {

        const r = Math.random();

        if (r < 0.5) {
            // Slow glide
            f.vx = f.direction * (f.speed * 0.3);
        }
        else if (r < 0.8) {
            // Pause
            f.vx = 0;
        }
        else {
            // Quick burst
            f.vx = f.direction * (f.speed * 2.0);
        }
    }

    // 2. Speed up when VERY close to another fish
    const veryClose = fishList.some(o =>
        o !== f &&
        Math.hypot(o.x - f.x, o.y - f.y) < 60
    );

    if (veryClose) {
        f.vx = f.direction * (f.speed * 2.5); // quick dart
    }
}

    // ---------------------------------------------
    // HYPER FISH ERRATIC MOVEMENT
    // ---------------------------------------------
    if (f.erratic) {
        f.ax += (Math.random() - 0.5) * 1.2;
        f.ay += (Math.random() - 0.5) * 1.2;
    }

    // ---------------------------------------------
    // PAIR FISH SCHOOLING
    // ---------------------------------------------
    if (f.group) {
        const neighbors = fishList.filter(o =>
            o !== f &&
            o.type === "pair" &&
            Math.hypot(o.x - f.x, o.y - f.y) < 260
        );

        if (neighbors.length > 0 && neighbors.length < 20) {

            let avgX = 0, avgY = 0, avgDir = 0;

            neighbors.forEach(n => {
                avgX += n.x;
                avgY += n.y;
                avgDir += n.direction;
            });

            avgX /= neighbors.length;
            avgY /= neighbors.length;
            avgDir /= neighbors.length;

            f.ax += (avgX - f.x) * 0.0022;
            f.ay += (avgY - f.y) * 0.0006;

            f.direction = avgDir > 0 ? 1 : -1;

            neighbors.forEach(n => {
                const dx = f.x - n.x;
                const dy = f.y - n.y;
                const dist = Math.hypot(dx, dy);

                if (dist < 45) {
                    f.ax += (dx / dist) * 0.04;
                    f.ay += (dy / dist) * 0.02;
                }
            });

            f.ay *= 0.85;
            f.ax += (Math.random() - 0.5) * 0.002;
        }
    }

    // ---------------------------------------------
    // PERSONALITY WIGGLE MODIFIERS
    // ---------------------------------------------
    if (f.big) f.wiggleStrength *= 0.95;
    if (f.type === "lazy") f.wiggleStrength *= 1.02;

    // ---------------------------------------------
    // PHYSICS — vertical movement disabled during avoidance
    // ---------------------------------------------
    f.vx += f.ax;
    f.vy += f.ay;

    f.x += f.vx;

    if (!(f.type === "shy" && f.shyAvoiding)) {
        f.y += f.vy;
    }

    f.vx *= 0.9;
    f.vy *= 0.9;
    f.ax *= 0.8;
    f.ay *= 0.8;

    // ---------------------------------------------
    // HORIZONTAL STEP — respect shy freeze
    // ---------------------------------------------
    if (f.type === "shy" && f.shyFreezeFrames > 0) {
        f.shyFreezeFrames--;
    } else {
        f.x += f.speed * f.direction;
    }

    if (f.x > canvas.width - f.turnBuffer) f.direction = -1;
    if (f.x < f.turnBuffer) f.direction = 1;

    f.wiggleStrength += (20 - f.wiggleStrength) * 0.05;

    // ---------------------------------------------
    // FINAL Y POSITION
    // ---------------------------------------------
    f.y = f.baseY + Math.sin(f.x * 0.01) * f.wiggleStrength;
}

// ----------------------------------------------------
// CLICK PUSH
// ----------------------------------------------------
function pushFish(f, clickX, clickY) {
const dx = f.x - clickX;
const dy = f.y - clickY;
const dist = Math.sqrt(dx * dx + dy * dy);

if (dist < 120) {
const force = (120 - dist) / 120;

if ((clickX > f.x && f.direction === 1) ||
(clickX < f.x && f.direction === -1)) {
f.direction *= -1;
}

f.ax += (dx / dist) * force * 5;
f.ay += (dy / dist) * force * 5;

f.wiggleStrength = 40;
}
}

canvas.addEventListener("click", event => {
const rect = canvas.getBoundingClientRect();
const clickX = event.clientX - rect.left;
const clickY = event.clientY - rect.top;

fishList.forEach(f => pushFish(f, clickX, clickY));
});

animate();