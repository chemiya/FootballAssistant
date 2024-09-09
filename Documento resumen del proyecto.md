<h1>Documento resumen del proyecto para crear la aplicación "FootballAssistant"</h1>

<ol>
<h2><li>Resumen del proyecto</li></h2>
<p>Esta aplicación funcionará como un asistente virtual en la que los usuarios pueden hacer consultas sobre datos estadísticos de futbol relacionados con un equipo, jugador o competición en una determinada temporada. El sistema será capaz de responder a diferentes consultas de los usuarios obteniendo los datos de una API externa que proporciona datos de futbol. Esta aplicación incorpora diferentes características para mejorar la experiencia del usuario como diálogos por turnos, entrada por comandos de voz o historial de consultas. Esta aplicación se ha desarrollado para la asignatura de Sistemas Conversacionales en el máster en Ingeniería Informática.
</p>




<h2><li>Aplicaciones similares</li></h2>
<p>Se han encontrado varias aplicaciones similares a lo que se quiere desarrollar en este proyecto:</p>
<ol>
  <li>Laliga Assitant</li>
  <li>Google assistant</li>
  <li>ChatGPT</li>

</ol>




<h2><li>Tecnologías utilizadas</li></h2>
<p>Se van a utilizar las siguientes tecnologías:</p>
<ul>

<li>Frontend: Angular y Bootstrap</li>
<li>Backend: NodeJS y DialogFlow</li>
</ul>



<h2><li>Funcionalidad de la aplicación</li></h2>
<p>En este caso, al ser un sistema conversacional que va a funcionar como un asistente virtual que proporcione datos de futbol sobre diferentes equipos, jugadores o competiciones en diferentes temporadas, se definen a continuación los 4 tipos diferentes de consultas de las que el sistema será capaz de proporcionar datos:</p>

<ul>
<li>Consultas sobre la clasificación de una determinada competición en una determinada temporada</li>
<li>Consultas sobre unos determinados datos de un determinado equipo en una determinada temporada. Estos datos pueden ser el número de partidos ganados/empatados/perdidos como local, visitante o en total o los goles marcados/encajados como local, visitante o en total</li>
<li>Consultas sobre unos determinados datos de un determinado jugador en una determinada temporada. Estos datos pueden ser los goles marcados, las asistencias dadas, los minutos jugados, los pases realizados o las tarjetas amarillas que recibió</li>
<li>Consultas sobre los partidos jugados de un determinado equipo en una determinada temporada</li>
</ul>







<h2><li>Estructura del backend</li></h2>

<p>El backend se estructura en un programa hecho en NodeJS que mediante ExpressJS recibirá las consultas que introduzca el usuario en la aplicación. Esta parte del backend procesará en primer lugar la consulta recibida desde el frontend, extrayendo mediante DialogFlow todos los parámetros que haya introducido el usuario y que serán necesarios para después, realizar una consulta a una API externa que proporciona datos de futbol. Al extraer los parámetros con DialogFlow de la consulta que introduce el usuario, se puede configurar como realizar la consulta a la API externa de futbol para obtener los datos necesarios que respondan a la consulta del usuario. Por otro lado, en DialogFlow se han definido entities que corresponden con los parámetros que se obtendrán de las consultas del usuario como pueden ser los nombres de los jugadores, equipos, competiciones o temporadas y por otro lado se han definido intents, que son frases para entrenar al sistema y que sea capaz de extraer estos parámetros en forma de entities de las consultas de los usuarios. </p>






<h2><li>Estructura del frontend</li></h2>
La aplicación contará únicamente con una vista en la que aparecerá una entrada de texto para que el usuario pueda realizar la consulta al sistema y justo debajo se irán almacenando las consultas del usuario junto a las respuestas que proporcione el sistema. A continuación se describen algunos de los principales detalles de la aplicación que mejoran la experiencia del usuario:
<ul>
<li>Historial de consultas realizadas: el sistema almacena las consultas y preguntas que realiza el usuario junto a las respuestas que el propio sistema ofrece de manera similar al comportamiento que ofrece ChatGPT.
</li>
<li>Entrada por mensaje de voz: el sistema permite a los usuarios introducir sus consultas mediante mensajes de voz para aumentar así la eficiencia en su utilización y disminuir el esfuerzo que tiene que hacer el usuario para conseguir sus objetivos. 
</li>
<li>Diálogos flexibles: el sistema permite realizar diálogos por pasos de manera escalonada, es decir, de manera que el usuario vaya introduciendo los diferentes parámetros sobre los que quiere obtener los datos de manera escalonada en diferentes turnos. 
 </li>

</ul>





<h2><li>Demostración del funcionamiento del sistema</li></h2>
<p>A continuación se definen diferentes consultas para demostrar el funcionamiento del sistema:</p>

<ul>
<li>¿Me puedes decir la clasificación de laliga en la temporada actual?</li>
<li>Quiero ver la clasificación/ de la liga inglesa/ en la temporada 2022</li>
<li>¿Cuántos partidos ganó como local el Real Madrid en la temporada 2021?</li>
<li>¿Cuántos goles ha marcado como local el Atlético en la temporada actual?</li>
<li>Dime cuántos goles marcó Cristiano Ronaldo en la temporada 2020</li>
<li>Dime las asistencias que dio / Messi/ en la temporada 2020</li>
<li>Búscame los partidos jugados por el Real Madrid en la temporada actual</li>
<li>Muéstrame los partidos jugados por el Barca en la temporada 2021</li>

</ul>










<h2><li>Resultado final: vídeo youtube y repositorio</li></h2>
Repositorio Github: https://github.com/chemiya/FootballAssistant

Video Youtube: https://youtu.be/rdWlh40c7-Q


<h2><li>Conclusiones</li></h2>
He podido crear un asistente virtual que pueda además conectarse con una API externa y obtener los datos de ella. Esta combinación ha creado una aplicación con mucho potencial y que es capaz de proporcionar multitud de datos de una manera muy eficiente. 


</ol>
