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
    public addCreepApi(creepNames:string,role:CreepRoleName,spawnRoom:string,bodys:string[],data?:CreepData):void{
        //如果没有就生成一个空的
        if(!this.memory.creepConfigs){
            this.memory.creepConfigs = {}
        }
        //加入内存
        this.memory.creepConfigs[creepNames] = {role,spawnRoom,bodys,data}
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
     * 内存检查 删掉不需要内存
     */
    public checkMemory(): void {
        
    }
    
    /**
     * 房间工作整合
     */
    public doing():void{

    }
}