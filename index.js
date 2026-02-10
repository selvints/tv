
const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

app.get('/stream/:canalId', async (req, res) => {
    const { canalId } = req.params;
    // Base de tu IPTV con tus credenciales
    const IPTV_BASE = 'http://live.proyectoxpro.com:8080/mAmaRony4w/cFQqrbyu79';
    const targetUrl = `${IPTV_BASE}/${canalId}`;

    try {
        console.log(`Solicitando canal: ${canalId}`);

        const response = await axios({
            method: 'get',
            url: targetUrl,
            responseType: 'stream',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            },
            timeout: 15000 
        });

        // Cabeceras CORS esenciales
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Content-Type', 'video/mp2t'); // Formato para MPEG-TS

        response.data.pipe(res);

        req.on('close', () => {
            response.data.destroy();
        });

    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).setHeader('Access-Control-Allow-Origin', '*').send('Error en el stream');
    }
});

app.listen(port, () => console.log(`Proxy corriendo en puerto ${port}`));
