const inputCiudad = document.querySelector("#ciudadInput");
const btnBuscar = document.querySelector("#buscarBtn");
const resultado = document.querySelector("#resultado");

const API_KEY = "b22aed2ad9d8f3e9f5ac5302f6cd673c";

btnBuscar.addEventListener("click", buscarClima);
inputCiudad.addEventListener("keypress", e => {
    if (e.key === "Enter") buscarClima();
});

async function buscarClima() {
    const ciudad = inputCiudad.value.trim();
    if (!ciudad) {
        resultado.innerHTML = "<p>⚠️ Ingresa una ciudad</p>";
        return;
    }

    resultado.innerHTML = "<p>⏳ Consultando clima...</p>";

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${API_KEY}&units=metric&lang=es`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.cod !== 200) {
            resultado.innerHTML = "<p>❌ Ciudad no encontrada</p>";
            return;
        }

        const clima = data.weather[0].main.toLowerCase();
        cambiarFondo(clima);

        const icono = obtenerIcono(clima);

        resultado.innerHTML = `
            <div class="icon">${icono}</div>
            <h2>${data.name}</h2>
            <div class="temp">${Math.round(data.main.temp)}°C</div>
            <p class="desc">${data.weather[0].description}</p>
        `;
    } catch (error) {
        resultado.innerHTML = "<p>🚨 Error de conexión</p>";
        console.error(error);
    }
}

function cambiarFondo(clima) {
    document.body.className = "default";

    if (clima.includes("clear")) document.body.classList.add("clear");
    else if (clima.includes("cloud")) document.body.classList.add("clouds");
    else if (clima.includes("rain") || clima.includes("drizzle")) document.body.classList.add("rain");
    else if (clima.includes("snow")) document.body.classList.add("snow");
    else if (clima.includes("thunder")) document.body.classList.add("thunderstorm");
}

function obtenerIcono(clima) {
    if (clima.includes("clear")) return "☀️";
    if (clima.includes("cloud")) return "☁️";
    if (clima.includes("rain") || clima.includes("drizzle")) return "🌧️";
    if (clima.includes("snow")) return "❄️";
    if (clima.includes("thunder")) return "⛈️";
    return "🌤️";
}