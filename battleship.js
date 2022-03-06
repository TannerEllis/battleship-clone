// The displayMessage method takes a string message and displays it in the message area

const view = {
    
    displayMessage: function(message){
        var messageArea = document.getElementById('messageArea');
        messageArea.innerHTML = message
    },
    
    displayHit: function(location){
        var cell = document.getElementById(location);
        cell.setAttribute('class', 'hit')
    },
    
    displayMiss: function(location){
        var cell = document.getElementById(location);
        cell.setAttribute('class', 'miss')
    }
    
}

const model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,
    ships:[{locations: [0, 0, 0], hits: ['', '', '']},
           {locations: [0, 0, 0], hits: ['', '', '']},
           {locations: [0, 0, 0], hits: ['', '', '']}],

    fire: function(guess){

        for(let i = 0; i < this.numShips; i++) {
            let ship = this.ships[i]
            let index = ship.locations.indexOf(guess)
            if(index >= 0) {
                ship.hits[index] = 'hit'
                console.log(model.ships)
                view.displayHit(guess)
                view.displayMessage('HIT!')
                if(this.isSunk(ship)) {
                    view.displayMessage('You sank my battleship!')
                    this.shipsSunk++
                }
                return true
            }
        }
        view.displayMiss(guess)
        view.displayMessage('You missed.')
        return false
    },
    isSunk: function(ship){
        for (let i = 0; i < this.shipLength; i++) {
            if(ship.hits[i] !== 'hit'){
                return false
            }
        }
        return true
    },

    generateShipLocations: function() {
        let locations;
        for (let i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip()
            } while (this.collision(locations))
            this.ships[i].locations = locations
        }
    },

    generateShip: function(){
        let direction = Math.floor(Math.random() * 2)
        let row;
        let column;
        if(direction === 1) {
            row = Math.floor(Math.random() * this.boardSize)
            column = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1))
        } else {
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1))
            column = Math.floor(Math.random() * this.boardSize)
        }

        let newShipLocations = []
        for(let i = 0; i < this.shipLength; i++) {
            if(direction === 1 ) {
               newShipLocations.push(row + '' + (column + i))
            } else {
                newShipLocations.push((row + i) + '' + column)
            }
        }
        return newShipLocations
    },
    
    collision: function(locations){
        for(let i = 0; i < this.numShips; i++) {
            let ship = this.ships[i]
            for(let j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true
                }
            }
        }
        return false
    }
}

function parseGuess(guess){
    let alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G']

 if(guess === null || guess.length !== 2) {
     alert('Oops, please enter a letter and a number on the board.')
 } else {
     let firstChar = guess.charAt(0)
     let row = alphabet.indexOf(firstChar)
     let column = guess.charAt(1)
     if(isNaN(row) || isNaN(column)) {
         alert('Oops! That isn\'t on the board!')
     } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
         alert('Oops! That\'s off the board!')
     } else {
         return row + column
     }
   }
   return null
}

console.log(model.ships)

const controller = {
    guesses: 0,
    processGuess: function(guess) {
         let location = parseGuess(guess)
         if (location) {
             this.guesses++
             let hit = model.fire(location)
             if(hit && model.shipsSunk === model.numShips) {
                 view.displayMessage('You sank all my battleships, in ' + this.guesses + ' guesses.')
             }
         }
    }
}


function handleFireButton(){
    let guessInput = document.getElementById('guessInput')
    let guess = guessInput.value.toUpperCase()

    controller.processGuess(guess)
    guessInput.value = ''
}

window.onload = init

function init(){
    let fireButton = document.getElementById('fireButton')
    fireButton.onclick = handleFireButton
    let guessInput = document.getElementById('guessInput')
    guessInput.onkeypress = handleKeyPress
    model.generateShipLocations()
}

function handleKeyPress(e){
    let fireButton = document.getElementById('fireButton')
    if(e.keyCode === 13){
        fireButton.click()
        return false
    }
}


