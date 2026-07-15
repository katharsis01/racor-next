# Auditoría de mejoras — RACOR

## Resumen ejecutivo

La prioridad no es añadir más páginas, sino ayudar a elegir una prenda y reducir la incertidumbre antes de pedir presupuesto. La revisión ha combinado el contenido real del catálogo, el flujo actual, la navegación, accesibilidad, rendimiento percibido y buenas prácticas de producto.

## Estado de ejecución · 14 de julio de 2026

- La ficha Morcuera 2.0 ya muestra clima, ajuste, uso recomendado, construcción, gramajes, cuidados, tallaje y límites de la información publicada.
- El presupuesto, WhatsApp y los factores de confianza aparecen antes del contenido técnico largo.
- Ya existe comparación compacta de maillots y un recomendador por temperatura, prioridad y ajuste.
- Los productos relacionados explican ahora para qué destaca cada alternativa.
- Se ha creado una galería de vídeos con el material auténtico publicado por RACOR.
- El asistente registra únicamente intención agregada, aperturas y clics comerciales cuando GA4 está configurado; no envía el texto de la pregunta.
- Se han añadido canonicals de producto, Open Graph, datos estructurados `Product`, `robots.txt` y `sitemap.xml`.

## Mejoras ya aplicadas

1. **Arquitectura más simple.** El proceso completo está ahora dentro de “Nosotros”, inmediatamente después de los tres pilares. La antigua URL `/proceso` redirige al nuevo bloque para no romper enlaces guardados.
2. **Decisión de producto más clara.** Cada ficha muestra de un vistazo pedido mínimo, diseño incluido y plazo orientativo, con acceso directo al proceso.
3. **Asistente de producto.** Está disponible en toda la web, conoce el catálogo, compara modelos, orienta por clima, tallaje, clubes, plazo y condiciones. No inventa precios ni datos no publicados y deriva a contacto cuando hace falta una confirmación.
4. **Dos modos de funcionamiento.** La respuesta local funciona sin servicios externos. De forma opcional se puede activar respuesta generativa mediante AI Gateway, manteniendo el catálogo como contexto y la misma interfaz en streaming.
5. **Accesibilidad del panel.** El asistente usa un diálogo lateral con nombre accesible, cierre por teclado, foco contenido, mensajes anunciables, controles etiquetados y enlaces reales a productos.

## Próximas prioridades recomendadas

### P1 — Completar la información que desbloquea la compra

- Publicar **composición, cuidados, rango térmico, tipo de ajuste y uso recomendado** con una estructura común para cada prenda.
- Añadir una página clara de **envíos, cambios/devoluciones y prendas personalizadas**. El asistente ya detecta estas preguntas, pero actualmente debe reconocer que el dato no está publicado.
- Ampliar el tallaje por familia de prenda con **medidas de la prenda, ajuste esperado y medidas del modelo**. Baymard identifica la información de talla insuficiente como una debilidad extendida en ecommerce de moda.
- Incorporar más imágenes de **detalle, espalda, tejido y prenda puesta**. Las imágenes se usan para entender escala, acabado y ajuste, no solo para decorar la ficha.

Impacto esperado: menos consultas repetitivas, más confianza y presupuestos mejor cualificados.

### P1 — Convertir el asistente en una herramienta comercial medible

- Medir `chat_open`, intención de la pregunta, producto recomendado, clic a ficha y clic a contacto.
- Guardar únicamente eventos agregados; no almacenar texto libre sin consentimiento y una política definida.
- Revisar mensualmente las preguntas sin respuesta para decidir qué información añadir a las fichas.
- Mostrar una derivación humana clara cuando la pregunta sea de precio final, fecha comprometida o condición contractual.

Impacto esperado: saber qué dudas frenan al cliente y mejorar el catálogo con evidencia real.

### P2 — Comparación y recomendación guiada

- Crear una tabla comparativa compacta para maillots: clima, ligereza, transpirabilidad, durabilidad, ajuste y uso.
- Añadir un selector de tres preguntas: **temperatura, intensidad y ajuste**. El resultado debe explicar por qué recomienda cada modelo y permitir comparar dos prendas.
- En las fichas, sustituir “productos similares” genéricos por “mejor para…”: más calor, más resistencia, entretiempo o competición.

Impacto esperado: acelerar la elección cuando varios modelos parecen similares.

### P2 — SEO técnico y contenido compartible

- Configurar dominio canónico, `sitemap.xml`, `robots.txt`, Open Graph y tarjetas sociales cuando esté confirmado el dominio de producción.
- Añadir datos estructurados `Organization` y `Product` solo para información verificable; no marcar un precio si depende de presupuesto.
- Crear páginas útiles por intención, por ejemplo “equipaciones para clubes”, “ropa ciclista personalizada en Madrid” y “cómo elegir maillot según temperatura”, enlazadas desde productos y respuestas del asistente.

### P2 — Rendimiento y calidad continua

- Medir Core Web Vitals con datos de usuarios reales y segmentar móvil/escritorio. Objetivos recomendados: **LCP ≤ 2,5 s, INP ≤ 200 ms y CLS ≤ 0,1 en el percentil 75**.
- Cargar las dependencias del asistente después de la interacción si el peso del paquete afecta al inicio; verificarlo con un análisis de bundle antes de decidir.
- Añadir pruebas de regresión para navegación, envío del formulario, apertura/cierre del asistente y preguntas críticas.

## Riesgos y controles del asistente

- **Alucinaciones:** las respuestas locales son deterministas y basadas en el catálogo. El modo generativo recibe instrucciones para declarar límites y no inventar precio, stock, entrega o políticas.
- **Privacidad:** el campo no debe solicitar datos sensibles; cualquier persistencia futura necesita finalidad, retención y consentimiento claros.
- **Expectativas:** la interfaz explica que precio y confirmaciones finales corresponden al equipo humano.
- **Mantenimiento:** cada cambio de producto debe actualizar también el contexto del asistente; ambos consumen la misma fuente local para evitar divergencias.

## Nota de dependencias

La auditoría de paquetes marca dos avisos moderados en PostCSS, incluido de forma interna por la versión actual de Next.js. El arreglo automático propone una bajada incompatible de Next, por lo que no se ha aplicado a ciegas. Conviene actualizar cuando Next publique una versión estable que incorpore la corrección y repetir la auditoría.

## Fuentes consultadas

- Baymard Institute, estado de la UX de páginas de producto: https://baymard.com/blog/current-state-ecommerce-product-page-ux
- Baymard Institute, información de talla en moda: https://baymard.com/blog/apparel-size-information
- Baymard Institute, estadísticas de UX: https://baymard.com/learn/ux-statistics
- W3C WAI-ARIA, patrón de diálogo modal: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- web.dev, Core Web Vitals: https://web.dev/articles/vitals?hl=en
- web.dev, Interaction to Next Paint: https://web.dev/articles/inp
- AI SDK, patrón de chatbot: https://ai-sdk.dev/docs/ai-sdk-ui/chatbot
- AI Elements, componentes de conversación, mensajes y entrada: https://elements.ai-sdk.dev/
