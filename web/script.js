document.addEventListener('DOMContentLoaded', () => {
    const formationsGrid = document.getElementById('formations-grid');
    const featuredVideoIframe = document.getElementById('featured-video');
    const randomLink = document.getElementById('random-link');
    const loginModal = document.getElementById('login-modal');
    const loginForm = document.getElementById('login-form');
    const displayNameSpan = document.getElementById('display-name');
    const userInfoDiv = document.getElementById('user-info');
    const userDetailsModal = document.getElementById('user-details-modal');
    const modalUserName = document.getElementById('modal-user-name');
    const modalUserEmail = document.getElementById('modal-user-email');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const cancelBtn = document.getElementById('cancel-btn');

    const youtubeVideoIds = ["x7qLYzFIy_E", "iR1CWOG20YQ", "HR3HfYHOuHY", "_xvbJdnFQpk", "VfNfFQJ6kvQ"];
    let formationsData = []; // To store formations data globally

    // --- User Session Management ---
    let userName = localStorage.getItem('userName') || 'Anonyme';
    let userEmail = localStorage.getItem('userEmail') || 'N/A';

    const updateUserInfo = () => {
        displayNameSpan.textContent = userName;
        if (userName === 'Anonyme') {
            loginBtn.style.display = 'inline-block';
            logoutBtn.style.display = 'none';
        } else {
            loginBtn.style.display = 'none';
            logoutBtn.style.display = 'inline-block';
        }
    };

    const showModal = (modalElement) => {
        modalElement.style.display = 'flex'; // Use flex for centering
    };

    const hideModal = (modalElement) => {
        modalElement.style.display = 'none';
    };

    // Update user info on page load (for all pages using this script)
    updateUserInfo();

    // Handle login form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        userName = document.getElementById('name').value.trim();
        userEmail = document.getElementById('email').value.trim();

        if (userName === '') userName = 'Anonyme';
        if (userEmail === '') userEmail = 'N/A';

        localStorage.setItem('userName', userName);
        localStorage.setItem('userEmail', userEmail);
        updateUserInfo();
        hideModal(loginModal);
    });

    // Cancel button for login modal
    cancelBtn.addEventListener('click', () => {
        userName = 'Anonyme';
        userEmail = 'N/A';
        localStorage.setItem('userName', userName);
        localStorage.setItem('userEmail', userEmail);
        updateUserInfo();
        hideModal(loginModal);
    });

    // Login button (shows login modal)
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('name').value = userName === 'Anonyme' ? '' : userName;
        document.getElementById('email').value = userEmail === 'N/A' ? '' : userEmail;
        showModal(loginModal);
    });

    // Logout button
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        userName = 'Anonyme';
        userEmail = 'N/A';
        localStorage.setItem('userName', userName);
        localStorage.setItem('userEmail', userEmail);
        updateUserInfo();
        showModal(loginModal); // Optionnal: Re-show login modal after logout
    });

    // Click on username to show user details
    userInfoDiv.addEventListener('click', () => {
        if (userName !== 'Anonyme') {
            modalUserName.textContent = userName;
            modalUserEmail.textContent = userEmail;
            showModal(userDetailsModal);
        }
    });

    // Close modals
    document.querySelectorAll('.close-button').forEach(button => {
        button.addEventListener('click', () => {
            hideModal(loginModal);
            hideModal(userDetailsModal);
        });
    });

    // Close modal if user clicks outside of content
    window.addEventListener('click', (event) => {
        if (event.target == loginModal) {
            hideModal(loginModal);
        }
        if (event.target == userDetailsModal) {
            hideModal(userDetailsModal);
        }
    });

    // --- Load and Display Formations (on index.html only) ---
    // Check if formationsGrid exists, meaning we are on index.html
    if (formationsGrid) {
        const loadFormations = async () => {
            try {
                const response = await fetch('https://raw.githubusercontent.com/RousselTM/grafana-formation/main/tp/data/projet3.json');
                formationsData = await response.json();

                formationsGrid.innerHTML = ''; // Clear grid before adding
                formationsData.forEach(formation => {
                    const card = document.createElement('div');
                    card.classList.add('formation-card');

                    // Link to formation_details.php
                    const detailLink = `formation_details.php?id=${formation.id}`;

                    card.innerHTML = `
                        <a href="${detailLink}">
                            <img src="${formation.image}" alt="${formation.title}" class="icon">
                            <h3>${formation.title}</h3>
                        </a>
                        <p class="category">Catégorie: ${formation.category}</p>
                        <p class="views">Vues: ${formation.views}</p>
                        <a href="${detailLink}" class="view-link">Voir la formation</a>
                    `;
                    formationsGrid.appendChild(card);
                });
            } catch (error) {
                console.error('Erreur lors du chargement des formations:', error);
                formationsGrid.innerHTML = '<p>Impossible de charger les formations pour le moment. Veuillez réessayer plus tard.</p>';
            }
        };
        loadFormations();
    }


    // --- Featured Video Section ---
    const playRandomVideo = () => {
        const randomIndex = Math.floor(Math.random() * youtubeVideoIds.length);
        const videoId = youtubeVideoIds[randomIndex];
        // Ensure autoplay and other parameters are set correctly
        featuredVideoIframe.src = `http://www.youtube.com/embed/${videoId}?autoplay=1&allow="autoplay"&mute=1&controls=1&showinfo=0&rel=0&iv_load_policy=3`;
    };

    if (featuredVideoIframe) { // Only play video if element exists (on index.html)
        playRandomVideo();
    }


    // --- "Aléatoire" Link ---
    randomLink.addEventListener('click', async (e) => {
        e.preventDefault();
        const rand = Math.random();
        if (rand < 0.4) { // 2 chances sur 5 (0.4)
            window.open('https://nonexistante.fr', '_blank');
        } else {
            // Ensure formationsData is loaded before trying to get a random formation
            if (formationsData.length === 0) {
                // If not already loaded, try to fetch it
                try {
                    const response = await fetch('https://raw.githubusercontent.com/RousselTM/grafana-formation/main/tp/data/projet3.json');
                    formationsData = await response.json();
                } catch (error) {
                    console.error('Erreur lors du chargement des formations pour le lien aléatoire:', error);
                    alert('Impossible de charger les formations pour le moment.');
                    return;
                }
            }

            if (formationsData.length > 0) {
                const randomIndex = Math.floor(Math.random() * formationsData.length);
                const randomFormation = formationsData[randomIndex];
                window.open(`formation_details.php?id=${randomFormation.id}`, '_blank');
            } else {
                alert('Aucune formation disponible pour le moment.');
            }
        }
    });

});