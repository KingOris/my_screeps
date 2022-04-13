/**
 * 挂载所有属性和方法
 */
import mountCreep from './creep'
import mountRoom from './room'
export default function(): void {
    if(!global.hasExtension){
        mountCreep()
        mountRoom()
        global.hasExtension = true
        console.log('[mount] reload all extentions')
    }
}