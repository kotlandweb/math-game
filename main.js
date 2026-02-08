const btn = document.getElementById("btn");
const text = document.getElementById("text");

if (btn && text) {
  btn.addEventListener("click", () => {
    text.textContent = "JavaScript veikia. Atsisiuntimo nuoroda ir QR kodas.";
  });
}

window.addEventListener("load", () => {
  const snowContainer = document.querySelector(".snow");
  if (!snowContainer) return;

  // Sukuriame 100 snaigių su atsitiktine pozicija ir greičiu.
  for (let i = 0; i < 100; i++) {
    const snowflake = document.createElement("div");
    snowflake.style.left = Math.random() * 100 + "%";
    snowflake.style.animationDuration = (Math.random() * 5 + 5) + "s";
    snowContainer.appendChild(snowflake);
  }
});
