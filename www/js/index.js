function changePage( name, fn ) {
  return function(e) {
    e.preventDefault();
    showDiv( name );
    if (fn) fn();
  }
}

function showDiv(name) {
  var target = $("#pola");
  var html = $("#"+name).clone();
  target.empty();
  target.append( html );
  html.show();
}

function shuffle(o) {
  var i = 0;
  while( i < o.length ) {
    var j = parseInt(Math.random() * o.length);
    var x = o[i];
    o[i] = o[j];
    o[j] = x;
    i++;
  }
};

var app = {
    currentIndex: 0,
    maxIndex: 10,
    currentName: '',
    essai: 0,
    score: 0,
    checkInProgress: false,
    names: [
     'Angelina Jolie',
     'Johnny Depp',
     'Lady Gaga',
     'Jennifer Aniston',
     'Bruce Willis',
     'Ryan Gosling',
     'Leonardo Dicaprio',
     'Jennifer Lopez',
     'Patrick Dempsey',
     'Marion Cotillard',
     'Guillaume Canet',
     'Céline Dion',
     'Johnny Halliday',
     'Jean Dujardin',
     'Rihanna',
     'Cameron Diaz',
     'Justin Timberlake',
     'Christophe Mae'
    ],
    photos: [],
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        if ( typeof(device) == 'undefined' ) this.onDeviceReady();
    },
    showNextPhoto: function() {
      if ( this.currentIndex == 10 ) {
        showDiv('fin');
        $("#points p").html( this.score );
        $("#texte b").html( this.score );
        return;
      }
      var file = this.photos.pop();
      console.log("file = "+file);
      this.currentName = this.names[file];
      console.log("name = " + this.currentName);
      file = parseInt(file) + 1; // because pictures start at 1
      if ( file < 10 ) file = "0" + file;
      this.currentIndex += 1;
      $("#photo img").attr("src","photos/"+file+"_03.jpg");
      $("#avancement p").first().html( this.currentIndex + "/10" );
      $("#info").hide();
      $("#reponse").val("");
      $("#reponse")[0].disabled="";
      this.essai = 0;
    },
    checkAnswer: function() {
      if ( this.checkInProgress ) return;
      this.checkInProgress = true;
      
      var proposition = $("#reponse").val();
      $("#reponse")[0].disabled="disabled";
      var ok = ( proposition == this.currentName );
      this.essai += 1;
      $("#info")
        .show()
        .find("p")
        .attr("class", ok ? "vrai" : "faux" )
        .find("span")
        .html( ok ? "Bonne réponse !" : "Mauvaise réponse. ("+this.essai+")");
      window.setTimeout( function() {
        if ( ok ) app.score += 1;
        if ( ok || app.essai >= 3 ) app.showNextPhoto();
        else {
          $("#info").hide();
        }
        $("#reponse")[0].disabled="";
        app.checkInProgress = false;
        }, 2500 
      );
    },
    onDeviceReady: function() {
      // var photos = this.photos;
        $( function() {
          for( i in app.names ) {
            app.photos.push(i);
          }
          shuffle( app.photos );
          $("#chargement").hide();
          $("#je_joue").show();
          $("#je_joue").click( changePage('jeu', function() {
            $("#next").first().click( function(e) {
              e.preventDefault();
              if ( app.checkInProgress ) return;
              app.showNextPhoto();
            });
            $("#valider").first().click( function(e) {
              e.preventDefault();
              app.checkAnswer();
            });
            app.showNextPhoto();
          }));
        });
    }
};
