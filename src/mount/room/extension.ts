
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
    public addCreepApi(creepNames:string,role:CreepRoleName,spawnRoom:string,bodys:BodyPartConstant[],data?:CreepData):void{
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
        energy_sources.forEach(source => this.addCreepApi('Harvester' + source.id,'harvester',this.name,['work','carry','move'],{sourceId : source.id}))
    }

    /**
     * 生成upgraderApi
     */
    private createUpgraderApi():void{
        this.addCreepApi('Upgrader','upgrader',this.name,['work','carry','move'])
    }

    /**
     * 房间内存初始化
     */
    public roomInitial():void{
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
        const return_code = this.find(FIND_MY_SPAWNS)[0].addTask(name)
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
                if(!Game.creeps[config].spawning){
                    this.spawnMission(config)
                }
            }
        }
            
    }

    /**
     * 房间工作整合
     */
    public doing():void{
        this.roomInitial()
        this.checkMemory()
    }
}