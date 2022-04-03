import { errorMapper } from './modules/errorMapper'
import mountwork from './mount'

export const loop = errorMapper(() => {

    mountwork()

    // 自动删除死亡creep内存
    for(var name in Memory.creeps){
        if(!Game.creeps[name]){
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memeory', name)
        }
    }

    //监测harvesters的数量
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    
    //自动生成harvester
    if(harvesters.length < 2){
        var newName = 'Harvester' + Game.time
        if(Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName, {memory: {role: 'harvester', building: false, ready: false, sourceId: Game.spawns['Spawn1'].room.find(FIND_SOURCES)[0]['id']}}) == 0){
            console.log('Spawning new Harvester: ' + newName);
        }
    }

    Object.values(Game.creeps).forEach(creep => creep.work())
})