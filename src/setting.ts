export const bodaypart = {
    worker : {
        300:{ [WORK]: 1, [CARRY]: 1, [MOVE]: 1 },
        550: { [WORK]: 2, [CARRY]: 2, [MOVE]: 2 },
        800: { [WORK]: 3, [CARRY]: 3, [MOVE]: 3 },
        1300: { [WORK]: 4, [CARRY]: 4, [MOVE]: 4 },
        1800: { [WORK]: 6, [CARRY]: 6, [MOVE]: 6 },
        2300: { [WORK]: 7, [CARRY]: 7, [MOVE]: 7 },
        5600: { [WORK]: 12, [CARRY]: 6, [MOVE]: 9 },
        10000: { [WORK]: 20, [CARRY]: 8, [MOVE]: 14 }
    },
    harvester : {
        300: { [WORK]: 2, [CARRY]: 1, [MOVE]: 1 },
        550: { [WORK]: 2, [CARRY]: 1, [MOVE]: 1 },
        800: { [WORK]: 6, [CARRY]: 1, [MOVE]: 3 },
        1300: { [WORK]: 8, [CARRY]: 1, [MOVE]: 4 },
        1800: { [WORK]: 10, [CARRY]: 1, [MOVE]: 5 },
        2300: { [WORK]: 12, [CARRY]: 1, [MOVE]: 6 },
        5600: { [WORK]: 12, [CARRY]: 1, [MOVE]: 6 },
        10000: { [WORK]: 12, [CARRY]: 1, [MOVE]: 6 }
    }
}

export const creepNumber:{[index:number]: {[role:string]:number}} = {
    0: {['upgrader']: 1},
    1: {['upgrader']: 1, ['builder']: 1, ['carrier']: 1},
    2: {['upgrader']: 2, ['builder']: 3, ['carrier']: 3, ['repairer']: 2},
    3: {['upgrader']: 3, ['builder']: 3, ['carrier']: 4,['repairer']: 2},
    4: {['upgrader']: 4, ['builder']: 3,['carrier']: 5, ['repairer']: 3},
    5: {['upgrader']: 4, ['builder']: 3,['carrier']: 5, ['repairer']: 3},
    6: {['upgrader']: 4, ['builder']: 3,['carrier']: 5, ['repairer']: 3},
    7: {['upgrader']: 4, ['builder']: 3,['carrier']: 5, ['repairer']: 3},
    8: {['upgrader']: 4, ['builder']: 3,['carrier']: 5, ['repairer']: 3}
}
