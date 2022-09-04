import getApi from "../router/baseUrl"

const headers = { "Content-Type": "application/json" };
const domain = "/cluster"

export function getClusterList() {
    const subEndpoint = "/meta"
    return fetch(getApi([domain, subEndpoint].join("")), { headers })
        .then((resp) => {
            return resp.json();
        })
}

const requestOptions = {
    method: "DELETE",
    headers: headers,
};
export function deleteCluster(clusterName) {
    return fetch(getApi(domain) + "?cluster=" + clusterName, requestOptions)
}
