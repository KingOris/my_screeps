import { errorMapper } from './modules/errorMapper'
import { roleHarvester } from './role.harvester'
import { roleBuilder } from './role.builder'

export const loop = errorMapper(() => {
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
if(harvesters.length < 3){
    var newName = 'Harvester' + Game.time
    if(Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName, {memory: {role: 'harvester', building: false}}) == 0){
        console.log('Spawning new Harvester: ' + newName);
    }
}

for( var name in Game.creeps){
    var creep = Game.creeps[name];
    if(creep.memory.role == 'harvester'){
        roleHarvester.run(creep);
    }
    
    if(creep.memory.role == 'builder'){
        roleBuilder.run(creep);
    }
}
})