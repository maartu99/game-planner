# Si gioca?

Web app leggera per organizzare le serate di gioco tra amici, partendo dai **gruppi**.

- Un **gruppo** è una campagna di un gioco (es. "Campagna D&D", "L'Ultima Torcia") con le persone che ci giocano. Ognuno può far parte di più gruppi.
- Chi crea un gruppo **invita** gli altri con un link, via email, SMS o WhatsApp.
- Ognuno segna le sue **disponibilità** (SI, FORSE, NO) una volta sola, su un calendario con scelta del mese: valgono per tutti i suoi gruppi.
- La pagina **Serate** incrocia le disponibilità di tutti, sera per sera, e dice a quali gruppi si può giocare. Se la stessa sera sono possibili più gruppi con persone in comune, consiglia quello con più **voglia di giocare** (ognuno la indica per ogni gruppo).
- Da una serata possibile si **propone** la data con ora e luogo; i membri confermano e la serata si aggiunge al calendario del telefono con due promemoria.

Costi: zero. GitHub Pages ospita l'app, Firebase (piano gratuito Spark, senza carta di credito) gestisce login e dati.

App online: https://maartu99.github.io/game-planner/

## Le pagine

- **Gruppi**: i tuoi gruppi; da qui ne crei uno nuovo o entri con un link di invito. Nella pagina del gruppo trovi gioco e regola ("solo se ci sono tutti" oppure "almeno N membri"), la tua voglia di giocare, i membri (con chi non ha ancora segnato le disponibilità), gli inviti e le serate in programma.
- **Disponibilità**: menu mese/anno e calendario del mese; scegli SI, FORSE o NO e tocca i giorni. Scorciatoie per i giorni vuoti, i weekend o per svuotare il mese.
- **Serate**: per ogni sera del mese scelto, i gruppi con cui si può giocare, chi c'è, chi forse, chi no e chi non ha risposto, il gruppo consigliato e il pulsante per proporre la serata.
- **Agenda**: le serate proposte, con le conferme di tutti, "Aggiungi al calendario" e Google Calendar.

## Provarla subito (modalità demo)

Finché la configurazione Firebase non è impostata, l'app gira in modalità demo: i dati restano sul dispositivo. "Carica l'esempio" crea Gigi, Mattia, Roberto, Iole, Gian e Fabiola con le disponibilità di ottobre 2026 del foglio "QUANDO GIOCARE" e quattro gruppi (L'Ultima Torcia, Set Base, Campagna D&D, Fan Made). Con "Cambia" passi da un giocatore all'altro, anche per provare gli inviti.

## Metterla online per il gruppo

Tempo stimato: 20-30 minuti, da computer.

1. **Progetto Firebase**: su https://console.firebase.google.com crea un progetto (Analytics non serve), aggiungi un'app Web, copia il blocco `firebaseConfig` e incollalo in `index.html` al posto di `null` in `const FIREBASE_CONFIG = null;`. La `apiKey` non è un segreto: la protezione vera sono le regole.
2. **Login**: Authentication > Sign-in method > abilita Google ed Email/Password.
3. **Database**: Firestore Database > Crea database in modalità produzione, località in Europa (es. `europe-west8` Milano). Nella scheda Regole incolla `firestore.rules` e pubblica.
4. **Dominio**: Authentication > Settings > Domini autorizzati > aggiungi `maartu99.github.io`.
5. Carica `index.html` aggiornato nel repository: GitHub Pages pubblica da solo in un paio di minuti.

Non serve più una lista di email: chiunque può creare un account, ma vede solo i gruppi in cui è entrato con un link di invito.

## Note

- Gli inviti partono dalle app del tuo telefono o computer (email, SMS, WhatsApp): l'app non manda messaggi da sola.
- Sul telefono conviene aggiungere la pagina alla schermata Home: su Chrome per Android dal menu "Aggiungi a schermata Home", su iPhone dal pulsante Condividi.

## Prossimi passi possibili

- Email automatiche di promemoria (GitHub Actions + servizio di invio gratuito).
- Notifiche push sul telefono.
- Installazione come app vera (PWA con icona e funzionamento offline).
