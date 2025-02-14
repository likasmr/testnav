export async function onRequestGet(context) {
    const { env } = context;
    try {
        const links = await env.SETTINGS.get('siteLinks', { type: 'json' }) || {};
        return new Response(JSON.stringify(links), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: '获取链接失败' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

export async function onRequestPost(context) {
    const { request, env } = context;
    
    // 验证token
    const token = request.headers.get('Authorization');
    if (!isValidToken(token, env)) {
        return new Response(JSON.stringify({ 
            success: false, 
            message: '未授权访问' 
        }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    try {
        const { links } = await request.json();
        await env.SETTINGS.put('siteLinks', JSON.stringify(links));
        
        return new Response(JSON.stringify({ 
            success: true 
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ 
            success: false,
            message: '保存失败' 
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