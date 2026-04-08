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

// Kai puslapis užsikrauna, sukuriame žvaigždes.
window.addEventListener("load", () => {
  // Randame žvaigždžių konteinerį.
  const starContainer = document.querySelector(".stars");
  // Jei konteinerio nėra, nieko nedarome.
  if (!starContainer) return;

  // Sukuriame 100 žvaigždžių su atsitiktine pozicija ir greičiu.
  for (let i = 0; i < 100; i++) {
    // Sukuriame vieną žvaigždę.
    const star = document.createElement("div");
    // Atsitiktinė horizontali pozicija.
    star.style.left = Math.random() * 100 + "%";
    // Atsitiktinis judėjimo greitis.
    star.style.animationDuration = (Math.random() * 5 + 8) + "s";
    // Neigiamas vėlinimas, kad žvaigždės matytųsi iš karto.
    star.style.animationDelay = `-${Math.random() * 12}s`;
    // Pridedame žvaigždę į konteinerį.
    starContainer.appendChild(star);
  }
});
