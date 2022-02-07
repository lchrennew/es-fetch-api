import http from "http";

const server = http.createServer((request, response) => {
    console.log(request.method, request.url)
    response.setHeader('Access-Control-Allow-Origin', new URL(request.headers.referer).origin)
    response.setHeader('Access-Control-Allow-Credentials', 'true')
    response.setHeader('Access-Control-Allow-Headers', 'content-type')
    response.write(`hello ${Date()}`)
    setTimeout(() => response.end(), Math.random() * 3 * 1000)
})
server.listen(8080)
