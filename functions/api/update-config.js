export async function onRequestPost(context) {
    const { request, env } = context;
    
    // 验证token
    const token = request.headers.get('Authorization');
    if (!token || !isValidToken(token, env)) {
        return new Response(JSON.stringify({ 
            success: false, 
            message: '未授权访问' 
        }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    try {
        const { defaultBgImage } = await request.json();
        
        // 使用 KV 存储背景图片 URL
        await env.SETTINGS.put('defaultBgImage', defaultBgImage);
        
        return new Response(JSON.stringify({ 
            success: true 
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ 
            success: false, 
            message: '更新失败' 
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

function isValidToken(token, env) {
    try {
        const decoded = JSON.parse(atob(token.replace('Bearer ', '')));
        return decoded.username === env.AUTH_USERNAME && 
               Date.now() < decoded.expiresAt;
    } catch {
        return false;
    }
} 