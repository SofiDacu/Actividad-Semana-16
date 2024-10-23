// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    console.log('El DOM ha sido cargado.');

    const regionesSelect = document.getElementById('regiones-select');
    const pokemonList = document.getElementById('pokemon-list');

    // Verificar que el elemento <select> esté presente en el DOM
    if (!regionesSelect) {
        console.error('El elemento select no se encontró.');
        return;
    }

    // Consumir la API para obtener las regiones
    fetch('https://pokeapi.co/api/v2/pokedex/')
        .then(response => response.json())
        .then(data => {
            console.log('Regiones:', data);
            // Llenar el <select> con las regiones
            data.results.forEach(region => {
                const option = document.createElement('option');
                option.value = region.url; // Guardamos la URL de la región como valor
                option.textContent = region.name.toUpperCase();
                regionesSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error al cargar las regiones:', error);
        });

    // Manejar el evento de selección de una región
    regionesSelect.addEventListener('change', async () => {
        const regionUrl = regionesSelect.value;
        if (regionUrl) {
            try {
                const response = await fetch(regionUrl);
                const regionData = await response.json();
                const pokemonEntries = regionData.pokemon_entries.slice(0, 50); // Máximo 50 Pokémon

                pokemonList.innerHTML = ''; // Limpiar la lista anterior

                // Cargar los detalles de cada Pokémon
                for (const entry of pokemonEntries) {
                    const pokemonData = await fetch(entry.pokemon_species.url.replace('-species', ''))
                        .then(res => res.json());
                    renderPokemonCard(pokemonData);
                }
            } catch (error) {
                console.error('Error al cargar los Pokémon:', error);
            }
        }
    });

    //crea y muestra una tarjeta de Pokémon
    function renderPokemonCard(pokemon) {
        const card = document.createElement('div');
        card.className = 'pokemon-card';
        card.innerHTML = `
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            <h3>${pokemon.name.toUpperCase()}</h3>
            <button onclick="agregarAlEquipo('${pokemon.name}', '${pokemon.sprites.front_default}')">Agregar al equipo</button>
        `;
        pokemonList.appendChild(card);
    }
});

//  agregarAlEquipo
window.agregarAlEquipo = function agregarAlEquipo(nombre, imagen) {
    const equipo = JSON.parse(localStorage.getItem('equipo')) || [];
    equipo.push({ nombre, imagen });
    localStorage.setItem('equipo', JSON.stringify(equipo));
    alert(`${nombre} ha sido agregado a tu equipo!`);
};
