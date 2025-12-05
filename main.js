document.getElementById("btn").addEventListener("click", function () {
    document.getElementById("text").textContent = "JavaScript veikia!";
});
window.addEventListener('load', () => {
  const snowContainer = document.querySelector('.snow');
  
  for (let i = 0; i < 100; i++) {
    let snowflake = document.createElement('div');
    snowContainer.appendChild(snowflake);
  }
});
