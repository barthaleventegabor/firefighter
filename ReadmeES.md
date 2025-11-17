Conversión de Excel → JSON (Angular 18)
📌 Descripción del Proyecto
Este proyecto es una aplicación web creada con Angular 18 diseñada para procesar registros de intervenciones de bomberos almacenados en archivos Excel .xlsx.
La aplicación lee los datos del Excel, aplica reglas específicas de cálculo de horas extra, agrupa los resultados por trabajador y genera un archivo JSON descargable.
Toda la implementación se realiza dentro de un único componente independiente (AppComponent), lo que hace que el proyecto sea ligero y fácil de mantener.

🛠 Tecnologías Utilizadas
Framework Frontend


Angular 18 (componentes independientes, sin routing)


TypeScript (implementación completa de la lógica de negocio)


Interfaz y Estilos


HTML / CSS


Bootstrap (diseño, estilo, tablas responsivas)


SweetAlert2 (alertas para carga de archivos y retroalimentación)


Manejo de Archivos


xlsx (SheetJS) – análisis de archivos Excel .xlsx


API Blob del navegador – exportación de JSON



📂 Funcionalidades
✔ 1. Carga de archivos Excel
Los usuarios pueden subir archivos .xlsx mediante un campo de carga estilizado con Bootstrap.

✔ 2. Procesamiento de Filas del Excel
Cada fila del Excel se convierte en una estructura con los siguientes campos:


ID del trabajador


Nombre del trabajador


Ubicación


Tiempos de inicio y fin


Número de parte


Duración calculada



✔ 3. Análisis de Fechas y Horas
El sistema extrae fechas desde cadenas como:
02/07/2025 de 23:15 a 00:30
Maneja automáticamente:


Extracción de fecha


Extracción de hora


Turnos que cruzan medianoche (si la hora de fin < hora de inicio → pasa al día siguiente)



✔ 4. Unificación de Intervenciones
Las intervenciones que ocurren de forma consecutiva (la hora de fin coincide con la siguiente hora de inicio) se unifican:


Se suma la duración


Los partes se concatenan


Las ubicaciones se combinan



✔ 5. Reglas de Cálculo de Horas Extra
Cada intervención se procesa siguiendo estas reglas:
Regla 1 — Duración mínima
Si una intervención dura menos de 60 minutos, se redondea a 1 hora.

Excepción: intervenciones unificadas utilizan el tiempo acumulado total.

Regla 2 — Redondeo a bloques de 10 minutos
Duraciones superiores a una hora se redondean al bloque de 10 minutos más cercano:
1:03 → 1:00
1:06 → 1:10
1:14 → 1:10
1:17 → 1:20
Regla 3 — Redondeo mensual por trabajador
Una vez sumados todos los minutos ajustados de un trabajador,
el total final se redondea hacia arriba en bloques de 30 minutos:
7h 20m → 7h 30m
7h 40m → 8h 00m
Todos los valores se presentan en formato H:MM.

📊 Agrupación de Datos por Trabajador
La aplicación genera una estructura WorkerSummary que contiene:


id


name


interventions[] → cada una con:


ubicación


inicio / fin


parte


duración (sin ajustar)


duración ajustada




totalAdjustedHours (total mensual ajustado)


Cada trabajador recibe:


Una tarjeta con su nombre e ID


Una tabla con todas sus intervenciones


Un pie mostrando el total mensual ajustado



💾 Exportación a JSON
Con un solo clic, los usuarios pueden descargar los resultados en un archivo .json que contiene:


Datos del trabajador


Todas las intervenciones


Tiempos de inicio y fin


Duraciones totales y ajustadas


Totales mensuales finales


La exportación se realiza mediante la API Blob del navegador.

🖥 Vista General de la Interfaz
La página web incluye:
🟥 Encabezado
Un título estilizado en rojo con Bootstrap:
🚒 Firefighters Overtime Tool
📤 Carga de archivos
Un selector de archivos con clases:


form-control


form-control-sm


mb-3


📥 Descarga de JSON
Visible únicamente después del procesamiento:


btn btn-secondary


📑 Tablas por Trabajador
Cada trabajador cuenta con:


Una tarjeta con su nombre e ID


Una tabla con todas sus intervenciones


Un pie que resume las horas ajustadas totales


Todas las tablas son completamente responsivas gracias a:


.table-responsive
