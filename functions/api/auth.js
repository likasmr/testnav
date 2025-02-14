export async function onRequestPost(context) {
    const { request, env } = context;
    const { username, password } = await request.json();
    
    // 从环境变量获取凭据
    const VALID_USERNAME = env.AUTH_USERNAME;
    const VALID_PASSWORD = env.AUTH_PASSWORD;
    
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
        // 生成一个简单的token（实际应用中应该使用更安全的方式）
        const token = btoa(`${username}:${Date.now()}`);
        
        return new Response(JSON.stringify({ 
            success: true, 
            token 
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