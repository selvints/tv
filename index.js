const http = require('http');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    // Configuración de IPTV
    const user = "mAmaRony4w";
    const pass = "cFQqrbyu79";
    const targetBase = "http://live.proyectoxpro.com:8080";

    // Extraemos el ID del canal de la URL (ej: /9615)
    const channelId = req.url.replace('/', '');

    if (!channelId || channelId === "favicon.ico") {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Servidor Proxy Activo');
        return;
    }

    // Construimos la URL de destino
    const targetUrl = `${targetBase}/${user}/${pass}/${channelId}`;

    // Cabeceras para saltar bloqueos
    const options = {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Referer': targetBase + '/',
            'Host': 'live.proyectoxpro.com:8080'
        }
    };

    // Hacemos el túnel (Proxy)
    http.get(targetUrl, options, (proxyRes) => {
        // Añadimos CORS para tu página hibrido.html
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', proxyRes.headers['content-type'] || 'video/mp2t');

        // Transmitimos el video directamente (Pipe)
        proxyRes.pipe(res);
    }).on('error', (e) => {
        res.writeHead(500);
        res.end(`Error: ${e.message}`);
    });
});

server.listen(PORT, () => {
    console.log(`Proxy corriendo en puerto ${PORT}`);
});