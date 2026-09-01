# Documents

PDFs served by the `/documents` page. The list of links lives in
`src/config/documents.ts` — adding a file here does **not** put it on the page,
and removing an entry from the config is how you take a link down.

Filenames the config currently expects:

```
rules-of-procedure.pdf
beginner-guide.pdf

study-guides/sc.pdf        Security Council
study-guides/hbp.pdf       Historical British Parliament
study-guides/unoct.pdf     United Nations Office for Counter-Terrorism
study-guides/osce.pdf      Organisation for Security and Cooperation in Europe
study-guides/specpol.pdf   Special Political and Decolonisation Committee
study-guides/who.pdf       World Health Organisation
study-guides/unodc.pdf     United Nations Office on Drugs and Crime
study-guides/ecosoc.pdf    Economic and Social Council
```

Study guides are named after the committee shorthand, lowercased. Any file in
here is publicly downloadable by anyone who knows the URL.
