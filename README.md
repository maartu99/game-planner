# Game Planner - Quando si gioca?

Web app leggera per organizzare le serate di gioco tra amici, partendo dai **gruppi**.

- Un **gruppo** è una campagna di un gioco (es. "Campagna D&D", "L'Ultima Torcia") con le persone che ci giocano. Ognuno può far parte di più gruppi.
- Chi crea un gruppo **invita** gli altri con un link, via email, SMS o WhatsApp.
- Ognuno segna le sue **disponibilità** (SI, FORSE, NO) una volta sola, su un calendario con scelta del mese: valgono per tutti i suoi gruppi.
- La pagina **Serate** incrocia le disponibilità di tutti, sera per sera, e dice a quali gruppi si può giocare. Se la stessa sera sono possibili più gruppi con persone in comune, consiglia quello con più **voglia di giocare** (ognuno la indica per ogni gruppo).
- Ogni gruppo ha uno o più **admin**: invitano persone (anche chi non ha ancora l'app), aggiungono e rimuovono giocatori, nominano altri admin.
- L'admin apre una serata, vede tutti i giochi possibili quella sera e **conferma** quello a cui si gioca. Tutti i membri ricevono l'**avviso** nell'app (e sul dispositivo, se hanno attivato gli avvisi); l'admin può avvisarli anche via WhatsApp o email.
- La sezione **Giocate** riepiloga quando giochi e a cosa: serate in programma, giocate totali, giochi provati e lo storico dettagliato (data, gioco, gruppo, luogo, chi c'era) filtrabile per gioco, gruppo, anno e mese.

Costi: zero. GitHub Pages ospita l'app, Firebase (piano gratuito Spark, senza carta di credito) gestisce login e dati.

App online: https://maartu99.github.io/game-planner/

## Le pagine

- **Gruppi**: i tuoi gruppi; da qui ne crei uno nuovo o entri con un link di invito. Nella pagina del gruppo trovi gioco e regola ("solo se ci sono tutti" oppure "almeno N membri"), chi sono gli admin, la tua voglia di giocare, i membri (con chi non ha ancora segnato le disponibilità) e le serate confermate. Gli admin vedono anche gli inviti (link, email, SMS, WhatsApp), i pulsanti "Rendi admin" e "Rimuovi dal gruppo" e possono modificare o eliminare il gruppo.
- **Disponibilità**: menu mese/anno e calendario del mese; scegli SI, FORSE o NO e tocca i giorni. Scorciatoie per i giorni vuoti, i weekend o per svuotare il mese.
- **Serate**: per ogni sera del mese scelto, i gruppi con cui si può giocare, chi c'è, chi forse, chi no, chi non ha risposto e chi è già impegnato in un'altra serata confermata, con il gruppo consigliato. "Apri" mostra la serata nel dettaglio: l'admin sceglie e conferma il gioco.
- **Giocate**: riepilogo (prossima giocata, serate in programma, giocate totali, giochi provati, conteggio per gioco), serate in programma con le presenze ("Ci sono" / "Non posso", "Aggiungi al calendario", Google Calendar) e storico dettagliato filtrabile per gioco, gruppo, anno e mese.
- **Avvisi** (in alto): le serate confermate dagli admin dei tuoi gruppi, con il numero di quelle non ancora lette.

## Provarla subito (modalità demo)

Finché la configurazione Firebase non è impostata, l'app gira in modalità demo: i dati restano sul dispositivo. "Carica l'esempio" crea Gigi, Mattia, Roberto, Iole, Gian e Fabiola con le disponibilità di ottobre 2026 del foglio "QUANDO GIOCARE" e quattro gruppi (L'Ultima Torcia, Set Base, Campagna D&D, Fan Made). Con "Cambia" passi da un giocatore all'altro, anche per provare gli inviti.

## Configurazione Firebase (già fatta)

Tempo stimato: 20-30 minuti, da computer.

1. **Progetto Firebase** (già fatto: progetto `game-planner-e876c`): su https://console.firebase.google.com crea un progetto, aggiungi un'app Web, copia il blocco `firebaseConfig` e incollalo in `index.html` in `const FIREBASE_CONFIG`. La `apiKey` non è un segreto: la protezione vera sono le regole.
2. **Login**: Authentication > Sign-in method > abilita Google ed Email/Password.
3. **Database**: Firestore Database > Crea database in modalità produzione, località in Europa (es. `europe-west8` Milano). Nella scheda Regole incolla `firestore.rules` e pubblica.
4. **Dominio**: Authentication > Settings > Domini autorizzati > aggiungi `maartu99.github.io`.
5. Carica `index.html` aggiornato nel repository: GitHub Pages pubblica da solo in un paio di minuti.

Non serve più una lista di email: chiunque può creare un account, ma vede solo i gruppi in cui è entrato con un link di invito.

## Note

- Gli inviti e gli avvisi esterni partono dalle app del tuo telefono o computer (email, SMS, WhatsApp): l'app non manda messaggi da sola.
- Gli avvisi sul dispositivo arrivano mentre l'app è aperta (anche in un'altra scheda). Le notifiche push ad app chiusa richiedono un piccolo server e sono tra i prossimi passi.
- Sul telefono conviene aggiungere la pagina alla schermata Home: su Chrome per Android dal menu "Aggiungi a schermata Home", su iPhone dal pulsante Condividi.

## Prossimi passi possibili

- Email automatiche di promemoria (GitHub Actions + servizio di invio gratuito).
- Notifiche push sul telefono.
- Installazione come app vera (PWA con icona e funzionamento offline).
