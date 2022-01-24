import {CreepExtension }from "./extension"
import { assignPrototype } from "src/utils"
export default () => {
    assignPrototype(Creep, CreepExtension)
}