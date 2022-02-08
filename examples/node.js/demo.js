import { abortable, getApi, json, POST, query } from "../../fetch.js";

const api = getApi('http://localhost:8080')
setInterval(async () => {
    const controller = new AbortController()
    setTimeout(() => controller.abort(), 500)
    try {
        const response = await api(`/${Date.now()}`, POST, json({ hello: 'world' }), query({
                hello: [ 'Bing', 'Dwen', 'Dwen' ],
                world: '2022'
            }),
            abortable(controller),
        )
        console.log(response.status, response.statusText)
        const body = await response.text()
        console.log(body)
    } catch (error) {
        console.log(error.message)
    }
}, 3000)
