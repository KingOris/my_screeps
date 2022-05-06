/**
 * 挂载所有属性和方法
 */
import mountCreep from './creep'
import mountRoom from './room'
import mountSpawn from './spawn'
import mountTower from './tower'

export default function(): void {
    if(!global.hasExtension){
        mountCreep()
        mountRoom()
        mountSpawn()
        mountTower()
        global.hasExtension = true
        console.log('[mount] reload all extentions')
    }
}