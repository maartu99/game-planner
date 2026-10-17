# Prompt dettagliato delle schermate - Game Planner

Descrizione testuale di tutte le schermate: contenuti, testi, elementi, stati e comportamenti. Nessuna indicazione grafica (colori, font, layout): quelle sono libere.

```
APP: "Game Planner" - sottotitolo "Quando si gioca?"
Web app per organizzare serate di gioco (giochi da tavolo, giochi di ruolo, giochi di carte) tra gruppi di amici.
Lingua: italiano. Uso principale da smartphone, funziona anche da computer.

=====================================================================
CONCETTI DI BASE
=====================================================================
- UTENTE: persona con un account (accesso con Google oppure email e password). Ha un nome visibile agli altri.
- GRUPPO: una campagna di un gioco, con le persone che ci giocano. Ha: nome del gruppo o della campagna, nome del gioco, membri, uno o più admin, una regola di gioco, la "voglia di giocare" di ciascun membro. Un utente può far parte di più gruppi.
- ADMIN: membro con permessi speciali nel gruppo. Chi crea il gruppo è il primo admin. Gli admin invitano persone, nominano o tolgono altri admin, rimuovono giocatori, modificano ed eliminano il gruppo, confermano e annullano le serate.
- REGOLA DEL GRUPPO: "Solo se ci sono tutti i membri" (predefinita) oppure "Basta un minimo di N membri" (N da 2 a 10).
- VOGLIA DI GIOCARE: ogni membro indica per ogni gruppo un livello tra "Tanta voglia" (3), "Normale" (2, predefinito), "Poca voglia" (1). Serve a scegliere quale gruppo consigliare quando la stessa sera si potrebbe giocare a più giochi.
- DISPONIBILITÀ: per ogni giorno l'utente indica SI, FORSE o NO, oppure lascia vuoto. La disponibilità è unica e vale per tutti i gruppi dell'utente.
- SERATA POSSIBILE: per un gruppo e un giorno, l'app conta i membri disponibili.
  - "Ci sono tutti quelli che servono": i SI raggiungono il numero richiesto dalla regola.
  - "Possibile se i forse confermano": servono anche i FORSE per raggiungerlo.
  - "Non si può": non si raggiunge neanche contando i FORSE.
  - Un membro già impegnato quella sera in una serata confermata di un altro gruppo conta come non disponibile ("occupato").
- SERATA CONFERMATA: un admin sceglie gruppo, giorno, ora, luogo e note. Tutti i membri ricevono un avviso e possono indicare "Ci sono" o "Non posso".
- GIOCATA: una serata confermata ormai passata, a cui l'utente non ha risposto "Non posso". Le giocate formano lo storico personale.
- AVVISO: notifica nell'app per ogni serata confermata da un altro membro di uno dei tuoi gruppi; risulta "non letta" finché l'utente non apre gli Avvisi.
- INVITO: link personale del gruppo con codice segreto. Chi lo apre, dopo l'accesso, può unirsi al gruppo. Funziona anche con chi non ha ancora un account.

=====================================================================
STRUTTURA GENERALE (dopo l'accesso)
=====================================================================
INTESTAZIONE FISSA IN ALTO
- Nome dell'app: "Game Planner"
- Pulsante "Avvisi": se ci sono avvisi non letti mostra il numero, es. "Avvisi (2)", ed è evidenziato. Apre la finestra Avvisi.
- Pulsante con il proprio nome: apre la finestra per cambiarlo.
- Pulsante "Esci" (in modalità demo si chiama "Cambia" e riporta alla scelta del giocatore).

BARRA DI NAVIGAZIONE FISSA IN BASSO, 4 voci
1. Gruppi
2. Disponibilità
3. Serate
4. Giocate - con un contatore del numero di serate future in cui l'utente non ha ancora risposto "Ci sono" o "Non posso".
La voce attiva è evidenziata. Cambiando voce la pagina torna in cima.

MESSAGGI BREVI A SCOMPARSA (toast)
Conferme ed errori brevi, es. "Copiato.", "Gruppo creato: ora invita gli altri.", "Serata confermata: i membri del gruppo trovano l'avviso nell'app.", "Sei entrato nel gruppo. Segna le tue disponibilità!".

FINESTRE A COMPARSA
Si aprono sopra la pagina; si chiudono con il pulsante dedicato, toccando fuori o con Esc.

MODALITÀ DEMO (solo se l'app non è collegata al database)
Sotto l'intestazione un avviso: "Modalità demo - i dati restano su questo dispositivo."

=====================================================================
SCHERMATE DI ACCESSO
=====================================================================

S1. CARICAMENTO
- Solo il testo "Caricamento...".
- Errore di collegamento: titolo "Ops" e testo "Non riesco a collegarmi a Firebase. Controlla la configurazione in index.html e la connessione."
- Errore di lettura dati: titolo "Ops", testo "Non riesco a leggere i dati. Controlla la connessione e le regole Firestore.", pulsante "Esci".

S2. ACCESSO
- Titolo: "Game Planner"
- Sottotitolo: "Quando si gioca?"
- Testo: "Crea i gruppi delle tue campagne, segna quando ci sei, scopri quando si gioca."
- Se l'utente è arrivato da un link di invito, un riquadro: "Sei stato invitato nel gruppo [nome gruppo]. Accedi per unirti."
- Pulsante principale: "Entra con Google".
- Separatore: "oppure con email".
- Campo "Email".
- Campo "Password" (Invio = Entra).
- Area messaggi di errore. Testi possibili: "Email non valida.", "Inserisci la password.", "La password deve avere almeno 6 caratteri.", "Esiste già un account con questa email: usa Entra.", "Email o password non corrette.", "Accesso annullato.", "Il browser ha bloccato la finestra di Google. Riprova o usa email e password.", "Questo indirizzo non è autorizzato nel progetto Firebase (vedi README).", "Troppi tentativi, riprova tra poco.", "Qualcosa non ha funzionato. Riprova."
- Due pulsanti affiancati: "Entra" e "Crea account". "Crea account" crea l'account e invia un'email di verifica.
- Link: "Password dimenticata?". Se l'email è vuota mostra "Scrivi la tua email qui sopra, poi tocca di nuovo."; altrimenti invia l'email di reimpostazione e mostra "Ti abbiamo mandato un'email per reimpostare la password."

S3. VERIFICA EMAIL (account email non ancora verificato)
- Titolo: "Quasi fatto"
- Testo: "Ti abbiamo mandato un'email per verificare l'indirizzo. Apri il link (controlla anche lo spam), poi torna qui."
- Area errori (es. "Non risulta ancora verificata. Apri il link nell'email e riprova.").
- Pulsante principale: "Ho verificato, entra".
- Pulsanti: "Rinvia email" (toast "Email inviata di nuovo.") ed "Esci".

S4. INGRESSO DEMO (solo modalità demo)
- Titolo: "Game Planner", sottotitolo "Quando si gioca?"
- Riquadro: "Modalità demo: i dati restano solo su questo dispositivo. Puoi creare più giocatori e passare dall'uno all'altro per provare gruppi, inviti e incroci."
- Eventuale riquadro di invito come in S2.
- "Entra come": un pulsante per ogni giocatore demo già esistente.
- Campo "Nuovo giocatore" (segnaposto "Il tuo nome") e pulsante "Entra".
- Separatore "per provare al volo" e pulsante "Carica l'esempio (dati del foglio di ottobre)": crea 6 giocatori (Gigi, Mattia, Roberto, Iole, Gian, Fabiola), 4 gruppi (L'Ultima Torcia, Set Base, Campagna D&D, Fan Made), le disponibilità di ottobre 2026 e uno storico di giocate da settembre 2025; entra come Mattia e apre Serate.
- Pulsante "Cancella tutti i dati demo" (con conferma).

=====================================================================
PAGINA 1 - GRUPPI (elenco)
=====================================================================
- Titolo: "I miei gruppi"
- Pulsanti in alto: "Ho un invito" (apre F3) e "Crea gruppo" (apre F2).

STATO VUOTO (nessun gruppo)
Scheda di benvenuto:
- Titolo: "Benvenuto!"
- Testo 1: "Tutto parte da un gruppo: una campagna di un gioco con le persone che ci giocano. Puoi far parte di più gruppi."
- Testo 2: "Crea il primo gruppo e invita gli altri via email, SMS o WhatsApp, oppure apri il link di invito che ti hanno mandato."
- Pulsanti: "Crea un gruppo" e "Ho un link di invito".

ELENCO (una scheda per gruppo, in ordine alfabetico; toccando la scheda si apre il dettaglio)
- Nome del gruppo.
- Numero di membri: "1 membro" / "N membri".
- Riga: "[nome del gioco] - [regola]", dove la regola è "Si gioca solo se ci sono tutti" oppure "Si gioca con almeno N membri".
- Etichette con i nomi dei membri.
- Riga finale: "La tua voglia: [Tanta voglia / Normale / Poca voglia]" e, se esiste, " - Prossima serata: [giorno della settimana, giorno e mese]".

=====================================================================
PAGINA 1b - DETTAGLIO GRUPPO
=====================================================================
- Link di ritorno: "< I miei gruppi".

BLOCCO A - INTESTAZIONE DEL GRUPPO
- Nome del gruppo.
- Pulsante "Modifica" (solo admin, apre F2 in modifica).
- Nome del gioco.
- Regola: "Si gioca solo se ci sono tutti" / "Si gioca con almeno N membri".
- Riga sul ruolo:
  - se sei admin: "Sei admin: inviti, gestisci i giocatori e confermi le serate."
  - altrimenti: "Admin: [nomi degli admin]. Sono loro a confermare le serate."

BLOCCO B - LA TUA VOGLIA DI GIOCARE
- Titolo: "La tua voglia di giocare con questo gruppo"
- Testo: "Serve a scegliere quale gruppo consigliare quando la stessa sera si potrebbe giocare a più giochi."
- Tre opzioni a scelta singola: "Tanta voglia", "Normale", "Poca voglia" (la scelta attuale è evidenziata; il salvataggio è immediato).

BLOCCO C - MEMBRI
- Titolo: "Membri (N)"
- Una riga per membro, in ordine alfabetico:
  - nome, con "(tu)" se sei tu ed etichetta "Admin" se lo è;
  - sotto: "N giorni segnati da oggi in poi" oppure "Non ha ancora segnato le disponibilità";
  - a destra: la sua voglia di giocare;
  - solo se sei admin e la riga non è tua: pulsanti "Rendi admin" / "Togli admin" e "Rimuovi dal gruppo" (con conferma "Rimuovi [nome] dal gruppo?").

BLOCCO D - INVITA QUALCUNO (solo admin)
- Titolo: "Invita qualcuno"
- Testo: "Chi riceve il link entra nel gruppo dopo aver fatto l'accesso."
- Il link di invito per intero, in un riquadro leggibile.
- Pulsanti: "Copia link" e, se il dispositivo lo supporta, "Condividi..." (condivisione di sistema).
- "Via email": campo email (segnaposto "nome@esempio.it") e pulsante "Invia". Apre l'app di posta con destinatario, oggetto "Invito al gruppo [nome]" e testo già pronti. Email non valida: "Scrivi un indirizzo email valido."
- "Via cellulare": campo numero (segnaposto "+39 333 1234567") e pulsanti "SMS" e "WhatsApp". Aprono l'app SMS o WhatsApp con il messaggio già pronto; senza prefisso internazionale si assume +39. Numero non valido: "Scrivi un numero di cellulare valido."
- Testo: "Funziona anche con chi non ha ancora l'app: dal link si registra e entra direttamente nel gruppo."
- Messaggio di invito precompilato: "Ciao! Ti invito nel gruppo "[nome]" ([gioco]) su Game Planner, così vediamo insieme quando possiamo giocare. Entra da qui: [link]"
Per chi non è admin, al posto del blocco: "Per invitare qualcuno chiedi a un admin del gruppo."

BLOCCO E - SERATE CONFERMATE
- Titolo: "Serate confermate"
- Schede serata future del gruppo (vedi COMPONENTE SCHEDA SERATA).
- Se non ce ne sono: "Nessuna serata in programma. Guarda le Serate possibili." (link alla pagina Serate).

BLOCCO F - AZIONI FINALI
- "Esci dal gruppo": conferma "Vuoi uscire dal gruppo "[nome]"?". Se sei l'unico admin e ci sono altri membri: "Sei l'unico admin: prima rendi admin qualcun altro." Se sei l'unico membro, uscire elimina il gruppo.
- "Elimina gruppo" (solo admin): conferma "Elimini il gruppo "[nome]" per tutti?".

=====================================================================
PAGINA 2 - DISPONIBILITÀ
=====================================================================
- Titolo: "Le mie disponibilità"
- Sottotitolo: "Valgono per tutti i tuoi gruppi."
- Menu a tendina mese/anno: da mese corrente a dicembre 2029, voci tipo "Ottobre 2026". All'apertura è selezionato il mese corrente.
- Quattro "pennelli" a scelta singola: "SI", "FORSE", "NO", "Cancella" (predefinito: SI).
- Intestazione giorni: Lun Mar Mer Gio Ven Sab Dom (settimana da lunedì).
- Griglia del mese, una casella per giorno:
  - numero del giorno; il giorno di oggi è riconoscibile;
  - se segnato, sotto il numero l'etichetta "SI", "FORSE" o "NO" (con stato visivo distinto per ognuno);
  - i giorni passati sono disattivati.
- Toccando un giorno gli si applica il pennello scelto. Se il giorno ha già lo stesso stato, lo stato viene tolto. Con "Cancella" il giorno torna vuoto.
- Riepilogo: "Hai segnato N giorni su M da qui a fine mese."
- Pulsanti rapidi:
  - "Applica ai giorni vuoti": applica il pennello a tutti i giorni futuri non segnati del mese;
  - "Applica ai weekend": applica il pennello a tutti i sabati e le domeniche futuri del mese;
  - "Svuota mese": dopo la conferma "Cancello le tue disponibilità di questo mese?", cancella i giorni futuri del mese.
  - Se il pennello è "Cancella", i primi due mostrano: "Scegli prima SI, FORSE o NO."
- Legenda: "Scegli SI, FORSE o NO e tocca i giorni. Toccando di nuovo un giorno con lo stesso stato lo cancelli."
- Se l'utente non ha gruppi: "Ricorda: per vedere quando si gioca devi far parte di almeno un gruppo. Vai su Gruppi." (link)

=====================================================================
PAGINA 3 - SERATE (incrocio delle disponibilità)
=====================================================================
- Titolo: "Serate"
- Sottotitolo: "Incrocia le disponibilità di tutti i membri dei tuoi gruppi, sera per sera."
- Filtri:
  - menu mese/anno (come in Disponibilità);
  - menu gruppo: "Tutti i miei gruppi" oppure un singolo gruppo;
  - interruttore "Solo le serate possibili" (attivo di default). Spento, mostra tutte le sere del mese, anche quelle senza gruppi possibili.
- Stato senza gruppi: "Qui vedrai in quali serate si può giocare e con quale gruppo. Prima crea o entra in un gruppo." (link)
- Stato senza risultati: "Nessuna serata possibile in [mese anno]. Servono le disponibilità di tutti: controlla in ogni gruppo chi non ha ancora segnato i suoi giorni, oppure prova un altro mese."

SCHEDA SERATA (una per ogni sera futura del mese che ha almeno un gruppo possibile o una serata confermata)
- Intestazione: giorno per esteso (es. "Lunedì 19 ottobre"), etichetta di stato e pulsante "Apri" (apre F4).
  Etichetta di stato:
  - "Confermata": c'è già una serata confermata quella sera;
  - "Si può giocare": almeno un gruppo ha tutti quelli che servono;
  - "Dipende dai forse": solo gruppi possibili contando i FORSE;
  - "Nessun gruppo": nessun gruppo possibile (solo con il filtro spento).
- Per ogni serata già confermata quella sera: "Si gioca [gioco] con [gruppo] alle [ora] - [luogo]".
- Nota sovrapposizioni (se 2 o più gruppi sono possibili e hanno persone in comune): "[N] gruppi possibili con persone in comune ([nomi]): si gioca a uno solo. Consigliato [gruppo], il gruppo con più voglia di giocare."
- Righe dei gruppi non ancora confermati quella sera (vedi COMPONENTE RIGA GRUPPO), in ordine: prima "tutti ci sono", poi "dipende dai forse", poi "non si può"; a parità, prima la voglia media più alta, poi più SI.

COMPONENTE RIGA GRUPPO (usato in Serate e nella finestra F4)
- Nome del gruppo; etichetta "Consigliato" sul migliore, quando i gruppi possibili sono 2 o più.
- Sotto: "[gioco] - servono N su M" (N = membri necessari, M = membri totali).
- Etichetta di stato: "Ci sono tutti quelli che servono" / "Possibile se i forse confermano" / "Non si può" (le righe "Non si può" sono attenuate).
- Etichette dei membri, ognuna con il suo stato distinguibile:
  - SI: solo il nome;
  - FORSE: "[nome] (forse)";
  - occupato: "[nome] (gioca a [altro gruppo])";
  - NO: solo il nome, con stato "no";
  - non segnato: "[nome] (?)".
- Se il gruppo è possibile:
  - "Voglia media: X,X su 3" (media della voglia di chi è disponibile);
  - se sei admin del gruppo: pulsante "Conferma questa serata" (apre F5 con gruppo e data precompilati);
  - altrimenti: testo "Decide un admin".

=====================================================================
PAGINA 4 - GIOCATE (riepilogo personale e storico)
=====================================================================
- Titolo: "Le mie giocate"
- Pulsante "Conferma una serata" (solo se sei admin di almeno un gruppo; apre F5 vuota).

BLOCCO RIEPILOGO
- Titolo: "Riepilogo"
- Riga: "Prossima giocata: [giorno] alle [ora], [gioco] con [gruppo]." oppure "Nessuna giocata in programma."
- Tre contatori con didascalia:
  - "[N] in programma": serate future confermate a cui non hai detto "Non posso";
  - "[N] giocate in totale": tutte le giocate passate di sempre (non solo dell'anno in corso);
  - "[N] giochi provati": numero di giochi diversi a cui hai giocato almeno una volta.
- Etichette per gioco con il numero di giocate, es. "Dungeons & Dragons: 7", dalla più alta. Toccando un'etichetta lo storico si filtra su quel gioco (l'etichetta selezionata è evidenziata); toccandola di nuovo il filtro si toglie.
- Frase: "Il gioco a cui hai giocato di più è [gioco]; la prima giocata registrata è del [giorno mese anno]."

INVITO AD ATTIVARE GLI AVVISI (solo se il browser li supporta e non sono ancora stati attivati o negati)
- Testo: "Vuoi un avviso su questo dispositivo quando un admin conferma una serata?"
- Pulsante: "Attiva avvisi" (chiede il permesso al browser).

BLOCCO IN PROGRAMMA
- Titolo: "In programma"
- Schede delle serate future di tutti i tuoi gruppi, in ordine di data e ora (vedi COMPONENTE SCHEDA SERATA).
- Stato vuoto: "Nessuna serata confermata. Guarda le Serate possibili." (link)

BLOCCO STORICO DELLE GIOCATE
- Titolo: "Storico delle giocate"
- Pannello filtri con quattro menu a tendina, combinabili tra loro:
  - "Gioco": "Tutti i giochi" + i giochi a cui hai giocato (ordine alfabetico);
  - "Gruppo": "Tutti i gruppi" + i gruppi con cui hai giocato;
  - "Anno": "Tutti gli anni" + gli anni in cui hai giocato (dal più recente);
  - "Mese": "Tutti i mesi" + Gennaio...Dicembre (combinato con "Tutti gli anni" mostra quel mese in ogni anno).
- Sotto i filtri: "[N] giocate trovate" (con "in totale" se non ci sono filtri attivi; "1 giocata trovata" al singolare) e, se c'è almeno un filtro attivo, il pulsante "Togli i filtri".
- Risultati raggruppati per mese, dal più recente. Ogni gruppo di mese ha il titolo (es. "Dicembre 2025") e il conteggio ("1 giocata" / "N giocate").
- Ogni giocata mostra:
  - nome del gioco;
  - data completa (es. "Sabato 27 dicembre 2025");
  - "Gruppo [nome] - ore [ora] - [luogo]";
  - "Con: [nomi degli altri presenti]" (oppure "nessun altro");
  - le note, se presenti.
- Nessun risultato con i filtri: "Nessuna giocata con questi filtri."
- Nessuna giocata in assoluto: "Le serate giocate compariranno qui, con data, gioco, gruppo e chi c'era." (i filtri non compaiono).

=====================================================================
COMPONENTE SCHEDA SERATA (usato in Giocate e nel dettaglio gruppo)
=====================================================================
- Nome del gioco e, sotto, "Gruppo [nome]".
- Etichetta "Confermata".
- Riga: "Confermata da [nome admin]." seguita da una tra:
  - "Presenze: X sì, Y da confermare, Z non vengono." (la parte "non vengono" solo se Z > 0);
  - "Z non vengono." (se nessuno deve ancora rispondere);
  - "Hanno confermato tutti."
- Data per esteso ("Lunedì 19 ottobre 2026") e "alle [ora]".
- Luogo (se presente) e note (se presenti).
- Etichette dei membri: "[nome]" (presente), "[nome] - in attesa", "[nome] - non viene".
- Pulsanti presenza: "Ci sono" e "Non posso" (quello scelto è evidenziato; si può cambiare).
- Pulsanti calendario:
  - "Aggiungi al calendario": scarica un evento calendario (.ics) con titolo "[gioco] - [gruppo]", durata 3 ore, luogo, descrizione con i confermati e le note, e due promemoria: il giorno prima ("Domani si gioca a [gioco]") e 2 ore prima ("Tra 2 ore si gioca a [gioco]");
  - "Google Calendar": apre Google Calendar con l'evento precompilato.
- Solo admin: "Avvisa tutti" (apre F6) e "Annulla" (conferma "Annulli questa serata per tutti?").

=====================================================================
FINESTRE A COMPARSA
=====================================================================

F1. IL TUO NOME
- Titolo: "Il tuo nome"
- Testo: "È il nome che vedono gli altri nei tuoi gruppi."
- Campo precompilato con il nome attuale.
- Pulsanti: "Annulla" e "Salva" (anche con Invio; nome vuoto non accettato). Il nuovo nome si aggiorna in tutti i gruppi.

F2. NUOVO GRUPPO / MODIFICA GRUPPO
- Titolo: "Nuovo gruppo" oppure "Modifica gruppo".
- Campo "Nome del gruppo o della campagna" (segnaposto "Es. La campagna del giovedì").
- Campo "Gioco" (segnaposto "Es. Dungeons & Dragons").
- "Quando si può giocare", scelta singola:
  - "Solo se ci sono tutti i membri" (predefinita);
  - "Basta un minimo di [menu 2-10] membri".
- Errore se mancano nome o gioco: "Scrivi il nome del gruppo e il gioco."
- Pulsanti: "Annulla" e "Crea gruppo" (oppure "Salva").
- Dopo la creazione si apre il dettaglio del nuovo gruppo con il toast "Gruppo creato: ora invita gli altri."

F3. HO UN INVITO
- Titolo: "Ho un invito"
- Testo: "Incolla qui il link che ti hanno mandato."
- Campo testo (segnaposto "https://...#join=...").
- Errore: "Questo non sembra un link di invito valido."
- Pulsanti: "Annulla" e "Continua" (porta alla finestra F7).

F4. DETTAGLIO SERATA (dal pulsante "Apri" in Serate)
- Titolo: data completa (es. "Lunedì 19 ottobre 2026").
- Se ci sono serate già confermate quel giorno, sezione "Confermate": per ognuna "[gioco] con [gruppo] alle [ora] - [luogo]".
- Sezione "Giochi possibili questa sera":
  - testo: "Più giochi sono possibili: l'admin sceglie a cosa giocare. Il consigliato è quello con più voglia di giocare." oppure "C'è un gioco possibile." oppure "Nessun gioco possibile questa sera con le disponibilità attuali.";
  - elenco di tutti i tuoi gruppi senza serata confermata quel giorno (COMPONENTE RIGA GRUPPO), con "Consigliato" e "Conferma questa serata" per gli admin;
  - se tutti i gruppi sono già confermati: "Tutti i tuoi gruppi hanno già una serata confermata."
- "Tu quella sera:" con tre opzioni "Ci sono", "Forse", "Non ci sono" (la tua scelta è evidenziata; toccandola di nuovo la togli). L'elenco si aggiorna subito.
- Pulsante "Chiudi".

F5. CONFERMA LA SERATA (solo admin)
- Titolo: "Conferma la serata"
- Testo: "Tutti i membri del gruppo riceveranno l'avviso."
- Campi:
  - "Gruppo": menu con i soli gruppi di cui sei admin, voci "[gruppo] - [gioco]";
  - "Giorno": selettore data da oggi al 31/12/2029;
  - "Ora": predefinita 21:00;
  - "Dove" (segnaposto "Es. da Gigi, via Roma 12");
  - "Note" (segnaposto "Es. portate le schede, si cena prima").
- Errori: "Scegli un gruppo di cui sei admin.", "Scegli un giorno a partire da oggi.", "Questo gruppo ha già una serata confermata in quel giorno."
- Pulsanti: "Annulla" e "Conferma".
- Dopo la conferma: si va su Giocate, toast "Serata confermata: i membri del gruppo trovano l'avviso nell'app." e si apre F6.

F6. AVVISA TUTTI (solo admin)
- Titolo: "Avvisa tutti"
- Testo: "Tutti i membri del gruppo vedono già la serata nell'app, tra gli Avvisi e in Giocate. Puoi avvisarli anche fuori dall'app:"
- Anteprima del messaggio: "Confermato! [data completa] alle [ora] si gioca a [gioco] (gruppo [nome]), [luogo]. [note] Conferma la tua presenza su Game Planner: [link app]"
- Pulsanti:
  - "Invia su WhatsApp" (apre WhatsApp con il messaggio);
  - "Invia per email a N persone" (apre l'app di posta con tutti i membri in copia nascosta, oggetto "Game Planner - si gioca: [gioco] [data]");
  - "Copia il messaggio";
  - "Fatto" (chiude).

F7. INVITO RICEVUTO (compare dopo l'accesso, se l'utente è arrivato da un link di invito o ne ha incollato uno)
- Titolo: "Invito"
- Testo: "Sei stato invitato nel gruppo [nome]."
- Nota: "Entrando, gli altri membri vedranno il tuo nome e le tue disponibilità."
- Errore possibile: "Invito non valido o gruppo non più esistente."
- Pulsanti: "Non ora" e "Unisciti".
- Dopo "Unisciti": si apre il dettaglio del gruppo con il toast "Sei entrato nel gruppo. Segna le tue disponibilità!". Se l'utente è già membro, si apre direttamente il gruppo senza finestra.

F8. AVVISI
- Titolo: "Avvisi"
- Elenco delle serate future confermate da altri nei tuoi gruppi, dalla più recente. Per ognuna:
  - "Nuova: " davanti se non letta, poi "[gioco] - [giorno] alle [ora]";
  - sotto: "[nome admin] ha confermato la serata del gruppo [gruppo], [luogo]."
- Stato vuoto: "Nessun avviso. Quando un admin conferma una serata di un tuo gruppo, la trovi qui."
- Pulsanti: "Chiudi" e "Vai alle giocate".
- Aprendo la finestra, tutti gli avvisi diventano letti e il contatore in alto si azzera.
- Se l'utente ha attivato gli avvisi del browser, una nuova serata confermata genera anche una notifica di sistema: titolo "Game Planner - si gioca!", testo "[giorno] alle [ora]: [gioco] con [gruppo]" (mentre l'app è aperta, anche in un'altra scheda).

=====================================================================
REGOLE TRASVERSALI
=====================================================================
- Nomi sempre in ordine alfabetico. Date in italiano con l'iniziale maiuscola: per esteso "Lunedì 19 ottobre 2026", in forma breve "Lunedì 19 ottobre".
- Tutto si aggiorna in tempo reale per tutti i membri, senza ricaricare la pagina.
- Eliminazioni, uscite e annullamenti chiedono sempre conferma.
- Mentre la pagina si aggiorna, i campi che si stanno compilando mantengono testo e posizione del cursore.
- Un utente vede solo i gruppi di cui fa parte; nei gruppi vede nomi, voglia di giocare e disponibilità degli altri membri.
```
