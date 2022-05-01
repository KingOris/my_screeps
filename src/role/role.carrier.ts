/**
 * 搬运者
 */
const carrier = (data:CreepData): CreepApi =>({
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
        //如果有target就直接用
        if(creep.room.memory.fill_extension?.length){
            const target = creep.room.memory.fill_extension[0]
            if(target&&creep.store[RESOURCE_ENERGY]>0){
                if(creep.transfer(target,RESOURCE_ENERGY)==ERR_NOT_IN_RANGE){
                    creep.moveTo(target)
                }else if(creep.transfer(target,RESOURCE_ENERGY) == ERR_FULL || target.structureType==STRUCTURE_SPAWN){
                    //如果已经满了就重新找target
                    return false
                }
            }
        }
        
        //如果extenstion 满了就先看看tower里面能量
        if(creep.room.memory.fill_tower?.length){
            creep.say('找呀找呀找朋友')
            const target = creep.room.memory.fill_tower[0]
            if(target&&creep.store[RESOURCE_ENERGY]>0){
                if(creep.transfer(target,RESOURCE_ENERGY)==ERR_NOT_IN_RANGE){
                    creep.moveTo(target)
                }else if(creep.transfer(target,RESOURCE_ENERGY) == ERR_FULL){
                    //如果已经满了就重新找target
                    return false
                }
            }
        }
        
        //如果tower满了 就去填满storage
        if(creep.room.memory.fill_storage?.length){
            creep.say('我对着自己开了一枪',true)
            const target = creep.room.memory.fill_storage[0]
            if(target&&creep.store[RESOURCE_ENERGY]>0){
                if(creep.transfer(target,RESOURCE_ENERGY)==ERR_NOT_IN_RANGE){
                    creep.moveTo(target)
                }else if(creep.transfer(target,RESOURCE_ENERGY) == ERR_FULL){
                    //如果已经满了就重新找target
                    return false
                }
            }
        }

        if(creep.store[RESOURCE_ENERGY]==0){
            delete creep.memory.sourceId
            return true
        }
        
        return false
    }
})

export default carrier;
