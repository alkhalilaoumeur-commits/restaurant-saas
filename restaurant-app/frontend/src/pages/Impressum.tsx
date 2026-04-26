import { Link } from 'react-router-dom';
import ServeFlowLogo from '../components/brand/ServeFlowLogo';

export default function Impressum() {
  return (
    <div className="min-h-dvh bg-gradient-to-br from-slate-50 via-blue-50/40 to-cyan-50/30 dark:from-[#070B14] dark:via-[#0A0F1A] dark:to-[#0F1724] font-body">
      <header className="sticky top-0 z-20 backdrop-blur-md bg-white/70 dark:bg-[#0A0F1A]/70 border-b border-gray-200/60 dark:border-white/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-slate-300 hover:text-brand-primary transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Zurück
          </Link>
          <ServeFlowLogo variante="text" groesse="sm" />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <h1 className="text-3xl sm:text-4xl font-heading font-semibold text-gray-900 dark:text-slate-50 tracking-[-0.02em] mb-2">
          Impressum
        </h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mb-10">
          Angaben gemäß § 5 TMG (Telemediengesetz) und § 2 DL-InfoV (Dienstleistungs-Informationspflichten-Verordnung)
        </p>

        <div className="glass-surface rounded-2xl shadow-premium p-6 sm:p-8 space-y-8">
          <section>
            <h2 className="text-lg font-heading font-semibold text-gray-900 dark:text-slate-50 mb-3">
              Anbieter
            </h2>
            <div className="text-sm text-gray-700 dark:text-slate-300 space-y-1 leading-relaxed">
              <p><strong>Al-Khalil Aoumeur</strong></p>
              <p>Einzelunternehmen</p>
              <p>Egilolfstraße 41</p>
              <p>70599 Stuttgart</p>
              <p>Deutschland</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-gray-900 dark:text-slate-50 mb-3">
              Kontakt
            </h2>
            <div className="text-sm text-gray-700 dark:text-slate-300 space-y-1 leading-relaxed">
              <p>
                E-Mail:{' '}
                <a href="mailto:kontakt@serve-flow.org" className="text-brand-primary hover:underline">
                  kontakt@serve-flow.org
                </a>
              </p>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-2">
                Wir antworten i.&nbsp;d.&nbsp;R. innerhalb von 48&nbsp;Stunden an Werktagen.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-gray-900 dark:text-slate-50 mb-3">
              Umsatzsteuer
            </h2>
            <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
              Gemäß <strong>§ 19 UStG</strong> (Kleinunternehmerregelung) wird keine Umsatzsteuer berechnet und ausgewiesen.
              Eine Umsatzsteuer-Identifikationsnummer liegt daher nicht vor.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-gray-900 dark:text-slate-50 mb-3">
              Berufsbezeichnung & Aufsichtsbehörde
            </h2>
            <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
              Die Tätigkeit als Anbieter einer Software-as-a-Service-Lösung unterliegt keiner besonderen berufsrechtlichen Regelung
              und keiner spezifischen Aufsichtsbehörde.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-gray-900 dark:text-slate-50 mb-3">
              Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
            </h2>
            <div className="text-sm text-gray-700 dark:text-slate-300 space-y-1 leading-relaxed">
              <p>Al-Khalil Aoumeur</p>
              <p>Egilolfstraße 41</p>
              <p>70599 Stuttgart</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-gray-900 dark:text-slate-50 mb-3">
              Online-Streitbeilegung (OS-Plattform)
            </h2>
            <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
              <a
                href="https://ec.europa.eu/consumers/odr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-primary hover:underline break-all"
              >
                https://ec.europa.eu/consumers/odr
              </a>
              .
            </p>
            <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed mt-2">
              Hinweis nach § 36 VSBG: Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen. ServeFlow richtet sich ausschließlich an Unternehmer im Sinne
              des § 14 BGB; ein Verbrauchergeschäft findet nicht statt.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-gray-900 dark:text-slate-50 mb-3">
              Haftung für Inhalte
            </h2>
            <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
              Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen
              Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet,
              übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen,
              die auf eine rechtswidrige Tätigkeit hinweisen.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-gray-900 dark:text-slate-50 mb-3">
              Haftung für Links
            </h2>
            <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben.
              Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten
              Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-gray-900 dark:text-slate-50 mb-3">
              Urheberrecht
            </h2>
            <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
              Die durch den Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen
              Urheberrecht. Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der
              Grenzen des Urheberrechts bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
            </p>
          </section>
        </div>

        <p className="text-xs text-gray-500 dark:text-slate-500 text-center mt-8">
          Stand: 25. April 2026
        </p>

        <div className="flex justify-center gap-6 text-xs text-gray-500 dark:text-slate-500 mt-6">
          <Link to="/datenschutz" className="hover:text-brand-primary transition-colors">Datenschutzerklärung</Link>
          <Link to="/agb" className="hover:text-brand-primary transition-colors">AGB</Link>
        </div>
      </main>
    </div>
  );
}
