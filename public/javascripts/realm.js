var Realm = {

  resourceNodes: [],

  init: function () {
    Realm.generateResources();

    setInterval(function () {
      Realm.generateResources();
    }, 10000);
  },

  generateResources: function () {
    if (Realm.resourceNodes.length < 100) {
      var numberOfResourceNodesToGenerate = 100 - Realm.resourceNodes.length;
      console.log(Realm.resourceNodes.length + ' / 100 items ... generating ' + numberOfResourceNodesToGenerate +' items');
      for (var i = 0; i < numberOfResourceNodesToGenerate; i++) {
        Realm.resourceNodes.push(new ResourceNode());
      }
    }
  }
  
};
