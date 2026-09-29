import { canvas, ctx } from '../core/display.js';

export const joystick = {
    active: false, baseX: 0, baseY: 0, stickX: 0, stickY: 0, 
    maxRadius: 50, dx: 0, dy: 0, touchId: null
};

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault(); 
    if (!joystick.active) {
        const touch = e.changedTouches[0];
        joystick.touchId = touch.identifier;
        joystick.active = true;
        joystick.baseX = touch.clientX;
        joystick.baseY = touch.clientY;
        joystick.stickX = touch.clientX;
        joystick.stickY = touch.clientY;
        joystick.dx = 0;
        joystick.dy = 0;
    }
}, { passive: false });

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (joystick.active) {
        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            if (touch.identifier === joystick.touchId) {
                let diffX = touch.clientX - joystick.baseX;
                let diffY = touch.clientY - joystick.baseY;
                let distance = Math.sqrt(diffX * diffX + diffY * diffY);

                if (distance > joystick.maxRadius) {
                    diffX = (diffX / distance) * joystick.maxRadius;
                    diffY = (diffY / distance) * joystick.maxRadius;
                }

                joystick.stickX = joystick.baseX + diffX;
                joystick.stickY = joystick.baseY + diffY;
                joystick.dx = diffX / joystick.maxRadius;
                joystick.dy = diffY / joystick.maxRadius;
            }
        }
    }
}, { passive: false });

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === joystick.touchId) {
            joystick.active = false;
            joystick.dx = 0;
            joystick.dy = 0;
        }
    }
}, { passive: false });

export function drawJoystick() {
    if (!joystick.active) return;
    
    ctx.beginPath();
    ctx.arc(joystick.baseX, joystick.baseY, joystick.maxRadius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(joystick.stickX, joystick.stickY, joystick.maxRadius / 2, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.fill();
}