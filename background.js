// background.js

class BackgroundRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.waterGradient = this.#createWaterGradient();

        // Structure storage
        this.backStructures = [];
        this.frontStructures = [];

        // Centerpiece options
        this.centerpieceOptions = ["driftwood", "treasure", "bigRock"];

        // Build scenery once
        this.#generateScenery();
    }

    // -----------------------------
    // PRIVATE: Create water gradient
    // -----------------------------
    #createWaterGradient() {
        const g = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        g.addColorStop(0, "#7ecfff");
        g.addColorStop(1, "#004f7a");
        return g;
    }

    // -----------------------------
    // PRIVATE: Create a structure
    // -----------------------------
    #createStructure(x, y, type) {
        const s = { x, y, type };

        if (type === "sand") {
            const palette = ["#e5d6a7", "#d9c28f", "#e1cea8", "#e6d6c5", "#d3cab5"];
            const base = palette[Math.floor(Math.random() * palette.length)];
            const shift = Math.floor(Math.random() * 41) - 20;
            s.color = this.#adjustBrightness(base, shift);
            s.size = 20 + Math.random() * 40;
        }

        if (type === "rock") {
            s.size = 20 + Math.random() * 20;
        }

        if (type === "grass") {
            s.height = 40 + Math.random() * 80;
            s.blades = 7 + Math.floor(Math.random() * 4);
            s.spread = 20 + Math.random() * 40;
            s.swayOffset = Math.random() * 1000;

            s.bladeData = [];
            for (let i = 0; i < s.blades; i++) {
                s.bladeData.push({
                    heightFactor: 0.7 + Math.random() * 0.6,
                    curveFactor: 0.5 + Math.random() * 0.5,
                    width: 1.5 + Math.random() * 2.5,
                    offset: (Math.random() - 0.5) * s.spread
                });
            }
        }

        if (type === "driftwood") {
            s.height = 80 + Math.random() * 40;
            s.width = 20 + Math.random() * 10;
            s.lean = (Math.random() - 0.5) * 20;
            s.tipOffset = (Math.random() - 0.5) * 15;
        }

        if (type === "bigRock") {
            s.height = 15 + Math.random() * 25;
            s.width = 20 + Math.random() * 20;
            s.tilt = (Math.random() - 0.5) * 10;
            s.scale = 3 + Math.random() * 4;
        }

        if (type === "treasure") {
            s.tilt = (Math.random() - 0.5) * 0.25;
            s.scale = 2.5 + Math.random() * 0.5;
        }

        return s;
    }

    // -----------------------------
    // PRIVATE: Generate scenery
    // -----------------------------
    #generateScenery() {
        const w = this.canvas.width;
        const h = this.canvas.height;

        // Centerpiece
        const chosen = this.centerpieceOptions[
            Math.floor(Math.random() * this.centerpieceOptions.length)
        ];

        const centerpiece = this.#createStructure(
            w / 2 + (Math.random() * 200 - 100),
            h,
            chosen
        );

        this.backStructures.push(centerpiece);

        // Back layer
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * w;
            const y = h;
            const r = Math.random();

            if (r < 0.50) this.backStructures.push(this.#createStructure(x, y, "sand"));
            else if (r < 0.80) this.backStructures.push(this.#createStructure(x, y, "grass"));
            else this.backStructures.push(this.#createStructure(x, y, "rock"));
        }

        // Front layer
        for (let i = 0; i < 40; i++) {
            const x = Math.random() * w;
            const y = h;
            const r = Math.random();

            if (r < 0.75) this.frontStructures.push(this.#createStructure(x, y, "grass"));
            else if (r < 0.90) this.frontStructures.push(this.#createStructure(x, y, "sand"));
            else this.frontStructures.push(this.#createStructure(x, y, "rock"));
        }
    }

    // -----------------------------
    // PRIVATE: Draw a structure
    // -----------------------------
    #drawStructure(s) {
        const ctx = this.ctx;
        ctx.save();

        if (s.type === "sand") {
            ctx.fillStyle = s.color;
            ctx.beginPath();
            ctx.ellipse(s.x, s.y, s.size * 2, s.size, 0, 0, Math.PI, true);
            ctx.fill();
        }

        if (s.type === "rock") {
            ctx.fillStyle = "#6e6e6e";
            ctx.beginPath();
            ctx.ellipse(s.x, s.y, s.size, s.size * 0.7, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        if (s.type === "grass") {
            ctx.strokeStyle = "#2e8b57";
            const sway = Math.sin(Date.now() * 0.0006 + s.swayOffset) * 6;

            for (const b of s.bladeData) {
                const bladeX = s.x + b.offset;
                const bladeHeight = s.height * b.heightFactor;
                const bladeCurve = sway * b.curveFactor;

                ctx.lineWidth = b.width;
                ctx.beginPath();
                ctx.moveTo(bladeX, s.y);
                ctx.quadraticCurveTo(
                    bladeX + bladeCurve,
                    s.y - bladeHeight * 0.5,
                    bladeX,
                    s.y - bladeHeight
                );
                ctx.stroke();
            }
        }

        if (s.type === "driftwood") {
            ctx.translate(s.x, s.y);
            ctx.fillStyle = "#5a3e2b";
            ctx.beginPath();
            ctx.moveTo(-s.width / 2, 0);
            ctx.lineTo(-s.width / 3 + s.lean, -s.height * 3);
            ctx.lineTo(s.tipOffset, -s.height * 3.2);
            ctx.lineTo(s.width / 3 + s.lean, -s.height * 2.6);
            ctx.lineTo(s.width / 2, 0);
            ctx.closePath();
            ctx.fill();
        }

        if (s.type === "treasure") {
            ctx.translate(s.x, s.y);
            ctx.rotate(s.tilt);
            ctx.scale(s.scale, s.scale);

            ctx.fillStyle = "#7a4a1e";
            ctx.fillRect(-20, -20, 40, 20);

            ctx.fillStyle = "#545454";
            ctx.fillRect(-20, -15, 40, 4);
            ctx.fillRect(-20, -5, 40, 4);

            ctx.fillStyle = "#523417";
            ctx.beginPath();
            ctx.moveTo(-20, -20);
            ctx.quadraticCurveTo(0, -45, 20, -20);
            ctx.lineTo(20, -25);
            ctx.quadraticCurveTo(0, -50, -20, -25);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = "gold";
            ctx.beginPath();
            ctx.arc(0, -22, 6, 0, Math.PI * 2);
            ctx.fill();
        }

        if (s.type === "bigRock") {
            ctx.translate(s.x, s.y);
            ctx.scale(s.scale, s.scale);
            ctx.fillStyle = "#444444";
            ctx.beginPath();
            ctx.moveTo(-s.width / 2, 0);
            ctx.lineTo(s.tilt, -s.height);
            ctx.lineTo(s.width / 2, 0);
            ctx.closePath();
            ctx.fill();
        }

        ctx.restore();
    }

    // -----------------------------
    // PRIVATE: Brightness adjust
    // -----------------------------
    #adjustBrightness(hex, amount) {
        const num = parseInt(hex.slice(1), 16);
        let r = (num >> 16) + amount;
        let g = ((num >> 8) & 0xff) + amount;
        let b = (num & 0xff) + amount;

        r = Math.min(255, Math.max(0, r));
        g = Math.min(255, Math.max(0, g));
        b = Math.min(255, Math.max(0, b));

        return `rgb(${r}, ${g}, ${b})`;
    }

    // -----------------------------
// PUBLIC: Draw background
// -----------------------------
    drawBackground() {
        this.ctx.fillStyle = this.waterGradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawSand() {
        const h = this.canvas.height;
        this.ctx.fillStyle = "#d9c27a";
        this.ctx.fillRect(0, h - 40, this.canvas.width, 80);
    }
    // -----------------------------
    // PUBLIC: Draw everything
    // -----------------------------
    draw() {
        this.drawBackground();

        // Back layer
        this.backStructures.forEach(s => this.#drawStructure(s));

        this.drawSand();

        // Fish drawn in idle-fish.js

        // Front layer
        this.frontStructures.forEach(s => this.#drawStructure(s));
    }
}

export default BackgroundRenderer;