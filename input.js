const pressed = new Set();

function keyPressed(evt) {
    const { code } = evt;

    if (!pressed.has(code)) {
        pressed.add(code);
    }
}

function keyReleased(evt) {
    pressed.delete(evt.code);
}