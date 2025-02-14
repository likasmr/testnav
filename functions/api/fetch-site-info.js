export async function onRequestGet(context) {
    const { request } = context;
    const url = new URL(request.url).searchParams.get('url');
    
    if (!url) {
        return new Response(JSON.stringify({ 
            error: '请提供URL' 
        }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    try {
        const response = await fetch(url);
        const html = await response.text();
        
        // 使用正则表达式提取标题和描述
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        const descriptionMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i) 
            || html.match(/<meta[^>]*content="([^"]*)"[^>]*name="description"[^>]*>/i);
        const iconMatch = html.match(/<link[^>]*rel="icon"[^>]*href="([^"]*)"[^>]*>/i) 
            || html.match(/<link[^>]*href="([^"]*)"[^>]*rel="icon"[^>]*>/i);
        
        let icon = iconMatch ? new URL(iconMatch[1], url).href : null;
        
        return new Response(JSON.stringify({
            title: titleMatch ? titleMatch[1].trim() : null,
            description: descriptionMatch ? descriptionMatch[1].trim() : null,
            icon: icon
        }), {
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({ 
            error: '获取网站信息失败' 
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
} 