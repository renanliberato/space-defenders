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

    getGameObjectsByTag(tag) {
        return this.gameObjects.filter(go => go.tag == tag);
    }

    getCollidableGameObjects(tag) {
        return this.gameObjects.filter(go => go.collidable);
    }

    addGameObject(go) {
        this.gameObjects.push(go);
    }

    removeGameObject(go) {
        this.gameObjects.splice(this.gameObjects.indexOf(go), 1);
    }
}
