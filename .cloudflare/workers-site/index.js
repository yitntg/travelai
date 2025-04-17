import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

/**
 * Cloudflare Workers site handler
 */
addEventListener('fetch', event => {
  event.respondWith(handleEvent(event));
});

async function handleEvent(event) {
  try {
    // 从KV存储获取静态资源
    return await getAssetFromKV(event);
  } catch (e) {
    // 处理错误
    let pathname = new URL(event.request.url).pathname;
    return new Response(`构建资源未找到: ${pathname}`, {
      status: 404,
      statusText: 'not found'
    });
  }
} 