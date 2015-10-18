if (process.env.IS_MIRROR) {
  Meteor.methods({
    'loadFixtures': function(){
      console.log('Loading default fixtures');
      // TODO: add your fixtures here
      //añado esto y con createdby
      ///////////////////////////////////////////////////
      Accounts.createUser({
        email: 'pepe@gmail.com',
        password: 'mipassword'
      });

      var user = Meteor.users.findOne();

      console.log("user id",user._id);

      var names = ["Ada Lovelace",
                 "Grace Hopper",
                 "Marie Curie",
                 "Carl Friedrich Gauss",
                 "Nikola Tesla",
                 "Claude Shannon"];
    for (var i = 0; i < names.length; i++) {
      Players.insert({
        name: names[i], 
        score: PlayersService._randomScore(),
        createdBy: user._id
      });
    }
      
      //////////////////////////////////////////////

      
      console.log('Finished loading default fixtures');
    },
    'clearDB': function(){
      console.log('Clear DB');
      var collectionsRemoved = 0;
      var db = Meteor.users.find()._mongo.db;
      db.collections(function (err, collections) {
        var appCollections = _.reject(collections, function (col) {
          return col.collectionName.indexOf('velocity') === 0 ||
            col.collectionName === 'system.indexes';
        });
        _.each(appCollections, function (appCollection) {
          appCollection.remove(function (e) {
            if (e) {
              console.error('Failed removing collection', e);
              fut.return('fail: ' + e);
            }
            collectionsRemoved++;
            console.log('Removed collection');
            if (appCollections.length === collectionsRemoved) {
              console.log('Finished resetting database');
            }
}); });
});
      console.log('Finished clearing');
    }
}); }