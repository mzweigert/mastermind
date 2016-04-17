/*jshint node: true, esnext: true */
// poniżej użylismy krótszej (niż na wykładzie) formy
// module.exports ==> exports
var _ = require('underscore');

exports.index = function (req, res) {
    req.session.puzzle = req.session.puzzle || req.app.get('puzzle');
    res.render('index', {
        title: 'Mastermind'
    });
};

exports.play = function (req, res) {
    var newGame = function () {
        var i, data = [],
            puzzle = req.session.puzzle;
        for (i = 0; i < puzzle.size; i += 1) {
            data.push(Math.floor(Math.random() * puzzle.dim));
        }
        req.session.puzzle.data = data;
        
        return {
            "retMsg": { size: puzzle.size, dim : puzzle.dim, max : puzzle.max }
        };
    };
    // poniższa linijka jest zbędna (przy założeniu, że
    // play zawsze używany będzie po index) – w końcowym
    // rozwiązaniu można ją usunąć.
    req.session.puzzle = req.session.puzzle || req.app.get('puzzle');
    /*
     * req.params[2] === wartość size
     * req.params[4] === wartość dim
     * req.params[6] === wartość max
     */
    
    if (req.params[2]) {
        req.session.puzzle.size = req.params[2];
    }
    if (req.params[4]) {
        req.session.puzzle.dim = req.params[4];
    }
    if (req.params[6]) {
        req.session.puzzle.max = req.params[6];
    }
         
    res.json(newGame());
};

exports.mark = function (req, res) {
    var markAnswer = function () {
        
        var move = req.params[0].split('/'),
            data = req.session.puzzle.data,
            movesToEnd,
            markRes = new Map();
           
        if(req.session.puzzle.max > 0)
            req.session.puzzle.max -= 1;
        
        movesToEnd = req.session.puzzle.max;
        move = move.slice(0, move.length - 1);
        move = move.map((el) => parseInt(el, 10));

		var sizeOfBlacks = _.size(_.filter(_.zip(move, data), (b) => b[0] === b[1]));
    
	   
        var countByMove = _.countBy(move, (n) =>n );
        var countByData = _.countBy(data, (n) =>n );
        var sizeOfWhites = _.reduce(_.mapObject(_.pick(countByMove, _.values(data)), (val, key) => Math.min(countByData[key], val)), (memo, num) => memo + num, 0) - sizeOfBlacks;
        console.log(data);
        console.log(movesToEnd);
        return {
            "retVal": { blackCount: sizeOfBlacks, whiteCount: sizeOfWhites, movesToEnd: movesToEnd}
        };
    };
    res.json(markAnswer());
};
