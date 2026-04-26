import { Link } from 'react-router-dom';
import ServeFlowLogo from '../components/brand/ServeFlowLogo';

export default function Datenschutz() {
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
          Datenschutzerklärung
        </h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mb-10">
          Informationen über die Verarbeitung personenbezogener Daten gemäß Art. 13 und 14 DSGVO
        </p>

        <div className="glass-surface rounded-2xl shadow-premium p-6 sm:p-8 space-y-10">

          <section>
            <h2 className="text-lg font-heading font-semibold text-gray-900 dark:text-slate-50 mb-3">
              1. Verantwortlicher
            </h2>
            <div className="text-sm text-gray-700 dark:text-slate-300 space-y-1 leading-relaxed">
              <p><strong>Al-Khalil Aoumeur</strong> (Einzelunternehmen)</p>
              <p>Egilolfstraße 41, 70599 Stuttgart, Deutschland</p>
              <p>
                E-Mail:{' '}
                <a href="mailto:kontakt@serve-flow.org" className="text-brand-primary hover:underline">
                  kontakt@serve-flow.org
                </a>
              </p>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-3">
                Im Folgenden „wir" oder „ServeFlow".
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-gray-900 dark:text-slate-50 mb-3">
              2. Geltungsbereich dieser Erklärung
            </h2>
            <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed mb-3">
              Diese Datenschutzerklärung gilt für die Verarbeitung personenbezogener Daten <strong>im Verhältnis zwischen ServeFlow
              und dem Restaurant-Betreiber</strong> (unserem Kunden) sowie für Besucher dieser Website und der App.
            </p>
            <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
              Für personenbezogene Daten der <strong>Gäste eines Restaurants</strong> (z.&nbsp;B. Reservierungen, Bestellungen)
              ist das jeweilige Restaurant der datenschutzrechtlich Verantwortliche. ServeFlow verarbeitet diese Daten ausschließlich
              im Auftrag des Restaurants gemäß einem Auftragsverarbeitungsvertrag (AVV) nach Art. 28 DSGVO. Die Datenschutzerklärung
              des jeweiligen Restaurants ist insoweit maßgeblich.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-gray-900 dark:text-slate-50 mb-3">
              3. Verarbeitungstätigkeiten im Überblick
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-slate-100 mb-1">3.1 Besuch der Website / Server-Logfiles</h3>
                <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
                  Beim Aufruf unserer Website werden technisch notwendige Informationen verarbeitet (IP-Adresse, Datum/Uhrzeit,
                  aufgerufene URL, Browser-Typ, Betriebssystem). Rechtsgrundlage: <strong>Art. 6 Abs. 1 lit. f DSGVO</strong> (berechtigtes
                  Interesse an einem stabilen, sicheren Betrieb). Diese Daten werden nach 14 Tagen automatisch gelöscht und
                  nicht mit anderen Datenquellen zusammengeführt.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 dark:text-slate-100 mb-1">3.2 Registrierung und Nutzerkonto</h3>
                <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
                  Wenn Sie sich bei ServeFlow registrieren, verarbeiten wir: Name, E-Mail, Telefonnummer, Passwort (verschlüsselt
                  als bcrypt-Hash, niemals im Klartext), Restaurantname, Anschrift des Restaurants. Rechtsgrundlage:{' '}
                  <strong>Art. 6 Abs. 1 lit. b DSGVO</strong> (Vertragserfüllung). Speicherdauer: für die Dauer Ihres
                  Vertragsverhältnisses zzgl. gesetzlicher Aufbewahrungsfristen (bis zu 10 Jahre für Rechnungsdaten gemäß § 147 AO).
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 dark:text-slate-100 mb-1">3.3 E-Mail-Verifizierung & Passwort-Reset</h3>
                <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
                  Zur Verifizierung Ihrer E-Mail und für Passwort-Resets versenden wir transaktionale E-Mails. Rechtsgrundlage:{' '}
                  <strong>Art. 6 Abs. 1 lit. b DSGVO</strong>. Tokens werden nach Verwendung bzw. nach 1&nbsp;Stunde (Reset)
                  bzw. 24&nbsp;Stunden (Verifizierung) ungültig.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 dark:text-slate-100 mb-1">3.4 Zahlungsabwicklung (Abo)</h3>
                <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
                  Für die Bezahlung Ihres Abonnements nutzen wir <strong>Stripe Payments Europe, Ltd.</strong>, 1 Grand Canal
                  Street Lower, Grand Canal Dock, Dublin, Irland. Stripe verarbeitet Zahlungsdaten (Kartennummer, Bankverbindung)
                  eigenverantwortlich. ServeFlow erhält von Stripe nur eine pseudonyme Kunden-ID, den Zahlungsstatus und Rechnungsdaten.
                  Rechtsgrundlage: <strong>Art. 6 Abs. 1 lit. b DSGVO</strong>. Bei der Karten-Authorisierung kann es zu einer
                  Datenübermittlung in die USA kommen; diese ist abgesichert durch das <strong>EU-US Data Privacy Framework
                  (DPF)</strong>, dem Stripe Inc. beigetreten ist, sowie ergänzend durch <strong>Standardvertragsklauseln (SCC)</strong>
                  nach Art. 46 Abs. 2 lit. c DSGVO im Stripe DPA. Datenschutzerklärung von Stripe:{' '}
                  <a href="https://stripe.com/de/privacy" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline break-all">
                    https://stripe.com/de/privacy
                  </a>
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 dark:text-slate-100 mb-1">3.5 Mitarbeiterverwaltung</h3>
                <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
                  Wenn Sie als Restaurant-Inhaber Mitarbeiter zur App einladen, werden deren Name und E-Mail zur Vertragsanbahnung
                  und Authentifizierung verarbeitet. Rechtsgrundlage: <strong>§ 26 BDSG</strong> i.&nbsp;V.&nbsp;m. Art. 6 Abs. 1
                  lit. b DSGVO (Beschäftigungsverhältnis bzw. Vertragserfüllung).
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 dark:text-slate-100 mb-1">3.6 Kontaktaufnahme per E-Mail</h3>
                <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
                  Bei Kontaktaufnahme per E-Mail werden Ihre Angaben zur Bearbeitung der Anfrage gespeichert. Rechtsgrundlage:{' '}
                  <strong>Art. 6 Abs. 1 lit. b DSGVO</strong> (vorvertragliche Maßnahmen) oder <strong>lit. f</strong>
                  (berechtigtes Interesse an Anfragenbeantwortung). Löschung nach Erledigung des Anliegens, sofern keine gesetzlichen
                  Aufbewahrungspflichten entgegenstehen.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-gray-900 dark:text-slate-50 mb-3">
              4. Auftragsverarbeiter und Empfänger
            </h2>
            <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed mb-4">
              Wir setzen folgende Dienstleister ein, mit denen Auftragsverarbeitungsverträge gemäß Art. 28 DSGVO bestehen:
            </p>
            <div className="overflow-x-auto -mx-2 sm:mx-0">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-white/10">
                    <th className="text-left py-2 px-2 font-medium text-gray-900 dark:text-slate-100">Dienstleister</th>
                    <th className="text-left py-2 px-2 font-medium text-gray-900 dark:text-slate-100">Zweck</th>
                    <th className="text-left py-2 px-2 font-medium text-gray-900 dark:text-slate-100">Standort</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 dark:text-slate-300">
                  <tr className="border-b border-gray-100 dark:border-white/5">
                    <td className="py-2 px-2">Hetzner Online GmbH</td>
                    <td className="py-2 px-2">Server-Hosting</td>
                    <td className="py-2 px-2">Deutschland (Frankfurt)</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-white/5">
                    <td className="py-2 px-2">Stripe Payments Europe, Ltd.</td>
                    <td className="py-2 px-2">Zahlungsabwicklung</td>
                    <td className="py-2 px-2">Irland (EU)</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-white/5">
                    <td className="py-2 px-2">Zoho Corporation B.V.</td>
                    <td className="py-2 px-2">Versand transaktionaler E-Mails (Zoho Mail)</td>
                    <td className="py-2 px-2">EU-Rechenzentrum (Niederlande)</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-2">seven communications GmbH (geplant)</td>
                    <td className="py-2 px-2">SMS-Versand</td>
                    <td className="py-2 px-2">Deutschland</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-4">
              Eine vollständige, jeweils aktuelle Liste der Subunternehmer stellen wir Restaurant-Kunden auf Anfrage zur Verfügung.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-gray-900 dark:text-slate-50 mb-3">
              5. Cookies und lokale Speicherung
            </h2>
            <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
              ServeFlow verwendet ausschließlich <strong>technisch notwendige</strong> Cookies und Local-Storage-Einträge,
              die für den Betrieb der App erforderlich sind (Login-Token, Theme-Einstellung, Spracheinstellung). Eine
              Einwilligung ist hierfür nach § 25 Abs. 2 Nr. 2 TDDDG (seit 14.05.2024 in Kraft, vormals TTDSG) nicht erforderlich. Wir setzen <strong>keine</strong>{' '}
              Tracking-, Analyse- oder Marketing-Cookies ein.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-gray-900 dark:text-slate-50 mb-3">
              6. Direktwerbung für eigene ähnliche Produkte (§ 7 Abs. 3 UWG)
            </h2>
            <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed mb-3">
              Wir behalten uns vor, Ihre E-Mail-Adresse als Bestandskunde gemäß <strong>§ 7 Abs. 3 UWG</strong> für
              Direktwerbung für eigene ähnliche Produkte und Dienstleistungen (z.&nbsp;B. neue ServeFlow-Module,
              Schwesterprodukte derselben Anbieterin) zu verwenden. Eine separate Einwilligung ist hierfür gesetzlich
              nicht erforderlich, da die Adresse im Rahmen einer Vertragsbeziehung erhoben wurde.
            </p>
            <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed mb-3">
              <strong>Sie können dieser Verwendung jederzeit widersprechen</strong> — ohne andere als die nach den
              Basistarifen entstehenden Übermittlungskosten — entweder über den Abmelde-Link am Ende jeder Werbe-E-Mail
              oder per Mail an{' '}
              <a href="mailto:kontakt@serve-flow.org" className="text-brand-primary hover:underline">
                kontakt@serve-flow.org
              </a>
              . Nach einem Widerspruch erhalten Sie keine weiteren Werbe-E-Mails — transaktionale E-Mails
              (Reservierungs-Bestätigungen, Verifikationscodes, Rechnungen) erhalten Sie weiterhin, da diese durch die
              Vertragsbeziehung gedeckt sind (Art. 6 Abs. 1 lit. b DSGVO).
            </p>
            <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
              Diese Regelung beruht auf der gefestigten Rechtsprechung des EuGH zu Bestandskundenwerbung (vgl. <em>EuGH,
              Urteil vom 26.&nbsp;September 2024, C-654/23</em>) und auf § 7 Abs. 3 UWG.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-gray-900 dark:text-slate-50 mb-3">
              7. Ihre Rechte als betroffene Person
            </h2>
            <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed mb-3">
              Sie haben jederzeit das Recht auf:
            </p>
            <ul className="text-sm text-gray-700 dark:text-slate-300 space-y-2 list-disc list-inside leading-relaxed">
              <li><strong>Auskunft</strong> über die zu Ihrer Person gespeicherten Daten (Art. 15 DSGVO)</li>
              <li><strong>Berichtigung</strong> unrichtiger Daten (Art. 16 DSGVO)</li>
              <li><strong>Löschung</strong> Ihrer Daten („Recht auf Vergessenwerden", Art. 17 DSGVO)</li>
              <li><strong>Einschränkung</strong> der Verarbeitung (Art. 18 DSGVO)</li>
              <li><strong>Datenübertragbarkeit</strong> in einem strukturierten, gängigen Format (Art. 20 DSGVO)</li>
              <li><strong>Widerspruch</strong> gegen die Verarbeitung (Art. 21 DSGVO)</li>
              <li><strong>Widerruf</strong> erteilter Einwilligungen mit Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO)</li>
            </ul>
            <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed mt-4">
              Zur Ausübung Ihrer Rechte genügt eine formlose E-Mail an{' '}
              <a href="mailto:kontakt@serve-flow.org" className="text-brand-primary hover:underline">
                kontakt@serve-flow.org
              </a>
              . Wir antworten innerhalb der gesetzlich vorgeschriebenen Frist von einem Monat (Art. 12 Abs. 3 DSGVO).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-gray-900 dark:text-slate-50 mb-3">
              7. Beschwerderecht bei der Aufsichtsbehörde
            </h2>
            <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed mb-3">
              Sie haben gemäß Art. 77 DSGVO das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren.
              Zuständig für unseren Sitz ist:
            </p>
            <div className="text-sm text-gray-700 dark:text-slate-300 space-y-1 leading-relaxed pl-4 border-l-2 border-brand-primary/40">
              <p><strong>Der Landesbeauftragte für den Datenschutz und die Informationsfreiheit Baden-Württemberg</strong></p>
              <p>Lautenschlagerstraße 20</p>
              <p>70173 Stuttgart</p>
              <p>
                Web:{' '}
                <a href="https://www.baden-wuerttemberg.datenschutz.de" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline break-all">
                  www.baden-wuerttemberg.datenschutz.de
                </a>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-gray-900 dark:text-slate-50 mb-3">
              8. Datensicherheit
            </h2>
            <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
              Wir treffen geeignete technische und organisatorische Maßnahmen gemäß Art. 32 DSGVO, um Ihre Daten zu schützen
              (TLS-Verschlüsselung, bcrypt-Hashing, rollenbasierte Zugriffskontrolle, Mandantentrennung, Rate-Limiting,
              regelmäßige Backups). Eine vollständige Übersicht stellen wir Auftraggebern als Anlage zum AVV zur Verfügung.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-gray-900 dark:text-slate-50 mb-3">
              9. Speicherdauer und Löschung
            </h2>
            <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
              Personenbezogene Daten werden nur so lange gespeichert, wie es für den jeweiligen Zweck erforderlich ist
              oder gesetzliche Aufbewahrungspflichten dies verlangen. Reservierungs- und Gästedaten werden automatisch
              <strong> 30 Tage nach dem Reservierungsdatum</strong> gelöscht. Rechnungsdaten werden gemäß § 147 AO
              <strong> 10 Jahre</strong> aufbewahrt. Beschäftigtendaten nach Vertragsende für die Dauer der Verjährungsfristen
              (i.&nbsp;d.&nbsp;R. 3 Jahre, § 195 BGB).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-heading font-semibold text-gray-900 dark:text-slate-50 mb-3">
              10. Änderung dieser Datenschutzerklärung
            </h2>
            <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
              Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den aktuellen rechtlichen
              Anforderungen entspricht oder um Änderungen unserer Leistungen umzusetzen. Für Ihren erneuten Besuch gilt
              dann die jeweils aktuelle Datenschutzerklärung.
            </p>
          </section>
        </div>

        <p className="text-xs text-gray-500 dark:text-slate-500 text-center mt-8">
          Stand: 25. April 2026
        </p>

        <div className="flex justify-center gap-6 text-xs text-gray-500 dark:text-slate-500 mt-6">
          <Link to="/impressum" className="hover:text-brand-primary transition-colors">Impressum</Link>
          <Link to="/agb" className="hover:text-brand-primary transition-colors">AGB</Link>
        </div>
      </main>
    </div>
  );
}
