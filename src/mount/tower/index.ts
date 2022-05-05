import TowerExtension from "./extension"
import { assignPrototype } from "src/utils"
export default () => {
    assignPrototype(StructureTower, TowerExtension)
}