export class SpawnExtension extends StructureSpawn {

    public work():void{
        this.spawnInitial()

        if(this.spawning || !this.memory.spawnList || this.memory.spawnList.length == 0){
            return
        }

        const task_name = this.memory.spawnList[0]
        const spawn_code = this.doSpawn(task_name)
        
        if(spawn_code == 0){
            this.memory.spawnList.shift()
            this.room.memory.creepConfigs[task_name].inList =false
        }else{
            console.log('Spawn creep failed: ' + task_name + ' error_code' + spawn_code)
        }
    }

    public addTask(taskName:string): number{
        if(!this.memory.spawnList){
            this.memory.spawnList = []
        }
        this.memory.spawnList.push(taskName)
        return this.memory.spawnList.length
    }

    public doSpawn(taskName:string): ScreepsReturnCode{
        const creep_config = this.room.memory.creepConfigs[taskName]
        const source = creep_config.data?.sourceId
        const target = creep_config.data?.targetId

        const return_code = this.spawnCreep(creep_config.bodys,taskName,{memory:{role:creep_config.role,ready:false,building:false,targetId:target,sourceId:source}})
        return return_code
    }

    /**
     * Spawn内存初始化
     */
    public spawnInitial():void{
        if(!this.memory.initial){
            this.memory.spawnList = []
            this.memory.initial = true
        }
    }
}