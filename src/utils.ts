export const assignPrototype = function(obj1: {[key: string]: any}, obj2: {[key: string]: any}) {
    Object.getOwnPropertyNames(obj2.prototype).forEach(key => {
        if (key.includes('Getter')) {
            Object.defineProperty(obj1.prototype, key.split('Getter')[0], {
                get: obj2.prototype[key],
                enumerable: false,
                configurable: true
            })
        }
        else obj1.prototype[key] = obj2.prototype[key]
    })
}

export function doing(...hashMaps:object[]):void{
    hashMaps.forEach((obj) =>{
        Object.values(obj).forEach(item=>{
            if(item.work){
                item.work()
            }
        })
    })
}