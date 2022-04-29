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

        let source_list: Array<StructureContainer | StructureStorage>  | ERR_NOT_FOUND
        let sourceStructure:StructureContainer | StructureStorage
        if(!creep.memory.sourceId){
            source_list= creep.room.getAvaliblesource()
            if(source_list == ERR_NOT_FOUND){
                creep.say('一杯二锅头',true)
                return false
            }else{
                sourceStructure = creep.findNearestSource(source_list)
                creep.memory.sourceId = sourceStructure.id
            }
        }else{
            sourceStructure = Game.getObjectById<StructureContainer | StructureStorage>(creep.memory.sourceId!)!
        }

        if (creep.withdraw(sourceStructure,RESOURCE_ENERGY,creep.store.getCapacity()) == ERR_NOT_ENOUGH_RESOURCES || creep.withdraw(sourceStructure,RESOURCE_ENERGY) == ERR_INVALID_TARGET){
            creep.say('你是我滴神')
            delete creep.memory.sourceId
        }

        if (creep.withdraw(sourceStructure,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
            creep.moveTo(sourceStructure,{visualizePathStyle: {stroke: '#ffffff'}})
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
            return true
        }

        return false
    }
})

export default builder;