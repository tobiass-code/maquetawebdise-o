# Qué hay que diseñar: web nueva de DeTurista

Lista completa para trabajar con Mica. Sale del relevamiento de la web actual (`relevamiento/`: 201 páginas, 936 salidas, 109 paquetes, capturas en escritorio y celular).

**Cómo usar esta lista**
- Se diseña en código, en este repo, como maquetas navegables con datos reales. En febrero se conectan a la API del admin.
- Cada pantalla se hace primero en celular (390 px) y enseguida en escritorio (1440 px).
- Prioridad: **P1** recorrido de compra · **P2** descubrir y contactar · **P3** institucional y resto.
- «Casos límite» son datos reales que el diseño tiene que aguantar sin romperse.
- Marcá `[x]` lo que quede aprobado.

---

## 1. Fundamentos

Las reglas base. Van antes que cualquier pantalla.

### Cómo es hoy (para no partir de cero sin saberlo)
- Tipografía: Open Sans en todo (600 y 700), texto base a 12 px. Lato cargada pero casi sin uso. El Shop usa otra letra condensada.
- Colores: morado `#400E73` y `#4D1D83`, rosa `#DE228F`, fondo lila `#F3F0FA`, texto gris `#333333` y `#67728A`, footer casi negro `#1E1E1F`.
- Radios mezclados: 4, 5, 6, 8, 10, 15 px, pastillas redondas y esquinas de un solo lado.
- Íconos: Font Awesome 4 y 5 mezclados.
- Fotos: sombreado negro al 60 % sobre la foto en todas las tarjetas.

### Decisiones a tomar
- [ ] **Dirección visual**: dos propuestas sobre la misma pantalla (ficha de paquete en celular) y elegir una.
- [ ] **Tipografía**: una para títulos y una para textos. Probarlas con:
  - el título más largo: «Paquete Patagonia: Bariloche, Angostura y San Martín de los Andes» (65 caracteres);
  - un precio grande: «AR $18.144.293» y «USD 11.579»;
  - noches múltiples: «7, 8, 9, 10 y 14 noches»;
  - tildes, ñ, «&» y números que alineen en columna.
- [ ] **Escala tipográfica**: tamaños para celular y escritorio (título de página, sección, tarjeta, texto, letra chica, precio).
- [ ] **Color**: morado y rosa de marca, neutros, fondos, y colores de estado (éxito, error, aviso, info). Revisar contraste legible.
- [ ] **Colores semánticos de viaje**: avisos de salida («Mejor tarifa», «Últimos lugares»), tipos de viaje (grupal, acompañada, playa, vuelo).
- [ ] **Grilla**: columnas en 390, 768 y 1440; ancho máximo de contenido.
- [ ] **Espaciado**: escala en múltiplos de 4 u 8.
- [ ] **Radios**: dos o tres valores, no más.
- [ ] **Sombras y elevación**: tarjeta, menú desplegable, hoja inferior en celular, modal.
- [ ] **Movimiento**: aperturas (acordeón, hoja), carga, transiciones de galería. Respetar «reducir movimiento».
- [ ] **Fotografía**: criterio (luz, encuadre, gente o no), cómo va el texto sobre la foto sin sombreado pesado, proporciones (16:9, 4:5, 1:1).
- [ ] **Ilustración**: estilo para estados vacíos, 404, confirmación de compra, giftcards (Magnific).
- [ ] **Logo**: versiones (color, blanco), tamaño mínimo, uso en header y footer.
- [ ] **Voz de la interfaz**: voseo, botones que dicen lo que hacen («Comprar», «Consultar por WhatsApp»), mensajes de error que explican cómo seguir.

---

## 2. Iconografía

Hoy hay 30 íconos distintos de Font Awesome. Hace falta un set propio y parejo (misma grilla, mismo grosor). Base sugerida: Phosphor o Lucide adaptados.

### Servicios del paquete (P1)
- [ ] Aéreo · [ ] Hotel · [ ] Traslados · [ ] Asistencia al viajero · [ ] Excursiones / tour · [ ] Impuestos incluidos
- [ ] Régimen: [ ] Con desayuno · [ ] Media pensión · [ ] Pensión completa · [ ] All inclusive · [ ] Sin pensión
- [ ] Crucero · [ ] Coordinador acompañante · [ ] Seguro de cancelación

### Equipaje (P1)
- [ ] Artículo personal · [ ] Carry on · [ ] Valija en bodega · [ ] Sin equipaje
(Hay 6 combinaciones reales: personal; personal + carry on; personal + bodega; personal + carry on + bodega; solo bodega; sin dato.)

### Vuelo (P1)
- [ ] Ida · [ ] Vuelta · [ ] Escala · [ ] Directo · [ ] Duración / horario

### Interfaz (P1)
- [ ] Buscar · [ ] Filtrar · [ ] Ordenar · [ ] Calendario · [ ] Pasajeros (adulto, menor) · [ ] Ubicación · [ ] Mapa
- [ ] Flecha (4 direcciones) · [ ] Cerrar · [ ] Menú · [ ] Más / menos · [ ] Check · [ ] Alerta · [ ] Info
- [ ] Compartir · [ ] Descargar · [ ] Favorito (si se suma) · [ ] Copiar
- [ ] Tarjeta / cuotas · [ ] Cupón · [ ] Seña · [ ] Candado (pago seguro)
- [ ] Teléfono · [ ] WhatsApp · [ ] Email · [ ] Reloj / horario

### Redes y sellos (P2)
- [ ] Instagram · [ ] Facebook · [ ] TikTok · [ ] YouTube
- [ ] Sellos oficiales en versión monocroma: Data Fiscal, CACE, Ministerio de Turismo, FAEVYT

### Tipos de viaje y regiones (P2)
- [ ] Salida grupal · [ ] Grupal acompañada · [ ] Playa · [ ] Cultural · [ ] Aventura · [ ] Eventos musicales · [ ] Deportivos · [ ] Experiencias de autor · [ ] Introspección · [ ] Familia
- [ ] Regiones: Europa · Asia · Caribe · África · Sudamérica · Centroamérica · Norteamérica · Oceanía · Antártida · Todo el mundo

---

## 3. Componentes

Cada uno con sus estados y en celular y escritorio.

### Básicos (P1)
- [ ] **Botones**: primario, secundario, terciario (texto), WhatsApp, peligro. Estados: normal, hover, presionado, foco, deshabilitado, cargando. Tamaños: chico, mediano, grande, ancho completo.
- [ ] **Campos**: texto, email, teléfono con país (+54), número, fecha, rango de fechas, select con búsqueda, textarea. Estados: vacío, foco, completo, error con mensaje, deshabilitado.
- [ ] **Selección**: checkbox, radio, interruptor, chip seleccionable, rango de precio (doble manija).
- [ ] **Selector de pasajeros**: adultos y menores (edad límite 12), máximo según salida (de 4 a 20). No arrancar en 0.
- [ ] **Etiquetas**: tipo de viaje, estado de salida, atributo (all inclusive, con excursión, premium, Family Plan), noches/días, «desde Buenos Aires».
- [ ] **Avisos**: en línea (info, éxito, aviso, error), toast, banner de página.
- [ ] **Acordeón** (itinerario, preguntas, filtros).
- [ ] **Pestañas** (opciones de hotel, sucursales).
- [ ] **Hoja inferior** en celular y **modal** en escritorio (filtros, hotel, galería).
- [ ] **Carga**: esqueleto de tarjeta, de ficha y de lista de salidas.
- [ ] **Migas de pan**.
- [ ] **Paginación o «Ver más»**.

### Precio (P1, es el componente más importante)
- [ ] Bloque «desde» para tarjetas: moneda + monto + «por persona» + cuotas.
- [ ] Bloque de salida: precio final por pasajero, base, cuotas, seña.
- [ ] Bloque de total en checkout: por N pasajeros, cupón aplicado, seña o total.
- [ ] Variantes:
  - USD y AR $ con la misma jerarquía (hoy 85 paquetes se muestran en USD y el resto en pesos).
  - Con cuotas (de 2 a 12) y sin cuotas (63 paquetes no muestran cuotas).
  - «12 cuotas sin interés» como destacado.
  - Precio tachado y % OFF (campañas).
  - Seña disponible / no disponible (54 paquetes se pueden comprar online, el resto solo consultar).
- [ ] **Bases de habitación**: doble, single, triple, cuádruple, doble a compartir, Family Plan 2+1 y 2+2. Cómo se elige y cómo se muestra la diferencia de precio.

### Tarjetas (P1)
- [ ] **Paquete vertical** (home, carruseles): foto, tipo, noches, título (hasta 65 caracteres, 2 líneas), destinos, servicios, precio, cuotas, aviso.
- [ ] **Paquete horizontal** (listados en escritorio).
- [ ] **Salida** (dentro de la ficha): fecha ida y vuelta, días, ciudad de salida, precio, cuotas, aviso de lugares.
- [ ] **País / región**: foto, nombre (sin cortar), cantidad de paquetes, «desde».
- [ ] **Campaña / banner**: foto limpia + título + bajada + botón (texto en HTML, no en la foto).
- [ ] **Hotel**: foto, nombre (hasta 85 caracteres), estrellas (2 a 5 o sin dato), régimen, noches, ciudad.
- [ ] **Vuelo**: aerolínea (logo), número, aeropuertos, horarios, escalas (hasta 7 tramos en una salida).
- [ ] **Sucursal**: foto, nombre, dirección, horario, mapa, WhatsApp.
- [ ] **Producto del shop** y **giftcard**.
- [ ] **Reseña** (si se suman reseñas de Google).

### Navegación (P1)
- [ ] **Header** escritorio y celular, con versión fija al scrollear.
- [ ] **Menú de destinos**: 10 regiones → países. Mostrar solo lo que tiene paquetes y cuántos.
- [ ] **Menú celular** (hoy hamburguesa con submenú).
- [ ] **Buscador**: destino (con sugerencias que solo muestren destinos con paquetes), mes, pasajeros. Versión grande (home) y compacta (header y listados).
- [ ] **Footer** completo y **footer mínimo** para checkout.
- [ ] **Botón flotante de WhatsApp** (en celular ya existe uno desde el 27/10).
- [ ] **Barra fija de compra** en la ficha (celular): precio desde + «Ver salidas».

---

## 4. Pantallas

### 4.1 Ficha de paquete · P1
La pantalla que más vende. Hoy no muestra el itinerario ni la galería.

Secciones:
- [ ] Galería (hasta 17 fotos; 32 paquetes tienen una sola: diseñar también ese caso).
- [ ] Título, subtítulo (hasta 149 caracteres), tipo de viaje, noches, «desde», precio desde.
- [ ] «Visitando»: chips de ciudades (hasta 15 destinos en un paquete).
- [ ] Servicios incluidos con íconos.
- [ ] **Mapa del recorrido**: ciudades en orden, línea entre ellas, vuelo de ida.
- [ ] **Itinerario por día** (acordeón): día, título, ciudades, texto, comidas.
- [ ] **Dónde dormís**: hoteles por ciudad o por opción (playa: hasta 8 opciones de hotel por salida; circuitos: «hoteles previstos o similares»).
- [ ] **Incluye / No incluye** en dos columnas.
- [ ] **Información importante** (documentación, condiciones, cancelación).
- [ ] **Salidas** (ver 4.2).
- [ ] Mejor época para ir (temporadas; hoy casi sin datos).
- [ ] Preguntas frecuentes.
- [ ] Consultar: WhatsApp, llamar, formulario.
- [ ] Paquetes relacionados.

Variantes y estados:
- [ ] Circuito grupal (Europa, exóticos) · [ ] Playa con hoteles a elección · [ ] Argentina en pesos con 12 cuotas · [ ] Solo vuelo (1 paquete) · [ ] Evento o crucero · [ ] Family Plan (5 paquetes) · [ ] Con banner de campaña (16) · [ ] Agotado o sin salidas · [ ] Solo consulta (no se compra online).

Casos límite: descripción de hasta 3.355 palabras; noches «6, 7, 8, 9 y 10»; título de hotel de 85 caracteres.

### 4.2 Selector de salida · P1
Hoy son tarjetas una debajo de otra; Bariloche tiene 27 y República Dominicana 108.
- [ ] Vista de calendario o por mes con el precio más bajo marcado.
- [ ] Filtros: mes, duración, ciudad de salida (Buenos Aires, Córdoba, Mendoza, Rosario), equipaje, estrellas, precio.
- [ ] Orden: precio, fecha, duración.
- [ ] Salida abierta: vuelos, hotel u opción, base, pasajeros, total, Comprar / Consultar.
- [ ] Avisos: Mejor tarifa (628 hoy), Últimos N lugares (263), Último lugar (11), Sugerido (13).
- [ ] Estados: 1 salida · 100+ salidas · filtros sin resultado · salida sin lugares.

### 4.3 Checkout · P1
Hoy: una página larga con 3 pasos (6 pantallas en celular).
- [ ] Paso 1, contacto: nombre, apellido, CUIL, email, teléfono.
- [ ] Paso 2, pasajeros: nombre, apellido, DNI/CUIL, nacionalidad, nacimiento, por cada uno (hasta 10 o más). «Copiar mis datos al pasajero 1».
- [ ] Paso 3, pago: total o seña, cupón, medio de pago (Mercado Pago), términos.
- [ ] Resumen fijo (escritorio a la derecha, celular plegable): paquete, fechas, vuelos, hotel, pasajeros, total.
- [ ] Barra de progreso de pasos.
- [ ] Estados: error por campo, cupón válido / inválido, pago rechazado, pago pendiente, salida que se agotó mientras compraba.
- [ ] **Confirmación de compra**: número de reserva, qué sigue, contacto del asesor, agregar al calendario.

### 4.4 Home · P1
- [ ] Buscador protagonista.
- [ ] Campaña activa (Hot Sale, Cyber, Travel Sale, Semanas temáticas) y versión sin campaña.
- [ ] Secciones por tipo de viaje (hoy 5 carruseles que repiten paquetes).
- [ ] Regiones destacadas.
- [ ] Por qué DeTurista: sucursales, años, pago en cuotas, asesoramiento.
- [ ] Reseñas.
- [ ] Newsletter.

### 4.5 Listado / resultados · P1
Sirve para país, ciudad, categoría y búsqueda.
- [ ] Cabecera (título, cantidad, foto si es región o país).
- [ ] Filtros (lateral en escritorio, hoja en celular) y orden.
- [ ] Grilla o lista de tarjetas.
- [ ] Estados: 1 resultado · muchos (Travel Sale tiene 88) · **sin resultados** con sugerencias (hoy hay 319 ciudades sin paquetes que llevan a una página vacía).

### 4.6 Región · P2
10 regiones (Europa, Asia, Caribe, África, Sudamérica, Centroamérica, Norteamérica, Oceanía, Antártida, Todo el mundo).
- [ ] Portada con foto, países con cantidad de paquetes, destacados.
- [ ] Caso con 1 país (Antártida, Centroamérica) y con 23 (Europa).

### 4.7 País · P2
63 países; 41 tienen 1 o 2 paquetes.
- [ ] Portada del país, ciudades, paquetes, documentación necesaria.
- [ ] Caso con 1 paquete (que no se vea vacío).

### 4.8 Landing de campaña · P2
26 categorías tienen página; 6 dan error hoy (las «Salidas desde…» y Cybermonday).
- [ ] Plantilla: héroe de campaña, cuenta regresiva, condiciones (cupón, cuotas), paquetes elegidos, por región.
- [ ] Estados: antes (próximamente), durante, terminada.
- [ ] Variantes de color por campaña.
- [ ] Página «Salidas desde Córdoba / Mendoza / Rosario / Salta».

### 4.9 Contacto · P2
- [ ] Formulario: nombre, email, WhatsApp con país, destino, fechas, consulta, «quiero que me llamen», términos.
- [ ] Contacto directo: teléfono 0810, WhatsApp, horarios, email, redes.
- [ ] Estados: enviado, error.

### 4.10 Sucursales · P2 (nueva)
Hoy solo están en el footer.
- [ ] Mapa con las 8: Pilar, Callao y Córdoba (CABA), TOM Tortugas Open Mall, La Plata, Nueva Córdoba, Paraná, Mendoza, Salta.
- [ ] Ficha por sucursal: foto, dirección, horario, cómo llegar, WhatsApp.

### 4.11 Quiénes somos · P3
Hoy son 48 pantallas en celular: lista 84 personas con nombre, cargo y mail.
- [ ] Historia, valores, números, sucursales, sellos.
- [ ] Equipo: decidir si va completo, por área o solo dirección.
- [ ] «Hablá con nuestro CEO» (hoy en todas las páginas).

### 4.12 Shop · P3
53 productos en 5 categorías, todo en una página de 38 pantallas en celular.
- [ ] Portada con categorías, listado, ficha de producto, cómo se compra.
- [ ] Decidir si se rediseña, se simplifica o sale de la web principal.

### 4.13 Giftcards · P3
- [ ] Elegir monto (USD 50, 100, 500, 1.000, 2.500 o libre desde 50), cuotas, datos (nombre, apellido, email, teléfono, CUIL), pago.
- [ ] Diseño de la tarjeta Detugift.
- [ ] Confirmación.

### 4.14 Legales · P3
6 páginas: condiciones (8.083 palabras, 44 pantallas en celular), privacidad, cancelaciones, documentación para salir del país, medios de pago, legales de giftcards.
- [ ] Plantilla de texto largo con índice lateral (escritorio) o desplegable (celular).
- [ ] Hoy tiene scroll horizontal en celular: arreglar.

### 4.15 Error y vacíos · P3
- [ ] 404 con buscador y destacados (hoy: «La página solicitada no existe» e «Ir al inicio»).
- [ ] Error de servidor.
- [ ] Sin resultados de búsqueda.
- [ ] Sin conexión (celular).

### 4.16 Newsletter · P2
- [ ] Bloque de suscripción (nombre, email, región de interés).
- [ ] Confirmación y error.

---

## 5. Flujos a prototipar

Para probar con 5 personas antes de cerrar.
- [ ] Buscar «Brasil en enero» → listado → ficha → salida → checkout → confirmación.
- [ ] Entrar desde un anuncio de Meta directo a una ficha (celular) → consultar por WhatsApp.
- [ ] Comparar dos salidas del mismo paquete (precio y vuelos).
- [ ] Comprar una giftcard.
- [ ] Encontrar la sucursal más cercana.

---

## 6. Imágenes a producir (Magnific, Space «Web nueva» en «web marketing»)

- [ ] **Página Dirección**: moodboard de las dos propuestas.
- [ ] **Héroes de home**: uno por campaña principal + uno general. 16:9 (escritorio) y 4:5 (celular).
- [ ] **Regiones**: 10 portadas sin texto quemado.
- [ ] **Países**: 63 portadas (prioridad: los que tienen más paquetes). Fotos reales, no generadas.
- [ ] **Ilustraciones**: 404, sin resultados, confirmación de compra, checkout vacío, newsletter.
- [ ] **Campañas**: kit por campaña (héroe, banner, tarjeta).
- [ ] **Video**: loops de 3 a 6 s sin sonido para el héroe de home y regiones (Kling 3.0).
- [ ] **Giftcard**: diseño de la tarjeta.

Medidas a pedir al admin para cada paquete: foto 16:9 de 1920×1080, foto 4:5 de 1080×1350 y galería de 5 a 10 fotos.

---

## 7. Textos a escribir

- [ ] Microcopy de botones, avisos y errores (voseo).
- [ ] Bajadas de home, regiones y campañas.
- [ ] «Por qué DeTurista».
- [ ] Preguntas frecuentes generales (pago, cuotas, seña, documentación, cancelación).
- [ ] Estados vacíos y 404.
- [ ] Títulos y descripciones para buscadores por plantilla (hoy 24 paquetes con título vacío).

---

## 8. No es diseño, pero hay que definirlo

- [ ] Pedido de datos a la API de febrero (`relevamiento/README.md`, sección «Pedido de datos»).
- [ ] URLs nuevas y redirecciones desde las viejas.
- [ ] Medición: GTM, dos GA4, Google Ads, Clarity; revisar el píxel de Meta.
- [ ] SEO: sitemap, títulos, H1, datos estructurados de viaje.
- [ ] Velocidad: la home actual pesa 10 MB; objetivo menos de 2 MB.
- [ ] Accesibilidad: contraste, foco visible, textos alternativos (hoy 103 de 120 imágenes de la home no tienen).

---

## 9. Orden sugerido

1. Fundamentos + iconografía de servicios (secciones 1 y 2).
2. Componentes básicos y precio (sección 3).
3. Ficha de paquete y selector de salida (4.1 y 4.2).
4. Checkout y confirmación (4.3).
5. Home y listado (4.4 y 4.5).
6. Región, país, campaña, contacto, sucursales, newsletter (4.6 a 4.10 y 4.16).
7. Quiénes somos, shop, giftcards, legales, errores (4.11 a 4.15).
8. Prototipo y prueba (sección 5).
