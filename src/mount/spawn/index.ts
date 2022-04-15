import {SpawnExtension }from "./extension"
import { assignPrototype } from "src/utils"
export default () => {
    assignPrototype(Spawn, SpawnExtension)
}