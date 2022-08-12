const apiVersion = "v1"
const localEndPoint = `http://localhost:9394/api/${apiVersion}`
const productionEndPoint = `${window.location.protocol}//${window.location.host}/api/${apiVersion}`

const getApi = (endpoint = "") => {
    if (process.env.NODE_ENV === "development"){
    return localEndPoint + endpoint
    }

    return productionEndPoint + endpoint
}
export default getApi