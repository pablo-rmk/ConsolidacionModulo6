const http = require('http');
const fs = require('fs/promises')

const animeServer = http.createServer(async (req, res) => {
    try {
        let animes = JSON.parse(await fs.readFile('anime.json', 'utf8'));
        const { searchParams, pathname } = new URL(req.url, `http://${req.headers.host}`);
        const params = new URLSearchParams(searchParams);

        if (pathname === '/anime' && req.method === 'GET') {
            const id = params.get('id');
            if (id === null) {
                res.statusCode = 200;
                res.write(JSON.stringify(animes, null, 2));
            } else {
                const anime = animes[id];
                if (!anime) {
                    res.write('Anime no encontrado');
                }
                res.statusCode = 200;
                res.write(JSON.stringify(anime, null, 2));
            }
            res.end();
        } else if (pathname === '/anime' && req.method === 'POST') {
            let nuevoAnime = '';
            req.on('data', (body) => {
                nuevoAnime = JSON.parse(body);
            });
            req.on('end', async () => {
                try {
                    const nuevoId = Object.keys(animes).length + 1;
                    animes[nuevoId] = nuevoAnime;
                    res.statusCode = 200;
                    await fs.writeFile('anime.json', JSON.stringify(animes, null, 2));
                    res.write(JSON.stringify(animes, null, 2));
                } catch (error) {
                    res.write(`Error al procesar el JSON: ${error.message}`);
                } finally {
                    res.end();
                }
            });
        } else if (pathname === '/anime' && req.method === 'PUT') {
            const id = params.get('id');
            if (id === null) {
                res.write('Debe ingresar el id del anime a modificar');
            } else if (parseInt(id) < 1 || parseInt(id) > Object.keys(animes).length) {
                res.write('Anime no encontrado');
            } else {
                try {
                    let anime = '';
                    req.on('data', (body) => {
                        anime = JSON.parse(body);
                    });
                    req.on('end', async () => {
                        if (!animes[id]) {
                            res.write('Anime no encontrado');
                        } else {
                            const animesUpdate = { ...animes[id], ...anime };
                            animes[id] = animesUpdate;
                            await fs.writeFile('anime.json', JSON.stringify(animes, null, 2));
                            res.statusCode = 200;
                            res.write(JSON.stringify(animes, null, 2));
                            res.write('Anime modificado correctamente');
                        };
                    });
                } catch (error) {
                    res.write(`Error al procesar el JSON: ${error.message}`);
                } finally {
                    res.end();
                };
            };
        } else if (pathname === '/anime' && req.method === 'DELETE') {
            const id = params.get('id');
            if (!id) {
                res.write('Debe ingresar el id del anime a eliminar');
                return res.end();
            } else {
                if (!animes[id]) {
                    res.write('Anime no encontrado');
                }
                delete animes[id];
                await fs.writeFile('anime.json', JSON.stringify(animes, null, 2));
                res.statusCode = 200;
                res.write('Anime eliminado correctamente');
            }
            res.end();
        } else {
            res.write('Ruta no encontrada');
        }
        res.end();
    } catch (error) {
        res.write(`Error en el servidor: ${error.message}`);
        res.end();
    }
}).listen('3000', () => {
    console.log('Servidor funcionando en puerto 3000');
});

module.exports = { animeServer };