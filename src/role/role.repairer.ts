/**
 * 维修者
 */

 const repairer = (data: CreepData): CreepApi => ({
    source: creep=>{
        if(creep.store[RESOURCE_ENERGY] > 0){
            return true
        }

        let source_list: Array<StructureContainer | StructureStorage>  | ERR_NOT_FOUND
        let sourceStructure:StructureContainer | StructureStorage
        if(!creep.memory.sourceId){
            source_list= creep.room.getAvaliblesource()
            if(source_list == ERR_NOT_FOUND){
                creep.say('我傻了')
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
            return false
        }

        if (creep.withdraw(sourceStructure,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
            creep.moveTo(sourceStructure,{visualizePathStyle: {stroke: '#ffffff'}})
        }

        return false
    },

    target: creep=>{
        var targets = creep.room.getRepairstructure();
        if(targets == ERR_NOT_FOUND){
            creep.setFillWallid()
            const result = creep.steadyWall()
            if(result == ERR_NOT_FOUND){
                if (creep.upgradeController(creep.room.controller!)== ERR_NOT_IN_RANGE){
                    creep.moveTo(creep.room.controller!)
                }
            }
        }else{
            creep.memory.targetId = targets.id
            if(creep.repair(targets) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets,{visualizePathStyle: {stroke: '#cc3fb5'}});
            }
        }

        if(creep.store.getUsedCapacity() === 0 ){
            return true
        }

        return false
    }

 })

 export default repairer;