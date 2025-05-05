export const ELF_FLAG = "ELF"
export const ORC_FLAG = "ORC"
export const NULL = "NULL"

export function dice(chance) {
    
    const x = Math.floor(Math.random() * 101);
    if ( x <= chance) {
        return true 
    }
    return false
}
