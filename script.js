//Formulario
const form = document.getElementById("form-pelicula");
//Imputs
const imagenInput = document.getElementById("imagen");
const tituloInput = document.getElementById("titulo");
const anioInput = document.getElementById("anio");
const descripcionInput = document.getElementById("descripcion");
const generoInput = document.getElementById("genero");
const clasificacionInput = document.getElementById("clasificacion");

const filtroGenero = document.getElementById("filtro-genero");
const buscarPelicula = document.getElementById("buscar-pelicula");

let peliculas = JSON.parse(localStorage.getItem("peliculas")) || [];
let indiceEdicion = null;
//Tabla y card

const tablaBody = document.querySelector("#tablaPeliculas tbody");
const cardsContainer = document.getElementById("cards-container");

function crearFilaTabla(pelicula) {
  // Creamos la fila
  const fila = document.createElement("tr");

  // Celda imagen
  const celdaImagen = document.createElement("td");
  const img = document.createElement("img");
  img.src = pelicula.imagen;
  img.alt = pelicula.titulo;
  img.width = 80;
  celdaImagen.appendChild(img);

  // Celda título
  const celdaTitulo = document.createElement("td");
  celdaTitulo.textContent = pelicula.titulo;

  // Celda año
  const celdaAnio = document.createElement("td");
  celdaAnio.textContent = pelicula.anio;

  // Celda descripción
  const celdaDescripcion = document.createElement("td");
  celdaDescripcion.textContent = pelicula.descripcion;

  // Celda género
  const celdaGenero = document.createElement("td");
  celdaGenero.textContent = pelicula.genero;

  // Celda clasificación
  const celdaClasificacion = document.createElement("td");
  celdaClasificacion.textContent = pelicula.clasificacion;
  // Celda Acciones
  const celdaAcciones = document.createElement("td");

  const botonEditar = document.createElement("button");
  botonEditar.textContent = "Editar";

  botonEditar.addEventListener("click", () => {
    editarPelicula(pelicula);
  });
  const botonBorrar = document.createElement("button");
  botonBorrar.textContent = "Borrar";

  botonBorrar.addEventListener("click", () => {
    borrarPelicula(pelicula);
  });

  celdaAcciones.appendChild(botonEditar);
  celdaAcciones.appendChild(botonBorrar);

  // Montamos la fila
  fila.appendChild(celdaImagen);
  fila.appendChild(celdaTitulo);
  fila.appendChild(celdaAnio);
  fila.appendChild(celdaDescripcion);
  fila.appendChild(celdaGenero);
  fila.appendChild(celdaClasificacion);
  fila.appendChild(celdaAcciones);

  return fila;
}
function editarPelicula(pelicula) {
  indiceEdicion = peliculas.indexOf(pelicula);

  imagenInput.value = pelicula.imagen;
  tituloInput.value = pelicula.titulo;
  anioInput.value = pelicula.anio;
  descripcionInput.value = pelicula.descripcion;
  generoInput.value = pelicula.genero;
  clasificacionInput.value = pelicula.clasificacion;

  form.scrollIntoView({ behavior: "smooth" });
}
function borrarPelicula(pelicula) {
  const indice = peliculas.indexOf(pelicula);
  if (indice === -1) return;
  const confirmar = confirm(`¿Seguro que quieres borrar "${pelicula.titulo}"?`);
  if (!confirmar) return;
  peliculas.splice(indice, 1);
  localStorage.setItem("peliculas", JSON.stringify(peliculas));

  if (indiceEdicion === indice) {
    indiceEdicion = null;
    form.reset();
  }

  filtrarPorGenero();
}
function crearCard(pelicula) {
  const card = document.createElement("article");
  card.classList.add("card");

  card.innerHTML = `
    <img src="${pelicula.imagen}" alt="${pelicula.titulo}">
    <h3>${pelicula.titulo}</h3>
    <p><strong>Año:</strong> ${pelicula.anio}</p>
    <p>${pelicula.descripcion}</p>
    <p><strong>Género:</strong> ${pelicula.genero}</p>
    <p><strong>Clasificación:</strong> ${pelicula.clasificacion}</p>
    <button class="editar-pelicula">Editar</button>
    <button class="borrar-pelicula">Borrar</button>
  `;
  const botonEditar = card.querySelector(".editar-pelicula");
  const botonBorrar = card.querySelector(".borrar-pelicula");

  botonEditar.addEventListener("click", () => {
    editarPelicula(pelicula);
  });
  botonBorrar.addEventListener("click", () => {
    borrarPelicula(pelicula);
  });

  return card;
}

function renderizarPeliculas(listaPeliculas) {
  // Vaciar la tabla y las tarjetas
  tablaBody.innerHTML = "";
  cardsContainer.innerHTML = "";

  // Recorrer las películas que queremos mostrar
  listaPeliculas.forEach((pelicula) => {
    // Crear y añadir la fila de la tabla
    const fila = crearFilaTabla(pelicula);
    tablaBody.appendChild(fila);

    // Crear y añadir la tarjeta
    const card = crearCard(pelicula);
    cardsContainer.appendChild(card);
  });
}
function filtrarPorGenero() {
  const generoSeleccionado = filtroGenero.value;

  if (generoSeleccionado === "todos") {
    renderizarPeliculas(peliculas);
    return;
  }

  const peliculasFiltradas = peliculas.filter(
    (pelicula) => pelicula.genero === generoSeleccionado,
  );

  renderizarPeliculas(peliculasFiltradas);
}
// Ejecutar el filtro por titulo
function buscarPorTitulo() {
  const textoBuscado = buscarPelicula.value.toLowerCase().trim();

  const peliculasFiltradas = peliculas.filter((pelicula) =>
    pelicula.titulo.toLowerCase().includes(textoBuscado),
  );

  renderizarPeliculas(peliculasFiltradas);
}
buscarPelicula.addEventListener("input", buscarPorTitulo);
// Ejecutar el filtro cuando cambia el selector
filtroGenero.addEventListener("change", filtrarPorGenero);

form.addEventListener("submit", (event) => {
  console.log("Formulario enviado");
  event.preventDefault(); //Evita que recargue la pagina
  //Leer los valores del formulario
  const imagen = imagenInput.value;
  const titulo = tituloInput.value;
  const anio = anioInput.value;
  const descripcion = descripcionInput.value;
  const genero = generoInput.value;
  const clasificacion = clasificacionInput.value;
  // 2. Validar el año
  const anioActual = new Date().getFullYear();
  if (
    anioInput.value.length !== 4 ||
    !/^\d{4}$/.test(anioInput.value) ||
    anio < 1800 ||
    anio > anioActual
  ) {
    alert(`El año debe tener 4 cifras y estar entre 1800 y ${anioActual}.`);
    return;
  }

  //Crear objeto pelicula nueva
  const nuevaPelicula = {
    imagen,
    titulo,
    anio,
    descripcion,
    genero,
    clasificacion,
  };
  //Guardar la película en el array
  if (indiceEdicion === null) {
    // Crear una película nueva
    peliculas.push(nuevaPelicula);
  } else {
    // Actualizar la película que estamos editando
    peliculas[indiceEdicion] = nuevaPelicula;
    indiceEdicion = null;
  }

  localStorage.setItem("peliculas", JSON.stringify(peliculas));

  filtrarPorGenero();
  form.reset();
});
filtrarPorGenero();
