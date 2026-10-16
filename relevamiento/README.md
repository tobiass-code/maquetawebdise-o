# Fase 0: relevamiento de deturista.com

Relevamiento completo de la web actual antes del rediseño. Sirve para dos cosas:

1. Saber qué hace hoy cada pantalla, para que la web nueva no pierda nada.
2. Armar la lista de datos que cada pantalla necesita, para pedirlos en la API nueva del admin (prevista para febrero 2027).

Relevado el 16/10/2026. Se puede volver a correr (ver «Cómo actualizarlo»).

## Números

| | |
|---|---|
| Páginas recorridas | 201 (home, 10 regiones, 63 países, 4 categorías del menú, 109 paquetes, 14 fijas) |
| Paquetes activos | 109 (Sudamérica 55, Europa 35, Caribe 19) |
| Salidas publicadas | 934 (mediana 4 por paquete; máximo 108, República Dominicana) |
| Fotos cargadas en el admin | 430 (45 paquetes con 5 o más, 32 con una sola; la web muestra solo una) |
| Categorías en el admin | 32 (campañas, salidas desde cada ciudad, tipos de viaje); el menú muestra 3 |
| Destinos en el buscador | 513 (71 países y 442 ciudades); solo 123 ciudades tienen algún paquete |
| Sucursales | 8 |

## Cómo funciona cada pantalla hoy

### Global (todas las páginas)
- Header: logo, menú (Destinos con megamenú, Argentina en 12 cuotas, Playas, Salidas Grupales, Shop, Quiénes somos, Sucursales, Contacto), teléfono 0810, lupa de búsqueda por texto.
- En celular: hamburguesa con el mismo menú; Destinos abre submenú.
- Botón flotante de teléfono (rosa, abajo a la derecha).
- Footer: newsletter (nombre, apellido, mail, región de interés), horarios, redes, links legales, sucursales en pestañas con foto y mapa, «Hablá con nuestro CEO» con QR, sellos (Data Fiscal, CACE, Turismo, FAEVYT) y razón social.
- Medición: Google Tag Manager con dos propiedades de GA4 (`G-NHJ590EJJE`, `G-Q2EYMDH7X7`), Google Ads (`AW-996515620`) y Microsoft Clarity. No hay píxel de Meta en el código; verificar si está dentro de GTM. reCAPTCHA en formularios.

### Home `/`
- Buscador «¿Adónde querés viajar?» + «¿En qué mes?». El campo de destino busca entre 513 destinos (`/model/public/destinations/get_all`), incluidas ciudades sin paquetes: al escribir «Bra» la primera opción es Brandemburgo y el resultado es «No se encontraron paquetes» (`capturas/buscador-resultado.jpg`).
- Slider grande (7 slides, 897×456 en pantalla) y dos banners chicos.
- 5 carruseles de 4 tarjetas: Salidas Grupales Europa, Exóticos y más · Playas del Caribe y Centroamérica · Brasil y Sudamérica · Argentina en 12 cuotas sin interés · Vacaciones 2027 en Cuotas. Los mismos paquetes se repiten entre carruseles.
- Tarjeta de paquete: foto, noches, íconos de servicios sobre la foto, título en mayúsculas, precio, cuotas.

### Región `/destino/{region}` (10)
- Banner 1920×456 con el nombre, migas de pan y grilla de países con «Desde AR $». La tarjeta de país usa el mismo banner recortado y el nombre queda cortado.

### País `/destino/{region}/{pais}` (63) y ciudad `/destino/{region}/{pais}/{ciudad}`
- Banner, filtros (ciudad de destino, mes) y listado de paquetes. 41 de los 63 países tienen 1 o 2 paquetes.
- Las páginas de ciudad existen para las 442 ciudades, la mayoría vacías.

### Categoría `/categoria/{nombre}-{id}`
- Igual que país, con filtros de destino y mes. Las 4 del menú tienen el mismo título SEO genérico.

### Paquete `/paquete/{id}/{slug}.html` (109)
- Cabecera: título, subtítulo, íconos de servicios incluidos (aéreos, hotel, régimen, traslados, asistencia, tour, impuestos), una foto.
- 16 paquetes muestran un banner de campaña (1920×280, p. ej. «12 cuotas sin interés»).
- «Ordenar salidas por» precio, fecha o días, y filtros (mes, duración, estrellas, precio, equipaje). En celular los filtros abren una hoja.
- Lista de salidas: fecha ida y vuelta, días, «desde Buenos Aires», precio por pasajero en base doble, cuotas. Avisos: «Mejor tarifa» (628), «Últimos N lugares!» (263), «Último lugar!» (11), «Sugerido» (13).
- «Ver más info» abre la salida: «Ver Vuelos» (aerolínea, horarios, aeropuertos), «Ver Detalles» (hotel o programa, régimen), selector de pasajeros, «Ver single, doble a compartir, etc.», botones Consultar y Comprar. Los hoteles con ficha abren un modal (nombre, estrellas, destino, dirección, descripción) — `capturas/hotel.jpg`.
- El selector de pasajeros arranca en 0: si tocás Consultar o Comprar sin cambiarlo, sale un error.
- «Consultar» abre un formulario (nombre, WhatsApp, email, precio total, cupón, términos) con tres salidas: «Llamar ahora a un asesor», «Chatear por WhatsApp» y enviar. Es el único lugar donde aparece WhatsApp (`capturas/consultar.jpg`).
- Debajo: «Paquetes relacionados» de la misma región.
- La descripción completa (itinerario, incluye, no incluye, información importante) no se muestra en la página; está en el admin como texto libre.

### Checkout `/compra/paquete/{id}/{slug}/precio/{id_precio}/{pasajeros}`
- Una página con 3 pasos: datos de contacto (nombre, apellido, CUIL, email, teléfono) → datos de cada pasajero (nombre, apellido, DNI/CUIL, nacionalidad, nacimiento; «copiar datos al pasajero 1») → reserva y pago (pago total o seña). Cupón de descuento. Resumen a la derecha con vuelos. Pago con Mercado Pago.

### Otras
- **Shop** `/shop.html`: 5 categorías (térmicos, termos y mates, equipaje, mochilas, accesorios), todos los productos en una sola página de 26.000 px, estilo propio.
- **Giftcards** `/giftcards`: montos fijos o libre (1 punto = USD 1), cuotas, datos del comprador, Mercado Pago.
- **Quiénes somos**: texto institucional y equipo con nombre, cargo y mail.
- **Contacto** `/consulta`: formulario (nombre, email, WhatsApp con país, destino, fechas, consulta, «quiero que me llamen»), contacto directo, CEO, sucursales y paquetes sugeridos. Es la pantalla con el estilo más nuevo.
- **Legales**: condiciones, privacidad, cancelaciones, documentación para salir del país, medios de pago, legales de giftcards.
- **404**: página de error genérica. `/sitemap.xml` también da 404.

## SEO y velocidad

| Tema | Hoy |
|---|---|
| Títulos | 24 paquetes con título vacío («deturista.com -»); las 4 categorías comparten título |
| Descripción | 26 paquetes sin meta description |
| H1 | Home, regiones, países y categorías sin H1; los paquetes tienen 3 |
| Sitemap | No existe (404) |
| Canonical / datos estructurados | Ninguna página los tiene |
| Imágenes sin texto alternativo | 103 de 120 en la home |
| Peso de la home | ~10 MB y 190 pedidos (en celular también) |
| Carga completa | Home 3,4 s en celular; paquete 2,7 s |

## Qué datos da hoy la parte pública del admin

Endpoints que usa la web (los mismos que copia el Hub en `hub_web_paquetes`):

- `GET /model/public/products/get_all`: todos los paquetes con título, subtítulo, resumen, destinos (id y nombre), región de producto, categorías, noches, precio desde (ARS y USD), base, cuotas, seña, servicios incluidos (`has_hotel`, `has_transfer`, `has_assistance`, `has_tour`, `has_tax`), cantidad de fotos (`has_images`), foto principal, Family Plan, WhatsApp activo, meses de temporada alta, media y baja.
- `GET /public/product/prices/{id}?departure={id_salida}`: por salida, precios por base (doble, single, triple, cuádruple, doble a compartir, Family Plan 1 y 2) con cuotas, seña y opciones ViajeFlex; hoteles (nombre, estrellas, dirección, descripción, foto, régimen, noches); vuelos por tramo (aerolínea, número, aeropuertos, horarios); equipaje; lugares disponibles; edad de menores; descripción completa en texto.
- `GET /model/public/destinations/get_all`: árbol región / país / ciudad para el buscador.

Archivos: `datos/api_productos.json`, `datos/api_salidas.json` (primera salida de cada paquete), `datos/api_destinos.json`.

## Pedido de datos para la API nueva (febrero)

Lo que cada pantalla de la web nueva necesita. ✅ ya está · ⚠️ está pero hay que ordenarlo · ❌ falta.

### Global
- ✅ Árbol de destinos (región → país → ciudad).
- ⚠️ Destinos con cantidad de paquetes activos, para no ofrecer en el buscador ni en el menú lo que da vacío.
- ❌ Sucursales: nombre, dirección, coordenadas, horarios, teléfono, WhatsApp, foto (hoy está escrito en el HTML).
- ❌ Datos de contacto generales (teléfono, WhatsApp, horarios, redes).
- ⚠️ Campañas: las categorías existen; faltan fecha de inicio y fin, imagen (sin texto quemado), color o logo y orden de los paquetes.
- ❌ Banners de la home con foto, título, texto y link por separado.

### Paquete
- ✅ Título, subtítulo, resumen, noches, región, categorías, servicios incluidos, Family Plan, temporadas.
- ⚠️ Fotos: el admin tiene la cantidad; falta la lista de URLs en la API, en tamaño grande y con texto alternativo.
- ❌ Itinerario como lista de días: número de día, título, ciudades, texto, comidas incluidas, noche en.
- ❌ Ciudades del recorrido en orden, con noches y coordenadas (para el mapa).
- ⚠️ Hoteles: en playa ya vienen con ficha; en circuitos hace falta hotel previsto por ciudad («o similar»), con estrellas y foto.
- ❌ «Incluye», «No incluye» e «Información importante» como listas separadas.
- ❌ Preguntas frecuentes por paquete (opcional).
- ⚠️ Título y descripción para buscadores (hoy 24 vacíos).
- ✅ Paquetes relacionados.

### Salidas y precios
- ✅ Fecha, días, ciudad de salida, precios por base, cuotas, seña, lugares disponibles, vuelos, equipaje.
- ⚠️ Una moneda principal por paquete y regla de cuándo se muestra USD o ARS (hoy la API dice ARS en los 109 y la web muestra USD en 85).
- ⚠️ Avisos («Mejor tarifa», «Sugerido», «Últimos lugares») como campos, no como texto.

### Otros
- ❌ Reseñas o testimonios (se pueden traer del Perfil de Empresa con el Hub).
- ❌ Equipo para Quiénes somos.
- ⚠️ Productos del Shop con categoría, precio, fotos y stock.

## Cómo actualizarlo

```sh
cd relevamiento
python3 -I scripts/relevar.py datos           # páginas + datos de la API (~3 min)
PW=/ruta/a/playwright node scripts/flujos.js capturas datos/flujos.json    # velocidad, hotel, filtros
PW=/ruta/a/playwright node scripts/flujos2.js capturas datos/flujos2.json  # buscador, consultar, menú
```

## Archivos

- `datos/paginas.json`: una fila por página (estado, título, descripción, H1, imágenes, links, salidas, avisos, filtros).
- `datos/flujos.json`, `datos/flujos2.json`: velocidad, buscador, consultar, hotel.
- `capturas/`: 24 capturas de escritorio y celular.
