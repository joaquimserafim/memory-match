/**
 * random function
 * @param length
 * @returns {number}
 */
function randNumbers (length) {
  return Math.floor(Math.random() * length);
}
/**
 * check an element exists in array
 * @param arr
 * @param n
 * @returns {Number}
 */
function exists (arr, n) {
  var ex = arr.filter(function (e) {
    return e === n;
  });
  // return true or false
  return ex.length;
}

/**
 * Badges class
 * @returns {Badges}
 * @constructor
 */
function Badges () {
  var self = this;
  // protection of constructor
  if (!(self instanceof Badges)) {
    return new Badges();
  }
}
/**
 * Badges - badges length
 * @returns int
 */
Badges.prototype.count = function () {
  var self = this;
  return self.badges.length;
};
/**
 * Badges - add new element
 * @param badges
 */
Badges.prototype.add = function (badges) {
  var self = this;
  self.badges = badges;
};
/**
 * Badges - find a element
 * @param badge
 * @returns {*}
 */
Badges.prototype.find = function (id) {
  var self = this;
  return self.badges[id];
};

/**
 * load the game structure
 * @param Request
 */
function Game (Request, game, counter, moves) {
  var self = this;
  // protection of constructor
  if (!(self instanceof Game)) {
    return new Game(Request);
  }
  // Request
  self.request = new Request();
  self.gameTable = game;
  self.counter = counter;
  self.moves = moves;
}

/**
 *
 * @param length
 * @param max
 * @returns {Array}
 */
Game.createRandomNumbs = function (length, max) {
  var random = [];
  // process random numbers
  while (random.length < max) {
    // get random number
    var n = randNumbers(length);
    // check the number is already in array
    var check = exists(random, n);
    // already exists, continue
    if (check) {
      continue;
    }
    // add twice because is 2 images by number
    random.push(n);
    random.push(n);
  }
  // disording
  var randomSort = random.sort(function (n) {
    return randNumbers(n);
  });
  // return
  return randomSort;
};

Game.prototype.load = function () {
  var self = this;

  // number of columns and the number of rows
  var cols = 6;
  var rows = 3;
  // will be to track the dnd of game
  var trackImgs = [];
  // register the number of moves
  var numberMoves = 0;
  // used to keep current clicked card
  var clicked = {};
  // used to get the game end
  var gaming = [];
  // endpoint with badges data
  var url = 'https://services.sapo.pt/Codebits/listbadges';
  // default image url
  var defaultImage = 'https://i2.wp.com/codebits.eu/logos/defaultavatar.jpg';
  // badges object
  var badges = new Badges();
  // remove H1
  self.gameTable.removeChild(self.gameTable.firstChild);

  /**
   * game logic
   */
  function checkImage () {
    // get id col-row-id
    var id = this.id.split('-');
    // find badge and get its data
    var info = badges.find(id[2]);
    // get img element
    var img = document.getElementById(this.id);
    // change image
    img.src = info.img;

    // game logic
    //check if a card was turned
    if (clicked && clicked.id) {
      // number of moves
      ++numberMoves;
      self.moves.value = numberMoves;
      // match cards
      if (clicked.info.id === info.id) {
        // reset
        clicked = {};
        // keep turned cards
        gaming.push(this.id);
        // find the elements and remove from track array
        // first the current clicked
        var index = trackImgs.indexOf(this.id);
        trackImgs.splice(index, 1);
        // second the old element clicked
        index = trackImgs.indexOf(clicked.id);
        trackImgs.splice(index, 1);
        // emit with the end of game
        if (!trackImgs.length) {
          // info player
          var msg = [
            'Congratulations!!!You have done ',
            self.moves.value,
            ' moves with the time ',
            self.counter.value
          ].join('');
          // alert
          window.alert(msg);
          // reload page
          window.location.reload();
        }
      } else {// ! then turn off
        setTimeout(function () {
          var oldImg = document.getElementById(clicked.id);
          // setting defualt image and enable onclick event
          img.src = oldImg.src = defaultImage;
          img.onclick = oldImg.onclick = checkImage;
          // reset
          clicked = {};
        }, 250);
      }
    } else {
      // keep info about the current clicked card
      clicked = {
        id: this.id,
        info: info
      };
    }
    // disable onclick event
    img.onclick = null;
  }

  // load data and create the game board
  self.request.load(url, function (status, ready, res) {
    // console.log(status, ready, res);
    // everthing is ok and loaded
    if (status === 200 && ready === 4) {
      // parse json
      var json = JSON.parse(res);
      // add into Badges object
      badges.add(json);
      // get random images - 9 only for this example
      var randomImages = Game.createRandomNumbs(badges.count(), cols * rows);
      // create table game
      // first the columns
      for (var x = 0; x < cols; x++) {
        // create column
        var col = document.createElement('div');
        // set row id
        col.id = 'col-'.concat(x.toString());
        col.className = 'div-col';
        // create rows
        for (var xx = 0; xx < rows; xx++) {
          // create row
          var row = document.createElement('div');
          // set row id
          row.id = 'row-'.concat(xx.toString());
          row.className = 'div-row';
          // create image element
          var img = document.createElement('img');
          // set image src
          img.src = defaultImage;
          // set image id
          var imgId = [
            x,
            xx,
            randomImages.splice(randNumbers(randomImages.length), 1)
          ].join('-');
          img.id = imgId;
          //
          trackImgs.push(imgId);
          // set image onlick event
          img.onclick = checkImage;
          // append image into row
          row.appendChild(img);
          // append to column
          col.appendChild(row);
        }
        // append to table game
        self.gameTable.appendChild(col);
      }
    }
  });
};