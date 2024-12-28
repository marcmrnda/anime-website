// DOM elements for various sections of the page
const videoCont = document.getElementById('anime__video__player'); // Container for video player
const list = document.getElementById('list'); // List container for episodes
const animeList = document.getElementById('anime'); // Container for anime list
const searchInput = document.getElementById('search-input'); // Input for search functionality
const dataContainer = document.getElementById('data-container'); // Container for search results
const linkContainers = document.querySelectorAll(".anime-link"); // Links to individual anime details
const animeContainer = document.getElementById('animedetails-container'); // Container for anime details
const titless = document.getElementById('titless'); // Title of the anime
const watchGenre = document.getElementById('watchgenre'); // Display genre of the anime

// Base URLs for the API endpoints
const orgURL = "https://consumet-api-3oe2.onrender.com/anime/gogoanime/"; // Base URL for anime search and list
const infoUrl = "https://consumet-api-3oe2.onrender.com/anime/gogoanime/info/"; // URL for fetching anime details
const Streamurl = "https://consumet-api-3oe2.onrender.com/anime/gogoanime/servers/"; // URL for fetching episode streams
const watchURL = "https://consumet-api-3oe2.onrender.com/anime/gogoanime/watch/"; // URL for watching anime

// Event listener for search input to handle "Enter" key
searchInput.addEventListener('keypress', function(e) {
    if (e.key === "Enter") {
        e.preventDefault();
        const searchResults = searchInput.value; // Get search input value
        window.location.href = `search.html?q=${encodeURIComponent(searchResults)}`; // Redirect to search results page
    }
});

// Fetch episode details and populate the list of episodes
async function fetchEpisodes() {
    let streamURL = `${infoUrl}${window.location.search.replace("?q=", "")}`; // Construct URL for fetching episodes
    console.log(streamURL);
    try {
        const response = await fetch(streamURL); // Fetch anime details
        const res = await response.json();
        const episode = res.episodes; // Extract episodes
        titless.textContent = res.title; // Set anime title
        watchGenre.textContent = res.genres[0]; // Display the first genre
        makeTheEpisodesAppear(episode); // Create episode list
    } catch (error) {
        console.error("Error fetching the API", error);
    }
}

// Function to create the list of episodes dynamically
function makeTheEpisodesAppear(episode) {
    Object.values(episode).forEach((obj) => {
        const ep = document.createElement("a"); // Create anchor element for episode
        const regex = /[^0-9]/g;
        ep.href = `#`; // Placeholder href
        ep.textContent = `Episode ${obj.id.replace(regex, " ")}`; // Set episode text
        ep.setAttribute("data-episode-id", obj.id); // Set data attribute with episode ID
        ep.classList.add("episode-link");
        ep.addEventListener('click', event => {
            event.preventDefault();
            const episodeID = ep.getAttribute('data-episode-id'); // Get episode ID
            const streamURL = `${Streamurl}${episodeID}`; // Construct stream URL
            getServer(streamURL); // Fetch the server and update the video player
        });
        list.appendChild(ep); // Append episode to the list
    });

    const firstEp = document.querySelector('.episode-link'); // Auto-click the first episode
    firstEp.click();
}

// Fetch stream URL for the selected episode and display it in the video player
async function getServer(streamURL) {
    try {
        const response = await fetch(streamURL); // Fetch stream data
        const res = await response.json();
        const prompt = `<iframe src="${res[1].url}" frameborder="0" allowfullscreen id="player" width="100%" height="750"></iframe>`; // Embed video player
        videoCont.innerHTML = prompt;
    } catch (error) {
        console.error("Error fetching the API", error);
    }
}

// Fetch detailed anime information and populate the details section
async function fetchAnimeDetails() {
    try {
        const INFOurl = `${infoUrl}${window.location.search.replace("?q=", "")}`; // Construct anime details URL
        console.log(INFOurl);
        const response = await fetch(INFOurl); // Fetch anime details
        const data = await response.json();
        const genres = data.genres; // Extract genres
        const prompt = `<div class="col-lg-3">
                        <div class="anime__details__pic set-bg" style="background: url(${data.image}) no-repeat; background-position: center; background-size: cover">
                            <div class="comment"><i class="fa fa-comments"></i> 11</div>
                            <div class="view"><i class="fa fa-eye"></i> 9141</div>
                        </div>
                    </div>
                    <div class="col-lg-9">
                        <div class="anime__details__text">
                            <div class="anime__details__title">
                                <h3>${data.title}</h3>
                                <span>${data.otherName}</span>
                            </div>
                            <div class="anime__details__rating">
                                <div class="rating">
                                    <a href="#"><i class="fa fa-star"></i></a>
                                    <a href="#"><i class="fa fa-star"></i></a>
                                    <a href="#"><i class="fa fa-star"></i></a>
                                    <a href="#"><i class="fa fa-star"></i></a>
                                    <a href="#"><i class="fa fa-star-half-o"></i></a>
                                </div>
                                <span>1.029 Votes</span>
                            </div>
                            <p>${data.description}</p>
                            <div class="anime__details__widget">
                                <div class="row">
                                    <div class="col-lg-6 col-md-6">
                                        <ul>
                                            <li><span>Type:</span> ${data.type}</li>
                                            <li><span>Release Date:</span>${data.releaseDate}</li>
                                            <li><span>Status:</span> ${data.status}</li>
                                        </ul>
                                    </div>
                                    <div class="col-lg-6 col-md-6">
                                        <ul>
                                            <li id="genresDetail"><span>Genre:</span></li>
                                            <li><span>Total Episodes:</span> ${data.totalEpisodes}</li>
                                            <li><span>Sub Or Dub:</span> ${data.subOrDub.toUpperCase()}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="anime__details__btn">
                                <a href="./anime-watching.html?q=${encodeURIComponent(data.id)}" class="watch-btn"><span>Watch Now</span> <i
                                    class="fa fa-angle-right"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>`;
        animeContainer.innerHTML += prompt; // Add anime details to the container

        // Add genres to the genres list
        const animeDetailsGenre = document.getElementById('genresDetail');
        Object.values(genres).forEach((g, index) => {
            animeDetailsGenre.textContent += index === genres.length - 1 ? ` ${g}` : ` ${g},`; // Add commas between genres
        });
    } catch (error) {
        console.error("Error fetching anime details", error);
    }
}

// Fetch anime list or search results
const data = async () => {
    if (window.location.search) {
        let count = 1; // Start page count
        let url = `${orgURL}${window.location.search.replace("?q=", "")}?page=1`; // Construct URL for fetching anime list
        try {
            const response = await fetch(url);
            const data = await response.json();
            while (data.hasNextPage) {
                const newurl = `${orgURL}${window.location.search.replace("?q=", "")}?page=${count++}`; // Construct URL for next page
                const response = await fetch(newurl);
                const datas = await response.json();
                const resultsData = datas.results;

                // Populate anime cards for each anime in the results
                Object.values(resultsData).forEach(d => {
                    const html = `<div class="col-lg-4 col-md-6 col-sm-6" id="card-container">
                        <div class="product__item">
                        <div class="product__item__pic set-bg" style="background: url(${d.image}) no-repeat; background-position: center; background-size: cover">
                        <div class="ep">${d.subOrDub}</div>
                        <div class="view">${d.releaseDate}</div>
                        </div>
                        <div class="product__item__text">
                         <h5><a href="anime-details.html?q=${encodeURIComponent(d.id)}" class="anime-link">${d.title}</a></h5>
                        </div>
                        </div>`;
                    dataContainer.innerHTML += html; // Add anime card to container
                });

                if (!datas.hasNextPage) break; // Stop fetching if no more pages
            }
        } catch (err) {
            console.error("Error fetching anime data", err);
        }
    }
};

// Initialize functions
data(); // Fetch anime list
fetchAnimeDetails(); // Fetch anime details
fetchEpisodes(); // Fetch episodes

// Hide ads in iframe video player
const iframe = document.getElementById('player');
iframe.onload = () => {
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

    // Add CSS to hide ads in iframe
    const style = document.createElement('style');
    style.textContent = `
        .ad-banner, .ad-popup {
            display: none !important;
        }
    `;
    iframeDoc.head.appendChild(style);
};
