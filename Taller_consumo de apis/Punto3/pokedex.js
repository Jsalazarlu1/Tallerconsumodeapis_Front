const input = document.querySelector("#pokemonInput");
const btnBuscar = document.querySelector("#buscarBtn");
const resultado = document.querySelector("#resultado");
const sugerencias = document.querySelector("#sugerencias");
const prevBtn = document.querySelector("#prevBtn");
const nextBtn = document.querySelector("#nextBtn");

let listaPokemon = [];
let pokemonActual = 1;

/* Cargar lista de Pokémon */
fetch("https://pokeapi.co/api/v2/pokemon?limit=1000")
    .then(res => res.json())
    .then(data => listaPokemon = data.results.map(p => p.name));

btnBuscar.addEventListener("click", buscarPokemon);
input.addEventListener("input", mostrarSugerencias);
input.addEventListener("keypress", e => {
    if (e.key === "Enter") buscarPokemon();
});

prevBtn.addEventListener("click", () => cambiarPokemon(-1));
nextBtn.addEventListener("click", () => cambiarPokemon(1));

async function buscarPokemon() {
    const valor = input.value.trim().toLowerCase();
    if (!valor) return;

    sugerencias.innerHTML = "";
    resultado.innerHTML = "<p>⏳ Buscando...</p>";

    try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${valor}`);
        if (!res.ok) throw new Error();

        const data = await res.json();
        pokemonActual = data.id;
        mostrarPokemon(data);
    } catch {
        resultado.innerHTML = "<p>❌ Pokémon no encontrado</p>";
    }
}

function cambiarPokemon(direccion) {
    const nuevo = pokemonActual + direccion;
    if (nuevo < 1) return;

    input.value = nuevo;
    buscarPokemon();
}

function mostrarSugerencias() {
    const texto = input.value.toLowerCase();
    sugerencias.innerHTML = "";

    if (texto.length < 2) return;

    listaPokemon
        .filter(p => p.startsWith(texto))
        .slice(0, 8)
        .forEach(nombre => {
            const li = document.createElement("li");
            li.textContent = nombre;
            li.addEventListener("click", () => {
                input.value = nombre;
                sugerencias.innerHTML = "";
                buscarPokemon();
            });
            sugerencias.appendChild(li);
        });
}

function mostrarPokemon(pokemon) {
    const tipos = pokemon.types.map(t => `<span>${t.type.name}</span>`).join("");
    const stats = pokemon.stats.map(s => `<p>${s.stat.name}: ${s.base_stat}</p>`).join("");

    resultado.innerHTML = `
        <div class="card">
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            <h2>${pokemon.name}</h2>
            <div class="types">${tipos}</div>
            <div class="stats">${stats}</div>
        </div>
    `;
}