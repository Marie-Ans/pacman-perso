'use strict';

window.onload = function(){

    // Ciblage du bouton "Jouer"
    var boutonJouer = window.document.getElementById('jouer');

    // Déclaration d'un tableau dans lequel on stockera l'indice du setInterval qui "gère" la partie. On l'effacera quand l'utilisateur cliquera sur le bouton Jouer.
    var parties = [];

    //Déclaration d'un nouveau jeu (voir fichier jeu.js)
    var newJeu = new Jeu();

    //Initialisation de l'affichage du jeu (voir fichier jeu.js)
    newJeu.initialiserJeu();

    // Exécution de la méthode surveillerAffichage au chargement de la page (voir fichier jeu.js) : affiche un message d'alerte si la taille de l'écran ne permet pas de jouer
    newJeu.surveillerAffichage();

    // Surveillance du redimensionnement de l'écran 
    window.addEventListener("resize", newJeu.surveillerAffichage);

    
    // La fonction jouer : quand l'utilisateur clique sur le bouton "Jouer", exécution de la fonction Jeu.jouer() (fichier jeu.js) qui contrôle tout le jeu. Si une partie est déjà en cours, le setInterval en cours est arrété et le jeu est réinitialisé avant de démarrer la nouvelle partie.
    var jouer = function(){
        boutonJouer.addEventListener('click', function(){
            if(parties.length>0){
                clearInterval(parties[0]);
                parties.splice(0,1);
                newJeu.initialiserJeu();
            }    
        
            //Exécution de la méthode ecouterDirection() de l'objet Jeu (voir fichier jeu.js). Cette méthode permet d'écouter les évènements clavier (flèches directionnelles pour déplacer Pacman et touche ENTRER pour mettre en pause).
            newJeu.ecouterDirection();
        
            //Exécution de setInterval sur la méthode jouer() de l'objet Jeu (voir fichier jeu.js). Cette fonction permet de contrôler tout le jeu.
            var newPartie = setInterval(newJeu.jouer,60);
            parties.push(newPartie);
    })};  

    // Exécution de la méthode jouer() ci-dessus.
    jouer(); 
};