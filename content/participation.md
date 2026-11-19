# Kolesarske: raziskovanje kolesarskih površin v Ljubljani

**{{phaseLabel}} — sodelovanje po predhodnem dogovoru.** Pred prvo meritvijo [piši raziskovalcu]({{contactHref}}). Prejel boš navodila za vključitev in dogovor o merilni opremi. Obisk strani ali odprtje e-poštnega programa še ne pomeni prijave oziroma oddaje meritve.

V projektu Kolesarske raziskujemo vibracijski odziv med vožnjo po kolesarskih površinah v Ljubljani. Prostovoljci s telefonom beležijo pospeške in lokacijo. Njihove meritve bomo v magistrskem delu primerjali z referenčnimi vožnjami, posnetimi z vedno istim kolesom in telefonom.

Raziskavo vodi **Jaka Grad** v okviru magistrskega dela **Ocena udobnosti kolesarskih poti v Ljubljani** na Oddelku za geografijo Filozofske fakultete Univerze v Ljubljani. Mentor je **Blaž Repe**.

## Pred prvim sodelovanjem

1. Piši na **[{{contactEmail}}]({{contactHref}})** in povej, da želiš sodelovati v pilotu.
2. Navedi model telefona, operacijski sistem, vrsto kolesa in držala. Raziskovalec se s tabo dogovori o merilni postavitvi ter označevanju tvojih voženj.
3. Pred meritvijo se seznani z namenom zbiranja lokacijskih in senzorskih podatkov ter z raziskovalčevimi informacijami o dostopu, hrambi in ravnanju s podatki. Če teh informacij še nisi prejel, jih najprej zahtevaj.
4. Meritev začni po potrditvi vključitve in prejemu veljavnih navodil za pilot.

**Za vprašanja in testne oddaje uporabljamo isti naslov: {{contactEmail}}.** Pred javnim zbiranjem bo objavljen projektni naslov. Zasebni register sodelujočih ni del javne karte; neprepoznana oddaja se ne vključi samodejno v javne rezultate.

## Kaj potrebuješ

- Pametni telefon z aplikacijo **phyphox** (Android ali iPhone).
- **Fiksno držalo za telefon**, ki se med vožnjo ne premika; ustreznost postavitve potrdiš z raziskovalcem.
- Kolo, primerno za dogovorjeni protokol: brez vzmetenja ali z možnostjo dogovorjenega zaklepa. Če nisi prepričan, to razjasni pred meritvijo.

## Pripravi aplikacijo in telefon

1. Namesti phyphox iz uradnega vira: [Android — Google Play](https://play.google.com/store/apps/details?id=de.rwth_aachen.phyphox), [iPhone — App Store](https://apps.apple.com/us/app/phyphox/id1127319693) ali [F-Droid](https://f-droid.org/packages/de.rwth_aachen.phyphox/). Podprto različico sistema preveri pri izbranem viru aplikacije.
2. V aplikacijo uvozi raziskovalni eksperiment **{{experimentName}}**. Če QR bereš na drugem zaslonu, v phyphox izberi dodajanje eksperimenta iz QR kode in ga shrani v zbirko.

![QR koda raziskovalnega eksperimenta](slike/Kolesarske3_QR.png)

Če stran bereš na istem telefonu, lahko [preneseš datoteko eksperimenta {{experimentName}}]({{experimentPath}}) in jo odpreš s phyphox. Če datoteke ne moreš uvoziti ali dobiš drugo ime eksperimenta, pred meritvijo piši raziskovalcu. Postopek uvoza se med različicami telefona lahko razlikuje.

3. Preveri, da je ime v zbirki eksperimentov **{{experimentName}}**. Podatke iz drugega eksperimenta pošlji le po dogovoru.
4. Telefon pritrdi vodoravno, z zgornjim robom v smeri vožnje, in preveri stabilnost držala. Končno postavitev uskladi z raziskovalcem. Fotografija dogovorjene namestitve bo dodana po preverjanju opreme v pilotu.
5. Preveri in ločeno zabeleži tlak sprednje in zadnje pnevmatike; ni zahteve, da sta enaka. Zabeleži tudi morebitno spremembo kolesa, telefona ali držala glede na dogovorjeno postavitev.

## Pred vožnjo in med meritvijo

- Ob varnem postanku vklopi lokacijo in omogoči dovoljenja, ki jih phyphox potrebuje za ta eksperiment. Preveri, da varčevanje z baterijo ne prekinja dogovorjenega zajema.
- Odpri **{{experimentName}}**, zaženi meritev in pred odhodom preveri, da se podatki zapisujejo. Med pilotom upoštevaj navodilo, da zaslon ostane odklenjen; svetlost lahko zmanjšaš.
- Kolesari po dogovorjeni poti in upoštevaj prometna pravila. **Med vožnjo ne upravljaj telefona. Meritev preveri samo ob varnem postanku.**
- Ob običajnem kratkem postanku, na primer pri semaforju, meritve ni treba ustaviti. Če se zajem prekine ali opremo premakneš, to zabeleži v sporočilu ob oddaji.
- Po koncu vožnje se varno ustavi in nato ustavi eksperiment.

## Izvozi in oddaj meritev

1. V phyphox izberi izvoz podatkov v obliki **CSV**. Za ta eksperiment potrebujemo **{{archiveFormat}} z vsemi izvoženimi CSV-ji**, ne posnetka zaslona ali ene same tabele.
2. ZIP naj vsebuje **{{requiredCsvFiles}}**. Datotek v arhivu ne preimenuj in jih ne urejaj ročno.
3. Ime priponke mora za trenutni testni sprejemnik vsebovati **{{filenameKeyword}}**, na primer **{{filenameExample}}**. Po potrebi spremeni samo ime ZIP-a; priponke ne razpakiraj in je ne zamenjaj z drugimi podatki.
4. Uporabi deljenje v phyphox oziroma priloži ZIP v e-poštnem programu. Pošlji ga na **[{{contactEmail}}]({{contactHref}})**. Pred pošiljanjem preveri prejemnika in prisotnost priponke.
5. V sporočilu navedi dogovorjeno oznako sodelujočega oziroma podatke za prepoznavo tvoje oddaje, merilno postavitev in morebitne prekinitve ali spremembe. E-poštnega naslova ne uporabljamo kot javne oznake na karti.

**Odprtje povezave za e-pošto ne priloži ZIP-a in ne potrdi prejema.** Če je bila priponka zavrnjena, je ne moreš izvoziti ali nisi prepričan, ali je prispela, piši raziskovalcu. Podatkov ti ni treba objavljati na GitHubu ali drugem javnem mestu.

## Kaj se zgodi po oddaji

- **Prejem in pregled:** raziskovalec v pilotu preveri oddajo, prepoznavo sodelujočega in uporabnost zapisa. Samodejna potrditev prejema in rok obdelave še nista potrjeni storitvi.
- **Povratna informacija:** za pilot se z raziskovalcem dogovoriš o povratni informaciji in zasebnem poročilu. Stran trenutno ne obljublja samodejne dostave ali dostave v določenem številu ur.
- **Neuporaben ali delno uporaben zapis:** pred ponovitvijo razjasnimo razlog, na primer prekinitev zajema ali manjkajoče datoteke. En neuspel zapis ne pomeni, da ne moreš sodelovati.
- **Skupni rezultati:** primerne meritve prostovoljcev se vključujejo v agregate po pravilih raziskave. Posamezen prispevek zato ni nujno takoj viden na javni karti; razlog je lahko premalo podatkov za objavo ali še neizvedena posodobitev.

Za vprašanja o prejemu ali nadaljevanju sodelovanja piši na **[{{contactEmail}}]({{contactHref}})**.

## Skupni rezultati raziskave

Javna karta je namenjena **agregiranim meritvam prostovoljcev**. Referenčne vožnje z vedno istim kolesom in telefonom ostanejo v zasebni analitični zbirki. Na javni karti ne prikazujemo posamezne časovno urejene vožnje ali identitete sodelujočega.

Vrednosti opisujejo **vibracijski odziv**, ne potrjene prometne varnosti. Večji odziv sam po sebi ne dokazuje poškodbe površine ali enakega doživetja pri vseh kolesarjih. Razredi so relativni prikazani izdaji; pred prvimi ustreznimi prostovoljskimi agregati je karta prazna.

<div id="mapMount"></div>

## O raziskavi in pomoč

Primerjava referenčnih in prostovoljskih meritev bo del magistrske naloge. Trenutni pilot vključuje senzorske meritve in terenski popis, ne uporabniških ocen zaznanega udobja. Sodelovanje je prostovoljno; pred prvo meritvijo razjasni vprašanja o postopku in podatkih z raziskovalcem.

Kontakt: **[{{contactEmail}}]({{contactHref}})**.

Navodila za prenos eksperimentov v aplikacijo: [uradna dokumentacija phyphox](https://phyphox.org/docs/transferring-experiments/).
