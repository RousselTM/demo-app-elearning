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
    let formationsData = []; // Pour stocker les données des formations globalement

    // --- Gestion de la session utilisateur ---
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
        modalElement.style.display = 'flex'; // Utilise flex pour le centrage
    };

    const hideModal = (modalElement) => {
        modalElement.style.display = 'none';
    };

    // Afficher la modale de connexion au chargement initial
    if (userName === 'Anonyme') {
        showModal(loginModal);
    }
    updateUserInfo();

    // Gestion de la soumission du formulaire de connexion
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

    // Bouton Annuler de la modale de connexion
    cancelBtn.addEventListener('click', () => {
        userName = 'Anonyme';
        userEmail = 'N/A';
        localStorage.setItem('userName', userName);
        localStorage.setItem('userEmail', userEmail);
        updateUserInfo();
        hideModal(loginModal);
    });

    // Bouton Connexion (affichage de la modale)
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('name').value = userName === 'Anonyme' ? '' : userName;
        document.getElementById('email').value = userEmail === 'N/A' ? '' : userEmail;
        showModal(loginModal);
    });

    // Bouton Déconnexion
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        userName = 'Anonyme';
        userEmail = 'N/A';
        localStorage.setItem('userName', userName);
        localStorage.setItem('userEmail', userEmail);
        updateUserInfo();
        // Optionnel : Réafficher la modale de connexion après déconnexion
        showModal(loginModal);
    });

    // Clic sur le nom d'utilisateur pour afficher les détails
    userInfoDiv.addEventListener('click', () => {
        if (userName !== 'Anonyme') {
            modalUserName.textContent = userName;
            modalUserEmail.textContent = userEmail;
            showModal(userDetailsModal);
        }
    });

    // Fermeture des modales
    document.querySelectorAll('.close-button').forEach(button => {
        button.addEventListener('click', () => {
            hideModal(loginModal);
            hideModal(userDetailsModal);
        });
    });

    // Fermer la modale si l'utilisateur clique en dehors du contenu
    window.addEventListener('click', (event) => {
        if (event.target == loginModal) {
            hideModal(loginModal);
        }
        if (event.target == userDetailsModal) {
            hideModal(userDetailsModal);
        }
    });

    // --- Chargement et affichage des formations ---
    const loadFormations = async () => {
        try {
            const response = await fetch('https://raw.githubusercontent.com/RousselTM/grafana-formation/main/tp/data/projet3.json');
            formationsData = await response.json();
            
            formationsGrid.innerHTML = ''; // Nettoyer la grille avant d'ajouter
            formationsData.forEach(formation => {
                const card = document.createElement('div');
                card.classList.add('formation-card');

                const link = `https://elearning.rousseltm.fr/training_chapter?id=${formation.id}`;
                
                card.innerHTML = `
                    <a href="${link}" target="_blank">
                        <img src="${formation.image}" alt="${formation.title}" class="icon">
                        <h3>${formation.title}</h3>
                    </a>
                    <p class="category">Catégorie: ${formation.category}</p>
                    <p class="views">Vues: ${formation.views}</p>
                    <a href="${link}" target="_blank" class="view-link">Voir la formation</a>
                `;
                formationsGrid.appendChild(card);
            });
        } catch (error) {
            console.error('Erreur lors du chargement des formations:', error);
            formationsGrid.innerHTML = '<p>Impossible de charger les formations pour le moment. Veuillez réessayer plus tard.</p>';
        }
    };

    // --- Section Vidéo à la une ---
    const playRandomVideo = () => {
        const randomIndex = Math.floor(Math.random() * youtubeVideoIds.length);
        const videoId = youtubeVideoIds[randomIndex];
        featuredVideoIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&allow="autoplay"&mute=1&controls=1&showinfo=0&rel=0&iv_load_policy=3`;
    };

    // --- Lien "Aléatoire" ---
    randomLink.addEventListener('click', (e) => {
        e.preventDefault();
        const rand = Math.random();
        if (rand < 0.6) { // 3 chances sur 5 (0.6)
            window.open('https://nonexistante.rousseltm.fr', '_blank');
        } else {
            if (formationsData.length > 0) {
                const randomIndex = Math.floor(Math.random() * formationsData.length);
                const randomFormation = formationsData[randomIndex];
                window.open(`https://elearning.rousseltm.fr/training_chapter?id=${randomFormation.id}`, '_blank');
            } else {
                alert('Aucune formation disponible pour le moment.');
            }
        }
    });

    // Initialisation
    loadFormations();
    playRandomVideo();
});