export default function SobreMiPage() {
  return (
    <div className="min-h-screen">
      <section className="py-24 px-6 sm:px-12 lg:px-24 border-b border-border">
        <div className="max-w-2xl mx-auto">
          <p className="text-grey-muted text-xs tracking-[0.2em] uppercase mb-4">
            Sobre mí
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-normal text-white-broken">
            La palabra y la tormenta
          </h1>
        </div>
      </section>

      <article className="py-24 px-6 sm:px-12 lg:px-24">
        <div className="max-w-2xl mx-auto">
          <div className="poem-line font-body text-xl leading-[2.2] text-white-broken space-y-12">
            <p>
              Escribo porque hay cosas que no se pueden dejar pasar.
            </p>

            <p>
              La palabra llegó cuando entendí que el silencio también es una forma de participación. Desde entonces, escribir se convirtió en una responsabilidad: nombrar lo que duele, sostener la memoria y no suavizar aquello que exige ser dicho.
            </p>

            <p>
              Mis canciones nacen de ahí. Letras pensadas para ser cantadas, pero también para quedarse cuando el ruido se apaga. No buscan respuestas fáciles ni mensajes cerrados, sino abrir grietas, generar conversación y mantener la atención despierta.
            </p>

            <p>
              Trabajo con distintos formatos —principalmente canciones, pero también textos y libros— porque no todo cabe en una estrofa. Sin embargo, el origen es siempre el mismo: una necesidad de verdad compartida.
            </p>

            <p>
              Ekaitzaren Bertsolariak no es un personaje ni una marca.
              Es un espacio para quienes no aceptan la normalidad como excusa.
            </p>
          </div>
        </div>
      </article>
    </div>
  );
}
