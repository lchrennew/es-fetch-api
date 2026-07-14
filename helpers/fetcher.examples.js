import { Fetcher } from "./fetcher.js";
import { POST } from "../middlewares/index.js";

const getBackendBaseUrl = async () => 'http://localhost:8000';
const useToken = (ctx, next) => {
    ctx.header('Authorization', 'Token demo')
    return next()
}

const { getText, getJSON, getEvents } = new Fetcher(getBackendBaseUrl, useToken);

const text = await getText('hello', POST)
const json = await getJSON('users/1')
console.log(text, json)
await getEvents('/stream').on(event => console.log(event))
