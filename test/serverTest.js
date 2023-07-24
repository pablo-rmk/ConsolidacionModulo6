const chai = require('chai');
const chaiHttp = require('chai-http');
const { animeServer } = require('../index');

chai.use(chaiHttp);

describe('Probando respuesta del servidor para GET', () => {
    it('Comprueba codigo de respuesta de GET /anime sea igual a 200', (done) => {
        chai.request(animeServer).get('/anime').end((error, respuesta) => {
            chai.expect(respuesta).to.have.status(200);
            done();
        });
    });
});
describe('Probando respuesta del servidor para GET', () => {
    it('Comprueba codigo de respuesta para GET /anime?id=1', (done) => {
        chai.request(animeServer).get('/anime?id=1').end((error, respuesta) => {
            chai.expect(respuesta).to.have.status(200);
            done();
        });
    });
});

describe('Probando respuesta del servidor para POST /anime', () => {
    it('Comprueba código de respuesta para POST /anime', (done) => {
        chai.request(animeServer).post('/anime').send({
            "nombre": "Anime de Prueba",
            "genero": "Prueba",
            "año": "2023",
            "autor": "Pablo"
        }).end((error, respuesta) => {
            chai.expect(respuesta).to.have.status(200);
            done();
        });
    });
});

describe('Probando respuesta del servidor para PUT /anime', () => {
    it('Comprueba código de respuesta para PUT /anime?id=6', (done) => {
        chai.request(animeServer).put('/anime?id=6').send({
            "nombre": "Modifica Anime de Prueba",
            "genero": "Modifica Prueba",
            "año": "2033",
            "autor": "Pablo"
        }).end((error, respuesta) => {
            chai.expect(respuesta).to.have.status(200);
            done();
        });
    });
});


describe('Probando respuesta del servidor para DELETE /anime', () => {
    it('Comprueba código de respuesta para DELETE /anime?id=6', (done) => {
        chai.request(animeServer).delete('/anime?id=6').end((error, respuesta) => {
            chai.expect(respuesta).to.have.status(200);
            done();
        });
    });
});