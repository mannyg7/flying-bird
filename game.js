let score = 0;
let highScore = 0;
let clicks = 0;
let lowestClicks = 0;
let time = 0;
let longestTime = 0;
var mouseClicked = false;
const gravity = 0.17;
const distance = 8;
var images = ["Images/bird.png", "Images/coin.png", "Images/building.png"];
var timeInterval;
var bird_img = new Image();
var coin_img = new Image();
var building_img = new Image();
var requestAnimation = window.requestAnimationFrame;
var bird;
var coin;
var building;

/*
Sets the variables to initial values. 
If the localStorage has the variables, sets the variables to those values.
*/
function setup() {
	score = 0;
	highScore = 0;
	clicks = 0;
	lowestClicks = 0;
	time = 0;
	longestTime = 0;
	mouseClicked = false;
	if (localStorage.getItem("highScore") != null) {
		highScore = localStorage.getItem("highScore");
	};
	if (localStorage.getItem("lowestClicks") != null) {
		lowestClicks = localStorage.getItem("lowestClicks");
	};
	if (localStorage.getItem("longestTime") != null) {
		longestTime = localStorage.getItem("longestTime");
	};
	timeInterval = setInterval(function updateTime() {
		time += 1;
	}, 1000);
	bird_img.src = images[0];
	coin_img.src = images[1];
	building_img.src = images[2];
	createObjects();
}

/*
Creates the functions required for 
the different objects used in the game. 
Each object has its own functions such as draw
or jump and own variables like x and y coordinates.
*/
function createObjects() {
	var c = canvas.getContext("2d");
	//Function for bird
	bird = function(x,y) {
		this.x = x;
		this.y = y;
		this.image = bird_img;
		this.velocity = 0;
		// Draws the bird image.
		this.draw = function() {
			c.drawImage(this.image, this.x, this.y);
		}
		// Defines the jumping behavior of bird.
		this.jump = function() {
			if(this.y + this.velocity + 85 > 500) {
				this.velocity = 0;
				this.y = 500 - 85;
			} else {
				this.velocity += gravity;
				this.y += this.velocity;
			}
		}
	}
	// Function for coin
	coin = function(x,y) {
		this.x = x;
		this.y = Math.floor(Math.random()*301) + 100;
		this.image = coin_img;
		// Draws the coin image at varying positions.
		this.draw = function() {
			if (this.x <= 0) {
				this.x = 1700;
				// Random y coordinate every time.
				this.y = Math.floor(Math.random()*301) + 100;
			} else {
				this.x = this.x - distance - Math.floor(time%1000) * .17;
			}
			c.drawImage(this.image, this.x, this.y);
		}
	}
	// Function for building.
	building = function(x,y) {
		this.x = x;
		this.y = Math.floor(Math.random() * 171) + 230;
		this.image = building_img;
		// Draws the buildings of varying sizes.
		this.draw = function() {
			if (this.x <= 0) {
				this.x = 1500;
				this.y = Math.floor(Math.random() * 171) + 230;
			} else {
				// Adjusts how quickly the building approches based on time.
				this.x = this.x - distance - Math.floor(time%1000) * .17;
			}
			c.drawImage(this.image, this.x, this.y);
		}
	}
}

/*
The function for how the game works. 
Allows for the moving graphics as well
as keeping track of the different metrics.
*/
function game() {
	var c = canvas.getContext("2d");
	var bird_char = new bird(100, 400);
	var building_char = new building(1500, 0);
	var coin_char = new coin(1700, 0);
	// Repaints the canvas with the different objects.
	function canvasupdate() {
		if (score > highScore) {
			highScore = score;
		};
		repaint();
		coin_char.draw();
		building_char.draw();
		bird_char.draw();
		c.fillRect(0, 480, 1000, 20);
		if (bird_char.y <= 100) {
			if (mouseClicked) {
				mouseClicked = false;
			};
		} else {
			if (mouseClicked) {
				bird_char.velocity = -6;
				mouseClicked = false;
			};
		}
		bird_char.jump();
		collision();
	}
	requestAnimation(canvasupdate);
	// Repaints the text on the canvas.
	function repaint() {
		c.clearRect(0,0, canvas.width, canvas.height);
		c.font = "15px Georgia";
		c.strokeText("high score: " + highScore, 750, 50);
		c.strokeText("your score: " + score, 750, 70);
		c.strokeText("lowest clicks: " + lowestClicks, 900, 50);
		c.strokeText("your clicks: " + clicks, 900, 70);
		c.strokeText("time: " + time, 20, 70);
		c.strokeText("longest time: " + longestTime, 20, 50);
	}
	// Checks if the bird collided with a building or coin.
	function collision() {
		if (bird_char.y >= coin_char.y - 65 && bird_char.y <= coin_char.y + 65 && coin_char.x > 100 && coin_char.x < 205) {
			score += 10;
			coin_char.x = -50;
		}
		if(bird_char.y >= building_char.y - 65 && building_char.x > 100 && building_char.x < 205) {
			// Updates localStorage
			if (score > highScore) {
				highScore = score;
			};
			if (lowestClicks == 0 || (clicks != 0 && clicks < lowestClicks)) {
				lowestClicks = clicks;
			};
			if (longestTime < time) {
				longestTime = time;
			};
			localStorage.setItem("highScore", highScore);
			localStorage.setItem("lowestClicks", lowestClicks);
			localStorage.setItem("longestTime", longestTime);
			clearInterval(timeInterval);
			repaint();
			c.fillRect(0, 480, 1000, 20);
			building_char.x = 1500;
			document.getElementById("button").style.display = "block";
			alert("Game Over");
		} else {
			// Request to repaint
			requestAnimation(canvasupdate);
		}
	}
}

/*
Called upon when the play again button is pressed.
Restarts the game and goes to initial settings.
*/
function restart() {
	document.getElementById("button").style.display = "none";
	setup();
	game();
}

window.onload = function() {
	var canvas = document.getElementById("canvas");
	canvas.width = 1000;
	canvas.height = 500;
	document.addEventListener('click', function(e) {
		mouseClicked = true;
		clicks += 1;
	});
	setup();
	game();
}
