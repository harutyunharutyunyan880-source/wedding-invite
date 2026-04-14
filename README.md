# Հարսանյաց հրավիրատոմս (ստատիկ կայք)

Մեկ էջ HTML/CSS/JS՝ առանց հավաքման քայլի։ Բացեք `index.html` զննարկիչում (տեղական նիշքի բացումը աշխատում է հիմնականում, բայց որոշ զննարկիչներում աուդիոն լավագույնս է աշխատում տեղական սերվերով)։

## Հերոի նկար (կայքը բացելիս առաջինը)

Տեղադրեք **մեկ** լուսանկար՝ `assets/images/hero.jpg` (կամ փոխեք `INVITATION_CONFIG.heroImageSrc` ճանապարհը `script.js`-ում)։

## Լուսանկարներ

1. Տեղադրեք 6 JPG նկարներ այս անուններով՝
   - `assets/images/gallery-01.jpg`
   - `assets/images/gallery-02.jpg`
   - … մինչև `gallery-06.jpg`
2. HTML-ում չփոխել ոչինչ՝ պարզապես փոխարինեք ֆայլերը նույն անուններով։

## Բոլոր տեքստերը, ժամանակացույցը, քարտեզները, հեռախոսը

Խմբագրեք **`script.js`** ֆայլի մեջ `INVITATION_CONFIG` օբյեկտը։

| Դաշտ | Ինչ է |
|------|--------|
| `coupleNames` | Երկու անուն |
| `heroImageSrc` | Հերոյի վերևի լուսանկարի ուղի (օր. `assets/images/hero.jpg`) |
| `heroInvitationText` | Անուններից հետո ցուցադրվող հրավերի տեքստը |
| `eventDate` | Տարին, ամիսը (1–12), օրը, ժամը (`hour` 0–23, `minute` 0–59) — հետհաշվարկը հաշվում է **տեղական** ժամացույցով |
| `heroDateDisplayHy` | Հրավերի տեքստից հետո՝ ամսաթիվ/ժամի տողը |
| `storyParagraphs` | Պարբերությունների զանգված |
| `scheduleItems` | Ժամ, վերնագիր, նկարագրություն |
| `venues` | Յուրաքանչյուրի `name` և `mapEmbedUrl` (iframe-ի `src`) |
| `rsvpPhone` | `telHref`՝ `tel:+374XXXXXXXX` ձևաչափ, `label`՝ կոճակի տեքստ |
| `audioSrc` | Ֆոնային երաժշտություն՝ օրինակ `"assets/audio/your-song.mp3"`, կամ `null`՝ թաքցնելու երաժշտության բլոկը |

Եթե պարտադիր դաշտերից մեկը դատարկ է կամ սխալ է, էջը կցուցադրի **Կարգավորման սխալ** հաղորդագրություն (fail-fast)։

## Քարտեզի embed հղում

**Google Maps.** Բացեք վայրը Google Maps-ում → **Share / Կիսվել** → **Embed a map** → պատճենեք `iframe`-ի `src` արժեքը և տեղադրեք `mapEmbedUrl` դաշտում։

**OpenStreetMap.** `openstreetmap.org` → **Share** → **HTML** → պատճենեք `iframe`-ի `src`-ը։

`mapEmbedUrl` պետք է սկսվի `https://`։

## Ֆոնային երաժշտություն

1. Տեղադրեք ձեր աուդիո ֆայլը, օրինակ՝ `assets/audio/wedding.mp3`։
2. `INVITATION_CONFIG.audioSrc`-ում գրեք `"assets/audio/wedding.mp3"`։
3. Նվագարկումը սովորաբար սկսվում է **օգտատիրոջ սեղմումից հետո** (զննարկիչների սահմանափակում)։

## Ֆայլերի կառուցվածք

```
wedding_invitation/
  index.html
  styles.css
  script.js
  README.md
  assets/
    images/     ← hero.jpg, gallery-01.jpg … gallery-06.jpg
    audio/      ← ձեր mp3 (ըստ ցանկության)
```

## Տեղային սերվեր (ըստ ցանկության)

Եթե ցանկանում եք iframe/աուդիո վարքագիծը ստուգել ավելի կայուն՝ գործարկեք պարզ HTTP սերվեր այս պանակից (ձեր մոտ՝ ձեր ընտրած հրամանով)։
