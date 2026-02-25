let contenedor = document.querySelector("#contenedor");
let boton = document.querySelector("#button");

boton.addEventListener("click", () => {
    peticionApi();
});

async function peticionApi() {
    const url = "https://jsonplaceholder.typicode.com/photos";

    try {
        const respuesta = await fetch(url);
        const datos = await respuesta.json();

        contenedor.innerHTML = "";

        datos.slice(0, 100).forEach((foto) => {
            contenedor.innerHTML += `
                <div class="foto">
                    <img src="https://picsum.photos/200?random=${foto.id}">
                    <p>${foto.title}</p>
                </div>
            `;
        });

    } catch (error) {
        console.error(error);
    }
}