class Time {
    static time = 0;
    static timeScale = 1;
    static deltaTime = 0;

    static tick(newDeltaTimeInMillis) {
        Time.deltaTime = Math.min(50, newDeltaTimeInMillis);
        Time.deltaTime /= 1000;

        Time.deltaTime *= Time.timeScale;
        Time.time += Time.deltaTime;
    }
}
