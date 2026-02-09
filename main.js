// Paimame mygtuką ir teksto vietą pagal jų ID.
const btn = document.getElementById("btn");
const text = document.getElementById("text");

// Jei elementai egzistuoja, uždedame paspaudimo įvykį.
if (btn && text) {
  btn.addEventListener("click", () => {
    // Parodome žinutę, kad JS veikia.
    text.textContent = "JavaScript veikia. Atsisiuntimo nuoroda ir QR kodas.";
  });
}

// Kai puslapis užsikrauna, sukuriame snaiges.
window.addEventListener("load", () => {
  // Randame snaigių konteinerį.
  const snowContainer = document.querySelector(".snow");
  // Jei konteinerio nėra, nieko nedarome.
  if (!snowContainer) return;

  // Sukuriame 100 snaigių su atsitiktine pozicija ir greičiu.
  for (let i = 0; i < 100; i++) {
    // Sukuriame vieną snaigę.
    const snowflake = document.createElement("div");
    // Atsitiktinė horizontali pozicija.
    snowflake.style.left = Math.random() * 100 + "%";
    // Atsitiktinis kritimo greitis.
    snowflake.style.animationDuration = (Math.random() * 5 + 5) + "s";
    // Neigiamas vėlinimas, kad snaigės matytųsi iš karto.
    snowflake.style.animationDelay = `-${Math.random() * 12}s`;
    // Pridedame snaigę į konteinerį.
    snowContainer.appendChild(snowflake);
  }
});
