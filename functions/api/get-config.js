export async function onRequestGet(context) {
    const { env } = context;
    
    try {
        // 从 KV 存储中获取默认背景图片
        const defaultBgImage = await env.SETTINGS.get('defaultBgImage');
        
        return new Response(JSON.stringify({ 
            defaultBgImage: defaultBgImage || null
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ 
            error: '获取配置失败' 
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
} 