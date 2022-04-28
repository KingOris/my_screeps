import { bodaypart } from "src/setting"

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
            this.room.memory.creepConfigs[task_name].inList = false
        }else{
            //console.log('Spawn creep failed: ' + task_name + ' error_code' + spawn_code)
        }

        this.checkSpawnTask()
    }

    private checkSpawnTask():void{
        for(var config in this.room.memory.creepConfigs){
            if(!this.hasSpawnTask(config) && this.room.memory.creepConfigs[config].inList){
                this.room.memory.creepConfigs[config].inList = false
            }

            if(this.hasSpawnTask(config) && !this.room.memory.creepConfigs[config].inList){
                this.room.memory.creepConfigs[config].inList = true
            }
        }
    }

    private hasSpawnTask(task_name:string):boolean{
        return this.memory.spawnList.indexOf(task_name) > -1 
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

        const return_code = this.spawnCreep(this.bodyCalculate(creep_config.bodys),taskName,{memory:{role:creep_config.role,ready:false,building:false,targetId:target,sourceId:source}})
        return return_code
    }

    private getNumRange(number:number):EnergyRange{
        switch(true){
            case number >= 10000:
                return 10000;
            case number >= 5600:
                return 5600;
            case number >= 2300:
                return 2300;
            case number >= 1800:
                return 1800;
            case number >= 1300:
                return 1300;
            case number >= 800:
                return 800;
             case number >= 550:
                return 550;
            case number >= 300:
                return 300
            default:
                return 300
        }
    }
    
    private bodyCalculate(role:BodyRoles):BodyPartConstant[]{
        const roomEnergy = this.getNumRange(this.room.energyAvailable)

        let body_parts:BodyPartConstant[] = []

        const get_body_parts = bodaypart[role][roomEnergy]

        for(let i=0;i<get_body_parts[WORK];i++){
            body_parts.push('work')
        }
        
        for(let i=0;i<get_body_parts[MOVE];i++){
            body_parts.push('move')
        }

        for(let i=0;i<get_body_parts[CARRY];i++){
            body_parts.push('carry')
        }

        return body_parts
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