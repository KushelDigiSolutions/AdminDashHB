export const getDataClone = (data: Array<any> | { [key: string]: any }) => {
    return JSON.parse(JSON.stringify(data))
}