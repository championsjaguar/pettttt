var dog1, dog2, dog;
var database, food, foodCountRef, foods;
var fedTime, lastFed;
var feed, addFood, milk, foodStock;
function preload() {
  dog1 = loadImage("dogImg.png");
  dog2 = loadImage("dogImg1.png");
}

function setup() {
  createCanvas(800, 800);
  dog = createSprite(400, 600, 80, 80);
  milk = new Food();
  dog.addImage("normal", dog1);
  dog.addImage("happy", dog2);

  database = firebase.database();

  var foodCountRef = database.ref("FOOD");
  foodCountRef.on("value", readFood);
  dog.scale = 0.2;
  feed = createButton("FEED THE DOG");
  feed.position(820, 95);
  feed.mousePressed(feedDog);

  addFood = createButton("ADD FOOD");
  addFood.position(700, 95);
  addFood.mousePressed(addFoods);
}

function draw() {
  background("green");
  milk.display();
  fedTime = database.ref("FEEDTIME");
  fedTime.on("value", function (data) {
    lastFed = data.val();
  });

  text("lastfed : " + lastFed, 350, 30);

  drawSprites();
}

function readFood(data) {
  foods = data.val();
  milk.updateFoodStock(foods);
}

function addFoods() {
  foods++;

  database.ref("/").update({
    FOOD: foods,
  });
}

function feedDog() {
  dog.changeImage("happy", dog2);
  var currentStock = milk.getFoodStock();
  currentStock = currentStock - 1;
  milk.updateFoodStock(currentStock);

  database.ref("/").update({
    FOOD: milk.getFoodStock(),
    FEEDTIME: hour(),
  });
}
