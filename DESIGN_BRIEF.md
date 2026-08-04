# Design Brief — Lista de Regalos Bebé

## 1. Resumen

Web app privada para gestionar la lista de regalos del baby shower. Los invitados pueden consultar regalos por categoría, reservarlos y ver info del evento. Los padres tienen un panel de administración para gestionar el contenido y ver quién reservó qué.

**Costo de infraestructura: $0**

---

## 2. Stack Técnico

| Capa | Tecnología | Justificación |
|------|-----------|---------------|
| Frontend + API | Next.js (App Router) | Server Actions resuelven el backend sin servidor separado |
| Base de datos | Supabase (free tier) | PostgreSQL real, resuelve race conditions, studio incluido |
| Hosting | Vercel (free tier) | Integración nativa con Next.js, deploy en minutos |
| Imágenes de regalos | URLs externas (ML, Amazon, etc.) | CDN de MercadoLibre permite hotlinking; sin necesidad de storage propio |

---

## 3. Modelo de Datos

### `settings`
Contenido editable del sitio. Una sola fila.

| Campo | Descripción |
|-------|-------------|
| `welcome_title` | Título de la sección de bienvenida |
| `welcome_subtitle` | Subtítulo o bajada de bienvenida |
| `event_date` | Fecha del baby shower |
| `event_time` | Hora del evento |
| `event_address` | Dirección física |
| `maps_url` | Link de Google Maps |
| `cash_note` | Texto de la sección de apoyo económico |
| `bank_name` | Nombre del banco |
| `bank_account` | CBU / CLABE / número de cuenta |
| `bank_holder` | Titular de la cuenta |

### `gifts`
Catálogo de regalos.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | PK |
| `category` | text | Ej: "Higiene y Baño", "Ropa y Textil" |
| `name` | text | Nombre del regalo |
| `description` | text | Descripción o preferencias (marcas, colores, etc.) |
| `image_url` | text | URL externa de la imagen del producto |
| `external_link` | text | Link a tienda (ML, Amazon, etc.) |
| `status` | enum | `available` \| `reserved` |
| `created_at` | timestamp | |

### `reservations`
Reservas de invitados.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | PK |
| `gift_id` | UUID | FK → gifts |
| `first_name` | text | Obligatorio — usado como nombre completo. El form solo pide un campo "Nombre". |
| `last_name` | text | Obligatorio en la DB pero no expuesto en el form (siempre `''`); dead weight, ver `reserve.ts`. |
| `message` | text | Opcional |
| `cancel_token` | UUID | Token único para cancelar sin cuenta |
| `created_at` | timestamp | |

---

## 4. Reglas de Negocio

- Un regalo tiene dos estados: `available` o `reserved`.
- Al reservar, el regalo no desaparece: se muestra en gris con badge "Reservado".
- Los invitados no ven quién reservó un regalo; solo que está ocupado.
- La reserva requiere nombre (un solo campo). El mensaje es opcional.
- **Race condition:** La reserva se ejecuta con `UPDATE ... WHERE status = 'available'`. Si retorna 0 filas, otro invitado llegó primero → se notifica al usuario y el regalo ya aparece reservado.

---

## 5. Flujo de Cancelación (sin cuenta)

1. Al confirmar una reserva, la carta de agradecimiento muestra un **código de cancelación** (ej: `ROSA-4821`).
2. El invitado guarda ese código.
3. Si necesita cancelar, ingresa a `/cancelar`, tipea el código y la reserva se revierte.
4. El admin también puede cancelar manualmente desde el backoffice.

> **Nota:** No se requiere cuenta ni email. El código es el único mecanismo de identidad del invitado.

---

## 6. Superficies

### Vista Pública (`/`)

Accesible sin login. Una sola página con scroll continuo:

1. **Bienvenida e info del evento** — mensaje, fecha, hora, dirección, botón Google Maps, nota de regalos alternativos
2. **Lista de regalos** — agrupados por categoría, con foto, descripción, link externo y botón "Reservar" (solo en disponibles)
3. **Modal de reserva** → carta de agradecimiento con código de cancelación
4. **Apoyo económico** — datos bancarios al pie

`/cancelar` — formulario simple: ingresá tu código → confirmación de cancelación.

### Vista Admin (`/admin`)

Protegida con contraseña almacenada en variable de entorno (no se requiere sistema de auth completo).

- **Settings** — editor de todos los textos e info del evento
- **Regalos** — CRUD completo (agregar, editar, eliminar, reordenar por categoría)
- **Reservas** — tabla con nombre, apellido, mensaje y regalo reservado; opción de cancelar manualmente

---

## 7. Consideraciones de Infraestructura

### Supabase Free Tier

| Límite | Valor | ¿Alcanza? |
|--------|-------|-----------|
| DB size | 500 MB | ✅ Sobra (usaremos <1 MB) |
| File storage | 1 GB | ✅ No se usa (imágenes externas) |
| Egress | 5 GB | ✅ Más que suficiente |
| Monthly active users | 50.000 | ✅ |
| Proyectos activos | 2 | ✅ |
| **Pausa por inactividad** | 1 semana | ⚠️ No crear el proyecto con demasiada antelación al evento |

### Imágenes de Regalos

URLs externas (MercadoLibre, Amazon, etc.). El CDN de ML no tiene hotlink protection — verificado. Riesgo menor: si el producto se elimina de ML, la imagen deja de cargar. Aceptable para un evento de vida corta.

---

## 8. Fuera de Scope — Fase 2

- Export a Excel desde el backoffice
- Notificaciones a los padres cuando alguien reserva (email / push)

---

## 9. Diseño Visual

- **Estilo:** Minimalista. Fondos blancos, espacios amplios.
- **Referencia:** `context/plantilla_diseno_web_bebe.html`
- **Responsivo:** Mobile-first. El link se comparte por WhatsApp; la mayoría accede desde celular.

### Paleta y tokens

| Token | Valor | Uso |
|-------|-------|-----|
| `--primary-color` | `#556b2f` | Botones activos, títulos de sección, detalles. Contraste ~7:1 sobre blanco ✅ |
| `--bg-color` | `#ffffff` | Fondo general |
| `--card-bg` | `#f7f9f6` | Cards, info del evento |
| `--text-color` | `#333333` | Texto principal |
| `--text-muted` | `#5a6657` | Texto secundario (fecha, subtítulo). **No usar `#7b8a76`** — contraste 3.5:1, falla AA |
| `--border-color` | `#e1e7de` | Bordes de cards |

### Tipografía

- **Font stack:** `'Helvetica Neue', Helvetica, Arial, sans-serif` (sin dependencia de Google Fonts)
- **Títulos (`h1`, `h2`):** `font-weight: 400`. Evitar `300` — en Windows Arial no tiene peso 300 real y se ve muy delgada.
- **Texto de cuerpo:** `font-weight: 400`, `line-height: 1.6`
- **Texto secundario / muted:** `font-weight: 400`, color `--text-muted`

### Navegación de categorías

Los tabs de categoría usan `overflow-x: auto` con scroll oculto para soportar crecimiento:

```css
.categories {
    display: flex;
    gap: 10px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    padding-bottom: 2px; /* evita que se corte el border-bottom del tab activo */
}
.categories::-webkit-scrollbar { display: none; }
```

**Comportamiento:** los tabs **filtran** los regalos visibles (muestra solo la categoría activa), no anclan con scroll. Esto escala a cualquier cantidad de categorías sin alargar la página.

---

## 10. Estados de UI

### Modal de reserva — tres estados

El modal tiene tres estados excluyentes:

| Estado | ID | Cuándo |
|--------|----|--------|
| Formulario | `#modal-form` | Al abrir el modal |
| Carta de agradecimiento | `#modal-thanks` | Reserva exitosa |
| Error de race condition | `#modal-error` | Otro invitado reservó primero |

**Estado de carga:** mientras el Server Action procesa, el botón "Confirmar Reserva" debe estar deshabilitado y mostrar el texto "Reservando…". Previene doble submit.

### Carta de agradecimiento — código de cancelación

La carta (`#modal-thanks`) **debe mostrar el código de cancelación** de forma destacada. El usuario lo ve desde el celular y tiene que poder copiarlo o fotografiarlo.

Estructura requerida:

```
¡Muchas gracias, {nombre}!
[texto de bienvenida]

Tu código de cancelación:
┌─────────────────┐
│   ROSA-4821     │  ← fondo destacado, fuente monoespaciada, texto grande
└─────────────────┘
[Copiar código]       ← botón que usa navigator.clipboard.writeText()

Guardá este código por si necesitás cancelar tu reserva.
```

### Error de race condition

```
Ups, alguien llegó primero.
Este regalo ya fue reservado mientras completabas el formulario.
[Cerrar]
```

Al cerrar, el regalo ya debe aparecer en estado gris/reservado en la lista (revalidación automática via Server Action).

### Estado vacío de categoría

Cuando todos los regalos de una categoría están reservados:

> *"Todos los regalos de esta categoría ya están reservados. ¡Gracias por su generosidad!"*

Aplica también si el admin no cargó regalos en esa categoría todavía.

### Fallback de imagen

Si la URL externa (MercadoLibre, Amazon, etc.) falla al cargar, mostrar un placeholder SVG genérico (ej: ícono de caja de regalo). Implementar via `onError` en el componente `<Image>` de Next.js.

```tsx
<Image
  src={gift.image_url}
  alt={gift.name}
  onError={(e) => { e.currentTarget.src = '/images/gift-placeholder.svg' }}
  ...
/>
```
