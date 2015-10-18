//////////////
// he traido el beforeeach  y aftereach de  el fichero pruebalogin
///////////////

beforeEach(function(done){
    Meteor.loginWithPassword("pepe@gmail.com", "mipassword", function(err){
      Tracker.afterFlush(done);
    });
  });
  

var selectGraceHopper = function (callback) {
  Session.set("selected_player", Players.findOne({name: "Grace Hopper"})._id);
  if (callback) {
    Deps.afterFlush(callback);
  }
};

var unselectPlayer = function () {
  Session.set("selected_player", null);
};

describe("Selecting Grace Hopper", function () {
  beforeEach(function (done) {
    Meteor.autorun(function (c) {
      var grace = Players.findOne({name: "Grace Hopper"});
      if (grace) {
        c.stop();
        selectGraceHopper(done);
      }
    })
  });

  it("should show Grace above the give points button", function () {
    expect($("div.details > div.name").html()).toEqual("Grace Hopper");
  });


  it("should highlight Grace's name", function () {
    var parentDiv = $("span.name:contains(Grace Hopper)").parent();
    expect(parentDiv.hasClass("selected")).toBe(true);
  });
});

describe("Point Assignment", function () {
  beforeEach(function (done) {
    selectGraceHopper(done);
  });





  it("should give a player 5 points when he is selected and the button is pressed", function () {
    var graceInitialPoints = Players.findOne({name: "Grace Hopper"}).score;
    $(".inc").click();
    expect(Players.findOne({name: "Grace Hopper"}).score).toBe(graceInitialPoints + 5);
  });




  it("should decrement a player 5 points when he is selected and the button is pressed", function () {
    var graceInitialPoints = Players.findOne({name: "Grace Hopper"}).score;
    $(".decrement").click();
    expect(Players.findOne({name: "Grace Hopper"}).score).toBe(graceInitialPoints - 5);
  });
});

describe("Player Ordering", function () {
  it("should result in a list where the first player has as many or more points than the second player", function () {
    var players = PlayersService.getPlayerList().fetch();
    expect(players[0].score >= players[1].score).toBe(true);
  });
});

describe("Pruebas con login y logout", function(){
  afterEach(function(done){
    Meteor.logout(function() {
      Tracker.afterFlush(done);
    });
  });

  it("se logeará un usuario", function(){
    var user = Meteor.user();
    expect(user).not.toBe(null);
  });

  it("después de login añade players", function(){
    var players = Players.find().count()
    $("#form").click();
    expect(Players.find().count()).toBe(players+1);
     
  }); 
  
});
