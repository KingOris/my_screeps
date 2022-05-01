/**
 * 维修者
 */

 const repairer = (data: CreepData): CreepApi => ({
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
            return false
        }

        if (creep.withdraw(source,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
            creep.moveTo(source,{visualizePathStyle: {stroke: '#ffffff'}})
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
            delete creep.memory.sourceId
            return true
        }

        return false
    }

 })

 export default repairer;