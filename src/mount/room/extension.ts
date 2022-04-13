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
    public addCreepApi(creepNames:string,role:CreepRoleName,data:CreepData,spawnRoom:string,bodys:string[]):void{
        //如果没有就生成一个空的
        if(!this.memory.creepConfigs){
            this.memory.creepConfigs = {}
        }
        //加入内存
        this.memory.creepConfigs[creepNames] = {role,data,spawnRoom,bodys}
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

    private createHaversterApi():void{
        const energy_sources = this.find(FIND_SOURCES)
        energy_sources.forEach(source => this.addCreepApi('Harvester' + source.id,'harvester',{sourceId : source.id},this.name,['work','carry','move']))
    }

    /**
     * 房间内存初始化
     */
    public roomInitial():void{
        if(!this.memory.initial){
            this.createHaversterApi()
            this.memory.initial = true
        }
    }
}