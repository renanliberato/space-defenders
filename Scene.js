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

    serialize() {
        return {
            gameObjects: this.gameObjects.map(g => g.serialize())
        }
    }

    deserialize(obj) {
        this.gameObjects = obj.gameObjects.map(obj => {
            var go = new GameObject();
            go.deserialize(obj)

            go.start();

            return go;
        });
    }

    update() {
        this.gameObjects.forEach(g => g.update());
    }

    render() {
        this.gameObjects.forEach(g => g.render());
    }

    /**
     * 
     * @param {Vec2} clickPos 
     */
    propagateMousePressed(clickPos) {
        this.gameObjects.forEach(go => {
            if (!go.components.has('Button')) {
                return;
            }

            if (!go.components.has('RectTransform')) {
                return;
            }

            if (!go.components.get('RectTransform').rect.contains(clickPos)) {
                return;
            }

            go.components.get('Button').onClick();
        })
    }
}
