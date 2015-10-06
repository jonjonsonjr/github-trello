var express = require('express');
var util = require('util');
var Trello = require('trello');
var initGitHubMiddleware = require('github-webhook-middleware');

var trello = new Trello(process.env.TRELLO_KEY, process.env.TRELLO_TOKEN);
var gh = initGitHubMiddleware({
  secret: process.env.GITHUB_SECRET
});

var list_id = process.env.TRELLO_LIST_ID;

if (!list_id) {
  var list_name = process.env.TRELLO_LIST_NAME;

  if (!list_name) {
    console.log('Need at least the name of the list');
    process.exit(1);
  }

  var board_short_link = process.env.TRELLO_BOARD_SHORT_LINK;

  trello.getBoards('me', function (err, boards) {
    if (board_short_link) {
      var board = boards.filter(function (b) {
        return b.shortLink === board_short_link;
      })[0];

      if (board) {
        boards = [board];
      }
    }

    var board_ids = boards.map(function (b) {
      return b.id;
    });

    searchBoard(board_ids.pop());

    function searchBoard(id) {
      if (!id) {
        console.log('No list with that name found.');
        process.exit(1);
      }

      trello.getListsOnBoard(id, function (err, lists) {
        var list = lists.filter(function (l) {
          return l.name === list_name;
        })[0];

        if (list) {
          list_id = list.id;
          console.log('Found list id:', list_id);
          startServer();
        } else {
          searchBoard(board_ids.pop());
        }
      });
    }
  });
} else {
  startServer();
}

function startServer() {
  var app = express();

  app.set('port', (process.env.PORT || 5000));

  app.post('/', gh, function (req, res) {
    var commits = req.body.commits;
    var commit = req.body.head_commit;
    var hash = commit.id;
    var short_hash = hash.substring(0, 10);
    var pusher = req.body.pusher.name;
    var message = commit.message;
    var compare = req.body.compare;
    var size = req.body.size;

    var desc_format = '%s pushed %s\n\n%s\n\n%s';

    var name = hash;

    var description = util.format(desc_format, pusher, hash, message, compare);

    console.log(description);

    if (list_id) {
      addCard(res, name, description, list_id);
    }
  });

  app.listen(app.get('port'), function () {
    console.log('listening on port', app.get('port'));
  });
}

function addCard(res, name, description, list_id) {
  trello.addCard(name, description, list_id, function (err, card) {
    if (err) {
      res.status(500).send(err);
      return console.log('could not add card:', err);
    }

    console.log('added card:', card);
    res.status(200).send(card);
  });
}
