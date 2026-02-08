## dci_acc_raw
`dci_acc_raw` opisuje dinamično obremenitev vožnje na osnovi navpičnega pospeška (`acc z`) v drsečem oknu. Višje vrednosti pomenijo bolj tresočo in manj udobno podlago.

Vir: Sayers, M. W., Gillespie, T. D., and Queiroz, C. A. V. (1986), *The International Road Roughness Experiment* (World Bank Technical Paper).

## dci_lin_recon_raw
`dci_lin_recon_raw` je soroden kazalnik dinamičnega odziva, izračunan iz linearnega pospeška z rekonstrukcijo relativno na gravitacijo. Uporaben je za primerjavo občutljivosti med različnimi senzorji.

Vir: Sayers, M. W., Gillespie, T. D., and Queiroz, C. A. V. (1986), *The International Road Roughness Experiment*; prenos metodologije na IMU meritve v novejših raziskavah pametnih telefonov.

## bri_speedcorr
`bri_speedcorr` je kazalnik hrapavosti, korigiran na hitrost, da so odseki primerljivi tudi pri različnih režimih vožnje. Višji rezultat navadno pomeni slabšo kakovost površine.

Vir: Khattak, A. J., et al. (2020+), raziskave ocenjevanja kolesarske udobnosti s pametnimi telefoni in speed normalization pristopi.

## fii_max
`fii_max` povzema vršne obremenitve (najbolj izrazite udarce) v oknu. Uporaben je za identifikacijo lokalnih defektov, kot so razpoke, robniki in prehodi.

Vir: Litovski pristopi v SHM/pavement monitoring, npr. signal peak-based distress indicators v IMU analizah.

## rms_lin_z_mps2
`rms_lin_z_mps2` je RMS (root-mean-square) navpičnega linearnega pospeška. Stabilen splošni kazalnik amplitud vibracij; nižji je praviloma boljši.

Vir: Standardna obdelava vibracijskih signalov (RMS metrika), npr. ISO 2631 koncepti za oceno vibracijske izpostavljenosti.

## std_lin_z_mps2
`std_lin_z_mps2` je standardni odklon navpičnega linearnega pospeška. Meri razpršenost vibracij v oknu; višje vrednosti pomenijo večjo neenakomernost podlage.

Vir: Osnovna statistična metrika variabilnosti signalov v transportni in geoinformacijski analizi IMU podatkov.

## p95_abs_lin_z_mps2
`p95_abs_lin_z_mps2` je 95. percentil absolutnega navpičnega linearnega pospeška. Namenjen je robustnemu zajemu močnih, a ne nujno ekstremnih sunkov.

Vir: Robustna signalna statistika (percentili) v kakovosti vožnje in odkrivanju poškodovanih odsekov.

## mean_abs_lin_z_mps2
`mean_abs_lin_z_mps2` je povprečje absolutnega navpičnega linearnega pospeška. Dober “globalni” indikator povprečne grobosti vožnje skozi okno.

Vir: Povprečje absolutne amplitude kot osnovna metrika v IMU-based roughness študijah.
