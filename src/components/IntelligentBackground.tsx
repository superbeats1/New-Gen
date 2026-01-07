import React, { useEffect, useRef } from 'react';

const IntelligentBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const particles: Particle[] = [];
        const particleCount = Math.min(80, Math.floor(window.innerWidth / 15));
        const connectionDistance = 200;
        const mouseDistance = 300;

        let mouse = { x: width / 2, y: height / 2 };
        let targetMouse = { x: width / 2, y: height / 2 };

        class Particle {
            x: number;
            y: number;
            baseX: number;
            baseY: number;
            vx: number;
            vy: number;
            size: number;
            opacity: number;
            color: string;

            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.baseX = this.x;
                this.baseY = this.y;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                this.size = Math.random() * 1.5 + 0.5;
                this.opacity = Math.random() * 0.5 + 0.2;

                // Deep Purple / Indigo palette
                const colors = [
                    'rgba(139, 92, 246, ', // Violet-500
                    'rgba(99, 102, 241, ', // Indigo-500
                    'rgba(167, 139, 250, ', // Violet-400
                    'rgba(129, 140, 248, '  // Indigo-400
                ];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                // Natural drift
                this.x += this.vx;
                this.y += this.vy;

                // Parallax effect based on mouse
                const moveX = (mouse.x - width / 2) * 0.02;
                const moveY = (mouse.y - height / 2) * 0.02;

                this.x += moveX * (this.size * 0.5);
                this.y += moveY * (this.size * 0.5);

                // Boundary check
                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = 0;
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color + this.opacity + ')';
                ctx.fill();
            }
        }

        const init = () => {
            particles.length = 0;
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Smooth mouse movement
            mouse.x += (targetMouse.x - mouse.x) * 0.05;
            mouse.y += (targetMouse.y - mouse.y) * 0.05;

            particles.forEach((particle, index) => {
                particle.update();
                particle.draw();

                // Draw connections
                for (let j = index + 1; j < particles.length; j++) {
                    const b = particles[j];
                    const dx = particle.x - b.x;
                    const dy = particle.y - b.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectionDistance) {
                        const opacity = (1 - dist / connectionDistance) * 0.15;
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.stroke();
                    }
                }
            });

            requestAnimationFrame(animate);
        };

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            init();
        };

        const handleMouseMove = (e: MouseEvent) => {
            targetMouse.x = e.clientX;
            targetMouse.y = e.clientY;
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);

        init();
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-[#07080a]">
            {/* Base Gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(139,92,246,0.05)_0%,_transparent_50%)]"></div>

            {/* Floating Orbs - Independent CSS Parallax */}
            <div className="absolute inset-0 z-0">
                <div
                    className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-violet-600/10 blur-[120px] rounded-full animate-float-slow"
                    style={{ transform: 'translate(var(--mouse-x, 0), var(--mouse-y, 0))' }}
                ></div>
                <div
                    className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full animate-float-delayed"
                    style={{ transform: 'translate(calc(var(--mouse-x, 0) * -1), calc(var(--mouse-y, 0) * -1))' }}
                ></div>
            </div>

            <canvas
                ref={canvasRef}
                className="absolute inset-0 z-10 opacity-60"
                style={{ mixBlendMode: 'plus-lighter' }}
            />

            <style>{`
                .animate-float-slow {
                    animation: float-main 30s ease-in-out infinite;
                }
                .animate-float-delayed {
                    animation: float-main 35s ease-in-out infinite reverse;
                    animation-delay: -7s;
                }
                @keyframes float-main {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(40px, 60px) scale(1.1); }
                    66% { transform: translate(-20px, 40px) scale(0.9); }
                }
            `}</style>
        </div>
    );
};

export default IntelligentBackground;
