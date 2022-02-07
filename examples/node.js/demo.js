import { getApi, json, POST, query } from "../../fetch.js";

const api = getApi('http://localhost:8080')
setInterval(async () => {
    const response = await api(`/${Date.now()}`, POST, json({ hello: 'world' }), query({
        hello: [ 'Bing', 'Dwen', 'Dwen' ],
        world: '2022'
    }))
    console.log(response.status, response.statusText)
    const body = await response.text()
    console.log(body)
}, 3000)
