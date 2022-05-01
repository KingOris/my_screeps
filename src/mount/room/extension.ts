import harvester from "src/role/role.harvester"
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
     * 生成upgraderApi
     */
    private createUpgraderApi(): void{
        this.addCreepApi('Upgrader1','upgrader',this.name,'worker')
        this.addCreepApi('Upgrader2','upgrader',this.name,'worker')
    }

    /**
     * 检查能量可采集位置数量
     */
    private energy_source_pos_check(source:Source): void{
        for (let i = 0; i <= this.pos_avail(source); i++){
            this.addCreepApi('Harvester' + i + source.id,'harvester',this.name,'harvester',{sourceId : source.id})
        }

    }

    private pos_avail(source:Source): number{
        const pos = source.pos
        const x = pos.x
        const y = pos.y
        const position = this.check_pos(x+1,y+1) + this.check_pos(x-1,y-1) + this.check_pos(x+1,y) + this.check_pos(x,y+1) + this.check_pos(x-1,y) + this.check_pos(x,y-1)
        console.log(position + source.id)
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
     * 房间内存初始化
     */
    public roomInitial(): void{
        if(!this.memory.initial){
            this.createHaversterApi()
            this.createUpgraderApi()

            this.memory.initial = true
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

    public getAvaliblesource(): Array<StructureContainer | StructureStorage> | ERR_NOT_FOUND{
        const containersWithEnergy = this.find(FIND_STRUCTURES, {
            filter: (i: StructureContainer | StructureStorage) => i.structureType == STRUCTURE_CONTAINER || i.structureType == STRUCTURE_STORAGE && i.store[RESOURCE_ENERGY] > 0
        })
        
        let result:Array<StructureContainer | StructureStorage> =[]
        if (containersWithEnergy.length){
            for (let i of containersWithEnergy){
                if(i.structureType == STRUCTURE_CONTAINER && i.store[RESOURCE_ENERGY] >= 100){
                    result.push(i)
                }

                if(i.structureType == STRUCTURE_STORAGE && i.store[RESOURCE_ENERGY] >= 100){
                    result.push(i)
                }
            }
            return result
        }

        return ERR_NOT_FOUND
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

    /**
     * 房间工作整合
     */
    public doing():void{
        this.roomInitial()
        this.checkMemory()
        this.fill_extension()
        this.fill_storage()
        this. fill_tower()
    }
}