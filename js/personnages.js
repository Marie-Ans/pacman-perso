'use strict';

/*
  Personnage est le prototype de Pacman et de Fantomes. J'ai fait le choix suivant : toutes les méthodes utilisées par Pacman et les Fantomes, ainsi que les méthodes utilisées uniquement par les fantomes sont dans le prototype (comme il y a trois fantomes, cela évite de recréer les méthodes à chaque objet créé). 
  Comme un seul objet Pacman est créé, les méthodes utilisées uniquement par Pacman sont des méthodes de l'objet Pacman.
*/

var Personnage = function(){

    ///////////// RENCONTRES ENTRE PERSONNAGES /////////////
    ////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////

    // Cette méthode retourne vrai si un fantome rencontre un autre fantome ou pacman. Comme le rayon de Pacman est plus petit que celui du fantome, la distance est testée est différente selon le personnage passé en paramètre.
    // Elle est utilisée dans la méthode rencontrerFantomes et avancerFantome.
    this.rencontreFantome = function(autrePerso){
        if(autrePerso.type === 'f'){
            var distance = 40; 
        } else {
            var distance = 35;
        }
        switch (this.direction) {
                    
            case 'd' : // direction droite de this
                if(autrePerso.x - this.x === distance && Math.abs(this.y-autrePerso.y)<= distance){
                    return true;
                }
            break;

            case 'g' : // direction gauche de this
                if(this.x - autrePerso.x === distance && Math.abs(this.y-autrePerso.y)<= distance){
                    return true;
                }
            break;

            case 'h' : // direction haut de this
                if(this.y - autrePerso.y === distance && Math.abs(this.x-autrePerso.x)<= distance){
                    return true;
                }
            break;

            case 'b' : // direction haut de this
                if(autrePerso.y - this.y === distance && Math.abs(this.x-autrePerso.x)<= distance){
                    return true;
                }
            break;
        }
        
    };

    // Cette méthode retourne vrai si le fantome qui appelle la méthode entre en collision avec l'un des deux autres fantomes.
    // Cette méthode est appelée dans la méthode avancerFantome, un peu plus loin dans ce même prototype.
    this.rencontrerFantomes = function(lesFantomes){
        for (var i = 0; i<lesFantomes.length; i++){
            if(this.nom != lesFantomes[i].nom){
                if(this.rencontreFantome(lesFantomes[i])){
                    return true;
                }
            }
        }
        return false;
    };


   
    //////////////// DESSINS DES FANTOMES //////////////////
    ////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////

    // Dessiner un fantome, selon sa couleur et ses coordonnées.
    this.dessinerFantome = function(ctx){
        var x = this.x;
        var y = this.y;

        //Le corps
        ctx.beginPath();
        ctx.fillStyle = this.couleur;
        ctx.arc(x,y,20,0,Math.PI,true);
        ctx.moveTo(x+20, y);
        ctx.lineTo(x+20, y+20);
        ctx.lineTo(x+15,y+15);
        ctx.lineTo(x+10, y+20);
        ctx.lineTo(x+5,y+15);
        ctx.lineTo(x, y+20);
        ctx.lineTo(x-5,y+15);
        ctx.lineTo(x-10, y+20);
        ctx.lineTo(x-15,y+15);
        ctx.lineTo(x-20, y+20);
        ctx.lineTo(x-20, y);
        ctx.fill();
        ctx.closePath();

        // Oeil gauche sans la pupille
        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.arc(x-10,y,5,0,2*Math.PI,true);
        ctx.fill();
        ctx.closePath();

        // Pupille de l'oeil gauche
        ctx.beginPath();
        ctx.fillStyle = this.couleur;
        ctx.arc(x-10,y,2,0,2*Math.PI,true);
        ctx.fill();
        ctx.closePath();

        // Oeil droit sans la pupille
        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.arc(x+10,y,5,0,2*Math.PI,true);
        ctx.fill();
        ctx.closePath();

        // Pupille de l'oeil droit
        ctx.beginPath();
        ctx.fillStyle = this.couleur;
        ctx.arc(x+10,y,2,0,2*Math.PI,true);
        ctx.fill();
        ctx.closePath();

    };


    ////////////// DEPLACEMENTS DES FANTOMES ///////////////
    ////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////

    //Cette méthode permet de choisir une direction aléatoire parmi les 4 directions. Si la direction choisie est possible (pas de mur), elle est retournée par la méthode, sinon on continue à choisir une direction de façon aléatoire.
    // Cette méthode est appelée dans la méthode avancerFantome, juste après celle-ci.
    this.donneDirectionAleatoire = function(){
        var directions = ['d','g','h','b'];
        var indiceAleatoire = positions.entierAleatoire(0,3);

        for(var i=0;i<directions.length;i++){
            if(indiceAleatoire!=directions.length){
                if(positions.deplacementAutorise(this.x,this.y,'f',directions[indiceAleatoire])){
                    return directions[indiceAleatoire];
                } else {
                    indiceAleatoire++;
                }
            } else {
                indiceAleatoire = 0;
                if(positions.deplacementAutorise(this.x,this.y,'f',directions[indiceAleatoire])){
                    return directions[indiceAleatoire];
                } else {
                    indiceAleatoire++;
                }
            }
        }
    };

   
    //Cette méthode permet de faire avancer un fantome, en tenant compte des murs et de la position des autres fantomes.
    //Lorsque le fantome croise un fantome ou pacman, il fait demi tour. Lorsqu'il croise un mur ou s'il est sur un rond point, il prend une direction aléatoire. 
    this.avancerFantome = function(lesFantomes,lePacman){
        if (this.rencontrerFantomes(lesFantomes) || this.rencontreFantome(lePacman)){
            switch (this.direction) {          
                case 'd' : // direction droite
                    //this.x-=5;
                    this.direction='g';
                break;
                case 'g' : //direction gauche
                    //this.x+=5;
                    this.direction='d';
                break;
                case 'h' : //direction haut
                    //this.y+=5;
                    this.direction='b';
                break;
                case 'b' : //direction bas
                    //this.y-=5;
                    this.direction='h';
                break;
            }
        } else {
            if(positions.estSurRondPoint(this.x, this.y)){
                this.direction = this.donneDirectionAleatoire();
            }
            if(positions.deplacementAutorise(this.x, this.y, 'f', this.direction)){
                switch (this.direction) {
                    case 'd' : 
                        this.x+=5;
                        if(this.x === 475 && ((this.y >= 115 && this.y <= 135 ) || (this.y >= 215 && this.y <= 235 ) || (this.y >= 390 && this.y <= 410))){
                            this.x = 25;
                        } 
                    break;
                    case 'g' : 
                        this.x-=5;
                        if(this.x === 25 && ((this.y >= 115 && this.y <= 135 ) || (this.y >= 215 && this.y <= 235 ) || (this.y >= 390 && this.y <= 410))){
                            this.x = 475;
                        } 
                    break;
                    case 'h' : 
                        this.y-=5;
                    break;
                    case 'b' : 
                        this.y+=5;
                    break;
                }
            } else {
                this.direction = this.donneDirectionAleatoire();
            }
        } 
    };

};

// Déclaration de l'instance de l'objet qui servira de prototype aux fonctions Constructeurs Pacman et Fantome.
var protoPerso = new Personnage();

///////////////// OBJET PACMAN //////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
var Pacman = function(x,y,bouche){
    this.x = x; // abcisse de la position de pacman
    this.y = y; // ordonnée de la position de pacman
    this.couleur = 'rgb(239, 243, 2)'; // couleur jaune de pacman (vire au rouge quand il est blessé ou mort)
    this.clignotement = 0; //utilisé dans la méthode this.clignoter() pour le nombre de clignotements lorsque pacman est blessé
    this.indice_clignotement; //utilisé dans la méthode this.clignoter() pour arrêter le setInterval
    this.stop = false; //vrai quand pacman est touché, et arrête le mouvement de pacman. redevient false quand appui sur flèche au clavier
    this.intouchable = false; // si vrai, pacman ne perd pas de vie quand le fantome le touche (intouchabilité pendant 1500ms après avoir été touché)
    this.direction; //direction courante de pacman (d:droite g:gauche h:haut b: bas)
    this.directionPrecedente = 'd'; //la direction précédente à la direction courante de pacman, permet de replacer correctement pacman lorsqu'il change d'axe (horiz/vert)
    this.nom = 'Pacman'; //inutile pour le fonctionnement, mais m'a servi pour le debug
    this.bouche = bouche; //permet de savoir avec quelle ouverture de bouche il faut dessiner pacman
    this.vie = 3; //nombre de vies de pacman
    this.bonus = 0; //nombre de bonus mangés
    this.croc = 0; //nombre de croquettes mangées
    var monPacman = this;
    
    // Dessiner Pacman de droite, avec une ouverture de bouche variable
    // Cette méthode est appelée dans la fonction Jeu.dessinerPacman() dans jeu.js.
    this.dessinerPacManDroite = function(ctx){
        ctx.beginPath();
        ctx.fillStyle = this.couleur;
        switch (this.bouche){
            case 0 :
                ctx.arc(this.x, this.y, 15, Math.PI/12, -Math.PI/12, false);
                this.bouche = 1;
            break;
            case 1 :
            case 17 :
                ctx.arc(this.x, this.y, 15, Math.PI/11, -Math.PI/11, false);
                if(this.bouche === 1){this.bouche = 2;}
                else{this.bouche = 0;}
            break;
            case 2 :
            case 16 :
                ctx.arc(this.x, this.y, 15, Math.PI/10, -Math.PI/10, false);
                if(this.bouche === 2){this.bouche = 3;}
                else{this.bouche = 17;}
            break;
            case 3 :
            case 15 :
                ctx.arc(this.x, this.y, 15, Math.PI/9, -Math.PI/9, false);
                if(this.bouche === 3){this.bouche = 4;}
                else{this.bouche = 16;}
            break;
            case 4 :
            case 14 :
                ctx.arc(this.x, this.y, 15, Math.PI/8, -Math.PI/8, false);
                if(this.bouche === 4){this.bouche = 5;}
                else{this.bouche = 15;}
            break;
            case 5 :
            case 13 :
                ctx.arc(this.x, this.y, 15, Math.PI/7, -Math.PI/7, false);
                if(this.bouche === 5){this.bouche = 6;}
                else{this.bouche = 14;}
            break;
            case 6 :
            case 12 :
                ctx.arc(this.x, this.y, 15, Math.PI/6, -Math.PI/6, false);
                if(this.bouche === 6){this.bouche = 7;}
                else{this.bouche = 13;}
            break;
            case 7 :
            case 11 :
                ctx.arc(this.x, this.y, 15, Math.PI/5, -Math.PI/5, false);
                if(this.bouche === 7){this.bouche = 8;}
                else{this.bouche = 12;}
            break;
            case 8 :
            case 10 :
                ctx.arc(this.x, this.y, 15, Math.PI/4, -Math.PI/4, false);
                if(this.bouche === 8){this.bouche = 9;}
                else{this.bouche = 11;}
            break;
            case 9 :
                ctx.arc(this.x, this.y, 15, Math.PI/3, -Math.PI/3, false);
                this.bouche = 10;
            break;
        }
        ctx.lineTo(this.x-10, this.y);
        ctx.fill();
        ctx.closePath();
    };

    // Dessiner Pacman de gauche, avec une ouverture de bouche variable
    // Cette méthode est appelée dans la fonction Jeu.dessinerPacman() dans jeu.js.
    this.dessinerPacManGauche = function(ctx){
        ctx.beginPath();
        ctx.fillStyle = this.couleur;
        switch (this.bouche){
            case 0 :
                ctx.arc(this.x, this.y, 15, (Math.PI/12)*11, -(Math.PI/12)*11, true);
                this.bouche = 1;
            break;
            case 1 :
            case 17 :
                ctx.arc(this.x, this.y, 15, (Math.PI/11)*10, -(Math.PI/11)*10, true);
                if(this.bouche === 1){this.bouche = 2;}
                else{this.bouche = 0;}
            break;
            case 2 :
            case 16 :
                ctx.arc(this.x, this.y, 15, (Math.PI/10)*9, -(Math.PI/10)*9, true);
                if(this.bouche === 2){this.bouche = 3;}
                else{this.bouche = 17;}
            break;
            case 3 :
            case 15 :
                ctx.arc(this.x, this.y, 15, (Math.PI/9)*8, -(Math.PI/9)*8, true);
                if(this.bouche === 3){this.bouche = 4;}
                else{this.bouche = 16;}
            break;
            case 4 :
            case 14 :
                ctx.arc(this.x, this.y, 15, (Math.PI/8)*7, -(Math.PI/8)*7, true);
                if(this.bouche === 4){this.bouche = 5;}
                else{this.bouche = 15;}
            break;
            case 5 :
            case 13 :
                ctx.arc(this.x, this.y, 15, (Math.PI/7)*6, -(Math.PI/7)*6, true);
                if(this.bouche === 5){this.bouche = 6;}
                else{this.bouche = 14;}
            break;
            case 6 :
            case 12 :
                ctx.arc(this.x, this.y, 15, (Math.PI/6)*5, -(Math.PI/6)*5, true);
                if(this.bouche === 6){this.bouche = 7;}
                else{this.bouche = 13;}
            break;
            case 7 :
            case 11 :
                ctx.arc(this.x, this.y, 15, (Math.PI/5)*4, -(Math.PI/5)*4, true);
                if(this.bouche === 7){this.bouche = 8;}
                else{this.bouche = 12;}
            break;
            case 8 :
            case 10 :
                ctx.arc(this.x, this.y, 15, (Math.PI/4)*3, -(Math.PI/4)*3, true);
                if(this.bouche === 8){this.bouche = 9;}
                else{this.bouche = 11;}
            break;
            case 9 :
                ctx.arc(this.x, this.y, 15, (Math.PI/3)*2, -(Math.PI/3)*2, true);
                this.bouche = 10;
            break;
        }
        ctx.lineTo(this.x+10, this.y);
        ctx.fill();
        ctx.closePath();
    };

    // Dessiner Pacman vers le bas, avec une ouverture de bouche variable
    // Cette méthode est appelée dans la fonction Jeu.dessinerPacman() dans jeu.js.
    this.dessinerPacManBas = function(ctx){
        ctx.beginPath();
        ctx.fillStyle = this.couleur;
        switch (this.bouche){
            case 0 :
                ctx.arc(this.x, this.y, 15, (Math.PI/5)*12, (Math.PI/12)*7, true);
                this.bouche = 1;
            break;
            case 1 :
            case 17 :
            ctx.arc(this.x, this.y, 15, (Math.PI/22)*9, (Math.PI/22)*13, true);
                if(this.bouche === 1){this.bouche = 2;}
                else{this.bouche = 0;}
            break;
            case 2 :
            case 16 :
                ctx.arc(this.x, this.y, 15, (Math.PI/5)*2, (Math.PI/5)*3, true);
                if(this.bouche === 2){this.bouche = 3;}
                else{this.bouche = 17;}
            break;
            case 3 :
            case 15 :
                ctx.arc(this.x, this.y, 15, (Math.PI/18)*7, (Math.PI/18)*11, true);
                if(this.bouche === 3){this.bouche = 4;}
                else{this.bouche = 16;}
            break;
            case 4 :
            case 14 :
                ctx.arc(this.x, this.y, 15, (Math.PI/8)*3, (Math.PI/8)*5, true);
                if(this.bouche === 4){this.bouche = 5;}
                else{this.bouche = 15;}
            break;
            case 5 :
            case 13 :
                ctx.arc(this.x, this.y, 15, (Math.PI/14)*5, (Math.PI/14)*9, true);
                if(this.bouche === 5){this.bouche = 6;}
                else{this.bouche = 14;}
            break;
            case 6 :
            case 12 :
                ctx.arc(this.x, this.y, 15, (Math.PI/3), (Math.PI/3)*2, true);
                if(this.bouche === 6){this.bouche = 7;}
            else{this.bouche = 13;}
            break;
            case 7 :
            case 11 :
                ctx.arc(this.x, this.y, 15, (Math.PI/10)*3, (Math.PI/10)*7, true);
                if(this.bouche === 7){this.bouche = 8;}
            else{this.bouche = 12;}
            break;
            case 8 :
            case 10 :
                ctx.arc(this.x, this.y, 15, (Math.PI/4), (Math.PI/4)*3, true);
                if(this.bouche === 8){this.bouche = 9;}
            else{this.bouche = 11;}
            break;
            case 9 :
                ctx.arc(this.x, this.y, 15, (Math.PI/6), (Math.PI/6)*5, true);
                this.bouche = 10;
            break;
        }
        ctx.lineTo(this.x, this.y-10);
        ctx.fill();
        ctx.closePath();
    };

    // Dessiner Pacman vers le haut, avec une ouverture de bouche variable
    // Cette méthode est appelée dans la fonction Jeu.dessinerPacman() dans jeu.js.
    this.dessinerPacManHaut = function(ctx){
        ctx.beginPath();
        ctx.fillStyle = this.couleur;
        switch (this.bouche){
            case 0 :
                ctx.arc(this.x, this.y, 15, -(Math.PI/5)*12, -(Math.PI/12)*7, false);
                this.bouche = 1;
            break;
            case 1 :
            case 17 :
            ctx.arc(this.x, this.y, 15, -(Math.PI/22)*9, -(Math.PI/22)*13, false);
                if(this.bouche === 1){this.bouche = 2;}
                else{this.bouche = 0;}
            break;
            case 2 :
            case 16 :
                ctx.arc(this.x, this.y, 15, -(Math.PI/5)*2, -(Math.PI/5)*3, false);
                if(this.bouche === 2){this.bouche = 3;}
                else{this.bouche = 17;}
            break;
            case 3 :
            case 15 :
                ctx.arc(this.x, this.y, 15, -(Math.PI/18)*7, -(Math.PI/18)*11, false);
                if(this.bouche === 3){this.bouche = 4;}
                else{this.bouche = 16;}
            break;
            case 4 :
            case 14 :
                ctx.arc(this.x, this.y, 15, -(Math.PI/8)*3, -(Math.PI/8)*5, false);
                if(this.bouche === 4){this.bouche = 5;}
                else{this.bouche = 15;}
            break;
            case 5 :
            case 13 :
                ctx.arc(this.x, this.y, 15, -(Math.PI/14)*5, -(Math.PI/14)*9, false);
                if(this.bouche === 5){this.bouche = 6;}
                else{this.bouche = 14;}
            break;
            case 6 :
            case 12 :
                ctx.arc(this.x, this.y, 15, -(Math.PI/3), -(Math.PI/3)*2, false);
                if(this.bouche === 6){this.bouche = 7;}
            else{this.bouche = 13;}
            break;
            case 7 :
            case 11 :
                ctx.arc(this.x, this.y, 15, -(Math.PI/10)*3, -(Math.PI/10)*7, false);
                if(this.bouche === 7){this.bouche = 8;}
            else{this.bouche = 12;}
            break;
            case 8 :
            case 10 :
                ctx.arc(this.x, this.y, 15, -(Math.PI/4), -(Math.PI/4)*3, false);
                if(this.bouche === 8){this.bouche = 9;}
            else{this.bouche = 11;}
            break;
            case 9 :
                ctx.arc(this.x, this.y, 15, -(Math.PI/6), -(Math.PI/6)*5, false);
                this.bouche = 10;
            break;
        }
        ctx.lineTo(this.x, this.y+10);
        ctx.fill();
        ctx.closePath();
    };

    // Dessiner Pacman lorsqu'il n'a plus de vie et que la partie est perdue.
    // Cette méthode est appelée dans la fonction Jeu.dessinerPacman() dans jeu.js.
    this.dessinerPacmanGameOver = function(ctx){

        ctx.fillStyle = '#B80024';
        ctx.strokeStyle = '#000';

        ctx.beginPath();
        ctx.arc(this.x, this.y, 15, 0, 2*Math.PI, false);
        ctx.moveTo(this.x-10,this.y+7.5);
        ctx.lineTo(this.x-7.5,this.y+5);
        ctx.lineTo(this.x-5,this.y+7.5);
        ctx.lineTo(this.x-2.5,this.y+5);
        ctx.lineTo(this.x,this.y+7.5);
        ctx.lineTo(this.x+2.5,this.y+5);
        ctx.lineTo(this.x+5,this.y+7.5);
        ctx.lineTo(this.x+7.5,this.y+5);
        ctx.lineTo(this.x+10,this.y+7.5);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.moveTo(this.x-7.5,this.y-7.5);
        ctx.lineTo(this.x-5,this.y-2.5);
        ctx.lineTo(this.x-2.5,this.y-7.5);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.moveTo(this.x+2.5,this.y-7.5);
        ctx.lineTo(this.x+5,this.y-2.5);
        ctx.lineTo(this.x+7.5,this.y-7.5);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();                
    };

    // Dessiner Pacman lorsque la partie est gagnée.
    // Cette méthode est appelée dans la fonction Jeu.dessinerPacman() dans jeu.js.
    this.dessinerPacmanGagnant = function(ctx){

        ctx.fillStyle = this.couleur;
        ctx.strokeStyle = '#000';

        ctx.beginPath();
        ctx.arc(this.x, this.y, 15, 0, 2*Math.PI, false);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(this.x, this.y+4, 7.5, 0, Math.PI, false);
        ctx.stroke();
        ctx.closePath();

        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(this.x-5, this.y-7.5, 1, 0, 2*Math.PI, false);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(this.x+5, this.y-7.5, 1, 0, 2*Math.PI, false);
        ctx.fill();
        ctx.closePath();
            
    };

    //Cette méthode est appelée dans la méthode d'après (mangeCroquette), pour faire évoluer l'affichage de la jauge de croquettes mangées par PACMAN.
    this.afficheCrocMangees = function(){
        var divCroc =  window.document.getElementById('croquettes');
        var largeurCroc = parseFloat(window.getComputedStyle(divCroc,null).getPropertyValue('width'));
        divCroc.style.width = (largeurCroc + 2) + 'px';
    }

    // Collision avec une croquette : quand pacman "mange" une croquette, pacman.croc est incrémenté, 0 est affecté à la représentation de l'abcisse de la croquette dans le tableau monJeu.croquettes (passé en paramètre) afin qu'elle ne soit pas redessinée, et on appelle la fonction afficheCrocMangees pour augmenter le niveau de croquettes mangées dans l'affichage du score.
    // Cette méthode est appelée dans la fonction Jeu.dessinerPacman() dans jeu.js.
    this.mangeCroquette = function(croquettes){
        var x = this.x;
        var y = this.y;
        for(var i=0; i<croquettes.length;i++){
            if((croquettes[i][0] - y < 10) && (croquettes[i][0] - y > - 10)){
                for(var j=0; j<croquettes[i][1].length;j++){
                    if((croquettes[i][1][j] - x <= 15) && (croquettes[i][1][j] - x >= -15)){
                        croquettes[i][1][j] = 0;
                        this.croc++;
                        this.afficheCrocMangees();
                    } 
                }
            }
        }
    };

    // Collision avec un bonus : quand pacman "mange" un bonus, on incrémente le nombre de bonus trouvé par pacman, on affecte 0 à l'abcisse du bonus dans le tableau jeu.bonus passé en paramètre pour qu'il ne soit pas redessiné, et on affiche le texte du bonus dans le scoring.
    // Cette méthode est appelée dans la fonction Jeu.dessinerPacman() dans jeu.js.
    this.mangeBonus = function(bonus){
        var x = this.x;
        var y = this.y;
        for(var i=0; i<bonus.length;i++){
            if(//dir d - dir b - dir g - dir h
                    ((Math.abs(bonus[i].x - x) <= 10) && (y >= bonus[i].y - 5) && (y <= bonus[i].y + 45))
                ||  ((Math.abs(bonus[i].y - y) <= 10) && (x >= bonus[i].x - 5) && (x <= bonus[i].x + 45))
                ||  ((Math.abs(x - bonus[i].x) <= 40) && (y >= bonus[i].y - 5) && (y <= bonus[i].y + 40) )
                ||  ((Math.abs(y - bonus[i].y) <= 50) && (x >= bonus[i].x - 5) && (x <= bonus[i].x + 40))
            ){
                // console.log('x : '+x);
                // console.log('y : '+y);
                // console.log('bonus[i].x :'+bonus[i].x);
                // console.log('bonus[i].y :'+bonus[i].y);
                bonus[i].x = 0;
                this.bonus++;                      
                window.document.getElementById(bonus[i].type).style.color = '#000';
            }
        }
    };


    // Cette méthode permet de faire avancer Pacman dans la direction correspondant à la flèche du clavier appuyée. Si pacman rencontre un mur, il s'arrête, sauf dans le cas où il se situe à l'un des endroits où le mur comporte des flèches et dans ce cas, il réapparaît de l'autre côté du terrain.
    // Cette méthode est appelée dans la fonction Jeu.jouer() dans jeu.js (c'est dans la méthode Jeu.jouer() que la collision avec les fantomes est gérée)
    this.avancerPacman = function(){
        if(!(this.stop)){
            switch (this.direction) {
                        
                case 'd' : // FLeche droite
                    if(positions.deplacementAutorise(this.x,this.y,'p','d')) {
                        this.x+=5;
                    }
                    if(this.x === 475 && (this.y === 125 || this.y === 225 || this.y === 400)){
                        this.x = 25;
                    } 
                break;
    
                case 'g' : //fleche gauche
                    if(positions.deplacementAutorise(this.x,this.y,'p','g'))
                    {
                        this.x-=5;
                    }
                    if(this.x === 25 && (this.y === 125 || this.y === 225 || this.y === 400)){
                        this.x = 475;
                    } 
                break;
    
                case 'h' : //fleche haut
                    if(positions.deplacementAutorise(this.x,this.y,'p','h'))
                    {
                        this.y-=5;
                    }
                break;
    
                case 'b' : //fleche bas
                    if(positions.deplacementAutorise(this.x,this.y,'p','b'))
                   {
                        this.y+=5;
                    }
                break;
    
            }
        }
    };
    
    // Cette méthode permet de replacer pacman dans le droit chemin ("bonne ordonnée et bonne abcisse) lorsqu'il tourne, afin de donner un peu de souplesse au joueur lorqu'il change de direction.
    // Cette méthode est appelée dans la fonction Jeu.ecouterDirection dans jeu.js.
    this.replacementPacman = function(){
        if(this.direction === 'd' || this.direction === 'g'){
            this.y = positions.replacementOrdonnee(this.y);
        } else {
            this.x = positions.replacementAbcisse(this.x, this.y, this.direction);
        }
        this.directionPrecedente = this.direction;
    };

    
    // Cette méthode est appelée dans la méthode jouer(), du fichier jeu.js, lorsque Pacman ente en collision avec un des fantomes.
    // Il perd une vie, devient intouchable (pdt 1.5 seconde, voir méthode suivante), et une vie est enlevée dans le scoring.
    this.estBlesse = function(){
        this.vie--;
        this.intouchable = true;

        var mesVies = window.document.getElementById('vies');
        var styleGauche = parseFloat(window.getComputedStyle(window.document.getElementById('vies'),null).getPropertyValue('left'));
        mesVies.style.left = (styleGauche-40)+'px';
    };

     // Cette méthode est appelée dans la méthode jouer(), du fichier jeu.js, lorsque Pacman ente en collision avec un des fantomes. Elle s'exécute toutes les 150ms, 10 fois. Elle permet de faire clignoter Pacman pour signaler qu'il est blessé.  
    this.clignoter = function(){
        if(monPacman.clignotement === 10){
            monPacman.couleur = 'rgb(239, 243, 2)';
            monPacman.intouchable = false;
            clearInterval(monPacman.indice_clignotement);
            monPacman.clignotement = 0;
        } else {
            if(monPacman.couleur === 'rgb(239, 243, 2)'){
                monPacman.couleur = 'red';
            } else {
                monPacman.couleur = 'rgb(239, 243, 2)';
            }
            monPacman.clignotement++;
        }
    };
};

//Déclaration du prototype de Pacman, instancié ligne 232.
Pacman.prototype = protoPerso;



///////////////// OBJET FANTOME//////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////

var Fantome = function(x, y, couleur, direction, nom){
    this.x = x; // abcisse de la position du fantome
    this.y = y; // ordonnee de la position du fantome
    this.couleur = couleur; //couleur du fantome
    this.direction = direction; //direction courante du fantome
    this.nom = nom; //nom du fantome, inutile pour le fonctionnement mais m'a servi pour le debug
}

//Déclaration du prototype de Fantome, instancié ligne 232.
Fantome.prototype = protoPerso;


        

