/**
 * 升级者
 * source: 从指定矿中挖矿
 * target: 将其转移到指定的 roomController 中
 * 
 * @param data creepData
 */
const upgrader = (data:CreepData) : CreepApi => ({
    prepare: creep => {

        let target: StructureController

        let sourceStructure : StructureContainer | StructureStorage 

        if(creep.memory.targetId && creep.memory.sourceId){
            target = Game.getObjectById<StructureController>(creep.memory.targetId)!
            sourceStructure = Game.getObjectById<StructureContainer | StructureStorage>(creep.memory.sourceId)!
            return true
        }

        if(!creep.memory.targetId){
            creep.memory.targetId = creep.room.controller!['id']
        }

        //配置能量获取地点-sourceId
        //获取所有存贮energy的建筑
        const containersWithEnergy = creep.room.find(FIND_STRUCTURES, {
            filter: (i: StructureContainer | StructureStorage) => i.structureType == STRUCTURE_CONTAINER || i.structureType == STRUCTURE_STORAGE && i.store[RESOURCE_ENERGY] > 0
        })
        

        if (containersWithEnergy.length){
            for (let i of containersWithEnergy){
                if(i.structureType == STRUCTURE_CONTAINER && i.store[RESOURCE_ENERGY] >= 500){
                    creep.memory.sourceId = i.id
                }

                if(i.structureType == STRUCTURE_STORAGE && i.store[RESOURCE_ENERGY] >= 10){
                    creep.memory.sourceId = i.id
                }
            }
        }else{
            creep.say('我是傻x')
            //creep.suicide()
        }

        return false
    },

    
    source: creep => {
        if (creep.store[RESOURCE_ENERGY] > 0){
            return true
        }

        let sourceStructure = Game.getObjectById<StructureContainer | StructureStorage>(creep.memory.sourceId!)!

        if (creep.withdraw(sourceStructure,RESOURCE_ENERGY) == ERR_NOT_ENOUGH_RESOURCES || creep.withdraw(sourceStructure,RESOURCE_ENERGY) == ERR_INVALID_TARGET){
            creep.suicide()
        }

        if (creep.withdraw(sourceStructure,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
            creep.moveTo(sourceStructure)
        }

        return false
    },

    target: creep => {
        let target = Game.getObjectById<StructureController>(creep.memory.targetId!)!
        if (creep.upgradeController(target)== ERR_NOT_IN_RANGE){
            creep.moveTo(target)
        }

        if (creep.upgradeController(target)== ERR_NOT_ENOUGH_ENERGY){
            return true
        }
        
        return false
    }
})

export default upgrader