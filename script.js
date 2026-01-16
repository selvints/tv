
let m3uUrl = 'https://bsite.net/Spgis/tv/link/gt.m3u'; 

function selectchange() {
    const ops = document.getElementById("selops");
    
    // Mapa de opciones para evitar el exceso de IFs
    const listas = {
        "opcion1": 'https://bsite.net/Spgis/tv/link/ar.m3u',
        "opcion2": 'https://bsite.net/Spgis/tv/link/bo.m3u',
        "opcion3": 'https://bsite.net/Spgis/tv/link/br.m3u',
        "opcion4": 'https://bsite.net/Spgis/tv/link/cl.m3u',
        "opcion5": 'https://bsite.net/Spgis/tv/link/co.m3u',
        "opcion6": 'https://bsite.net/Spgis/tv/link/cr.m3u',
        "opcion7": 'https://bsite.net/Spgis/tv/link/ec.m3u',
        "opcion8": 'https://bsite.net/Spgis/tv/link/es.m3u',
        "opcion9": 'https://bsite.net/Spgis/tv/link/usa.m3u',
        "opcion10": 'https://bsite.net/Spgis/tv/link/gt.m3u',
        "opcion11": 'https://bsite.net/Spgis/tv/link/mx.m3u',
        "opcion12": 'https://bsite.net/Spgis/tv/link/py.m3u',
        "opcion13": 'https://bsite.net/Spgis/tv/link/Pluto Tv.m3u',
        "opcion14": 'https://bsite.net/Spgis/tv/link/do.m3u',
        "opcion15": 'https://bsite.net/Spgis/tv/link/ve.m3u'
    };

    // 2. Actualizamos la variable global
    if (listas[ops.value]) {
        m3uUrl = listas[ops.value];
        
        // 3. Limpiamos la lista visualmente antes de cargar la nueva
        document.getElementById('channel-list').innerHTML = "Cargando nuevos canales...";
        
        // 4. Llamamos a la función de carga
        loadPlaylist();
    }
}
const player = videojs('my-video');
const channelListContainer = document.getElementById('channel-list');
const currentChannelTitle = document.getElementById('current-channel-name');

// Proxy gratuito para saltar CORS (puedes probar otros si este falla)
//const proxyUrl = "https://cors-anywhere.herokuapp.com/";

async function loadPlaylist() {
    try {
        // Intentamos cargar la lista. Si falla, avisamos al usuario.
        const response = await fetch(m3uUrl);
        if (!response.ok) throw new Error('No se pudo acceder a la lista');
        const data = await response.text();
        parseM3U(data);
    } catch (error) {
        channelListContainer.innerHTML = `
            <div style="color:#ff4444; padding:10px;">
                Error al cargar la lista.<br>
            </div>`;
    }
}

function parseM3U(content) {
    const lines = content.split('\n');
    let channels = [];
    let currentChannel = {};

    lines.forEach(line => {
        line = line.trim();
        if (line.startsWith('#EXTINF:')) {
            const nameMatch = line.split(',')[1];
            currentChannel.name = nameMatch || "Canal desconocido";
        } else if (line.startsWith('http')) {
            currentChannel.url = line;
            channels.push(currentChannel);
            currentChannel = {};
        }
    });
    displayChannels(channels);
}

function displayChannels(channels) {
    channelListContainer.innerHTML = '';
    channels.forEach((channel) => {
        const div = document.createElement('div');
        div.classList.add('channel-item');
        div.innerText = channel.name;
        div.onclick = () => playChannel(channel.url, channel.name, div);
        channelListContainer.appendChild(div);
    });
    
}

function playChannel(url, name, element) {
    // 1. Limpiar errores previos
    currentChannelTitle.innerText = "Cargando: " + name;
    
    // 2. Intentar reproducir con la URL original
    player.src({
        src: url,
        type: 'application/x-mpegURL'
    });

    player.play().catch(() => {
        // 3. Si falla (posible CORS), intentamos usar el Proxy como segunda opción
        console.log("Reintentando con proxy...");
        player.src({
            src: proxyUrl + url,
            type: 'application/x-mpegURL'
        });
        player.play();
    });

    // Manejo visual de la lista
    document.querySelectorAll('.channel-item').forEach(el => el.classList.remove('active'));
    element.classList.add('active');
}

loadPlaylist();