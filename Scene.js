class Scene {
    /**
     * @type {Scene}
     */
    static instance;

    constructor() {
        /**
         * @type {Array<GameObject>}
         */
        this.gameObjects = [];

        Scene.instance = this;
    }

    addGameObject(go) {
        this.gameObjects.push(go);
    }

    removeGameObject(go) {
        this.gameObjects.splice(this.gameObjects.indexOf(go), 1);
    }
}
