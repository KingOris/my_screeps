interface Creep{
    work(): void
}

interface Room{
    addCreepApi(creepNames:string,role:CreepRoleName,data:CreepData,spawnRoom:string,bodys:string[]): void
    removeCreepApi(configName: string): void
    roomInitial(): void
}
interface CreepMemory {
    /**
     * creep role
     */
    role: CreepRoleName

    /**
     * 准备是否完成
     */
    ready: boolean

    /**
     * 目标缓存
     */
    targetId?: Source['id'] | StructureContainer['id'] | ConstructionSite['id'] | StructureController['id']

    /**
     * 资源目标
     */
    sourceId?: Source["id"] | StructureContainer['id'] | StructureStorage['id']

    /**
     * 建造目标
     */
    constructionSiteId?: string
    /**
     * 检查是否在建造
     */
    building: boolean

    /**
     * 保存数据
     */
    data?: CreepData
    /**
     * 是否在工作状态
     */
    working?: boolean
}

declare module NodeJS {
    // 全局对象
    interface Global {
        // 是否已经挂载拓展
        hasExtension: boolean
    }
}

type CreepRoleName = CoreRoles

type CoreRoles = 'harvester' | 'upgrader' //| 'builder' | 'carrier' | 'repairer'

interface CreepApi {
    //creep的准备阶段
    //true：准备完成 并进入下一阶段
    prepare?: (creep: Creep) => boolean
    //creep获取工作所需资源
    //true: 阶段完成 并进入target阶段
    source?: (creep: Creep) => boolean
    //creep执行工作阶段
    //true: 阶段完成 并返回source阶段
    target: (creep: Creep) => boolean
}


type CreepData = HarvesterData | UpgraderData

interface HarvesterData {
    //
    sourceId: Source["id"]
    //
    targetId?: Source['id'] | StructureContainer['id'] | ConstructionSite['id']
}

interface UpgraderData {
    //
    sourceId: StructureContainer['id'] | StructureStorage['id']
    //Controller
    targetId?: StructureController['id']
}

interface RoomMemory {
    creepConfigs: {
        [creepName:string]:{
            role: CreepRoleName,
            data: CreepData,
            spawnRoom:string,
            bodys:string[]
        }
    }

    initial?:boolean
}