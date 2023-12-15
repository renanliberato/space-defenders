function randomPointAroundCenter(radius) {
    var angle = Math.random() * Math.PI * 2;

    return new Vec2(Math.cos(angle) * radius, Math.sin(angle) * radius);
    // var offset = Math.random() * 128 * Math.sign(Math.random() - 0.5);
    // return 128 + offset;
}
