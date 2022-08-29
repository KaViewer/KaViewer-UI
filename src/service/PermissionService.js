import getApi from "../router/baseUrl"

const headers = { "Content-Type": "application/json" };
const domain = "/permission"
const key = "PERMISSION"

async function getPermission() {
    const res = await fetch(getApi(domain), { headers })
    const resp = await res.json()
    return resp
}
export async function getPermissionList() {
    let permission = sessionStorage.getItem(key)
    if (!permission) {
        const data = await getPermission()
        let store = {};
        data.forEach(element => {
            store[element.type] = element.toggles
        })
        sessionStorage.setItem(key, JSON.stringify(store).toLocaleLowerCase())
    }
    permission = JSON.parse(sessionStorage.getItem(key))
    return permission

}
