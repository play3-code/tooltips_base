let geodata;
let treeData;

let backgroundImg;

let bounds = {
  left: 8.20782,
  top: 47.094669,
  right: 8.365691,
  bottom: 47.024504,
};

let colorScale = d3
  .scaleLinear()
  .domain([0, 50])
  .range(["rgba(255,0,0,0.5)", "rgba(255,255,0,0.5)"]);

// https://github.com/d3/d3-quadtree
const quadtree = d3.quadtree();

let highlightObj = null;

function preload() {
  geodata = loadJSON("lucerne-trees.json");
  backgroundImg = loadImage("tree_background.png");
}

function setup() {
  createCanvas(900, 650);

  treeData = geodata.features;

  quadtree
    .x(function (d) {
      return d.geometry.coordinates[0];
    })
    .y(function (d) {
      return d.geometry.coordinates[1];
    })
    .addAll(treeData);

  textSize(24);
  noLoop();
}

function draw() {
  image(backgroundImg, 0, 0, width, height);

  if (highlightObj) {
    let lat = highlightObj.geometry.coordinates[1];
    let lon = highlightObj.geometry.coordinates[0];
    let x = map(lon, bounds.left, bounds.right, 0, width);
    let y = map(lat, bounds.top, bounds.bottom, 0, height);
    noFill();
    stroke("springgreen");
    strokeWeight(2);
    ellipse(x, y, 20, 20);
    strokeWeight(1);
    ellipse(x, y, 2, 2);

    noStroke();
    fill("white");
    let label = highlightObj.properties.BAUMHOEHE;
    if (label == null) {
      label = "";
    }

    text("Baumalter: " + label + " Jahre", x + 10, y - 20);
  }
}

function mouseMoved() {
  let lon = map(mouseX, 0, width, bounds.left, bounds.right);
  let lat = map(mouseY, 0, height, bounds.top, bounds.bottom);

  let obj = quadtree.find(lon, lat);

  highlightObj = obj;
  redraw();
}

function keyTyped() {
  saveCanvas("tree_background", "png");
}

function drawTrees() {
  for (let i = 0; i < treeData.length; i++) {
    let treeObject = treeData[i];
    let geometry = treeObject.geometry;
    let properties = treeObject.properties;
    // console.log(properties);
    let coordinates = geometry.coordinates;
    let lat = coordinates[1];
    let lon = coordinates[0];

    let x = map(lon, bounds.left, bounds.right, 0, width);
    let y = map(lat, bounds.top, bounds.bottom, 0, height);

    noStroke();
    fill(255, 5);
    ellipse(x, y, 10, 10);
    ellipse(x, y, 5, 5);
    ellipse(x, y, 3, 3);
  }
}
