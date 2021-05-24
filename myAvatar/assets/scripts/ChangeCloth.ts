
import { _decorator, Component, Node, resources, Prefab, instantiate, SkinnedMeshRenderer, EventTouch, SkeletalAnimation } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ChangeCloth')
export class ChangeCloth extends Component {
    @property({
        type: Node
    })
    modelNode!: Node;

    sex: string = "male";
    bodyPart: string[] = ["hair", "top", "pants", "shoes"];
    data: Map<string, Node> = new Map();

    start() {
        this.initAllData();
    }

    initAllData() {
        this.data.clear();
        for (let i = 0; i < this.bodyPart.length; i++) {
            let partName = this.bodyPart[i];
            let nodeName = `${this.sex}_${partName}-1`;
            let nodePart = this.modelNode.getChildByName(nodeName);
            if (nodePart) {
                console.debug("init part", nodeName);
                this.data.set(partName, nodePart);
            }
        }
    }

    changeCloth(partName: string, index: number) {
        resources.load(`prefab/${this.sex}_${partName}-${index}`, Prefab, (err, prefab) => {
            if (err) {
                console.debug(err);
                return;
            }
            let oldNode = this.data.get(partName);
            let oldModel = oldNode?.getComponent(SkinnedMeshRenderer);
            let newNode = instantiate(prefab);
            let newModel = newNode.getComponent(SkinnedMeshRenderer);
            if (oldModel?.skinningRoot && newModel) {
                newModel.skinningRoot = oldModel?.skinningRoot;

                oldNode?.removeFromParent();
                this.modelNode.addChild(newNode);
                this.data.set(partName, newNode);
            }
        })
    }

    onClickChange(touch: EventTouch, data: string) {
        console.debug("onClickChange", data);
        let params = data.split("-");
        this.changeCloth(params[0], parseInt(params[1]));
    }

    onClickAnimation(touch: EventTouch, animationName: string) {
        console.debug("onClickAnimation", animationName);
        this.modelNode.getComponent(SkeletalAnimation)!.play(animationName);
    }

    update(deltaTime: number) {
        // [4]
    }
}

