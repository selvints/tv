const http = require('http');

const server = http.createServer((req, res) => {
    const channelId = req.url.replace('/', '');
    if (!channelId || channelId === "favicon.ico") {
        res.end("Proxy Online");
        return;
    }

    const targetUrl = `http://live.proyectoxpro.com:8080/mAmaRony4w/cFQqrbyu79/${channelId}`;

    // Configuración para mantener la conexión viva
    const options = {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Referer': 'http://live.proyectoxpro.com:8080/',
            'Connection': 'keep-alive'
        }
    };

    http.get(targetUrl, options, (proxyRes) => {
        // CABECERAS CRÍTICAS PARA MPEGTS.JS
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'video/mp2t');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('Transfer-Encoding', 'chunked'); // Indica que el tamaño es dinámico

        // Si el servidor de origen nos da error, lo pasamos
        if (proxyRes.statusCode !== 200) {
            res.writeHead(proxyRes.statusCode);
            proxyRes.pipe(res);
            return;
        }

        // El 'pipe' en Node.js es mucho más estable que en Workers para video
        proxyRes.pipe(res);

        // Si el cliente (tu web) cierra el reproductor, cerramos la conexión al IPTV
        req.on('close', () => {
            proxyRes.destroy();
        });

    }).on('error', (e) => {
        console.error(e.message);
        res.end();
    });
});

server.listen(process.env.PORT || 3000);
