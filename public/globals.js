export const ELF_FLAG = "ELF"
export const ORC_FLAG = "ORC"
export const NULL = "NULL"
export const viewportWidth = 1000;
export const viewportHeight = 1000;
export const hexCols = 30;
export const hexRows = 20;





export function rollDice(chance) {
    const x = Math.floor(Math.random() * 101);
    if ( x <= chance) {
        return true 
    }
    return false
}
