export async function onRequestPost(context) {
    const { request, env } = context;
    const { username, password } = await request.json();
    
    // 从环境变量获取凭据
    const VALID_USERNAME = env.AUTH_USERNAME;
    const VALID_PASSWORD = env.AUTH_PASSWORD;
    
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
        // 生成带过期时间的token（7天后过期）
        const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7天后的时间戳
        const token = btoa(JSON.stringify({
            username,
            expiresAt
        }));
        
        return new Response(JSON.stringify({ 
            success: true, 
            token,
            expiresAt
        }), {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    
    return new Response(JSON.stringify({ 
        success: false, 
        message: '用户名或密码错误' 
    }), {
        status: 401,
        headers: {
            'Content-Type': 'application/json'
        }
    });
} 