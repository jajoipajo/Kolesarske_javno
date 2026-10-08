## dci_acc_raw
DCI je obratna vrednost RMS navpičnih pospeškov, normiranih z gravitacijskim pospeškom, ki presegajo 1 g. Višja vrednost pomeni manjši vibracijski odziv. Brez veljavnih preseganj rezultat manjka. Polsekundna okna so lokalna prilagoditev. Barve so relativni razredi te izdaje, ne potrjena lestvica udobnosti.

Vir: Bíl, M., Andrášik, R. in Kubeček, J. (2015). *How comfortable are your cycling tracks?* https://doi.org/10.1016/j.trc.2015.05.007

## dci_lin_recon_raw
Diagnostična rekonstrukcija DCI iz linearnega navpičnega pospeška in gravitacije. Ni neodvisna meritev in ne nadomesti preverjene orientacije telefona.

## bri_speedcorr
Prilagojeni BRI: povprečna absolutna vrednost navpičnega linearnega pospeška, pomnožena s hitrostno korekcijo iz objavljene tabele. Velja samo za 6–42 km/h. Kratka okna in merilna postavitev se razlikujejo od izvirne raziskave; njenih razredov udobnosti ne prenašamo.

Vir: Lee, D.-y., Yoo, H.-j., Lee, J.-y. in Jeong, G.-o. (2025). *Development of a bicycle road surface roughness and risk assessment method using smartphone sensor technology.* https://doi.org/10.3390/s25113520

## fii_max
FII pri 100 Hz: največja velikost spremembe troosnega linearnega pospeška med zaporednima vzorcema na 0,01 s. Uporabljamo dokumentiran 40-Hz nizkoprepustni filter; pri neustrezni frekvenci zajema rezultat manjka. Enota je m/s². Kazalnik opisuje spremembo vibracijskega odziva, ne sile ali prometne varnosti.

Vira: Lee in sod. (2025), https://doi.org/10.3390/s25113520 in https://doi.org/10.3390/su17167488. Filtriranje je prilagoditev našega postopka.

## rms_lin_z_mps2
RMS navpičnega linearnega pospeška v m/s². Opisuje amplitudo vibracijskega odziva; višja vrednost pomeni večji odziv. Ne predstavlja frekvenčno utežene izpostavljenosti celotnega telesa po ISO 2631.

## std_lin_z_mps2
Standardni odklon navpičnega linearnega pospeška v m/s².

## p95_abs_lin_z_mps2
95. percentil absolutnega navpičnega linearnega pospeška v m/s².

## mean_abs_lin_z_mps2
Povprečna absolutna vrednost navpičnega linearnega pospeška v m/s².
