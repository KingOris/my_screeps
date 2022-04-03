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
            target = Game.getObjectById<StructureController>(data.targetId)!
            sourceStructure = Game.getObjectById<StructureContainer | StructureStorage>(data.sourceId)!
            return true
        }

        if(!creep.memory.targetId){
            creep.memory.targetId = creep.room.controller!['id']
        }

        //配置能量获取地点-sourceId
        //获取所有存贮energy的建筑
        const containersWithEnergy = creep.room.find(FIND_STRUCTURES, {
            filter: (i: StructureContainer | StructureStorage) => i.store[RESOURCE_ENERGY] > 0
        })
        

        if (containersWithEnergy){
            for (let i of containersWithEnergy){
                if(i.structureType == STRUCTURE_CONTAINER && i.store[RESOURCE_ENERGY] >= 500){
                    creep.memory.sourceId = i.id
                }

                if(i.structureType == STRUCTURE_STORAGE && i.store[RESOURCE_ENERGY] >= 10){
                    creep.memory.sourceId = i.id
                }
            }
        }

        return false
    },

    
    source: creep => {
        if (creep.store[RESOURCE_ENERGY] > 0){
            return true
        }

        let sourceStructure = Game.getObjectById<StructureContainer | StructureStorage>(data.sourceId)!

        if (creep.withdraw(sourceStructure,RESOURCE_ENERGY) == ERR_NOT_ENOUGH_RESOURCES || creep.withdraw(sourceStructure,RESOURCE_ENERGY) == ERR_INVALID_TARGET){
            creep.suicide()
        }

        if (creep.withdraw(sourceStructure,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
            creep.moveTo(sourceStructure)
        }

        return false
    },

    target: creep => {
        if (creep.upgradeController(Game.getObjectById<StructureController>(data.targetId)!)== ERR_NOT_ENOUGH_ENERGY){
            return true
        }
        return false
    }
})

export default upgrader