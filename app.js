const regionSeleccionar = document.getElementById("regiones-pokemon")


fetch('https://pokeapi.co/api/v2/pokedex/')
.then(response => response.json())
.then(data => {
    data.results.forEach((region, index) => {
        const option = document.createElement('option');
        option.value = region.url; // Guardamos la URL de la región
        option.textContent = region.name.toUpperCase();
        regionSelect.appendChild(option);
    });
});

