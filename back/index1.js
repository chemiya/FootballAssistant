


//CONFIGURACION--------------------------------------------------------
const dialogflow = require('@google-cloud/dialogflow');
const express = require('express');
const axios = require('axios');
const fs = require('fs');
const cors = require('cors')

const PROJECID = "prueba-byws";
const CONFIGURATION = {
    credentials: {
        private_key: "",
        client_email: ""
    }
}





var cache = {
    equipo: "",
    temporada: "",
    competicion: "",
    parametro: "",
    jugador: "",
    incompleta: 0
}




//CONEXION CON DIALOGFLOW. sE ENCARGA DE EXTRAER LOS PARAMETROS DE LA FRASE INTRODUCIDA
const sessionClient = new dialogflow.SessionsClient(CONFIGURATION);
const detectIntent = async (languageCode, queryText, sessionId) => {

    let sessionPath = sessionClient.projectAgentSessionPath(PROJECID, sessionId);
    let request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: queryText,
                languageCode: languageCode,
            },
        },
    };


    const responses = await sessionClient.detectIntent(request);

    try{
        const result = responses[0].queryResult.parameters;
        var equipo = result.fields.equipos.stringValue
        var parametro = result.fields.parametros.stringValue
        var jugador = result.fields.jugadores.stringValue
        var competicion = result.fields.competiciones.stringValue
        var temporada = result.fields.temporadas.stringValue
    
    
        if (equipo != "") {
            console.log("Equipo recibido: " + equipo)
        } else {
            console.log("sin equipo")
        }
    
    
        if (jugador != "") {
            console.log("Jugador recibido: " + jugador)
        } else {
            console.log("sin jugador")
        }
    
    
        if (parametro != "") {
            console.log("Parametro recibido: " + parametro)
        } else {
            console.log("sin parametro")
        }
    
    
        if (temporada != "") {
            console.log("Temporada recibida: " + temporada)
        } else {
            console.log("sin temporada")
        }
    
    
        if (competicion != "") {
            console.log("Competicion recibida: " + competicion)
        } else {
            console.log("sin competicion")
        }
    
        var jsonRespuesta = {
            equipo: equipo,
            parametro: parametro,
            jugador: jugador,
            competicion: competicion,
            temporada: temporada,
            error:0
        }
    
        return jsonRespuesta
    }
    catch(error){
        var jsonRespuesta={
            mensaje:"Lo siento pero no te he entendido, ¿puedes repetirlo?",
            error:1
        }
        return jsonRespuesta
    }
    

}









//ARRAYS PARA CONVERSIONES---------------------------------------------------------
const codigoJugadores = {
    874: "Cristiano Ronaldo",
    154: "Messi",
    759: "Benzema",
    754: "Modric",
    276: "Neymar",
    738: "Sergio Ramos",
    521: "Lewandoski",
    129718: "Bellingham",
    762: "Vinícius",
    59: "Morata",
    56: "Griezmann",
    1100: "Haaland",
    909: "Rashford",
    306: "Salah",
    645: "Sterling",
    643: "Gabriel Jesus",
    1460: "Saka",
    278: "Mbappé",
    184: "Kane",
    907: "Lukaku"


};

const codigoEquipos = {
    541: "Real Madrid",
    529: "FC Barcelona",
    530: "Atlético de Madrid",
    536: "Sevilla FC",
    543: "Betis FC",
    533: "Villarreal FC",
    33: "Manchester United",
    50: "Manchester City",
    40: "Liverpool FC",
    49: "Chelsea FC",
    47: "Tottemham FC",
    42: "Arsenal FC",
    34: "Newcastle United",
    157: "Bayer Munich",
    165: "Borussia Dortmund",
    173: "RB Leipzig",
    169: "Eintracht Frankfurt",
    505: "Inter Milan",
    496: "Juventus",
    489: "AC Milan",
    492: "Napoles",
    497: "AS Roma",
    85: "Paris Saint Germain",
    91: "Monaco",
    81: "Marseilla",
    80: "Lyon"


};

const codigoLigas = {
    140: "LaLiga",
    39: "Premier League",
    78: "Bundesliga",
    135: "Serie A",
    61: "Ligue 1"

};









//FUNCION PARA HACER PETICION A LA API DE FUTBOL
const peticionFutbol = async (datos) => {
    const headers = {
        'X-RapidAPI-Key': '',
        'X-RapidAPI-Host': ''
    };




    if (cache.parametro == "") {
        cache.parametro = datos.parametro
    }

    if (cache.temporada == "") {
        cache.temporada = datos.temporada
    }

    if (cache.competicion == "") {
        cache.competicion = datos.competicion
    }

    if (cache.equipo == "") {
        cache.equipo = datos.equipo
    }

    if (cache.jugador == "") {
        cache.jugador = datos.jugador
    }

    console.log("\n\nCache actualmente:")
    console.log(cache)





    //se necesitan:
    //1. clasificacion-temporada-competicion
    //2. parametro-equipo-temporada
    //3. parametro-jugador-temporada
    //4. partidos jugados-equipo-temporada

    let completo = 0;


    if (cache.parametro != "" && cache.temporada != "" && cache.competicion != "") {
        completo = 1
    }

    if (cache.parametro != "" && cache.temporada != "" && cache.equipo != "") {
        completo = 1
    }

    if (cache.parametro != "" && cache.temporada != "" && cache.jugador != "") {
        completo = 1
    }

    if (completo == 0) {

        //1. clasificacion-temporada-competicion
        if (cache.parametro == "clasificacion" && cache.temporada == "" && cache.competicion == ""&& cache.jugador == ""&& cache.equipo == "") {
            var respuesta = {
                "tipo": -1,
                "error": "¿De qué temporada y competición quieres ver la clasificación?"
            };
            console.log("primero")
            return respuesta
        }
        if (cache.parametro == "clasificacion" && cache.temporada != "" && cache.competicion == ""&& cache.jugador == ""&& cache.equipo == "") {
            var respuesta = {
                "tipo": -1,
                "error": "¿De qué competición quieres ver la clasificación?"
            };
            console.log("segundo")
            return respuesta
        }
        if (cache.parametro == "clasificacion" && cache.temporada == "" && cache.competicion != ""&& cache.jugador == ""&& cache.equipo == "") {
            var respuesta = {
                "tipo": -1,
                "error": "¿De qué temporada quieres ver la clasificación?"
            };
            console.log("tercero")
            return respuesta
        }
        if (cache.parametro == "" && cache.temporada == "" && cache.competicion != ""&& cache.jugador == ""&& cache.equipo == "") {
            var respuesta = {
                "tipo": -1,
                "error": "¿Qué quieres ver de esa competición y en qué temporada?"
            };
            console.log("cuarto")
            return respuesta
        }
        if (cache.parametro == "" && cache.temporada != "" && cache.competicion == ""&& cache.jugador == ""&& cache.equipo == "") {
            var respuesta = {
                "tipo": -1,
                "error": "¿Qué quieres ver en esa temporada?"
            };
            console.log("quinto")
            return respuesta
        }
        if (cache.parametro == "" && cache.temporada != "" && cache.competicion != ""&& cache.jugador == ""&& cache.equipo == "") {
            var respuesta = {
                "tipo": -1,
                "error": "¿Qué parámetro quieres ver de esa competición?"
            };
            console.log("sexto")
            return respuesta
        }




        //2. parametro-equipo-temporada
        if (cache.parametro != "" && cache.temporada == "" && cache.equipo == ""&& cache.jugador == ""&& cache.competicion == "") {
            var respuesta = {
                "tipo": -1,
                "error": "¿De qué quieres ver ese parámetro?"
            };
            console.log("septimo")
            return respuesta
        }
        if (cache.parametro != "" && cache.temporada != "" && cache.equipo == ""&& cache.jugador == ""&& cache.competicion == "") {
            var respuesta = {
                "tipo": -1,
                "error": "¿De qué equipo quieres ver el parámetro?"
            };
            console.log("octavo")
            return respuesta
        }
        if (cache.parametro != "" && cache.temporada == "" && cache.equipo != ""&& cache.jugador == ""&& cache.competicion == "") {
            var respuesta = {
                "tipo": -1,
                "error": "¿De qué temporada quieres ver el parámetro?"
            };
            console.log("noveno")
            return respuesta
        }
        if (cache.parametro == "" && cache.temporada == "" && cache.equipo != ""&& cache.jugador == ""&& cache.competicion == "") {
            var respuesta = {
                "tipo": -1,
                "error": "¿Qué quieres ver de ese equipo y en qué temporada?"
            };
            console.log("decimo")
            return respuesta
        }
        if (cache.parametro == "" && cache.temporada != "" && cache.equipo != ""&& cache.jugador == ""&& cache.competicion == "") {
            var respuesta = {
                "tipo": -1,
                "error": "¿Qué parámetro quieres ver?"
            };
            console.log("undecimo")
            return respuesta
        }
        if (cache.parametro == "" && cache.temporada != "" && cache.equipo == ""&& cache.jugador == ""&& cache.competicion == "") {
            var respuesta = {
                "tipo": -1,
                "error": "¿Qué quieres ver en esa temporada?"
            };
            console.log("duodecimo")
            return respuesta
        }



        //3. parametro-jugador-temporada
        if (cache.parametro != "" && cache.temporada == "" && cache.jugador == ""&& cache.equipo == ""&& cache.competicion == "") {
            var respuesta = {
                "tipo": -1,
                "error": "¿De qué quieres ver ese parámetro?"
            };
            console.log("decimotercero")
            return respuesta
        }
        if (cache.parametro != "" && cache.temporada != "" && cache.jugador == ""&& cache.equipo == ""&& cache.competicion == "") {
            var respuesta = {
                "tipo": -1,
                "error": "¿De qué jugador quieres ver el parámetro?"
            };
            console.log("decimocuarto")
            return respuesta
        }
        if (cache.parametro != "" && cache.temporada == "" && cache.jugador != ""&& cache.equipo == ""&& cache.competicion == "") {
            var respuesta = {
                "tipo": -1,
                "error": "¿De qué temporada quieres ver el parámetro?"
            };
            console.log("decimoquinto")
            return respuesta
        }
        if (cache.parametro == "" && cache.temporada == "" && cache.jugador != ""&& cache.equipo == ""&& cache.competicion == "") {
            var respuesta = {
                "tipo": -1,
                "error": "¿Qué quieres ver de ese jugador y en qué temporada?"
            };
            console.log("decimosexto")
            return respuesta
        }
        if (cache.parametro == "" && cache.temporada != "" && cache.jugador != ""&& cache.equipo == ""&& cache.competicion == "") {
            var respuesta = {
                "tipo": -1,
                "error": "¿Qué parámetro quieres ver?"
            };
            console.log("decimoseptimo")
            return respuesta
        }
        if (cache.parametro == "" && cache.temporada != "" && cache.jugador == ""&& cache.equipo == ""&& cache.competicion == "") {
            var respuesta = {
                "tipo": -1,
                "error": "¿Qué quieres ver en esa temporada?"
            };
            console.log("decimooctavo")
            return respuesta
        }



        //4. partidos jugados-equipo-temporada
        if (cache.parametro == "partidos jugados" && cache.temporada == "" && cache.equipo == ""&& cache.jugador == ""&& cache.competicion == "") {
            var respuesta = {
                "tipo": -1,
                "error": "¿De qué temporada y de qué equipo quieres ver los partidos jugados?"
            };
            console.log("decimonoveno")
            return respuesta
        }
        if (cache.parametro == "partidos jugados" && cache.temporada != "" && cache.equipo == ""&& cache.jugador == ""&& cache.competicion == "") {
            var respuesta = {
                "tipo": -1,
                "error": "¿De qué equipo quieres ver los partidos jugados?"
            };
            console.log("vigesimo")
            return respuesta
        }
        if (cache.parametro == "partidos jugados" && cache.temporada == "" && cache.equipo != ""&& cache.jugador == ""&& cache.competicion == "") {
            var respuesta = {
                "tipo": -1,
                "error": "¿De qué temporada quieres ver los partidos jugados?"
            };
            console.log("vigesimoprimero")
            return respuesta
        }
        if (cache.parametro == "" && cache.temporada == "" && cache.equipo != ""&& cache.jugador == ""&& cache.competicion == "") {
            var respuesta = {
                "tipo": -1,
                "error": "¿Qué quieres ver de ese equipo y en qué temporada?"
            };
            console.log("vigesimosegundo")
            return respuesta
        }
        if (cache.parametro == "" && cache.temporada != "" && cache.equipo == ""&& cache.jugador == ""&& cache.competicion == "") {
            var respuesta = {
                "tipo": -1,
                "error": "¿Qué quieres ver en esa temporada?"
            };
            console.log("vigesimotercero")
            return respuesta
        }
        if (cache.parametro == "" && cache.temporada != "" && cache.equipo != ""&& cache.jugador == ""&& cache.competicion == "") {
            var respuesta = {
                "tipo": -1,
                "error": "¿Qué parámetro quieres ver de ese equipo?"
            };
            console.log("vigesimocuarto")
            return respuesta
        }

    }






    //PRIMERA OPCION: CLASIFICACION EN UNA TEMPORADA DE UNA LIGA
    //1. clasificacion-temporada-competicion
    if (cache.parametro == "clasificacion" && cache.competicion != "" && cache.temporada != "") {
        const apiUrl = 'https://api-football-v1.p.rapidapi.com/v3/standings'
        const params = {
            season: cache.temporada,
            league: cache.competicion
        }
        var respuesta = {
            "tipo": 1,
            "clasificacion": []
        };

        try {
            const response = await axios.get(apiUrl, {
                params: params,
                headers: headers
            });

            const jsonData = JSON.stringify(response.data, null, 2);
            //console.log('Respuesta:', jsonData);
            const data = JSON.parse(jsonData);

            const equipos_resultado = data.response[0].league.standings[0];

            for (const element of equipos_resultado) {
                const nombre = element.team.name;
                const puntos = element.points;
                const diferencia = element.goalsDiff;
                const posicion = element.rank
                var elemento_anadir = {
                    posicion: posicion,
                    equipo: nombre,
                    puntos: puntos,
                    diferencia_goles: diferencia
                }


                respuesta.clasificacion.push(elemento_anadir)
            }

            cache.competicion = ""
            cache.parametro = ""
            cache.equipo = ""
            cache.temporada = ""
            cache.jugador = ""
            return respuesta


        } catch (error) {
            console.error('Error en la solicitud:', error.message);
            // Puedes elegir lanzar el error nuevamente o manejarlo de otra manera
        }

    }
















    //CUARTA OPCION: LOS PARTIDOS JUGADOS POR UN EQUIPO EN UNA TEMPORADA
    //4. partidos jugados-equipo-temporada
    else if (cache.parametro == "partidos jugados" && cache.temporada != "" && cache.equipo != "") {
        const apiUrl = 'https://api-football-v1.p.rapidapi.com/v3/fixtures'
        const params = {
            season: cache.temporada,
            team: cache.equipo
        }
        var respuesta = {
            "tipo": 2,
            "resultados": []
        };

        try {
            const response = await axios.get(apiUrl, {
                params: params,
                headers: headers
            });

            const jsonData = JSON.stringify(response.data, null, 2);
            //console.log('Respuesta:', jsonData);
            const data = JSON.parse(jsonData);

            const partidos_jugados = data.response

            for (const element of partidos_jugados) {
                var local = element.teams.home.name
                var visitante = element.teams.away.name

                var resultado_local = element.goals.home
                var resultado_visitante = element.goals.away

                var elemento_anadir = {
                    local: local,
                    visitante: visitante,
                    resultado_local: resultado_local,
                    resultado_visitante: resultado_visitante
                }


                respuesta.resultados.push(elemento_anadir)



            }
            cache.competicion = ""
            cache.parametro = ""
            cache.equipo = ""
            cache.temporada = ""
            cache.jugador = ""
            return respuesta


        } catch (error) {
            console.error('Error en la solicitud:', error.message);
            // Puedes elegir lanzar el error nuevamente o manejarlo de otra manera
        }


    }












    //SEGUNDA OPCION: PARAMETROS SOBRE UN EQUIPO EN UNA TEMPORADA
    //2. parametro-equipo-temporada
    else if (cache.parametro != "" && cache.equipo != "" && cache.temporada != "") {
        var competicion_asignada = ""

        if (cache.equipo == "529" || cache.equipo == "530" || cache.equipo == "541" || cache.equipo == "536" || cache.equipo == "543" || cache.equipo == "533") {
            competicion_asignada = "140"
        }

        if (cache.equipo == "33" || cache.equipo == "50" || cache.equipo == "40" || cache.equipo == "49" || cache.equipo == "47" || cache.equipo == "42" || cache.equipo == "34") {
            competicion_asignada = "39"
        }

        if (cache.equipo == "157" || cache.equipo == "165" || cache.equipo == "173" || cache.equipo == "179") {
            competicion_asignada = "78"
        }

        if (cache.equipo == "505" || cache.equipo == "496" || cache.equipo == "489" || cache.equipo == "492" || cache.equipo == "497") {
            competicion_asignada = "135"
        }

        if (cache.equipo == "85" || cache.equipo == "91" || cache.equipo == "81" || cache.equipo == "80") {
            competicion_asignada = "61"
        }


        const apiUrl = 'https://api-football-v1.p.rapidapi.com/v3/teams/statistics'
        const params = {
            league: competicion_asignada,
            season: cache.temporada,
            team: cache.equipo
        }
        var respuesta = {
            "tipo": 3,
            "respuesta": ""
        };

        try {
            const response = await axios.get(apiUrl, {
                params: params,
                headers: headers
            });

            const jsonData = JSON.stringify(response.data, null, 2);
            //console.log('Respuesta:', jsonData);
            const data = JSON.parse(jsonData);

            var estadistica = 0
            var enlace = ""
            var marcador = ""
            var incorrecta=0



            if (cache.parametro == "partidos ganados como local") {
                estadistica = data.response.fixtures.wins.home
                enlace = "ha ganado como local"
                marcador = "partidos"
            }
            else if (cache.parametro == "partidos ganados como visitante") {
                estadistica = data.response.fixtures.wins.away
                enlace = "ha ganado como visitante"
                marcador = "partidos"
            }
            else if (cache.parametro == "partidos ganados en total") {
                estadistica = data.response.fixtures.wins.total
                enlace = "ha ganado en total"
                marcador = "partidos"
            }
            else if (cache.parametro == "partidos perdidos como local") {
                estadistica = data.response.fixtures.loses.home
                enlace = "ha perdido como local"
                marcador = "partidos"
            }
            else if (cache.parametro == "partidos perdidos como visitante") {
                estadistica = data.response.fixtures.loses.away
                enlace = "ha perdido como visitante"
                marcador = "partidos"
            }
            else if (cache.parametro == "partidos perdidos en total") {
                estadistica = data.response.fixtures.loses.total
                enlace = "ha perdido en total"
                marcador = "partidos"
            }
            else if (cache.parametro == "partidos empatados como local") {
                estadistica = data.response.fixtures.draws.home
                enlace = "ha empatado como local"
                marcador = "partidos"
            }
            else if (cache.parametro == "partidos empatados como visitante") {
                estadistica = data.response.fixtures.draws.away
                enlace = "ha empatado como visitante"
                marcador = "partidos"
            }
            else if (cache.parametro == "partidos empatados en total") {
                estadistica = data.response.fixtures.draws.total
                enlace = "ha empatado en total"
                marcador = "partidos"
            }


            else if (cache.parametro == "goles marcados como local") {
                estadistica = data.response.goals.for.total.home
                enlace = "ha marcado como local"
                marcador = "goles"
            }
            else if (cache.parametro == "goles marcados como visitante") {
                estadistica = data.response.goals.for.total.away
                enlace = "ha marcado como visitante"
                marcador = "goles"
            }
            else if (cache.parametro == "goles marcados en total") {
                estadistica = data.response.goals.for.total.total
                enlace = "ha marcado en total"
                marcador = "goles"
            }

            else if (cache.parametro == "goles encajados como local") {
                estadistica = data.response.goals.against.total.home
                enlace = "ha encajado como local"
                marcador = "goles"
            }
            else if (cache.parametro == "goles encajados como visitante") {
                estadistica = data.response.goals.against.total.away
                enlace = "ha encajado como visitante"
                marcador = "goles"
            }
            else if (cache.parametro == "goles encajados en total") {
                estadistica = data.response.goals.against.total.total
                enlace = "ha encajado en total"
                marcador = "goles"
            }
            else{
                incorrecta=1
            }


            const nombreEquipo = convertirCodigoANombreEquipo(parseInt(cache.equipo));

            respuesta.respuesta = "El " + nombreEquipo + " en la temporada " + cache.temporada + " " + enlace + " " + estadistica + " " + marcador

            if(incorrecta==1){
                respuesta.respuesta="No he podido encontrar el parámetro del equipo, ¿puedes decirlo de otra forma?"
            }

            console.log(respuesta)
            cache.competicion = ""
            cache.parametro = ""
            cache.equipo = ""
            cache.temporada = ""
            cache.jugador = ""
            return respuesta


        } catch (error) {
            console.error('Error en la solicitud:', error.message);

        }
    }














    //TERCERA OPCION: PARAMETROS SOBRE UN JUGADOR EN UNA TEMPORADA
    //3. parametro-jugador-temporada
    else if (cache.parametro != "" && cache.jugador != "" && cache.temporada != "") {
        const apiUrl = 'https://api-football-v1.p.rapidapi.com/v3/players'
        const params = {
            id: cache.jugador,
            season: cache.temporada
        }
        var respuesta = {
            "tipo": 4,
            "respuesta": ""
        };

        try {
            const response = await axios.get(apiUrl, {
                params: params,
                headers: headers
            });

            const jsonData = JSON.stringify(response.data, null, 2);

            const data = JSON.parse(jsonData);

            var estadistica = 0
            var enlace = ""
            var marcador = "goles"
            var incorrecta=0

            if (cache.parametro == "goles marcados") {
                estadistica = data.response[0].statistics[0].goals.total
                enlace = "marcado"
                marcador = "goles"


            }
            else if (cache.parametro == "minutos jugados") {
                estadistica = data.response[0].statistics[0].games.minutes
                enlace = "jugado"
                marcador = "minutos"
            }
            else if (cache.parametro == "asistencias dadas") {
                estadistica = data.response[0].statistics[0].goals.assists
                enlace = "dado"
                marcador = "asistencias"
            }
            else if (cache.parametro == "pases realizados") {
                estadistica = data.response[0].statistics[0].passes.total
                enlace = "dado"
                marcador = "pases"
            }
            else if (cache.parametro == "tarjetas amarillas") {
                estadistica = data.response[0].statistics[0].cards.yellow
                enlace = "recibido"
                marcador = "tarjetas amarillas"
            }

            else{
                incorrecta=1
            }



            const nombreJugador = convertirCodigoANombreJugador(parseInt(cache.jugador));



            respuesta.respuesta = nombreJugador + " en la temporada " + cache.temporada + " ha " + enlace + " " + estadistica + " " + marcador

            if(incorrecta==1){
                respuesta.respuesta="No he podido encontrar el parámetro del jugador, ¿puedes decirlo de otra forma?"
            }

            cache.competicion = ""
            cache.parametro = ""
            cache.equipo = ""
            cache.temporada = ""
            cache.jugador = ""
            return respuesta


        } catch (error) {
            console.error('Error en la solicitud:', error.message);

        }
    }









}





//FUNCIONES PARA CONVERTIR LOS CODIGOS A NOMBRES
function convertirCodigoANombreJugador(codigo) {

    if (codigo in codigoJugadores) {
        return codigoJugadores[codigo];
    } else {
        return "Jugador no encontrado";
    }
}

function convertirCodigoANombreEquipo(codigo) {

    if (codigo in codigoEquipos) {
        return codigoEquipos[codigo];
    } else {
        return "Equipo no encontrado";
    }
}


















//CONFIGURACION DE LA API--------------------------
const webApp = express();
webApp.use(express.urlencoded({
    extended: true
}));

webApp.use(express.json());
webApp.use(cors())

const PORT = 5000;
webApp.get('/', (req, res) => {
    res.send(`Hello World.!`);
});

webApp.post('/dialogflow', async (req, res) => {
    let languageCode = req.body.languageCode;
    let queryText = req.body.queryText;
    let sessionId = req.body.sessionId;
    //aqui se extraen los valores de la consulta
    let responseData = await detectIntent(languageCode, queryText, sessionId);
    console.log("\n\nValores extraidos de la consulta:")
    console.log(responseData)
    //aqui se hace la peticion a la API
    if(responseData.error==0){
        let responseDataFutbol = await peticionFutbol(responseData);
        console.log(responseDataFutbol)
        res.json(responseDataFutbol);
    }else{
        res.json(responseData);
    }

    
});

webApp.listen(PORT, () => {
    console.log(`Server is up and running at ${PORT}`);
});