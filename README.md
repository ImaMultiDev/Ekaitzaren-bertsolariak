# Ekaitzaren Bertsolariak

Portal artístico y poético para un autor-compositor de letras, canciones y libros. Centrado en rock, punk-rock y ska-punk.

> La tormenta tiene voz. La palabra tiene fuego.

## Stack

- **Next.js 16** (App Router)
- **PostgreSQL** (Railway)
- **Prisma** (ORM)
- **Tailwind CSS**
- **Vercel** (despliegue)
- **Cloudinary** (imágenes)
- **SoundCloud** (audio incrustado)

## Desarrollo

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con DATABASE_URL de Railway (URL postgresql:// directa)

# Generar cliente Prisma
npx prisma generate

# Aplicar migraciones y seed
npm run db:migrate
npm run db:seed

# Iniciar en desarrollo
npm run dev
```

## Estructura

- `src/app/` - Páginas (App Router)
- `src/components/` - Componentes reutilizables
- `src/lib/` - Utilidades, Prisma, datos
- `prisma/` - Schema y migraciones

## Páginas

- **/** - Home (manifiesto artístico)
- **/obras** - Listado de obras con filtros
- **/obras/[slug]** - Detalle de obra (letra, SoundCloud, imágenes)
- **/sobre-mi** - Página personal

## Modelos de datos (Prisma)

- `Author` - Autores (multi-autor preparado)
- `Work` - Obras genéricas (canciones, libros, poemas)
- `Song` - Extensión para canciones + SoundCloud
- `Book` - Extensión para libros (PDF/embed)
- `WorkImage` - Imágenes Cloudinary
- `Tag` - Etiquetas/temáticas
