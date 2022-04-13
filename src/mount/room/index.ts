import {RoomExtention }from "./extension"
import { assignPrototype } from "src/utils"
export default () => {
    assignPrototype(Room, RoomExtention)
}