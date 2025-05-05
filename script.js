// API Configuration
const PEXELS_API_KEY = "2vOrMqgbFTXSYRzLXSuB6cwNL3UFwILj8dSmkLw0Qam2fLiUyfiqUXxb";
const TMDB_API_KEY = "31bb2f7ae6a5b2455d6d35967addd240";

// Get DOM elements
const imageGallery = document.getElementById("hasilGambar");
const filmGallery = document.getElementById("hasilFilm");
const updateImagesBtn = document.getElementById("updateImagesBtn");
const updateMoviesBtn = document.getElementById("updateMoviesBtn");

// List of random queries for images
const randomQueries = [
    "nature", "indonesia", "animal", "city", "beach", 
    "mountain", "food", "travel", "people", "technology",
    "art", "business", "fashion", "health", "sports"
];

// Fetch random images from Pexels
async function fetchRandomImages() {
    try {
        // Get random query from the list
        const randomQuery = randomQueries[Math.floor(Math.random() * randomQueries.length)];
        
        const response = await fetch(`https://api.pexels.com/v1/search?query=${randomQuery}&per_page=6`, {
            headers: {
                Authorization: PEXELS_API_KEY
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.photos;
    } catch (error) {
        console.error("Failed to fetch images:", error);
        return null;
    }
}

// Display images in gallery
function displayImages(photos) {
    if (!photos || photos.length === 0) {
        imageGallery.innerHTML = '<p class="error">Gagal memuat gambar. Silakan coba lagi nanti.</p>';
        return;
    }

    imageGallery.innerHTML = '';
    imageGallery.style.display = 'grid';
    imageGallery.style.gridTemplateColumns = 'repeat(auto-fill, minmax(250px, 1fr))';
    imageGallery.style.gap = '20px';
    imageGallery.style.margin = '20px 0';

    photos.forEach(photo => {
        const imgContainer = document.createElement('a');
        imgContainer.href = photo.url;
        imgContainer.target = '_blank';
        imgContainer.rel = 'noopener noreferrer';
        imgContainer.style.position = 'relative';
        imgContainer.style.borderRadius = '10px';
        imgContainer.style.overflow = 'hidden';
        imgContainer.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
        imgContainer.style.transition = 'transform 0.3s ease';
        imgContainer.style.textDecoration = 'none';
        imgContainer.style.color = 'inherit';

        const img = document.createElement('img');
        img.src = photo.src.large;
        img.alt = photo.photographer;
        img.style.width = '100%';
        img.style.height = '200px';
        img.style.objectFit = 'cover';
        img.style.display = 'block';

        const overlay = document.createElement('div');
        overlay.style.position = 'absolute';
        overlay.style.bottom = '0';
        overlay.style.left = '0';
        overlay.style.right = '0';
        overlay.style.backgroundColor = 'rgba(0,0,0,0.7)';
        overlay.style.color = 'white';
        overlay.style.padding = '10px';
        overlay.style.fontSize = '14px';

        const photographer = document.createElement('p');
        photographer.textContent = `Foto oleh: ${photo.photographer}`;
        photographer.style.margin = '0';

        overlay.appendChild(photographer);
        imgContainer.appendChild(img);
        imgContainer.appendChild(overlay);
        imageGallery.appendChild(imgContainer);

        imgContainer.addEventListener('mouseenter', () => {
            imgContainer.style.transform = 'translateY(-5px)';
        });

        imgContainer.addEventListener('mouseleave', () => {
            imgContainer.style.transform = 'none';
        });
    });
}

// Fetch movies from TMDB
async function fetchMovies() {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&language=id-ID&page=1`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error("Failed to fetch movies:", error);
        return null;
    }
}

// Display movies in gallery
function displayMovies(movies) {
    if (!movies || movies.length === 0) {
        filmGallery.innerHTML = '<p class="error">Gagal memuat film. Silakan coba lagi nanti.</p>';
        return;
    }

    filmGallery.innerHTML = '';
    filmGallery.style.display = 'grid';
    filmGallery.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))';
    filmGallery.style.gap = '25px';
    filmGallery.style.margin = '20px 0';

    movies.slice(0, 6).forEach(movie => {
        const movieElement = document.createElement('a');
        movieElement.href = `https://www.themoviedb.org/movie/${movie.id}`;
        movieElement.target = '_blank';
        movieElement.rel = 'noopener noreferrer';
        movieElement.className = 'film-item';
        movieElement.style.background = '#fff';
        movieElement.style.borderRadius = '10px';
        movieElement.style.overflow = 'hidden';
        movieElement.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        movieElement.style.transition = 'transform 0.3s ease';
        movieElement.style.textDecoration = 'none';
        movieElement.style.color = 'inherit';

        const posterPath = movie.poster_path 
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : 'https://via.placeholder.com/500x750?text=No+Poster';

        movieElement.innerHTML = `
            <img src="${posterPath}" alt="${movie.title}" style="width:100%; height:300px; object-fit:cover;">
            <div style="padding:15px;">
                <h4 style="margin:0 0 8px 0; font-size:16px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${movie.title}</h4>
                <div style="display:flex; justify-content:space-between; font-size:14px; color:#666;">
                    <span>${movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}</span>
                    <span>⭐ ${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
                </div>
            </div>
        `;

        movieElement.addEventListener('mouseenter', () => {
            movieElement.style.transform = 'translateY(-5px)';
            movieElement.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
        });

        movieElement.addEventListener('mouseleave', () => {
            movieElement.style.transform = 'none';
            movieElement.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        });

        filmGallery.appendChild(movieElement);
    });
}

// Update images with random content
async function updateImages() {
    // Show loading state
    imageGallery.innerHTML = '<p>Memuat gambar random...</p>';
    
    const images = await fetchRandomImages();
    displayImages(images);
}

// Update movies function
async function updateMovies() {
    const movies = await fetchMovies();
    displayMovies(movies);
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", async function() {
    // Load initial random images
    await updateImages();
    
    // Load initial movies
    await updateMovies();
    
    // Set up event listener for update images button
    if (updateImagesBtn) {
        updateImagesBtn.addEventListener('click', updateImages);
    }
    
    // Set up event listener for update movies button
    if (updateMoviesBtn) {
        updateMoviesBtn.addEventListener('click', updateMovies);
    }

    // Guest book functionality (unchanged)
    const addGuestButton = document.getElementById('add-guest-button');
    const guestNameInput = document.getElementById('guest-name-input');
    const guestList = document.getElementById('guest-list');

    function addGuest(name) {
        const li = document.createElement('li');
        li.style.listStyle = 'none';
        li.style.backgroundColor = '#e6f0ff';
        li.style.marginBottom = '10px';
        li.style.padding = '10px';
        li.style.borderRadius = '10px';
        li.style.display = 'flex';
        li.style.justifyContent = 'space-between';
        li.style.alignItems = 'center';

        const nameSpan = document.createElement('span');
        nameSpan.textContent = name;
        nameSpan.style.flexGrow = '1';

        const buttonGroup = document.createElement('div');

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.style.backgroundColor = '#0c0553';
        editButton.style.color = '#fff';
        editButton.style.border = 'none';
        editButton.style.marginLeft = '5px';
        editButton.style.padding = '5px 10px';
        editButton.style.borderRadius = '5px';
        editButton.style.cursor = 'pointer';

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Hapus';
        deleteButton.style.backgroundColor = '#0c0553';
        deleteButton.style.color = '#fff';
        deleteButton.style.border = 'none';
        deleteButton.style.marginLeft = '5px';
        deleteButton.style.padding = '5px 10px';
        deleteButton.style.borderRadius = '5px';
        deleteButton.style.cursor = 'pointer';

        editButton.addEventListener('click', () => {
            if (nameSpan.isContentEditable) {
                nameSpan.contentEditable = false;
                editButton.textContent = 'Edit';
                editButton.style.backgroundColor = '#0c0553';
            } else {
                nameSpan.contentEditable = true;
                nameSpan.focus();
                editButton.textContent = 'Simpan';
                editButton.style.backgroundColor = '#64d8ff';
            }
        });

        deleteButton.addEventListener('click', () => {
            guestList.removeChild(li);
        });

        buttonGroup.appendChild(editButton);
        buttonGroup.appendChild(deleteButton);

        li.appendChild(nameSpan);
        li.appendChild(buttonGroup);
        guestList.appendChild(li);
    }

    addGuestButton.addEventListener('click', () => {
        const name = guestNameInput.value.trim();
        if (name !== '') {
            addGuest(name);
            guestNameInput.value = '';
        } else {
            alert('Nama tidak boleh kosong!');
        }
    });
});