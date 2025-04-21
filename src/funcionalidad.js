async function sugerirCiudades() {
    const ciudad = document.getElementById("ciudad").value.trim();
    const sugerenciasLista = document.getElementById("sugerencias");
    sugerenciasLista.innerHTML = ""; // Limpiar sugerencias previas

    if (ciudad.length < 3) return; // Esperar hasta que haya al menos 3 letras

    const apiKey = "b221ee79be96d11caa33bea05c8901f2"; // API Key de OpenWeatherMap
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${ciudad}&limit=5&appid=${apiKey}`;

    try {
        const respuesta = await fetch(url);
        const datos = await respuesta.json();

        if (datos.length > 0) {
            sugerenciasLista.style.display = "block"; // Mostrar sugerencias si hay resultados
        }

        datos.forEach(lugar => {
            const item = document.createElement("li");
            item.textContent = `${lugar.name}, ${lugar.country}`;
            item.onclick = () => {
                seleccionarCiudad(lugar.name);
                obtenerClima(); // Llamar a la función automáticamente
            };
            sugerenciasLista.appendChild(item);
        });
    } catch (error) {
        console.error("Error al obtener sugerencias:", error);
    }
}

function seleccionarCiudad(nombreCiudad) {
    document.getElementById("ciudad").value = nombreCiudad;
    document.getElementById("sugerencias").innerHTML = "";
    sugerenciasLista.style.display = "none"; //Oculto las sugerencias al seleccionar una ciudad
}

// Evento para buscar la ciudad directamente al presionar Enter
function funcionEnter(event) {
    if (event.key === "Enter") {
        obtenerClima();
    }
}

// Funcion para obtener el clima de la ciudad ingresada y mostrarlo en el elemento con id "resultado"
async function obtenerClima() {
    const ciudad = document.getElementById("ciudad").value.trim();
    const apiKey = "b221ee79be96d11caa33bea05c8901f2"; // API Key de OpenWeatherMap

    // Si la ciudad está vacía, mostramos un mensaje de error
    if (!ciudad) {
        document.getElementById("resultado").innerHTML = "Por favor, ingresa una ciudad.";
        return;
    }

    // URL para obtener el clima de la ciudad deseada
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${apiKey}&units=metric&lang=es`;

    // Esperamos a la respuesta y si es correcta la imprimimos en el resultado
    try {
        const respuesta = await fetch(url);
        const datos = await respuesta.json();

        if (respuesta.ok) {
            document.getElementById("resultado").innerHTML =
                `El clima en <b>${datos.name}</b> es de ${datos.main.temp}°C con un tiempo ${datos.weather[0].description}.`;
        } else {
            document.getElementById("resultado").innerHTML = `Error: ${datos.message}`;
        }
    } catch (error) {
        document.getElementById("resultado").innerHTML = "Error al obtener los datos. Verifica tu conexión.";
    }
}

function limpiarBusqueda() {
    // Borrar el valor del campo de entrada de ciudad
    document.getElementById("ciudad").value = "";

    // Borrar las sugerencias de la lista
    document.getElementById("sugerencias").innerHTML = "";

    // Borrar el resultado del clima mostrado
    document.getElementById("resultado").innerHTML = "";
}