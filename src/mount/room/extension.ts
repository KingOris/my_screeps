import harvester from "src/role/role.harvester"
import { creepNumber } from "src/setting"
import room from "."

/*
Room 拓展
*/
export class RoomExtention extends Room{
    /**
     * 添加CreepApi到房间内存中
     * @param creepNames 名称
     * @param role 职位
     * @param data 需要creep储存的数据（目标，地点等等）
     * @param spawnRoom 房间id
     * @param bodys 需要孵化的身体部件
     */
    public addCreepApi(creepNames:string,role:CreepRoleName,spawnRoom:string,bodys:BodyRoles,data?:CreepData):void{
        //如果没有就生成一个空的
        if(!this.memory.creepConfigs){
            this.memory.creepConfigs = {}
        }
        //加入内存
        this.memory.creepConfigs[creepNames] = {role,spawnRoom,bodys,data,inList:false}
    }

    /**
     * 删除CreepApi
     * @param configName api的名字
     */
    public removeCreepApi(configName: string): void{
        delete this.memory.creepConfigs[configName]
        //提醒api已经删除
        console.log('${configName} has been removed')
    }

    /**
     * 生成HaversterApi
     */
    private createHaversterApi():void{
        const energy_sources = this.find(FIND_SOURCES)
        energy_sources.forEach(source => this.energy_source_pos_check(source))
    }

    /**
     * 生成Api
     */
    public createApi(number:number,role:string): void{
        const name = role + number
        if(role == 'upgrader'){
            this.addCreepApi(name,'upgrader',this.name,'worker')
            this.memory.creepNum[role] += 1
        }

        if(role == 'carrier'){
            this.addCreepApi(name,'carrier',this.name,'worker')
            this.memory.creepNum[role] += 1
        }

        if(role == 'builder'){
            this.addCreepApi(name,'builder',this.name,'worker')
            this.memory.creepNum[role] += 1
        }

        if(role == 'repairer'){
            this.addCreepApi(name,'repairer',this.name,'worker')
            this.memory.creepNum[role] += 1
        }
    }

    /**
     * 检查能量可采集位置数量
     */
    private energy_source_pos_check(source:Source): void{
        for (let i = 0; i <= this.pos_avail(source); i++){
            if(this.memory.creepNum['harvester'] < 4){
                this.memory.creepNum['harvester'] += 1
                this.addCreepApi('Harvester' + i + source.id,'harvester',this.name,'harvester',{sourceId : source.id})
            }
        }

    }

    private pos_avail(source:Source): number{
        const pos = source.pos
        const x = pos.x
        const y = pos.y
        const position = this.check_pos(x+1,y+1) + this.check_pos(x-1,y-1) + this.check_pos(x+1,y) + this.check_pos(x,y+1) + this.check_pos(x-1,y) + this.check_pos(x,y-1)
        return position
    }

    private check_pos(x:number,y:number): number{
        switch(this.getTerrain().get(x,y)){
            case TERRAIN_MASK_WALL:
                return 0;
            case TERRAIN_MASK_SWAMP:
                return 0;
            case 0:
                return 1;
        }
    }

    /**
     * energy_source_pathFinder
     */
    private energy_source_pathFinder(structure:Structure):void {
        if(!this.memory.target_pos){
            this.memory.target_pos = {}
        }

        const structure_pos:RoomPosition = structure.pos

        const energy_sources = this.find(FIND_STRUCTURES,{filter:i=>i.structureType==STRUCTURE_CONTAINER || i.structureType==STRUCTURE_STORAGE})
        let map = new Map()
        for(var source of energy_sources){
            let path:PathStep[]
            let source_array:Array<Structure['id']> = []
            path = this.findPath(structure_pos,source.pos,{
                ignoreCreeps:true,
                plainCost:2,
                costCallback:(roomName:string,costMatrix)=>{
                    if(roomName == this.name){
                        this.find(FIND_STRUCTURES).forEach(i=>{
                            if(i.structureType == STRUCTURE_ROAD){
                                costMatrix.set(i.pos.x, i.pos.y, 1)
                            }
                        })
                    }
                    return costMatrix
                }
            })
            source_array.push(source.id)
            if(!map.has(path.length)){
                map.set(path.length,source_array)
            }else{
                source_array.push(map.get(path.length))
                map.set(path.length,source_array)
            }
        }
        const sorted =new Map([...map.entries()].sort());
        let source_list:Array<StructureContainer['id'] | StructureStorage['id']>=[]
        for(let values of sorted.values()){
            for(let value of values){
                source_list.push(value)
            }
        }
        this.memory.target_pos[structure.id] = {source:source_list}
    }


    /**
     * 房间内存初始化
     */
    public roomInitial(): void{
        if(!this.memory.initial){
            this.memory.creepNum={['harvester']:0,['upgrader']:0,['carrier']:0,['builder']:0,['repairer']:0}
            this.createHaversterApi()
            this.createApi(1,'upgrader')
            this.memory.level = 0
            this.memory.initial = true
            this.memory.container=[]
        }
    }

    private roomLevel(): void{
        if(this.memory.level == 0){
           const container= this.find(FIND_STRUCTURES,{
                filter: (i: StructureContainer) => i.structureType == STRUCTURE_CONTAINER
            })
            if(container.length){
                this.memory.level = 1
                return
            }else{
                return
            }
        }
        if(this.controller){
            this.memory.level = this.controller?.level
        }
    }

    /**
     * creep生成函数
     * @param name creep名称/Api名称
     */
    public spawnMission(name:string):void{
        // 此房间spawn
        const this_spawn = this.find(FIND_MY_SPAWNS)[0]
        const return_code = this_spawn.addTask(name)
        this.memory.creepConfigs[name].inList = true
        console.log('Spawn mission add: ' + return_code +' mission in the list')
    }

    /**
     * 内存检查 并发布孵化任务
     */
    public checkMemory(): void {
        const creeps = this.find(FIND_MY_CREEPS)
        for(var config in this.memory.creepConfigs){
            if(!_.find(creeps,creep => creep.name == config) && !this.memory.creepConfigs[config].inList){
                if(!Game.creeps[config] || !Memory.creeps[config]){
                    this.spawnMission(config)
                }
            }
        }
            
    }

    private creepApiControl():void{
        const level = this.memory.level
        const roles = ['upgrader','carrier','builder','repairer']
        roles.forEach(role => this.numberCalculate(role,level))
    }

    private numberCalculate(name:string, level:number): void{
        const target = creepNumber[level][name]
        if(target){
            const diff = target - this.memory.creepNum[name]
            if(diff !=0){
                for(var i=0;i<diff;i++){
                    this.createApi(this.memory.creepNum[name]+1+i,name)
                }
            }
        }
    }

    public getAvaliblesource(): void{
        const containersWithEnergy = this.find(FIND_STRUCTURES, {
            filter: (i: StructureContainer | StructureStorage) => i.structureType == STRUCTURE_CONTAINER && i.store[RESOURCE_ENERGY] > 100 || i.structureType == STRUCTURE_STORAGE && i.store[RESOURCE_ENERGY] > 100
        })
        
        let result:Array<StructureContainer['id'] | StructureStorage['id']> =[]
        if (containersWithEnergy.length){
            for (let i of containersWithEnergy){
                if(i.structureType == STRUCTURE_CONTAINER && i.store[RESOURCE_ENERGY] >= 100){
                    result.push(i.id)
                }

                if(i.structureType == STRUCTURE_STORAGE && i.store[RESOURCE_ENERGY] >= 100){
                    result.push(i.id)
                }
            }
            if(result){
                this.memory.energy_avalible = result
            }
        }
    }

    public getRepairstructure():Structure | ERR_NOT_FOUND{
        const damagedStructure = this.find(FIND_STRUCTURES,{
            filter:(i:Structure) => i.structureType != STRUCTURE_WALL && i.hits<i.hitsMax
        })

        if(damagedStructure.length){
            damagedStructure.sort((a,b) => (a.hits/a.hitsMax) - (b.hits/b.hitsMax));
            return damagedStructure[0]
        }

        return ERR_NOT_FOUND
    }

    private fill_extension():void{
        const extensions = this.find(FIND_MY_STRUCTURES,{
            filter:(i:StructureExtension) => i.structureType == STRUCTURE_EXTENSION && i.store.getFreeCapacity(RESOURCE_ENERGY) != 0
        })
        
        // 此房间spawn
        const this_spawn = this.find(FIND_MY_SPAWNS)[0]

        if(extensions.length){
            this.memory.fill_extension = extensions
        }else{
            this.memory.fill_extension = []
        }

        if(this_spawn.store.getFreeCapacity(RESOURCE_ENERGY)!=0){
            this.memory.fill_extension?.push(this_spawn)
        }

    }

    private fill_tower():void{
        const tower = this.find(FIND_MY_STRUCTURES,{
            filter:(i:StructureTower) => i.structureType == STRUCTURE_TOWER && i.store.getFreeCapacity(RESOURCE_ENERGY) != 0
        })
        
        if(tower.length){
            this.memory.fill_tower = tower
        }else{
            this.memory.fill_tower = []
        }
    }

    private fill_storage():void{
        const tower = this.find(FIND_MY_STRUCTURES,{
            filter:(i:StructureStorage) => i.structureType == STRUCTURE_STORAGE && i.store.getFreeCapacity(RESOURCE_ENERGY) != 0
        })
        
        if(tower.length){
            this.memory.fill_storage = tower
        }else{
            this.memory.fill_storage = []
        }
    }

    private find_enemy():void{
        const enemy = this.find(FIND_HOSTILE_CREEPS)
        this.memory.enemy_creep = enemy
    }
    /**
     * 房间工作整合
     */
    public work():void{
        this.roomInitial()
        this.checkMemory()
        this.roomLevel()
        this.creepApiControl()
        this.fill_extension()
        this.fill_storage()
        this.fill_tower()
        this.find_enemy()
        this.getAvaliblesource()
        if(Game.time%100 ==0){
            this.find(FIND_STRUCTURES,{filter:i=>{
                if('store' in i && i.structureType != STRUCTURE_CONTAINER){
                    this.energy_source_pathFinder(i)
                }
            }})
        }
    }
}