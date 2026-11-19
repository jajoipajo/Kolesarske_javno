# Vsebinska pogodba P0

`participation.md` je vir trenutnih navodil. `site.config.json` v korenu je edini vir kontaktnega naslova, faze in oznak eksperimenta/izvoza. V korenskem README je generirana vsebina, ker jo obstoječa stran še nalaga kot Markdown.

Po spremembi konfiguracije ali predloge poženi:

```sh
node scripts/build_content.cjs
node scripts/build_content.cjs --check
node scripts/test_map.cjs
```

Generator uskladi tudi statični kontakt in obvestilo o fazi v `index.html`. Preverjanje primerja ime in izvozne CSV-je z dejanskim `data/testphy.phyphox`. CI zavrne razhajanje generiranih datotek.

Privzeta faza je trenutno samo `closed-pilot`. Pred prehodom v javno sodelovanje je treba potrditi vključevanje sodelujočih, informacije o podatkih, končni kontakt in dejanski odzivni čas. Samodejni prejem ali dostava poročila nista omogočena s tem vsebinskim paketom.

Pri prvem stiku raziskovalec uskladi merilno postavitev in vključitev v zasebni register. Spletna vsebina ne nadomešča informiranega dogovora o sodelovanju. Neoznačene oddaje se ne objavijo samodejno. Za zdaj se povratna informacija in poročilo dogovorita v pilotu; časovnega jamstva ni.

Ime priponke mora trenutno vsebovati `measurement`, ker ga filtrira testni IMAP sprejemnik. V javnih navodilih je to izrecno navedeno; odstranitev odvisnosti od imena datoteke bi bila usklajena sprememba backend postopka, ne vsebinska rešitev.

Paket P0 ne vključuje štirih novih strani, končnega oblikovanja, uporabniškega portala, novega poštnega sistema ali sprememb algoritmov. To ostaja predmet naslednjih paketov po poročilu in uporabnikovem navodilu.
