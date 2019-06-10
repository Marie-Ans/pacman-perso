'use strict';
      
    var Jeu = function(){
        this.ctx = window.document.getElementById('canvas').getContext('2d');
        this.pause = false;
        var monJeu = this;

        /////////////////////// METHODE : INITIALISATION DU SCORING ////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////
        
        //Cette méthode est appelée dans la méthode this.initialiserJeu(). Elle permet de réinitialiser l'affichage du panneau de scoring.
        this.initialiserScore = function(){
                window.document.getElementById('vies').style.left = '0px';
                window.document.getElementById('competences').style.color = 'rgb(242, 227, 164)';
                window.document.getElementById('parcours').style.color = 'rgb(242, 227, 164)';
                window.document.getElementById('formation').style.color = 'rgb(242, 227, 164)';
                window.document.getElementById('croquettes').style.width = '0px';
                window.document.getElementById('resultat').style.display = 'none';
        };


        //////////////// METHODES : INITIALISATION ET DESSIN DES CROQUETTES ////////////////
        ////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////

        //Cette méthode est une "sous-méthode" utilisée dans la méthode qui suit (this.initialiserCroquettes). Elle permet de spécifier les emplacements ou NE PAS dessiner de croquettes à l'initialisation du jeu.
        this.ignorerCroquette = function(x,y){
            if((x === 200 && ( y === 100 || y === 125 || y === 400 || y === 425))
            || (x === 300 && ( y === 100 || y === 125 || y === 400 || y === 425))){
                return true;
            }
        };

        //Cette méthode est appelée dans la méthode this.initialiserJeu(). Elle permet de copier le tableau positions.chemin (voir le fichier positions.js) et de l'affecter à la propriété croquettes de Jeu. (La duplication est nécessaire car à chaque fois que Pacman mange une croquette, 0 est affecté à la représentation de l'abcisse dans le tableau this.croquettes). Pour éviter les doubles rangées de croquettes dans les "couloirs larges", on appelle la fonction ignorerCroquette().
        //this.croquette[i][0] = ordonnées des croquettes
        //this.croquettes[i][1] = tableaux des abcisses pour l'ordonnée au rang i.
        this.initialiserCroquettes = function(){
            var croquettesDupliquees = [];
            var ordonnee;
            
            for(var i=0;i<positions.chemin.length;i++){
            ordonnee = positions.chemin[i][0];
            var abcissesCroquettes=[];
            for (var j = 0;j<positions.chemin[i][1].length;j++){
                if(!(this.ignorerCroquette(positions.chemin[i][1][j], positions.chemin[i][0]))){
                    abcissesCroquettes.push(positions.chemin[i][1][j]);
                }
            }
            croquettesDupliquees.push([ordonnee,abcissesCroquettes]);
            }
            return croquettesDupliquees;
        };

        // Cette méthode est appelée dans la méthode this.initialiserJeu() et dans la méthode this.jouer(). Elle parcourt le tableau this.croquettes, et dessine chacune des croquettes non mangées (c'est à dire dont la représentation de l'abcisse est différente de 0).
        this.dessinerCroquettes = function(){
        for(var i=0; i<this.croquettes.length; i++){
            for (var j=0; j<this.croquettes[i][1].length;j++){
                if(this.croquettes[i][1][j]!=0){
                    var xc = this.croquettes[i][1][j];
                    var yc = this.croquettes[i][0];
                    this.ctx.beginPath();
                    this.ctx.fillStyle = 'rgb(242, 227, 164)';
                    this.ctx.arc(xc, yc, 2, 0, Math.PI*2, true);
                    this.ctx.fill();
                    this.ctx.closePath(); 
                }
            }
        }
        };

        //////////////////// METHODES : INITIALISATION ET DESSIN DES BONUS //////////////////
        /////////////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////////////////

        // Cette méthode est appelée dans la méthode this.initialiserJeu(). Elle permet de créer 3 objets Bonus (voir fichier bonus.js) dont les coordonnées sont distinctes et "suffisamment" éloignées, dont le type est unique pour chaque bonus ('competences', 'formation' ou 'parcours pro'). Les coordonnées de chaque bonus sont choisies de façon aléatoire dans le tableau positions.chemin (voir le fichier positions.js). 
        this.initialiserBonus = function(){
            var bonusInitialises = [];
            var stockOrdonnes = [];
            var compteur = 0;
            var trouveAbs = false;
            while (compteur < 3){
                //Recherche d'une ordonnée aléatoire
                var indiceOrd = positions.entierAleatoire(0, positions.chemin.length-1);
                //Si des bonus ont déjà été créés, on test si l'ordonnée choisie alétoirement n'est ni égale, ni trop proche de celle(s) dejà choisie(s).
                var ordChemin = positions.chemin[indiceOrd][0];
                if (stockOrdonnes.length>0) {
                    var i=0;
                    while(i<stockOrdonnes.length){
                        if(Math.abs(stockOrdonnes[i]-ordChemin)<=100){
                            indiceOrd = positions.entierAleatoire(0, positions.chemin.length-1);
                            ordChemin = positions.chemin[indiceOrd][0];
                            i = 0;
                        } else {
                            i++;
                        } 
                    }
                }
                var abcisses = positions.chemin[indiceOrd][1];
                while(trouveAbs === false){
                    //Recherche d'une abcisse pour le bonus en fonction de l'ordonne choisie
                    var indiceAbs = positions.entierAleatoire(0, abcisses.length-1);
                    var absChemin = abcisses[indiceAbs];
                    //console.log('absChemin :'+absChemin);
                    //On reboucle si le hasard a placé le bonus sur un personnage.
                    if((ordChemin === 25 && (absChemin === 25 || absChemin === 50 || absChemin === 450 || absChemin ===475))
                    || (ordChemin === 500 && (absChemin === 25 || absChemin === 50 || absChemin === 450 || absChemin === 475))
                    ){
                        trouveAbs = false;
                    } else {
                        trouveAbs = true;
                    }
                }
                trouveAbs = false;//On réinitialise à false pour le prochain tour de compteur.
                var ordBonus = ordChemin - 20;
                var absBonus = absChemin - 15;
                switch(compteur){
                    case 0:
                        var type='competences';
                    break;
                    case 1:
                        var type='parcours';
                    break;
                    case 2:
                        var type='formation';
                    break;               
                }
                //console.log('Bonus n°'+compteur+' : abcisse = '+absBonus+', ordonnee = '+ordBonus+' et type = '+type);
                var bonusChoisi = new Bonus(absBonus, ordBonus, type)
                bonusInitialises[compteur] = bonusChoisi; 
                compteur++;          
                stockOrdonnes.push(ordChemin);
            }
            return bonusInitialises;
        };
        
        // Cette méthode est appelée dans la méthode this.initialiserJeu(). Elle permet d'appeler la fonction dessinerUnBonus (voir fichier bonus.js) sur chacun des objets Bonus contenus dans this.bonus dont la représentation de l'abcisse est différente de 0 (c'est à dire non mangé par Pacman).
         this.dessinerLesBonus = function(){
            for (var i = 0; i<this.bonus.length;i++){
                if(this.bonus[i].x!=0){
                    this.bonus[i].dessinerUnBonus(this.ctx);
                }
            }
        };

        ///////////////////////// METHODES : DESSINS DES PERSONNAGES ////////////////////////
        /////////////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////////////////

        // Cette méthode est appelée dans la méthode this.initialiserJeu() et dans la méthode this.jouer(). En fonction de la direction de pacman, et de son état (perdu s'il n'a plus de vie, ou gagné si toutes les croquettes sont mangées), la méthode appelle l'une des méthodes de dessin de l'objet Pacman (voir fichier personnages.js). Par ailleurs, c'est dans cette méthode également que l'on appelle les méthodes de Pacman concernant les collisions avec les croquettes (pacman.mangeCroquette) et les bonus (pacman.mangeBonus).
        this.dessinerPacman = function(){
            if(monJeu.pacman.vie === 0){
                monJeu.pacman.dessinerPacmanGameOver(monJeu.ctx); 
            } else {
                if (monJeu.pacman.croc>=146){
                    monJeu.pacman.dessinerPacmanGagnant(monJeu.ctx); 
                } else {
                    monJeu.pacman.mangeCroquette(monJeu.croquettes);
                    monJeu.pacman.mangeBonus(monJeu.bonus);
                    switch (monJeu.pacman.direction) {
                            
                        case 'd' : // FLeche droite
                            monJeu.pacman.dessinerPacManDroite(monJeu.ctx);
                        break;
        
                        case 'g' : //fleche gauche
                            monJeu.pacman.dessinerPacManGauche(monJeu.ctx);
                        break;
        
                        case 'h' : //fleche haut
                            monJeu.pacman.dessinerPacManHaut(monJeu.ctx);
                        break;
        
                        case 'b' : //fleche bas
                            monJeu.pacman.dessinerPacManBas(monJeu.ctx);
                        break;
        
                        default :
                            monJeu.pacman.dessinerPacManDroite(monJeu.ctx);
                    }
                }
            }
        };

        // Cette méthode est appelée dans la méthode this.initialiserJeu() et dans la méthode this.jouer(). Pour chacun des objets Fantome contenus dans monJeu, elle appelle la méthode dessinerFantome (voir fichier personnage.js).
        this.dessinerFantomes = function(){
            monJeu.pinky.dessinerFantome(monJeu.ctx);
            monJeu.rookie.dessinerFantome(monJeu.ctx);
            monJeu.purply.dessinerFantome(monJeu.ctx);
        };

        //Cette méthode est appelée après le chargement du document, et à chaque fois que l'utilisateur clique sur le bouton Jouer (voir fichier jouer.js). Elle appelle toutes les méthodes d'initialisation et de dessin précédemments déclarées. Par ailleurs, la méthode fait en sorte que le jeu ne soit plus en pause et que l'alerte Pause ne soit pas affichée lorsqu'on clique sur Jouer(si la partie précédente était en pause).
        this.initialiserJeu = function(){
            this.initialiserScore();
            this.croquettes = this.initialiserCroquettes();
            this.bonus = this.initialiserBonus();
            this.pacman = new Pacman(25,500,5);
            this.pinky = new Fantome(475, 25, '#fc73d9','g', 'Pinky');
            this.rookie = new Fantome(25, 25, '#69b6eb','d', 'Rookie');
            this.purply = new Fantome(475, 500, '#8b00a5', 'g', 'Purply');
            this.fantomes = [this.pinky,this.rookie,this.purply];

            this.ctx.clearRect(0, 0, 500, 525);
            this.dessinerCroquettes();
            this.dessinerLesBonus();
            this.dessinerPacman();
            this.dessinerFantomes();

            this.pause = false;
            this.afficherPause();
        };


        //////////////////////////// METHODES : MESSAGES D'ALERTE ///////////////////////////
        /////////////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////////////////
        
        // Cette méthode permet d'afficher une alerte par dessus le jeu si le jeu est en pause, ou de ne pas l'afficher si le jeu n'est plus en pause. 
        this.afficherPause = function(){
            var pause = window.document.getElementById('pause');
            var hauteurPause= parseFloat(window.getComputedStyle(pause, null).getPropertyValue('height'));
            
            var hauteurEcran = window.innerHeight;
            var positionPause = (hauteurEcran/2)-(hauteurPause/2);
            pause.style.top = positionPause+'px';

            if(monJeu.pause){
                //console.log('Condition true : monJeu.pause = :'+monJeu.pause);
                pause.style.display = 'block';
            } else {
                //console.log('Condition false : monJeu.pause = :'+monJeu.pause);
                pause.style.display = 'none';
            }
        };

        // Cette méthode permet  d'afficher un message d'alerte si la taille de l'écran n'est pas adaptée au jeu. 
        this.surveillerAffichage = function(){
            var alerte = window.document.getElementById('alerte');
            var hauteurAlerte = parseFloat(window.getComputedStyle(alerte, null).getPropertyValue('height'));
            
            var largeurEcran = window.innerWidth;
            var hauteurEcran = window.innerHeight;
            
            var positionAlerte = (hauteurEcran/2)-(hauteurAlerte/2);
    
            if(largeurEcran<=900){
                alerte.style.display = 'block';
                alerte.style.top = positionAlerte+'px';
            } else {
                alerte.style.display = 'none';
            }           
        }; 


        ////////////// METHODES : DIRECTIONS / COLLISION PACMAN FANTOME / JOUER //////////////
        /////////////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////////////////
        
        // Cette méthode est exécutée depuis le fichier principal jouer.js. Si le joueur appuie sur entrer, le jeu est mis en pause/ou reprise du jeu. Si le joueur appuie sur une flèche du clavier, la direction correspondante est affectée à Pacman s'il est possible de se déplacer dans cette direction. 
        //NB : la méthode replacementPacman (voir personnages.js) permet de "remettre pacman dans le droit chemin" lorsque celui-ci passe d'un direction horizontale à verticale et inversement.
        //NB : monJeu.pacman.stop = false =>quand Pacman touche un fantome, true est affecté à sa propriété stop (il n'avance plus). quand on appuie sur une touche directionnelle, il avance à nouveau (donc monJeu.pacman.stop = false)
        this.ecouterDirection = function(){
            window.addEventListener('keydown', function(e){
                var code = e.keyCode;
                
                switch (code){

                    case 13 : //ENTRER = mettre en pause
                        e.preventDefault();
                        if(monJeu.pause){
                            monJeu.pause = false; 
                            monJeu.afficherPause(); 
                        } else {
                            monJeu.pause = true; 
                            monJeu.afficherPause();  
                        }
                                           
                        break;

                    case 32 : // Barre espace = pour éviter le rechargement de la page
                        e.preventDefault();
                    break;
  
                    case 39 : // FLeche droite
                        monJeu.pacman.stop = false;
                        e.preventDefault();
                        if(positions.deplacementAutorise(monJeu.pacman.x,monJeu.pacman.y,'p','d')){
                            monJeu.pacman.direction = 'd';
                            if (monJeu.pacman.direction != monJeu.pacman.directionPrecedente){
                                monJeu.pacman.replacementPacman();
                            }
                        }
                    break;

                    case 37 : //fleche gauche
                        monJeu.pacman.stop = false;
                        e.preventDefault();
                        if(positions.deplacementAutorise(monJeu.pacman.x,monJeu.pacman.y,'p','g')){
                            monJeu.pacman.direction = 'g';
                            if (monJeu.pacman.direction != monJeu.pacman.directionPrecedente){
                                monJeu.pacman.replacementPacman();
                            }
                        }
                    break;

                    case 38 : //fleche haut
                        monJeu.pacman.stop = false;
                        e.preventDefault();
                        if(positions.deplacementAutorise(monJeu.pacman.x,monJeu.pacman.y,'p','h')){
                            monJeu.pacman.direction = 'h';
                            if (monJeu.pacman.direction != monJeu.pacman.directionPrecedente){
                                monJeu.pacman.replacementPacman();
                            }     
                        }
                    break;

                    case 40 : //fleche bas
                        monJeu.pacman.stop = false;
                        e.preventDefault();
                        if(positions.deplacementAutorise(monJeu.pacman.x,monJeu.pacman.y,'p','b')){
                            monJeu.pacman.direction = 'b';
                            if (monJeu.pacman.direction != monJeu.pacman.directionPrecedente){
                                monJeu.pacman.replacementPacman();
                            }   
                        }
                    break;
                }
            });
        };

        // Cette méthode est appelée par la méthode Jeu.jouer() ci-dessous. Elle permet de vérifier avant chaque déplacement, si pacman entre en collision avec un fantome. Si tel est le cas, le fantome concerné prend la direction oppposée à celle qu'il avait avant de rencontrer Pacman. Le reste s'exécute dans la fonction Jeu.jouer()
        this.rencontrePacmanFantome = function(){
            for (var i = 0; i<monJeu.fantomes.length; i++){
                if (Math.pow((monJeu.fantomes[i].x - monJeu.pacman.x),2)+(Math.pow((monJeu.fantomes[i].y - monJeu.pacman.y),2)) <= 1600){
                    if(monJeu.pacman.intouchable === false){
                        switch(monJeu.fantomes[i].direction){
                            case 'd':
                                monJeu.fantomes[i].direction = 'g';
                            break;
                            case 'g':
                                monJeu.fantomes[i].direction = 'd';
                            break;
                            case 'h':
                                monJeu.fantomes[i].direction = 'b';
                            break;
                            case 'b':
                                monJeu.fantomes[i].direction = 'h';
                            break;
                        }

                    }
                    return true;
                }
            }
            return false;
        };
        

        //La fonction Jeu.jouer() de Jeu, est appelée toutes les 60ms ( setInterval dans le fichier jouer.js). Elle exécute les  méthodes "dessiner" et "avancer" des différentes composantes du jeu tant que Pacman a encore des vies, tant qu'il reste des croquettes à manger et si le jeu n'est pas en pause.
        //Si pacman n'a plus de vies, le jeu s'arrête et le texte vous avez perdu s'affiche
        //Si pacman mange toutes les croquettes, le jeu s'arrête, le texte vous avez gagné s'affiche, et le bouton "Voir le CV" apparaît.
        this.jouer = function(){
            monJeu.ctx.clearRect(0, 0, 500, 525);
            monJeu.dessinerCroquettes();
            monJeu.dessinerLesBonus();
            monJeu.dessinerPacman();
            monJeu.dessinerFantomes();

            console.log('monJeu.pacman.croc :'+monJeu.pacman.croc);

            //Plus de vie : la partie est perdue
            if(monJeu.pacman.vie===0){
                window.document.getElementById('resultat').style.display = 'block';
                window.document.querySelector('#resultat p').innerHTML = 'Vous avez perdu...';
                window.document.querySelector('#resultat div').style.display = 'none';
            }

            //Plus de croquettes : la partie est gagnée
            if(monJeu.pacman.croc>=146){
                window.document.getElementById('resultat').style.display = 'block';
                window.document.querySelector('#resultat p').innerHTML = 'Vous avez gagné!';
                window.document.querySelector('#resultat div').style.display = 'block';
            }

            //Pacman a des vies, il reste des croquettes, le jeu n'est pas en pause : la partie continue. 
            //Si Pacman entre en collision avec un fantome (et qu'il n'est pas deja blessé), il clignote et ne peut pas être blessé à nouveau pendant 1.5s.(=>appel de méthodes de l'objet Pacman dans personnages.js). Qu'il soit deja blessé ou non, il s'arrete quand il entre en collision avec le fantome : monJeu.pacman.stop = true
            if(monJeu.pacman.vie > 0 && monJeu.pacman.croc<146 && !monJeu.pause){
                if(monJeu.rencontrePacmanFantome() && monJeu.pacman.intouchable === false){
                        monJeu.pacman.stop = true;
                        monJeu.pacman.estBlesse();
                        monJeu.pacman.indice_clignotement = setInterval(monJeu.pacman.clignoter,150);
                }

                monJeu.pacman.avancerPacman();
                monJeu.pinky.avancerFantome(monJeu.fantomes, monJeu.pacman);
                monJeu.rookie.avancerFantome(monJeu.fantomes, monJeu.pacman);
                monJeu.purply.avancerFantome(monJeu.fantomes, monJeu.pacman);
            } 
        };
    };
