export async function onRequestGet(context) {
    const { env } = context;
    
    try {
        // 从 KV 存储中获取所有链接
        const links = await env.SETTINGS.get('siteLinks');
        
        return new Response(JSON.stringify({ 
            links: links ? JSON.parse(links) : {}
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ 
            error: '获取链接失败' 
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

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
        const { action, category, link } = await request.json();
        let links = await env.SETTINGS.get('siteLinks');
        links = links ? JSON.parse(links) : {};
        
        switch (action) {
            case 'add':
                // 如果分类不存在，创建新分类
                if (!links[category]) {
                    links[category] = [];
                }
                // 添加新链接
                links[category].push(link);
                break;
                
            case 'remove':
                if (links[category]) {
                    links[category] = links[category].filter(item => 
                        item.url !== link.url
                    );
                    // 如果分类为空，删除分类
                    if (links[category].length === 0) {
                        delete links[category];
                    }
                }
                break;
                
            case 'update':
                if (links[category]) {
                    const index = links[category].findIndex(item => 
                        item.url === link.oldUrl
                    );
                    if (index !== -1) {
                        links[category][index] = {
                            name: link.name,
                            url: link.url,
                            color: link.color
                        };
                    }
                }
                break;
        }
        
        // 保存更新后的链接
        await env.SETTINGS.put('siteLinks', JSON.stringify(links));
        
        return new Response(JSON.stringify({ 
            success: true,
            links
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ 
            success: false,
            message: '操作失败'
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