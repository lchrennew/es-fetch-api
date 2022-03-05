import { methods } from "../fetch.js";

/**
 * https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods
 * @param m
 * @return {function(*, *): Promise<*>}
 */
const method = m => async (ctx, next) => {
    ctx.method = m;
    return await next()
};
/**
 * GET方法请求一个指定资源的表示形式. 使用GET的请求应该只被用于获取数据。
 * @type {function(*, *): Promise<*>}
 */
export const GET = method('GET');
/**
 * POST方法用于将实体提交到指定的资源，通常导致在服务器上的状态变化或副作用。
 * @type {function(*, *): Promise<*>}
 */
export const POST = method('POST');
/**
 * PUT方法用请求有效载荷替换目标资源的所有当前表示。
 * @type {function(*, *): Promise<*>}
 */
export const PUT = method('PUT');
/**
 * DELETE方法删除指定的资源。
 * @type {function(*, *): Promise<*>}
 */
export const DELETE = method('DELETE');

/**
 * PATCH方法用于对资源应用部分修改。
 * @type {function(*, *): Promise<*>}
 */
export const PATCH = method('PATCH');

/**
 * CONNECT方法建立一个到由目标资源标识的服务器的隧道。
 * @type {function(*, *): Promise<*>}
 */
export const CONNECT = method('CONNECT');

/**
 * HEAD方法请求一个与GET请求的响应相同的响应，但没有响应体。
 * @type {function(*, *): Promise<*>}
 */
export const HEAD = method('HEAD');

/**
 * OPTIONS方法用于描述目标资源的通信选项。
 * @type {function(*, *): Promise<*>}
 */
export const OPTIONS = method('OPTIONS');

/**
 * TRACE方法沿着到目标资源的路径执行一个消息环回测试。
 * @type {function(*, *): Promise<*>}
 */
export const TRACE = method('TRACE');
