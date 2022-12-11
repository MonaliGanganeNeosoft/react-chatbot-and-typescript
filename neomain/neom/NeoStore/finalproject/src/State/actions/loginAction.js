export const loginEnable = () => {
    return {
        type: 'enable'
    }
}
export const loginDisable = (uuid) => {
    return {
        type: 'disable',
        payload: uuid
    }
}