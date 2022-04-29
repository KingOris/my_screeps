/**
 * 升级者（upgrader)是每一个爬爬帝国下属城市中必不可少的存在。
 * 这些阿爬被赋予了神圣及不可忽视的责任，为了维护一个城镇的基石--控制器（Controller）。
 * 他们的一生都在维护控制器和去维护控制器的路上，并且为了守卫控制器的秘密并且更好的保护城镇，
 * 只有上一辈的阿爬死掉，下一辈的阿爬才能继承他的位置，而且每个城镇只会有一只阿爬被赋予这个神圣的使命。
 */

/**
 * 升级者配置器 从建筑中获取能量并升级Controller
 * source: 从指定建筑中获取能量
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
        const avalible_source = creep.room.getAvaliblesource()

        if (avalible_source == ERR_NOT_FOUND){
            if(!creep.saying){
                creep.say('我是傻x')
            }else{
                creep.suicide()
            }
        }else{
            creep.memory.sourceId = creep.findNearestSource(avalible_source).id
        }

        return false
    },

    
    source: creep => {
        if (creep.store[RESOURCE_ENERGY] > 0){
            return true
        }

        let sourceStructure = Game.getObjectById<StructureContainer | StructureStorage>(creep.memory.sourceId!)!

        if (creep.withdraw(sourceStructure,RESOURCE_ENERGY) == ERR_NOT_ENOUGH_RESOURCES || creep.withdraw(sourceStructure,RESOURCE_ENERGY) == ERR_INVALID_TARGET){
            creep.say('WDNMD',true)
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