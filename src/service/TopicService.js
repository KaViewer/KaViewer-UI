import getApi from "../router/baseUrl"

const domain = "/topic"

export function addTopic(cluster, payload = {}) {
    const headers = {
        "Content-Type": "application/json",
        "k-cluster": cluster
    };
    const requestOptions = {
        method: "POST",
        headers: headers,
        body: JSON.stringify(payload),
    };
    return fetch(getApi(domain), requestOptions)
}

export function deleteTopic(cluster, topic) {
    const headers = {
        "Content-Type": "application/json",
        "k-cluster": cluster
    };
    const requestOptions = {
        method: "DELETE",
        headers: headers,
    };
    return fetch(getApi(domain)+"?topic="+topic, requestOptions)
}