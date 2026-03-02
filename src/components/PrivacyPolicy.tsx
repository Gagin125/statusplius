import { motion } from 'motion/react';
import { ArrowLeft, Shield } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

export function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
  return (
    <div className="min-h-screen bg-[#F5EFE6] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <motion.button
          type="button"
          onClick={onBack}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mb-6 inline-flex items-center gap-2 rounded-xl border border-[#3B2F2F]/15 bg-white px-4 py-2 text-sm font-semibold text-[#3B2F2F] shadow-sm transition-colors hover:bg-[#F8F3EC]"
        >
          <ArrowLeft className="h-4 w-4" />
          Grįžti
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="rounded-3xl border border-[#3B2F2F]/10 bg-white/95 p-6 shadow-xl sm:p-10"
        >
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.12 }}
            className="mb-8 flex items-center gap-4"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 220, damping: 18, delay: 0.16 }}
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#3B2F2F] text-white"
            >
              <Shield className="h-7 w-7" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-[#3B2F2F]">Privatumo politika</h1>
              <p className="mt-1 text-sm text-[#3B2F2F]/60">Paskutinį kartą atnaujinta: [įrašykite datą]</p>
            </div>
          </motion.div>

          <div className="space-y-8 text-[#3B2F2F]">
            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.2 }}
              className="space-y-3"
            >
              <p className="leading-7 text-[#3B2F2F]/85">
                Ši privatumo politika paaiškina, kaip STATUS+ renka, naudoja ir saugo asmens duomenis,
                kai naudojatės šia svetaine.
              </p>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.26 }}
              className="space-y-3"
            >
              <h2 className="text-xl font-semibold">1. Kas atsakingas už duomenis?</h2>
              <p className="leading-7 text-[#3B2F2F]/85">
                Ši svetainė yra valdoma kaip mokyklinis demonstracinis projektas STATUS+ sistemai.
              </p>
              <div>
                <p className="font-medium">Projekto kūrėjai:</p>
                <ul className="mt-2 list-disc space-y-1 pl-6 text-[#3B2F2F]/85">
                  <li>Dovydas Gagin</li>
                  <li>Dominykas Nenartavičius</li>
                  <li>Titas Jankūnas</li>
                  <li>Karina Parangovskytė</li>
                </ul>
              </div>
              <p className="text-[#3B2F2F]/85">Kontaktinis el. paštas: [įrašykite bendrą kontaktinį el. paštą]</p>
              <p className="text-[#3B2F2F]/85">[Nurodykite, ar kūrėjai taip pat yra sistemos administratoriai.]</p>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.32 }}
              className="space-y-3"
            >
              <h2 className="text-xl font-semibold">2. Kokius duomenis renkame?</h2>
              <ul className="list-disc space-y-1 pl-6 text-[#3B2F2F]/85">
                <li>El. pašto adresą</li>
                <li>Slaptažodį</li>
                <li>Vardą ir pavardę</li>
                <li>Klasę</li>
                <li>Tėvų paskyros duomenis</li>
                <li>Vaiko / globotinio vardą, pavardę ir klasę</li>
                <li>Mokytojo dėstomo dalyko informaciją</li>
                <li>Sistemoje kuriamus ar matomus pranešimus</li>
              </ul>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.38 }}
              className="space-y-3"
            >
              <h2 className="text-xl font-semibold">3. Kam naudojame duomenis?</h2>
              <ul className="list-disc space-y-1 pl-6 text-[#3B2F2F]/85">
                <li>Paskyrų kūrimui</li>
                <li>Prisijungimo patvirtinimui</li>
                <li>Teisingos profilio informacijos rodymui</li>
                <li>Pranešimų rodymui tinkamai vartotojų grupei</li>
                <li>Sistemos veikimui ir demonstravimo tikslams</li>
              </ul>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.44 }}
              className="space-y-3"
            >
              <h2 className="text-xl font-semibold">4. Kur saugomi duomenys?</h2>
              <ul className="list-disc space-y-1 pl-6 text-[#3B2F2F]/85">
                <li>Google Sheets</li>
                <li>Google Apps Script</li>
                <li>Vercel (svetainės talpinimas)</li>
              </ul>
              <p className="leading-7 text-[#3B2F2F]/85">
                Šios paslaugos gali tvarkyti duomenis kaip techniniai paslaugų teikėjai, reikalingi sistemos veikimui.
              </p>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.5 }}
              className="space-y-3"
            >
              <h2 className="text-xl font-semibold">5. Kas gali matyti duomenis?</h2>
              <ul className="list-disc space-y-1 pl-6 text-[#3B2F2F]/85">
                <li>Projekto kūrėjai / administratoriai</li>
                <li>Įgalioti asmenys, prižiūrintys projektą</li>
                <li>Techniniai paslaugų teikėjai, reikalingi sistemos veikimui</li>
              </ul>
              <p className="text-[#3B2F2F]/85">Mes neparduodame asmens duomenų.</p>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.56 }}
              className="space-y-3"
            >
              <h2 className="text-xl font-semibold">6. Kiek laiko saugomi duomenys?</h2>
              <p className="leading-7 text-[#3B2F2F]/85">
                Duomenys saugomi tiek, kiek reikia šiam projektui vykdyti. Jie gali būti ištrinti anksčiau,
                jei to paprašoma, arba projektui pasibaigus.
              </p>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.62 }}
              className="space-y-3"
            >
              <h2 className="text-xl font-semibold">7. Jūsų teisės</h2>
              <p className="leading-7 text-[#3B2F2F]/85">
                Pagal taikomus duomenų apsaugos teisės aktus, įskaitant BDAR, galite turėti teisę:
              </p>
              <ul className="list-disc space-y-1 pl-6 text-[#3B2F2F]/85">
                <li>Gauti prieigą prie savo duomenų</li>
                <li>Prašyti ištaisyti netikslius duomenis</li>
                <li>Prašyti ištrinti duomenis</li>
                <li>Prašyti apriboti duomenų tvarkymą</li>
                <li>Nesutikti su tam tikru duomenų tvarkymu, kai tai taikoma</li>
              </ul>
              <p className="text-[#3B2F2F]/85">Dėl šių teisių įgyvendinimo kreipkitės: [įrašykite kontaktinį el. paštą]</p>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.68 }}
              className="space-y-3"
            >
              <h2 className="text-xl font-semibold">8. Duomenų saugumas</h2>
              <p className="leading-7 text-[#3B2F2F]/85">
                Imamės pagrįstų priemonių šiame projekte naudojamiems duomenims apsaugoti. Tačiau tai yra
                demonstracinė sistema, todėl ji neturėtų būti naudojama itin jautriems asmens duomenims.
              </p>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.74 }}
              className="space-y-3"
            >
              <h2 className="text-xl font-semibold">9. Privatumo politikos pakeitimai</h2>
              <p className="leading-7 text-[#3B2F2F]/85">
                Ši privatumo politika gali būti periodiškai atnaujinama. Naujausia versija visada bus skelbiama šioje svetainėje.
              </p>
            </motion.section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
