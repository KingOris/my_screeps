/**
 * 搬运者
 */
const carrier = (data:CreepData): CreepApi =>({
    prepare: creep=>{
        const targets:Structure[] | undefined = creep.room.memory.fill_extension;
        if(targets&&targets.length){
            creep.memory.targetId = targets[0].id
            return true
        }else{
            creep.room.fill_extension()
        }
        return false
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
                creep.say('我傻了',true)
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
        //如果有target就直接用
        if(creep.memory.targetId){
            const target = Game.getObjectById<StructureExtension | StructureSpawn>(creep.memory.targetId)
            if(target&&creep.store[RESOURCE_ENERGY]>0){
                if(creep.transfer(target,RESOURCE_ENERGY)==ERR_NOT_IN_RANGE){
                    creep.moveTo(target)
                }else if(creep.transfer(target,RESOURCE_ENERGY) == ERR_FULL || target.structureType==STRUCTURE_SPAWN){
                    //如果已经满了就删掉重新找target
                    delete creep.memory.targetId
                }
            }
        }

        //如果没有target就先刷新room.memory.fill_extension
        if(!creep.memory.targetId){
            creep.say('找呀找呀找朋友')
            creep.room.fill_extension()
            if(creep.room.memory.fill_extension&&creep.room.memory.fill_extension.length){
                creep.memory.targetId = creep.room.memory.fill_extension[0].id
            }
        }
        
        if(creep.store[RESOURCE_ENERGY]==0){
            return true
        }
        
        return false
    }
})

export default carrier;
