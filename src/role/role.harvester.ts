/**
 * 采集者（havester) 是爬爬帝国中最基础也是最重要的存在。他们回去收集对于帝国的运营最为重要的资源。
 * 采集者们的选拔非常严格，这些爬必须具有非凡的耐心和任劳任怨的品质。他们中的大部分终其一生也不会有返回母体的机会。
 * 采集者们采用的是传承制度，只有一个阿爬退休，才会由母体制造出新的阿爬来继承职位。
 * 这导致了通常一个房间不会有超过十个采集者同时存在。
 */

import { contains, isNull, range } from "lodash";

/**
 * 采集者配置器
 * 从指定 source 中获取能量 > 将能量存放到身下的 container 中
 * @param data CreepData
 * @returns 
 */
const harvester = (data: CreepData): CreepApi => ({
    prepare: creep =>{
        let target : Source | StructureContainer | ConstructionSite | null = null

        //如果有目标缓存就直接使用
        if (creep.memory.targetId) {
            target = Game.getObjectById< Source | StructureContainer >(creep.memory.targetId)
        }

        //获得资源目标
        const source = Game.getObjectById<Source>(creep.memory.sourceId!)
        //const source = Game.getObjectById<Source>(data.sourceId)

        //如果资源目标获取失败 返回false
        if(isNull(source)){
            console.log(`creep ${creep.name} 携带了一个无效的sourceID ${creep.memory.sourceId}`)
            return false
        }

        //如果没有目标缓存，寻找资源目标附近容器
        if(!target){
            const containers = source!.pos.findInRange<StructureContainer>(FIND_MY_STRUCTURES,1,{filter: {structureType: StructureContainer}})

            if(containers.length > 0){
                target = containers[0]
            }
        }

        //如果依旧没有目标， 寻找资源目标附近容器建造地点
        if(!target){
            const constructionSites = source!.pos.findInRange(FIND_CONSTRUCTION_SITES,1,{filter: {structureType: StructureContainer}})

            if(constructionSites.length > 0){
                target = constructionSites[0]
            }
        }

        //如果依旧没有目标， 目标设置为资源地点
        if(!target){
            target = source!
            creep.memory.targetId = target!.id
        }

        //如果是资源地点走到1距离位置， 不是就走到上面
        const range = target instanceof Source? 1:0

        //行走到目标地点
        creep.moveTo(target.pos,{range})

        //走到就返回true
        if (creep.pos.inRangeTo(target.pos, range)){
            return true
        }

        return false
    },
    
    source: creep =>{
        creep.say('🚧')

        //如果没有能量就去采点
        if (creep.store[RESOURCE_ENERGY] <= 0){
            creep.harvest(Game.getObjectById(creep.memory.sourceId!)!)
            return false
        }

        //获取prepare阶段的目标
        let target = Game.getObjectById<StructureContainer | Source>(creep.memory.targetId!)

        //如果有容器就维护一下
        if(target && target instanceof StructureContainer){
            creep.repair(target)
            return target.hits >= target.hitsMax
        }

        //如果没有容器就找建筑标记
        let constructionSite : ConstructionSite | null | undefined = null

        //如果有缓存就等于缓存
        if(target && target instanceof ConstructionSite){
            constructionSite = target
        }

        //如果没有就检查是否已经建造完成
        if(!constructionSite){
            const containers = creep.pos.lookFor(LOOK_STRUCTURES).find(element => element.structureType == STRUCTURE_CONTAINER)
            if(containers){
                return true
            }
        }

        //如果没有就新建constructionsite
        if(!constructionSite){
            creep.pos.createConstructionSite(STRUCTURE_CONTAINER)
        }

        //再次寻找constructionsite,还没有就return false
        if(!constructionSite){
            constructionSite = creep.pos.lookFor(LOOK_CONSTRUCTION_SITES).find(element => element.structureType == STRUCTURE_CONTAINER)
        }

        if(!constructionSite){
            return false
        }else{
            creep.memory.constructionSiteId = constructionSite.id
        }

        creep.build(constructionSite)
        return false
    },

    target: creep =>{
        creep.harvest(Game.getObjectById(creep.memory.sourceId!)!)
        if((creep.ticksToLive!) < 2){
            creep.drop(RESOURCE_ENERGY)
        }
        return false
    }
})

export default harvester;