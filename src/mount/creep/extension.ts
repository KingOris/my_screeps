import builder from "src/role/role.builder";
import harvester from "src/role/role.harvester";
import upgrader from "src/role/role.upgrader";
import repairer from "src/role/role.repairer";
import carrier from "src/role/role.carrier";

/**
 * 引入 creep 配置项
 * 其键为角色名（role），其值为对应角色的逻辑生成函数
 */
 const roles = {
    'harvester': harvester,
    'upgrader': upgrader,
    'builder': builder,
    'repairer': repairer,
    'carrier': carrier
}

export class CreepExtension extends Creep {
    /*
    * 添加 work 方法
    */
    public work():void{

        const workConfig: CreepApi = roles[this.memory.role](this.memory.data!)

        if(!this.memory.ready){
            if(workConfig.prepare){
                this.memory.ready = workConfig.prepare(this)
            }else{
                this.memory.ready = true
            }
        }

        if(!this.memory.ready){
            return 
        }

        const work = workConfig.source ? (this.memory.working!): true

        let stateChange = false

        if(work){
            if(workConfig.target && workConfig.target(this)){
                stateChange = true
            }
        }else{
            if(workConfig.source && workConfig.source(this)){
                stateChange = true
            }
        }

        if(stateChange){
            this.memory.working = !this.memory.working
        }
    }
    //找墙
    public setFillWallid():void{
        const walls = this.room.find(FIND_STRUCTURES,{filter:(i)=>i.structureType == STRUCTURE_WALL || i.structureType == STRUCTURE_RAMPART})

        if(walls.length){
            for(let wall of walls){
                if(wall.structureType == STRUCTURE_WALL){
                    if(wall.hits < 1000000){
                        this.memory.fillWallId = wall.id
                    }
                }else{
                    if(wall.structureType == STRUCTURE_RAMPART){
                        if(wall.hits < 1000000){
                            this.memory.fillWallId = wall.id
                        }
                    }
                }
            }
        }
    }
    //刷墙
    public steadyWall(): OK | ERR_NOT_FOUND {
        const wall = Game.getObjectById<StructureWall | StructureRampart>(this.memory.fillWallId!)
        if (!wall) return ERR_NOT_FOUND

        if (wall.hits < 1000000) {
            const result = this.repair(wall)
            if (result == ERR_NOT_IN_RANGE) this.moveTo(wall.pos,{visualizePathStyle: {stroke:'#fa1125'}})
        }
        else delete this.memory.fillWallId

        return OK
    }

    private findNearestSource(target:Structure):StructureContainer | StructureStorage{ 
       
        const source_list = this.room.memory.target_pos[target.id]

        if(source_list){
            for(let i of source_list.source){
                if(this.room.memory.energy_avalible.indexOf(i) > -1){
                    return Game.getObjectById<StructureContainer | StructureStorage>(i)!
                }
            }
        }

        return Game.getObjectById(this.room.memory.energy_avalible[0])!
    }

    private pos2(structure1:Structure,structure2:Structure):number{
        return Math.sqrt((structure1.pos.x-structure2.pos.x)^2 + (structure1.pos.y-structure2.pos.y)^2)
    }

    public findSource(): OK | ERR_NOT_FOUND{
        let source_list: Array<StructureContainer['id'] | StructureStorage['id']>
        let sourceStructure:StructureContainer | StructureStorage
        let target:Structure | null
        if(!this.memory.sourceId){
            source_list= this.room.memory.energy_avalible
            if(!source_list.length){
                this.say('一杯二锅头',true)
                return ERR_NOT_FOUND
            }else{
                if(!this.memory.targetId){
                    target = this.room.find(FIND_MY_SPAWNS)[0]
                }else{
                    target = Game.getObjectById<Structure>(this.memory.targetId!)
                }
                if(target){
                    sourceStructure = this.findNearestSource(target)
                    this.memory.sourceId = sourceStructure.id
                    return OK
                }else{
                    return ERR_NOT_FOUND
                }
            }
        }else{
            return OK
        }
    }

}
