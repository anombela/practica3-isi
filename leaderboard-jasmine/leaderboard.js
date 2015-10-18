// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players".

Players = new Meteor.Collection("players");

/**
 * Separate player logic into an own service singleton for better testability and reusability.
 * @type {{}}
 */
PlayersService = {
  getPlayerList: function () {
    var currentUserId = Meteor.userId();
    return Players.find({createdBy: currentUserId}, {sort: {score: -1, name: 1}});
  },
  getPlayer: function (playerId) {
    var currentUserId = Meteor.userId();
    return Players.findOne({_id: playerId, createdBy: currentUserId});
  },
  rewardPlayer: function (playerId) {

    Players.update(playerId, {$inc: {score: 5}});
    //Meteor.call('modifyPlayerScore', playerId, 5);
  },
  playersExist: function () {
    return Players.find().count() > 0;
  },
  generateRandomPlayers: function () {

    //var currentUserId = Meteor.userId();

    var names = ["Ada Lovelace",
                 "Grace Hopper",
                 "Marie Curie",
                 "Carl Friedrich Gauss",
                 "Nikola Tesla",
                 "Claude Shannon"];
    for (var i = 0; i < names.length; i++) {
      Players.insert({
        name: names[i], 
        score: this._randomScore()
      });
    }
  },
  _randomScore: function () {
    return Math.floor(Random.fraction() * 10) * 5
  },

  ///////////////////////////////
  newPlayer: function (playerName,score) {
    var currentUserId = Meteor.userId();
    Players.insert({
      name: playerName, 
      score: score, 
      createdBy: currentUserId
    });
  },

  decrementPlayer: function (playerId) {
    var currentUserId = Meteor.userId();
    Players.update(playerId, {$inc: {score: -5}});
  },
  removePlayer: function (playerId) {
    Players.remove(playerId);
  }
  ///////////////////////////////////
};

if (Meteor.isClient) {
  Template.leaderboard.helpers({
    players: function () {
      return PlayersService.getPlayerList();
    },

    selected_name: function () {
      var player = PlayersService.getPlayer(Session.get("selected_player"));
      return player && player.name;
    }
  });

  Template.leaderboard.events({
    'click input.inc': function () {
      PlayersService.rewardPlayer(Session.get("selected_player"));
    },
    /////////////////////////////////////
    'click input.decrement': function(){
      PlayersService.decrementPlayer(Session.get("selected_player"));
    },     

    'click input.remove': function(){
      PlayersService.removePlayer(Session.get('selected_player'));
    }
    /////////////////////////////////////
  });


  Template.player.helpers({
    selected: function () {
      return Session.equals("selected_player", this._id) ? "selected" : '';
    }
  });

  Template.player.events({
    'click': function () {
      Session.set("selected_player", this._id);
    }
  });

  //////////////////////////////////////////////////////////
  Template.addPlayerForm.events({


    'submit form': function(event){
      event.preventDefault(); 
      var playerName = event.target.playerName.value;
      var score = PlayersService._randomScore()
      PlayersService.newPlayer(playerName, score);
    }
  });
  ///////////////////////////////////////////////////////
}

// On server startup, create some players if the database is empty.
if (Meteor.isServer) {
  Meteor.startup(function () {
    if (!PlayersService.playersExist()) {
      PlayersService.generateRandomPlayers();
    }

    Meteor.publish('players', function(){
      return Players.find();
    });
  });

  /*Meteor.methods({
       

        'modifyPlayerScore': function(selectedPlayer, scoreValue){
            var currentUserId = Meteor.userId();
            Players.update( {_id: selectedPlayer, createdBy: currentUserId}, //solo podra cambiar el que tenga esa id
                                        {$inc: {score: scoreValue} });
        }
    });*/
}

