import { errorMapper } from './modules/errorMapper'
import mountwork from './mount'
import { doing } from './utils';

export const loop = errorMapper(() => {

    mountwork()

    // 自动删除死亡creep内存
    for(var name in Memory.creeps){
        if(!Game.creeps[name]){
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memeory', name)
        }
    }

    if(!Game.spawns['Spawn1'].room.memory.initial){
        Game.spawns['Spawn1'].room.roomInitial()
    }

    if(!Game.spawns['Spawn1'].room.memory.initial){
        Game.spawns['Spawn1'].spawnInitial()
    }
    
    if(Game.cpu.bucket >= 10000){
        Game.cpu.generatePixel()
    }
    
    //Object.values(Game.rooms).forEach(room => room.work())
    //Object.values(Game.spawns).forEach(spawn => spawn.work())
    //Object.values(Game.creeps).forEach(creep => console.log(creep.work))
    //doing(Game.structures)
    doing(Game.rooms,Game.structures,Game.creeps)
})