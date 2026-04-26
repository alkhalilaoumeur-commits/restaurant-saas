import { Link } from 'react-router-dom';
import ServeFlowLogo from '../components/brand/ServeFlowLogo';

export default function AGB() {
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
          Allgemeine Geschäftsbedingungen
        </h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mb-10">
          AGB für die Nutzung von ServeFlow durch gewerbliche Kunden (B2B)
        </p>

        <div className="glass-surface rounded-2xl shadow-premium p-6 sm:p-8 space-y-10">

          <section>
            <h2 className="text-lg font-heading font-semibold text-gray-900 dark:text-slate-50 mb-3">
              § 1 Geltungsbereich, Vertragspartner
            </h2>
            <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed mb-3">
              (1) Diese Allgemeinen Geschäftsbedingungen („AGB") gelten für sämtliche Verträge zwischen
            </p>
            <div className="text-sm text-gray-700 dark:text-slate-300 space-y-1 leading-relaxed pl-4 border-l-2 border-brand-primary/40">
              <p>Al-Khalil Aoumeur (Einzelunternehmen)</p>
              <p>Egilolfstraße 41, 70599 Stuttgart</p>
              <p>nachfolgend „Anbieter" oder „ServeFlow"</p>
            </div>
            <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed mt-3">
              und dem Kunden über die Nutzung der Software-as-a-Service-Lösung „ServeFlow".
            </p>
            <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed mt-3">
              (2) ServeFlow richtet sich <strong>ausschließlich an Unternehmer</strong> i.&nbsp;S.&nbsp;d. § 14 BGB,
              juristische Personen des öffentlichen Rechts oder öffentlich-rechtliche Sondervermögen. Verbraucher
              i.&nbsp;S.&nbsp;d. § 13 BGB sind vom Vertragsschluss ausgeschlossen.
            </p>
            <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed mt-3">
              (3) Abweichende, entgegenstehende oder ergänzende AGB des Kunden werden nur dann Vertragsbestandteil,
              wenn ihrer Geltung ausdrücklich schriftlich zugestimmt wurde.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-gray-900 dark:text-slate-50 mb-3">
              § 2 Vertragsschluss
            </h2>
            <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
              (1) Der Vertrag kommt durch die Online-Registrierung des Kunden auf serve-flow.org und die anschließende
              Bestätigung durch den Anbieter (Freischaltung des Kontos) zustande.
            </p>
            <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed mt-3">
              (2) Mit der Registrierung versichert der Kunde, dass die angegebenen Daten wahr und vollständig sind und
              dass er bzw. die handelnde Person zur Vertretung des Unternehmens berechtigt ist.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-gray-900 dark:text-slate-50 mb-3">
              § 3 Leistungsumfang
            </h2>
            <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed mb-3">
              (1) ServeFlow stellt dem Kunden eine browserbasierte Restaurant-Management-Software zur Nutzung über das
              Internet bereit. Der Funktionsumfang richtet sich nach dem vom Kunden gewählten Tarif:
            </p>
            <ul className="text-sm text-gray-700 dark:text-slate-300 space-y-1 list-disc list-inside leading-relaxed">
              <li><strong>Basis</strong> (29&nbsp;€/Monat): Reservierungen, Online-Buchung, Speisekarte, Tischplan, Walk-ins, bis zu 3 Mitarbeiter</li>
              <li><strong>Standard</strong> (59&nbsp;€/Monat): zusätzlich QR-Bestellung, Gäste-CRM, Bewertungsmanagement, Warteliste, SMS-Erinnerungen, bis zu 10 Mitarbeiter</li>
              <li><strong>Pro</strong> (99&nbsp;€/Monat): zusätzlich Dienstplan, Inventur, unbegrenzte Mitarbeiter</li>
            </ul>
            <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed mt-3">
              (2) Der Anbieter ist berechtigt, den Funktionsumfang weiterzuentwickeln, sofern hierdurch der vertraglich
              vereinbarte Kernzweck nicht wesentlich beeinträchtigt wird.
            </p>
            <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed mt-3">
              (3) Eine bestimmte Verfügbarkeit der Software wird nicht zugesichert. Der Anbieter ist jedoch bemüht, die
              Software dauerhaft verfügbar zu halten und Wartungsarbeiten möglichst außerhalb der üblichen Geschäftszeiten
              vorzunehmen.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-gray-900 dark:text-slate-50 mb-3">
              § 4 Preise, Zahlungsbedingungen
            </h2>
            <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
              (1) Es gelten die zum Zeitpunkt des Vertragsschlusses auf serve-flow.org veröffentlichten Preise.
              Die Vergütung wird im Voraus pro Abrechnungsperiode (monatlich) fällig.
            </p>
            <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed mt-3">
              (2) <strong>Hinweis nach § 19 UStG (Kleinunternehmerregelung):</strong> Auf den Rechnungen wird keine
              Umsatzsteuer ausgewiesen, da der Anbieter Kleinunternehmer im Sinne des Umsatzsteuergesetzes ist.
            </p>
            <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed mt-3">
              (3) Die Zahlung erfolgt über den Zahlungsdienstleister Stripe Payments Europe, Ltd. Der Kunde ermächtigt
              den Anbieter, den jeweils fälligen Betrag wiederkehrend von der hinterlegten Zahlungsmethode einzuziehen.
            </p>
            <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed mt-3">
              (4) Bei Zahlungsverzug ist der Anbieter berechtigt, den Zugang zur Software nach vorheriger Mahnung
              vorübergehend zu sperren. Gesetzliche Verzugszinsen und Mahnkosten bleiben unberührt.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-gray-900 dark:text-slate-50 mb-3">
              § 5 Vertragslaufzeit, Kündigung
            </h2>
            <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
              (1) Der Vertrag wird auf unbestimmte Zeit geschlossen und kann von beiden Seiten ordentlich
              <strong> mit einer Frist von einem Monat zum Ende der laufenden Abrechnungsperiode</strong> gekündigt werden.
            </p>
            <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed mt-3">
              (2) Die Kündigung kann in Textform (z.&nbsp;B. E-Mail) oder über die Kündigungsfunktion in der App
              erklärt werden.
            </p>
            <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed mt-3">
              (3) Das Recht zur außerordentlichen Kündigung aus wichtigem Grund bleibt unberührt. Ein wichtiger Grund
              für den Anbieter liegt insbesondere bei wesentlichem Verstoß des Kunden gegen diese AGB, insbesondere
              bei missbräuchlicher Nutzung der Software, vor.
            </p>
            <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed mt-3">
              (4) Nach Vertragsende werden die Daten des Kunden 30 Tage zur Verfügung gehalten und anschließend
              endgültig gelöscht, soweit gesetzliche Aufbewahrungspflichten nicht entgegenstehen.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-gray-900 dark:text-slate-50 mb-3">
              § 6 Pflichten des Kunden
            </h2>
            <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed mb-3">
              Der Kunde verpflichtet sich:
            </p>
            <ul className="text-sm text-gray-700 dark:text-slate-300 space-y-2 list-disc list-inside leading-relaxed">
              <li>Zugangsdaten geheim zu halten und vor Zugriff Dritter zu schützen.</li>
              <li>Die Software nicht für rechtswidrige Zwecke zu nutzen, insbesondere keine rechtswidrigen Inhalte einzustellen.</li>
              <li>Alle erforderlichen datenschutzrechtlichen Einwilligungen seiner Gäste und Mitarbeiter einzuholen.</li>
              <li>Die ihm zur Verfügung gestellte Software nicht zu vervielfältigen, zu verändern oder Dritten zugänglich zu machen, soweit dies nicht ausdrücklich gestattet ist.</li>
              <li>Selbständig regelmäßige Datensicherungen seiner exportierbaren Daten vorzunehmen, sofern für ihn relevant.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-gray-900 dark:text-slate-50 mb-3">
              § 7 Mängel, Gewährleistung
            </h2>
            <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
              (1) Mängel der Software werden vom Anbieter innerhalb angemessener Frist beseitigt. Der Kunde ist
              verpflichtet, Mängel unverzüglich nach Entdeckung in Textform anzuzeigen.
            </p>
            <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed mt-3">
              (2) Eine verschuldensunabhängige Haftung für anfängliche Mängel gemäß § 536a Abs. 1 Alt. 1 BGB ist ausgeschlossen.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-gray-900 dark:text-slate-50 mb-3">
              § 8 Haftung
            </h2>
            <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
              (1) Der Anbieter haftet unbeschränkt für Vorsatz und grobe Fahrlässigkeit sowie für Schäden aus der
              Verletzung des Lebens, des Körpers oder der Gesundheit.
            </p>
            <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed mt-3">
              (2) Bei leichter Fahrlässigkeit haftet der Anbieter nur bei Verletzung wesentlicher Vertragspflichten
              (Kardinalpflichten). Die Haftung ist in diesem Fall auf den vertragstypischen, vorhersehbaren Schaden
              begrenzt, höchstens jedoch auf die in den letzten zwölf Monaten vor dem Schadensereignis vom Kunden
              gezahlte Vergütung.
            </p>
            <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed mt-3">
              (3) Die Haftung nach dem Produkthaftungsgesetz bleibt unberührt.
            </p>
            <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed mt-3">
              (4) Der Anbieter haftet nicht für Schäden, die durch höhere Gewalt, Ausfälle bei Drittanbietern (Hosting,
              Zahlungsdienstleister, E-Mail-Provider) oder durch unsachgemäße Nutzung des Kunden verursacht werden.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-gray-900 dark:text-slate-50 mb-3">
              § 9 Datenschutz, Auftragsverarbeitung
            </h2>
            <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
              (1) Soweit der Anbieter im Rahmen der Bereitstellung der Software personenbezogene Daten verarbeitet,
              für die der Kunde verantwortlich ist (z.&nbsp;B. Daten der Gäste oder Mitarbeiter des Kunden), erfolgt
              dies im Auftrag des Kunden gemäß Art.&nbsp;28 DSGVO.
            </p>
            <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed mt-3">
              (2) Mit Vertragsschluss schließen die Parteien einen Vertrag über die Auftragsverarbeitung (AVV).
              Der AVV wird dem Kunden bei der Registrierung in Textform zur Verfügung gestellt und ist Bestandteil
              dieses Vertrages.
            </p>
            <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed mt-3">
              (3) Im Übrigen gilt die{' '}
              <Link to="/datenschutz" className="text-brand-primary hover:underline">Datenschutzerklärung</Link>{' '}
              des Anbieters.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-gray-900 dark:text-slate-50 mb-3">
              § 10 Geheimhaltung
            </h2>
            <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
              Beide Parteien verpflichten sich, alle ihnen im Rahmen der Vertragsdurchführung bekannt werdenden
              vertraulichen Informationen der jeweils anderen Partei vertraulich zu behandeln, auch über das Vertragsende
              hinaus.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-gray-900 dark:text-slate-50 mb-3">
              § 11 Geistiges Eigentum
            </h2>
            <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
              (1) Sämtliche Rechte an der Software, einschließlich Quellcode, Design, Marken und Inhalte, verbleiben
              beim Anbieter. Der Kunde erhält ein einfaches, nicht übertragbares, auf die Vertragslaufzeit beschränktes
              Nutzungsrecht.
            </p>
            <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed mt-3">
              (2) Sämtliche Inhalte, die der Kunde in die Software einstellt (Speisekarte, Bilder, Texte), verbleiben
              im Eigentum des Kunden. Der Kunde räumt dem Anbieter ein einfaches Nutzungsrecht zur Verarbeitung dieser
              Inhalte im Rahmen der Bereitstellung der Software ein.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-gray-900 dark:text-slate-50 mb-3">
              § 12 Änderungen der AGB
            </h2>
            <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
              (1) Der Anbieter ist berechtigt, diese AGB mit Wirkung für die Zukunft zu ändern, sofern dies aus triftigen
              Gründen erforderlich ist (insbesondere geänderte Rechtslage, höchstrichterliche Rechtsprechung,
              technische Anpassungen, Änderungen des Leistungsumfangs).
            </p>
            <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed mt-3">
              (2) Änderungen werden dem Kunden mindestens sechs Wochen vor ihrem Inkrafttreten in Textform mitgeteilt.
              Widerspricht der Kunde den Änderungen nicht innerhalb von sechs Wochen ab Zugang der Mitteilung, gelten die
              Änderungen als angenommen. Auf das Widerspruchsrecht und die Folgen wird in der Mitteilung gesondert
              hingewiesen. Im Falle des Widerspruchs sind beide Parteien zur außerordentlichen Kündigung berechtigt.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-gray-900 dark:text-slate-50 mb-3">
              § 13 Schlussbestimmungen
            </h2>
            <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
              (1) Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts.
            </p>
            <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed mt-3">
              (2) Ausschließlicher Gerichtsstand für sämtliche Streitigkeiten aus diesem Vertrag ist <strong>Stuttgart</strong>,
              sofern der Kunde Kaufmann, juristische Person des öffentlichen Rechts oder öffentlich-rechtliches
              Sondervermögen ist.
            </p>
            <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed mt-3">
              (3) Sollten einzelne Bestimmungen dieser AGB unwirksam oder undurchführbar sein oder werden, so bleibt
              davon die Wirksamkeit der übrigen Bestimmungen unberührt. An die Stelle der unwirksamen Bestimmung tritt
              die gesetzliche Regelung.
            </p>
          </section>
        </div>

        <p className="text-xs text-gray-500 dark:text-slate-500 text-center mt-8">
          Stand: 25. April 2026
        </p>

        <div className="flex justify-center gap-6 text-xs text-gray-500 dark:text-slate-500 mt-6">
          <Link to="/impressum" className="hover:text-brand-primary transition-colors">Impressum</Link>
          <Link to="/datenschutz" className="hover:text-brand-primary transition-colors">Datenschutzerklärung</Link>
        </div>
      </main>
    </div>
  );
}
