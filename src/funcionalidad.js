async function sugerirCiudades() {
  const ciudad = document.getElementById("ciudad").value.trim();
  const sugerenciasLista = document.getElementById("sugerencias");
  sugerenciasLista.innerHTML = "";

  if (ciudad.length < 3) {
    sugerenciasLista.style.display = "none";
    return;
  }

  const apiKey = "b221ee79be96d11caa33bea05c8901f2";
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${ciudad}&limit=5&appid=${apiKey}`;

  try {
    const respuesta = await fetch(url);
    const datos = await respuesta.json();
    console.log(datos);

    if (datos.length > 0) {
      sugerenciasLista.style.display = "block";
    }

    datos.forEach((lugar) => {
      if (lugar.country === "ES") {
        const item = document.createElement("li");
        item.textContent = `${lugar.name}, ${lugar.country}`;
        item.onclick = () => {
          seleccionarCiudad(lugar.name);
          obtenerClima();
        };
        sugerenciasLista.appendChild(item);
      }
    });
  } catch (error) {
    console.error("Error al obtener sugerencias:", error);
  }
}

async function obtenerClima() {
  const ciudad = document.getElementById("ciudad").value.trim();
  const resultado = document.getElementById("resultado");
  const apiKey = "b221ee79be96d11caa33bea05c8901f2";
  const espania = "ES";

  if (!ciudad) {
    resultado.innerHTML = "Por favor, ingresa una ciudad.";
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${apiKey}&units=metric&lang=es`;

  try {
    const respuesta = await fetch(url);
    const datos = await respuesta.json();
    if (respuesta.ok) {
      const iconCode = datos.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

      // Actualiza los elementos de clima hoy
      document.getElementById("tempActual").textContent = `🌡 ${Math.round(
        datos.main.temp
      )}°C`;
      document.getElementById(
        "humedadActual"
      ).textContent = `💧 ${datos.main.humidity}%`;

      // Agrega el icono dentro del círculo
      const iconoClima = document.getElementById("iconoClima");
      iconoClima.innerHTML = `<img src="${iconUrl}" alt="Icono del clima">`;

      // También actualiza el resultado textual
      resultado.innerHTML = `<strong>${datos.name}</strong><br>`;

      obtenerPronostico(ciudad);
    } else {
      resultado.innerHTML = `Error: ${datos.message}`;
    }
  } catch (error) {
    resultado.innerHTML = "Error al obtener los datos. Verifica tu conexión.";
  }
}

function limpiarBusqueda() {
  document.getElementById("ciudad").value = "";
  document.getElementById("sugerencias").innerHTML = "";
  document.getElementById("sugerencias").style.display = "none";
  document.getElementById("resultado").innerHTML = "";
  document.querySelector(".proximos-dias .dias").innerHTML = "";
  document.getElementById("tempActual").textContent = "🌡 --°C";
  document.getElementById("humedadActual").textContent = "💧 --%";
  document.getElementById("iconoClima").innerHTML = "";
}

async function obtenerPronostico(ciudad) {
  const apiKey = "b221ee79be96d11caa33bea05c8901f2";
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${ciudad}&appid=${apiKey}&units=metric&lang=es`;

  try {
    const respuesta = await fetch(url);
    const datos = await respuesta.json();

    const contenedor = document.querySelector(".proximos-dias .dias");
    contenedor.innerHTML = "";

    // Agrupar por día
    const dias = {};

    datos.list.forEach((item) => {
      const fecha = item.dt_txt.split(" ")[0];
      if (!dias[fecha] && item.dt_txt.includes("12:00:00")) {
        dias[fecha] = item;
      }
    });

    // Mostrar solo 5 días
    const diasKeys = Object.keys(dias).slice(0, 5);

    diasKeys.forEach((fecha) => {
      const item = dias[fecha];
      const temp = Math.round(item.main.temp);
      const descripcion = item.weather[0].description;
      const icon = item.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${icon}.png`;

      const boton = document.createElement("button");
      boton.innerHTML = `
		  <img src="${iconUrl}" alt="${descripcion}" />
		  <div>${new Date(fecha).toLocaleDateString("es-ES", {
        weekday: "short",
      })}</div>
		  <div>${temp}°C</div>
		`;
      contenedor.appendChild(boton);
    });
  } catch (error) {
    console.error("Error al obtener el pronóstico:", error);
  }
}

function seleccionarCiudad(nombreCiudad) {
  document.getElementById("ciudad").value = nombreCiudad;
  document.getElementById("sugerencias").innerHTML = "";
  document.getElementById("sugerencias").style.display = "none";
}

function funcionEnter(event) {
  if (event.key === "Enter") {
    document.getElementById("sugerencias").style.display = "none";
    obtenerClima();
  }
}
