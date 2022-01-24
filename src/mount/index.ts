/**
 * 挂载所有属性和方法
 */
import mountCreep from './creep'

export default function(): void {
    if(!global.hasExtension){
        mountCreep()

        global.hasExtension = true
        console.log('[mount] reload all extentions')
    }
}