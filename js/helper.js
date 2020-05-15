//Create object for easy text

export default class textFactory {
  constructor(font, size, style) {
	this.font = font;
	this.size = size;
	this.style = style;
  }

  getText(content, x_pos, y_pos, color = "#ffffff") {
	var text = new createjs.Text();
	text.set({
	  text: content,
	  font: this.style + " " + this.size + "px " + this.font,
	  color: color,
	  textAlign: "center",
	  textBaseLine: "middle",
	  x: x_pos,
	  y: y_pos
	});
	return text;
  }
}

export class imageFactory {
  constructor(stage) {
	this.queue = new createjs.LoadQueue();
	this.stage = stage;
  }

  loadImage(filepath, w = 0, h = 0, x = 0, y = 0, layer = 0, id = "image") {
	this.queue.loadFile({src:filepath, id: id});
	this.queue.on("complete", (event) => {
	  var image = this.queue.getResult(id);
	  var bmp = new createjs.Bitmap(image);
	  if (w) bmp.scaleX = w / bmp.image.width;
	  if (h) bmp.scaleY = h / bmp.image.height;
	  if (x) bmp.x = x;
	  if (y) bmp.y = y;
	  this.stage.addChild(bmp);
	  if (layer) this.stage.setChildIndex(bmp, layer);
	  this.stage.update();
	});
  }
}
  
