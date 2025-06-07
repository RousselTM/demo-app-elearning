<?php
// formation_details.php

// Function to fetch JSON data
function getFormationsData($json_url) {
    $json_data = file_get_contents($json_url);
    if ($json_data === false) {
        error_log("Failed to fetch JSON from URL: " . $json_url);
        return [];
    }
    $formations = json_decode($json_data, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        error_log("JSON decoding error: " . json_last_error_msg());
        return [];
    }
    return $formations;
}

$formation = null;
if (isset($_GET['id'])) {
    $formationId = $_GET['id'];
    $json_url = 'https://raw.githubusercontent.com/RousselTM/grafana-formation/main/tp/data/projet3.json';
    $allFormations = getFormationsData($json_url);

    foreach ($allFormations as $f) {
        if (isset($f['id']) && $f['id'] == $formationId) {
            $formation = $f;
            break;
        }
    }
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Détails de la Formation</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <div class="container">
            <div class="logo-title">
                <img src="https://elearning.rousseltm.fr/admin/images/logo.jpeg" alt="Logo Du concept à l'expertise" class="logo">
                <h1>Du concept à l'expertise</h1>
            </div>
            <nav>
                <ul>
                    <li><a href="index.html">Accueil</a></li>
                    <li><a href="https://www.youtube.com/@Duconceptalexpertise" target="_blank">Toutes nos vidéos</a></li>
                    <li><a href="https://elearning.rousseltm.fr" target="_blank">À propos</a></li>
                    <li><a href="https://www.linkedin.com/company/rousseltm/about/?viewAsMember=true" target="_blank">LinkedIn</a></li>
                    <li><a href="#" id="random-link">Aléatoire</a></li>
                    <li id="auth-links">
                        <a href="#" id="login-btn" class="button">Connexion</a>
                        <a href="#" id="logout-btn" class="button" style="display: none;">Déconnexion</a>
                    </li>
                </ul>
            </nav>
            <div id="user-info">
                Bonjour, <span id="display-name">Anonyme</span>
            </div>
        </div>
    </header>

    <main>
        <div class="container">
            <section id="training-details">
                <a href="index.html" class="back-button">← Retour aux formations</a>
                <?php if ($formation): ?>
                    <h2><?php echo $formation['title']; ?></h2>
                    <div class="detail-content">
                        <img src="<?php echo $formation['image']; ?>" alt="<?php echo $formation['title']; ?>">
                        <div class="detail-info">
                            <?php foreach ($formation as $key => $value): ?>
                                <?php if ($key !== 'image' && $key !== 'title'): // Exclude image and title as they are already displayed ?>
                                    <p><strong><?php echo ucfirst(str_replace('_', ' ', $key)); ?> :</strong> 
                                    <?php 
                                        if (is_array($value)) {
                                            echo implode(', ', $value);
                                        } else {
                                            echo $value;
                                        }
                                    ?>
                                    </p>
                                <?php endif; ?>
                            <?php endforeach; ?>
                            <a href="https://elearning.rousseltm.fr/training_chapter?id=<?php echo $formation['id']; ?>" target="_blank" class="button">Accéder à la formation</a>
                        </div>
                    </div>
                <?php else: ?>
                    <p>Formation non trouvée. Retournez à la <a href="index.html">page d'accueil</a>.</p>
                <?php endif; ?>
            </section>
        </div>
    </main>

    <footer>
        <div class="container">
            <p>© 2025 Du concept à l'expertise - Auteur : Équipe RousselTM</p>
        </div>
    </footer>

    <div id="login-modal" class="modal">
        <div class="modal-content">
            <span class="close-button">×</span>
            <h2>Bienvenue !</h2>
            <p>Veuillez entrer votre nom et votre email (facultatif) :</p>
            <form id="login-form">
                <label for="name">Nom :</label>
                <input type="text" id="name" name="name">
                <label for="email">Email :</label>
                <input type="email" id="email" name="email">
                <div class="modal-buttons">
                    <button type="submit" class="button">Valider</button>
                    <button type="button" id="cancel-btn" class="button cancel">Annuler</button>
                </div>
            </form>
        </div>
    </div>

    <div id="user-details-modal" class="modal">
        <div class="modal-content">
            <span class="close-button">×</span>
            <h2>Vos Informations</h2>
            <p><strong>Nom :</strong> <span id="modal-user-name"></span></p>
            <p><strong>Email :</strong> <span id="modal-user-email"></span></p>
            <div class="modal-buttons">
                <button type="button" class="button close-button">Fermer</button>
            </div>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>