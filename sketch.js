var dog, sadDog, happyDog;
var foodObj;
var foodS, foodStock;
var feedTime, lastFeed, feed, addFood;


function preload() {
  sadDog = loadImage("Images/Dog.png");
  happyDog = loadImage("Images/happy dog.png");
}

function setup() {
  database = firebase.database();
  createCanvas(1000, 400);

  foodObj = new Food();

  foodStock = database.ref("Food")
  foodStock.on("value", readStock);

  dog = createSprite(800, 200, 150, 150);
  dog.addImage("sad",sadDog);
  dog.addImage("happy",happyDog);
  dog.scale = 0.15;

  feed = createButton("Feed The Dog");
  feed.position(700, 95);
  feed.mousePressed(feedDog);

  addFood = createButton(" Add Food");
  addFood.position(800, 95);
  addFood.mousePressed(addFoods);

}

function draw() {
  background(46, 139, 87);

  foodObj.display();

  feedTime = database.ref("FeedTime");
  feedTime.on("value", function (data) {
    lastFeed = data.val();
  });


  fill(255, 255, 254);
  textSize(15);
  if (lastFeed >= 12) {
    text("Last Feed: " + lastFeed % 12 + "PM", 350, 30);
  } else if (lastFeed == 0) {
    text("Last Feed: 12 AM", 350, 30);
  } else {
    text("Last Feed: " + lastFeed + "AM", 350, 30);
  }


  drawSprites();
}

//function to read food Stock
function readStock(data) {
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog() {
  dog.changeImage("happy",happyDog);
  foodObj.updateFoodStock(foodObj.getFoodStock() - 1);
  database.ref('/').update({
    Food: foodObj.getFoodStock(),
    FeedTime: hour()
  })
}

//function to add food in stock
function addFoods() {
  foodS++;
  database.ref('/').update({
    Food: foodS
  })
}
