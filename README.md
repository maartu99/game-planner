# Si gioca?

Web app leggera per organizzare le serate di gioco con gli amici: ognuno segna le proprie disponibilità sul calendario 2026-2029 e i giochi a cui vuole giocare, l'app trova i giorni in cui ci sono abbastanza giocatori, si propone una sessione con orario e luogo, e ognuno conferma la presenza. Ogni sessione si aggiunge al calendario del telefono con due promemoria (il giorno prima e due ore prima).

Costi: zero. GitHub Pages ospita l'app, Firebase (piano gratuito Spark, senza carta di credito) gestisce login e dati.

## Provarla subito (modalità demo)

Apri `index.html` nel browser. Finché la configurazione Firebase non è impostata, l'app gira in modalità demo: i dati restano sul dispositivo e con "Carica un gruppo di esempio" vedi subito incroci e sessioni.

## Metterla online per il gruppo

Tempo stimato: 20-30 minuti, da computer. I nomi dei menu Firebase possono cambiare leggermente nel tempo.

### 1. Crea il progetto Firebase

1. Vai su https://console.firebase.google.com e crea un nuovo progetto (es. `si-gioca`). Google Analytics non serve, puoi disattivarlo.
2. Nella pagina del progetto, aggiungi un'app **Web** (icona `</>`). Dagli un nome qualsiasi; Firebase Hosting non serve.
3. Firebase ti mostra un blocco `firebaseConfig = { ... }`. Copialo.
4. Apri `index.html`, trova la riga `const FIREBASE_CONFIG = null;` e sostituisci `null` con l'oggetto copiato (c'è un esempio subito sotto nel file).

La `apiKey` non è un segreto: identifica solo il progetto. La protezione vera sono le regole del punto 3.

### 2. Attiva il login

1. Menu **Authentication** > Inizia.
2. In **Sign-in method** abilita **Google** e **Email/Password**.

### 3. Crea il database e le regole

1. Menu **Firestore Database** > Crea database. Modalità produzione, località in Europa (es. `eur3` o `europe-west8` Milano).
2. Scheda **Regole**: incolla il contenuto di `firestore.rules`, sostituisci le email di esempio con quelle vere tue e degli amici (in minuscolo), poi **Pubblica**.

Chi non è nella lista vede la schermata "Non sei in lista" e non può leggere né scrivere nulla.

### 4. Pubblica su GitHub Pages

1. Crea un repository su GitHub (es. `si-gioca`) e carica `index.html` (puoi caricare anche questo README e `firestore.rules`).
2. **Settings** > **Pages** > Source: *Deploy from a branch*, branch `main`, cartella `/ (root)`. Salva.
3. Dopo un paio di minuti l'app è su `https://TUO-UTENTE.github.io/si-gioca/`.

### 5. Autorizza l'indirizzo su Firebase

**Authentication** > **Settings** > **Domini autorizzati** > aggiungi `TUO-UTENTE.github.io`. Senza questo passaggio il login con Google non funziona.

### 6. Invita gli amici

Manda il link. Ognuno entra con Google oppure crea un account email (in quel caso riceve un'email di verifica). Sul telefono conviene aggiungere la pagina alla schermata Home: su Chrome per Android dal menu "Aggiungi a schermata Home", su iPhone dal pulsante Condividi.

Nota: se il login con Google dall'icona sulla schermata Home di iPhone dà problemi, usare email e password risolve.

## Come si usa

- **Calendario - Gruppo** (vista iniziale): il calendario combinato di tutti. Ogni giorno mostra quanti ci sono (es. 4/5) e diventa più verde quanti più siete; toccandolo vedi chi c'è, chi forse, chi no, chi non ha ancora segnato, le sessioni di quel giorno e i giochi possibili, e puoi segnare la tua disponibilità o proporre subito una sessione.
- **Calendario - Le mie disponibilità**: scegli lo stato (Ci sono, Forse, Non ci sono, Cancella) e tocca i giorni. "Applica ai weekend del mese" fa prima.
- Tutto è condiviso in tempo reale: quello che segna o conferma uno, gli altri lo vedono subito.
- **Giochi**: aggiungi i giochi e segna a quali vuoi giocare. Ogni gioco ha un numero minimo di giocatori.
- **Incroci**: l'elenco dei giorni in cui, per un gioco, ci sono abbastanza giocatori disponibili. Da qui si propone la data.
- **Sessioni**: orario, luogo, chi ha confermato. Quando le conferme raggiungono il minimo compare "Si gioca". "Aggiungi al calendario" scarica l'evento con i promemoria.

## Per aggiungere un giocatore in seguito

Aggiungi la sua email in `firestore.rules` nella console Firebase (scheda Regole) e pubblica. Non serve toccare l'app.

## Prossimi passi possibili

- Email automatiche di promemoria (GitHub Actions + servizio di invio gratuito).
- Notifiche push sul telefono.
- Installazione come app vera (PWA con icona e funzionamento offline).
