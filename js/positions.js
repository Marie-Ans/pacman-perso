'use strict';

/*Initialement, le fichier positionnement.js contenait toutes les variables et fonctionsutilisées un peu partout, et en lien avec le positionnement.
Pour éviter d'avoir trop de variables et fonctions globales, j'ai finalement décidé de créer un objet Positions les contenant.*/

var Positions = function(){
    /////////////////// PRORIETES : LES COORDONNEES CONSTANTES /////////////////// 
    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////
    

    ///////////////// LES MURS ET LIMITES DU TERRAIN ////////////////
    //Coordonnées des murs et limites du terrain
    //interdites[i][0] et interdites[i][1] = intervalle d'ordonnées
    //interdites[2] = intervalles d'abcisses interdits pour l'intervalle d'ordonnées considéré
    this.interdites = 
    [
        [0, 51, [[200, 300]]],
        [50, 101, [[0, 50], [100, 150], [350,400], [450,500]]],
        [100, 151, [[225,275]]],
        [150, 201, [[0,50], [100,125], [175,325], [375,400], [450, 500]]],
        [200, 251, [[100,125], [375,400]]],
        [250, 276, [[0,50], [100,225], [275,400], [450,500]]],
        [275, 326, [[0,50], [100,125], [375,400], [450,500]]],
        [325, 376, [[0,50], [100,125], [175,325], [375,400], [450,500]]],
        [375, 426, [[225,275]]],
        [425, 476, [[0, 50], [100, 150], [350,400], [450,500]]],
        [475, 525, [[200, 300]]],
    ];

    ///////////////// LE CHEMIN OFFICIEL ////////////////
    // Coordonnées des toutes les positions du jeu pour gérer les tournants : utile spécifiquement pour replacer pacman "correctement" en abcisse ou en ordonnée lorsqu'il change d'axe de direction (horizontal / vertical et inversement), et ce afin de permettre au joueur plus de confort lorsqu'il change d'axe (pas besoin de viser trop précisément).
    //tournants[i][0] : ordonnées des tournants
    //tournants[i][1] : abcisses des tournants pour l'ordonnée[i][0] considérée

    this.chemin = 
    [
        [25, [25, 50, 75, 100, 125, 150, 175, 325, 350, 375, 400, 425, 450, 475]],
        [50, [75, 175, 325, 425]],
        [75, [75, 175, 200, 225, 250, 275, 300, 325, 425]],
        [100, [75, 175, 200, 300, 325, 425]],
        [125, [25, 50, 75, 100, 125, 150, 175, 200, 300, 325, 350, 375, 400, 425, 450, 475]],
        [150, [75, 150, 350, 425]],
        [175, [75, 150, 350, 425]],
        [200, [75, 150, 350, 425]],
        [225, [25, 50, 75, 150, 175, 200, 225, 250, 275, 300, 325, 350, 425, 450, 475]],
        [250, [75, 250, 425]],
        [275, [75, 250, 425]],
        [300, [75, 150, 175, 200, 225, 250, 275, 300, 325, 350, 425]],
        [325, [75, 150, 350, 425]],
        [350, [75, 150, 350, 425]],
        [375, [75, 150, 350, 425]],
        [400, [25, 50, 75, 100, 125, 150, 175, 200, 300, 325, 350, 375, 400, 425, 450, 475]],
        [425, [75, 175, 200, 300, 325, 425]],
        [450, [75, 175, 200, 225, 250, 275, 300, 325, 425]],
        [475, [75, 175, 325, 425]],
        [500, [25, 50, 75, 100, 125, 150, 175, 325, 350, 375, 400, 425, 450, 475]],
    ];

    // Coordonnées des croisements avec au moins 3 directions possibles. Est utilisé pour donner une direction aléatoire aux fantomes lorsqu'ils se situent sur les ronds points.
    this.rondPoints = 
    [
        [25, [75, 425]],
        [125, [75, 425]],
        [225, [75, 250]],
        [300, [250]],
        [400, [75, 425]],
        [500, [75, 425]],
    ];



    ///////////////////////////////// METHODES /////////////////////////////////// 
    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////

    /////////////////// GESTION DES COORDONNEES INTERDITES ////////////////////

    // Cette méthode retourne vrai si la valeur x est comprise, strictement, dans l'interval ]min, max[
    // Utilisée dans la méthode intervalleInterdit(x, min, max) déclarée juste après.
    this.estContenuDansIntervalle= function(x, min, max){
        if (x>min && x<max){
            return true;
        } else {
            return false;
        }
    };

    // Cette méthode retourne vrai si les coordonnées passées en paramètres, correspondent à un intervalle interdit.
    // Utilisée dans la méthode deplacementAutorisé(x, y, personnage, direction) déclarée juste après.
    this.intervalleInterdit = function(x,y){
        var trouveOrd = false;
        var i = 0;
        while(trouveOrd === false && i<this.interdites.length){
            if(this.estContenuDansIntervalle(y,this.interdites[i][0], this.interdites[i][1])){
                trouveOrd = true;
                var intAbcisses = this.interdites[i][2];
                for(var j=0;j<intAbcisses.length;j++){
                    if(this.estContenuDansIntervalle(x, intAbcisses[j][0], intAbcisses[j][1])){
                        return true;
                    }
                }
            }
            i++;
        }
        return false
    };

    // Cette méthode permet de savoir si le déplacement d'un personnage est autorisé.
    // Elle prend en paramètre les coordonnées x et y du personnage, son type ('p' pour pacman et 'f' pour fantome), et sa direction actuelle ('d', 'g', 'h' ou 'b' pour droite, gauche, haut et bas).
    // Cette méthode est utilisée pour autoriser ou non les déplacements lorsque le personnage ne change pas de direction (dans personnages.js : avanerPacman, avancerFantome et donneDirectionAleatoire) / dans jeu.js : ecouterDirection)
    this.deplacementAutorise = function(x,y,personnage,direction){

        if(personnage === 'p'){
            var ajout = 25;
        };
    
        if (personnage === 'f'){
            var ajout = 30;
        }
    
        switch(direction){
            case 'd':
                return ((!this.intervalleInterdit(x + ajout, y + 15))
                        && (!this.intervalleInterdit(x + ajout, y-15))
                        && (x<475));
            break;
    
            case 'g':
                return ((!this.intervalleInterdit(x - ajout, y + 15))
                        && (!this.intervalleInterdit(x - ajout, y-15))
                        && (x>25));
            break;
    
            case 'h':
                return ((!this.intervalleInterdit(x + 15, y - ajout))
                        && (!this.intervalleInterdit(x - 15, y - ajout))
                        && (y>25));
            break;
    
            case 'b':
                return ((!this.intervalleInterdit(x + 15, y + ajout))
                        && (!this.intervalleInterdit(x - 15, y + ajout))
                        && (y<500));
            break;
        }
    };

    // Cette méthode retourne vrai si le point de coordonnées passé en paramètre est l'un des points du tableau rondPoints. Est utilisée par avancerFantome dans personnages.js
    this.estSurRondPoint = function(x,y){
        var ordTrouvee = false;
        var i = 0;
        while(i<this.rondPoints.length && ordTrouvee === false){
            if(y === this.rondPoints[i][0]){
                ordTrouvee = true;
            } else {
                i++;
            }
        }
        if(ordTrouvee){
            var abcisses = this.rondPoints[i][1];
            for(var j=0;j<abcisses.length;j++){
                if(x === abcisses[j]){
                    return true;
                }
            }
            return false;
        } else {
            return false;
        }
    };


    /////////////// CHANGEMENT D'AXE DE PACMAN : VERTICAL <> HORIZONTAL ///////////////

    // Cette méthode renvoie l'ordonnée la plus proche de l'ordonnée passée en paramètre. Elle permet de replacer Pacman dans le droit chemin lorsqu'il passe d'une direction verticale (bas ou haut) à horizontale(gauche ou droite). Utilisée dans replacementPacman (personnages.js).
    this.replacementOrdonnee = function(y){
        var ecart = Math.abs(y - this.chemin[0][0]);
        var proche = this.chemin[0][0];
        for(var i = 1; i<this.chemin.length; i++){
            if (Math.abs(y - this.chemin[i][0])<ecart){
                proche = this.chemin[i][0];
                ecart = Math.abs(y - this.chemin[i][0]);
                
            } else {
            
                return proche;
            }
        }
        return proche;
    };


    // Cette méthode renvoie l'abcisse la plus proche de l'abcisse passée en paramètre, et tenant compte de l'ordonnée passée en paramètre. Elle permet de replacer Pacman dans le droit chemin lorsqu'il passe d'une direction horizontale(gauche ou droite) à verticale (bas ou haut). Utilisée dans replacementPacman (personnages.js).
    this.replacementAbcisse = function(x, y, direction){

        y = this.replacementOrdonnee(y);
        var yProche = 0;
        

        while(y != this.chemin[yProche][0]){
            yProche++;
        }

        if(direction === 'h'){
            var i = yProche-1;
        }

        if(direction === 'b'){
            var i = yProche;
        }
    
        var ecart = Math.abs(x - this.chemin[i][1][0]);
        var proche = this.chemin[i][1][0];

        for(var j = 1; j<this.chemin[i][1].length; j++){
            if (Math.abs(x - this.chemin[i][1][j])<ecart){
                proche = this.chemin[i][1][j];
                ecart = Math.abs(x - this.chemin[i][1][j]);
            } else {
                return proche;
            }
        }
        return proche;
    };

    /////////////////// METHODE GENERIQUE ///////////////////
    // Cette méthode retourne un entier aléatoire compris dans l'intervalle [min,max]. 
    // Elle est utilisée pour positionner les bonus de façon aléatoire sur la carte (jeu.js), ainsi que pour le choix des directions aléatoires pour les fantômes (personnages.js).

    this.entierAleatoire = function (min, max)
    {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }; 
};

// Création d'une nouvelle instance Positions.
var positions = new Positions();





