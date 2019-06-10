'use strict';

///////////////////////// BONUS //////////////////////////////
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////

// L'objet Bonus a trois propriétés : x son abcisse, y son ordonnée et type (soit parcours, soit compétence, soit formation), et une seule méthode dessinerBonus.
// Les 3 objets bonus sont générés à chaque initialisation du jeu (dane jeu.js), chacun avec des coordonnées aléatoires et un des trois types.
// La méthode dessinerUnBonus est appelée par la méthode Jeu.dessinerLesBonus()

var Bonus = function(x,y,type){
    this.x = x;
    this.y = y;
    this.type = type;

    this.dessinerUnBonus = function(ctx){
        ctx.beginPath();
        ctx.fillStyle = 'rgb(242, 227, 164)';
        ctx.strokeStyle = '#FF554F';
        ctx.moveTo(x, y);
        ctx.lineTo(x+30, y);
        ctx.lineTo(x+30, y+40);
        ctx.lineTo(x, y+40);
        ctx.lineTo(x, y);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        //dessiner l'icone Pacman dans le bonus
        var xp = x+15;
        var yp = y+10;

        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.moveTo(xp, yp);
        ctx.arc(xp, yp, 8, Math.PI/6, -Math.PI/6, false);
        ctx.lineTo(xp-2, yp);
        ctx.fill();
        ctx.closePath();

        //dessiner les trois traits
        var xl1 = x+5;
        var yl1 = y+25;

        ctx.beginPath();
        ctx.strokeStyle = '#FF554F';
        ctx.moveTo(xl1, yl1);
        ctx.lineTo(xl1+20, yl1);
        ctx.stroke();
        ctx.closePath();

        var xl2 = x+5;
        var yl2 = y+30;

        ctx.beginPath();
        ctx.strokeStyle = '#FF554F';
        ctx.moveTo(xl2, yl2);
        ctx.lineTo(xl2+20, yl2);
        ctx.stroke();
        ctx.closePath();

        var xl3 = x+5;
        var yl3 = y+35;

        ctx.beginPath();
        ctx.strokeStyle = '#FF554F';
        ctx.moveTo(xl3, yl3);
        ctx.lineTo(xl3+20, yl3);
        ctx.stroke();
        ctx.closePath();

    };
};

