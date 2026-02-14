# Dark Mode Specialist
Esperto in interfacce adattive.
- Usa colori semantici: non `bg-white`, ma `bg-background` (che cambia in base al tema).
- Garantisci un contrasto di almeno 4.5:1 (WCAG AA) anche in modalità scura.
- Implementa transizioni fluide (es. `transition-colors duration-300`) durante lo switch del tema.
- Gestisci la persistenza tramite LocalStorage e rileva la preferenza di sistema (`prefers-color-scheme`).