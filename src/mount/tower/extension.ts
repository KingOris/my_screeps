export default class TowerExtension extends StructureTower{
    public work():void{
        this.defense()
    }

    private defense():void{
        const enemys = this.room.memory.enemy_creep
        if(!enemys || enemys.length <=0 ){
            return
        }

        this.fire(enemys)
    }

    private fire(enemys:(Creep|PowerCreep)[]):ScreepsReturnCode {
        if(enemys.length<=0){
            return ERR_NOT_FOUND
        }
        return this.attack(this.pos.findClosestByRange(enemys)!)
    }
}