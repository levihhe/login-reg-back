const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const formTitle = document.getElementById("form-title");
const errorMessage = document.getElementById("error-message");
const toggleLink = document.querySelector(".toggle-link");

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function toggleForm() {
  errorMessage.textContent = "";
  if (loginForm.style.display === "none") {
    loginForm.style.display = "block";
    registerForm.style.display = "none";
    formTitle.textContent = "Bejelentkezés";
    toggleLink.textContent = "Még nincs fiókod? Regisztrálj!";
  } else {
    loginForm.style.display = "none";
    registerForm.style.display = "block";
    formTitle.textContent = "Regisztráció";
    toggleLink.textContent = "Van már fiókod? Jelentkezz be!";
  }
}

loginForm.addEventListener("submit", async function(e) {
  e.preventDefault();
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  if (!isValidEmail(email)) {
    errorMessage.textContent = "Hibás email formátum!";
    return;
  }

  if (password.length < 6) {
    errorMessage.textContent = "A jelszónak legalább 6 karakter hosszúnak kell lennie!";
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      errorMessage.textContent = data.message || "Hiba történt!";
      return;
    }

    errorMessage.textContent = "";
    alert("Sikeres bejelentkezés: " + data.email);

  } catch (err) {
    errorMessage.textContent = "Szerverhiba!";
    console.error(err);
  }
});


registerForm.addEventListener("submit", async function(e) {
  e.preventDefault();
  const email = document.getElementById("register-email").value.trim();
  const password = document.getElementById("register-password").value;
  const password2 = document.getElementById("register-password2").value;

  if (!isValidEmail(email)) {
    errorMessage.textContent = "Hibás email formátum!";
    return;
  }

  if (password.length < 6) {
    errorMessage.textContent = "A jelszónak legalább 6 karakter hosszúnak kell lennie!";
    return;
  }

  if (password !== password2) {
    errorMessage.textContent = "A két jelszó nem egyezik!";
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      errorMessage.textContent = data.message || "Hiba történt!";
      return;
    }

    errorMessage.textContent = "";
    alert("Sikeres regisztráció: " + data.email);
    toggleForm(); 
  } catch (err) {
    errorMessage.textContent = "Szerverhiba!";
    console.error(err);
  }
});
