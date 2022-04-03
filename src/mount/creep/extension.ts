import harvester from "src/role/role.harvester";
import upgrader from "src/role/role.upgrader";
/**
 * 引入 creep 配置项
 * 其键为角色名（role），其值为对应角色的逻辑生成函数
 */
 const roles = {
    'harvester': harvester,
    'upgrader': upgrader
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
}