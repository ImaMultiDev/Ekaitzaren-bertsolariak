export default function SobreMiPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-border">
        <div className="mx-auto max-w-3xl">
          <div className="line-accent mb-4" />
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl tracking-[0.15em] text-white">
            SOBRE MÍ
          </h1>
        </div>
      </section>

      {/* Contenido - tono honesto, humano, poético */}
      <article className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="space-y-12 font-body text-lg leading-relaxed text-white-broken">
            <p className="text-xl">
              Escribo porque no sé hacer otra cosa. O quizá sí, pero las
              palabras siempre ganan.
            </p>

            <p>
              La relación con la palabra es personal. Íntima. A veces violenta.
              A veces tierna. Como una tormenta que te empuja contra la pared y
              al mismo tiempo te abraza. Así es para mí escribir: no elegí la
              tormenta, la tormenta me eligió a mí.
            </p>

            <p>
              La música llegó después. O tal vez siempre estuvo ahí, esperando.
              Descubrí que una letra sola puede ser hermosa, pero una letra con
              guitarra, con batería, con la voz rota de quien canta lo que
              siente—eso es otra cosa. Eso es verdad. La música como herramienta
              de verdad. No de evasión. De encuentro.
            </p>

            <div className="py-8">
              <p className="font-heading text-2xl text-white italic">
                La tormenta no es solo mía. Es nuestra. Es la voz colectiva que
                dice lo que el silencio no se atreve. Resistencia. Dignidad.
                Verdad.
              </p>
            </div>

            <p>
              Rock, punk-rock, ska-punk. Los géneros son etiquetas. Lo que
              importa es lo que late debajo: la rabia que se transforma en
              poesía, la tristeza que se convierte en canción, la esperanza que
              no se rinde aunque todo diga lo contrario.
            </p>

            <p>
              Este espacio no es un portfolio. No es un escaparate. Es un lugar
              donde la palabra y la música se encuentran. Donde lo que escribo y
              lo que canto conviven sin jerarquías. Pocas páginas. Alto impacto
              emocional. Eso intento.
            </p>

            <p className="text-stone italic">
              Gracias por estar aquí. La tormenta te esperaba.
            </p>
          </div>
        </div>
      </article>
    </div>
  );
}
