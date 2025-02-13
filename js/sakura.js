class Sakura {
    constructor() {
        this.x = Math.random() * window.innerWidth;
        this.y = -10;
        this.size = Math.random() * 10 + 5;
        this.speed = Math.random() * 2 + 1;
        this.angle = Math.random() * 360;
        this.spin = Math.random() * 2 - 1;
    }

    update() {
        this.y += this.speed;
        this.x += Math.sin(this.angle) * 0.5;
        this.angle += this.spin * 0.01;
        return this.y < window.innerHeight;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255, 183, 197, 0.7)';
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let sakuras = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (Math.random() < 0.05) {
            sakuras.push(new Sakura());
        }

        sakuras = sakuras.filter(sakura => {
            const alive = sakura.update();
            if (alive) sakura.draw(ctx);
            return alive;
        });

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();
    animate();
}); 