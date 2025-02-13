export async function onRequest(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const key = url.searchParams.get('key') || 'default';

    // 处理 CORS
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    // 处理 OPTIONS 请求
    if (request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        switch (request.method) {
            case 'GET':
                const value = await env.BACKGROUNDS.get(key);
                return new Response(value || '', {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                });

            case 'POST':
                const data = await request.json();
                await env.BACKGROUNDS.put(key, JSON.stringify(data));
                return new Response(JSON.stringify({ success: true }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                });

            default:
                return new Response('Method not allowed', { status: 405, headers: corsHeaders });
        }
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
} 