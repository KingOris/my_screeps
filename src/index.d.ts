interface Creep{
    work(): void
    steadyWall(): OK| ERR_NOT_FOUND 
    setFillWallid():void
    findNearestSource(structurelist:Array<StructureContainer | StructureStorage> ):StructureContainer | StructureStorage
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
    targetId?: Source['id'] | StructureContainer['id'] | ConstructionSite['id'] | StructureController['id'] | ConstructionSite['id']| Structure['id']

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

    fillWallId?: StructureWall['id'] | StructureRampart['id']
}

interface Room{
    addCreepApi(creepNames:string,role:CreepRoleName,spawnRoom:string,bodys:BodyRoles,data?:CreepData): void
    removeCreepApi(configName: string): void
    roomInitial(): void
    spawnMission(name:string): void
    checkMemory():void
    getAvaliblesource(): Array<StructureContainer | StructureStorage> | ERR_NOT_FOUND
    getRepairstructure():Structure | ERR_NOT_FOUND
    fill_extension():void
    doing(): void
}

interface RoomMemory {
    creepConfigs: {
        [creepName:string]:{
            role: CreepRoleName,
            data?: CreepData,
            spawnRoom:string,
            bodys:BodyRoles
            inList?:boolean
        }
    }

    initial?:boolean

    fill_extension?:Structure[]
}

interface StructureSpawn{
    work(): void
    addTask(taskName:string): number
    doSpawn(taskName:string): ScreepsReturnCode
    spawnInitial():void
}

interface SpawnMemory{
    spawnList: Array<string>
    initial:boolean
}

declare module NodeJS {
    // 全局对象
    interface Global {
        // 是否已经挂载拓展
        hasExtension: boolean
    }
}

type CreepRoleName = CoreRoles

type CoreRoles = 'harvester' | 'upgrader' | 'builder' | 'carrier' | 'repairer'

type EnergyRange = 300 | 550 | 800 | 1300 | 1800 | 2300 | 5600 | 10000

type BodyRoles = 'harvester' | 'worker'
interface CreepApi {
    //检查房间是否需要
    isNeed?:(room:Room) => boolean
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


