function randomPointAroundCenter(radius) {
    var angle = Math.random() * Math.PI * 2;

    return new Vec2(Math.cos(angle) * radius, Math.sin(angle) * radius);
}

function pointAroundCenter(angle, radius) {
    return new Vec2(Math.cos(angle) * radius, Math.sin(angle) * radius);
}
