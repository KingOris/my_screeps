import { filter } from "lodash";
/**
 * 
 */

const builder = (data:CreepData): CreepApi =>({
    //没有就不需要孵化
    isNeed: room =>{
        const target = room.find(FIND_MY_CONSTRUCTION_SITES)
        return target.length > 0 ? true : false
    },

    source: creep=>{
        if(creep.store[RESOURCE_ENERGY] > 0){
            return true
        }

        let sourceStructure = creep.findSource()

        if(sourceStructure == ERR_NOT_FOUND){
            return false
        }
        const source:StructureContainer | StructureStorage = Game.getObjectById(creep.memory.sourceId!)!

        if (creep.withdraw(source,RESOURCE_ENERGY,creep.store.getCapacity()) == ERR_NOT_ENOUGH_RESOURCES || creep.withdraw(source,RESOURCE_ENERGY) == ERR_INVALID_TARGET){
            creep.say('你是我滴神')
            delete creep.memory.sourceId
        }

        if (creep.withdraw(source,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
            creep.moveTo(source,{visualizePathStyle: {stroke: '#ffffff'}})
        }

        return false
    },

    target: creep=>{
        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        if(targets.length){
            creep.memory.targetId = targets[0].id
            creep.moveTo(targets[0].pos, {range:1,visualizePathStyle: {stroke: '#ffffff'}})
            if(creep.build(targets[0]) ==  ERR_NOT_IN_RANGE){
                //走到上面省的堵路
                creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }else{
            creep.setFillWallid()
            const result = creep.steadyWall()
            if(result == ERR_NOT_FOUND){
                if (creep.upgradeController(creep.room.controller!)== ERR_NOT_IN_RANGE){
                    creep.moveTo(creep.room.controller!)
                }
            }
        }

        if(creep.store.getUsedCapacity() === 0 ){
            delete creep.memory.sourceId
            return true
        }

        return false
    }
})

export default builder;