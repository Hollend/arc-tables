import textFactory from './helper.js';
import { imageFactory } from './helper.js';

export function main() {
  var data = document.getElementById('dataentry').value.split('\n');
  var style = document.getElementById('table-style').value;
  var track = document.getElementById('track').value;
  var t = new table(style, data, track);
  t.processData();
}

class table {
  constructor(style, data, track) {
	this.stage = new createjs.Stage("table");
	this.data = data;
	this.clans = [];
	this.pl = [];
	this.pl2 = [];
	//Draw background
	var bg = new createjs.Shape();
	bg.graphics.beginFill("#065861").drawRect(0, 0, 850, 480);
	this.stage.addChild(bg);
	//Add track image, ARC logo, and middle divider
	let i = new imageFactory(this.stage);
	if (!track) track = "dAC";
	i.loadImage("static/images/tracks/" + track + ".png", 850, 480, 0, 0, 1);
	this.drawARCLogo(this.stage, style);
	var mid = new createjs.Shape();
	mid.graphics.beginFill("#ffffff").drawRect(227, 239, 396, 2);
	this.stage.addChild(mid);
	// this.drawPlayerNames();
  }

  processData() {
	let i = 0;
	//Read in data
	i = this.extractTag(i, this.clans);
	i = this.extractPlayers(i + 1, this.clans[0]);
	i = this.extractTag(i + 1, this.clans);
	this.extractPlayers(i + 1, this.clans[1]);
	this.pl.sort((a,b) => {
	  return b.score - a.score;
	});
	if (this.pl.length) this.pl[0]["plcmt"] = "1st";
	for (let j = 1; j < this.pl.length; j++) {
	  let plcmt = "";
	  if (this.pl[j]["score"] == this.pl[j-1]["score"]) {
		this.pl[j]["plcmt"] = this.pl[j-1]["plcmt"];
		continue;
	  }
	  if (j == 1) plcmt = "2nd";
	  else if (j == 2) plcmt = "3rd";
	  else plcmt = j + 1 +  "th";
	  this.pl[j]["plcmt"] = plcmt;
	}
	this.clans.sort((a,b) => {
	  return b.score - a.score;
	});

	//Split up the players into two arrays
	for (let k = 0; k < this.pl.length; k++) {
	  if (this.pl[k]["clan"] == this.clans[1]["tag"]) {
		this.pl2.push(this.pl[k]);
		this.pl.splice(k, 1);
		k--;
	  }
	}
	//Draw clan tags
	try {
	  this.drawClanTag(this.clans[0]["tag"], this.clans[0]["name"], this.stage, true);
	  this.drawClanTag(this.clans[1]["tag"], this.clans[1]["name"], this.stage, false);
	  this.drawPlayerInfo(this.pl, 0);
	  this.drawPlayerInfo(this.pl2, 240);
	  this.drawScores();
	}
	catch { console.log("Error!"); }
	this.stage.update();
  }

  extractTag(i, clans) {
	for (i; i < this.data.length; i++) {
	  let line = this.data[i];
	  if (this.isEmptyOrSpaces(line)) continue;
	  else {
		line = line.split(' - ');
		clans.push({
		  "tag": line[0],
		  "name": line[1],
		  "score": 0,
		  "penalty": 0
		});
		break;
	  }
	}
	return i;
  }

  extractPlayers(i, clan) {
	for (i; i < this.data.length; i++) {
	  let line = this.data[i];
	  if (this.isEmptyOrSpaces(line)) break;
	  let name = line.match(/.*\[.*\]{1}/).toString();
	  name = name.substr(0, name.length - 5);
	  if (name == "Gdin") name = "gdin";
	  line = line.trimRight();
	  line = line.split(' ');
	  let country = line[line.length - 2];
	  let score = line[line.length - 1];
	  let penalty = 0;
	  //Add scores or add penalty
	  if (score.includes("+")) {
		let scores = score.split('+');
		score = 0;
		for (let j = 0; j < scores.length - 1; j++) {
		  score += parseInt(scores[j]);
		}
		if (scores[scores.length - 1].includes("-")) {
		  let last = scores[scores.length - 1].split('-');
		  score += parseInt(last[0]);
		  penalty = parseInt(last[1]);
		}
		else {
		  score += parseInt(scores[scores.length - 1]);
		}
	  }
	  else if (score.includes("-")) {
		let scores = score.split('-');
		score = parseInt(scores[0]);
		penalty = parseInt(scores[1]);
	  }
	  let pl = {
		"name": name,
		"country": country,
		"score": parseInt(score),
		"clan": clan["tag"]
	  };
	  clan["score"] += score - penalty;
	  clan["penalty"] -= penalty;
	  this.pl.push(pl);
	}
	return i;
  }

  isEmptyOrSpaces(str) {
    return str === null || str.match(/^ *$/) !== null;
  }

  //Draw clan tags
  drawClanTag(tag, name, stage, win) {
	//place on top or bottom for win or loss
	let y_pos;
	win ? y_pos = 55 : y_pos = 312;
	//draw clan tag
	let t = new textFactory("Tahoma", 96, "bold");
	let tagText = t.getText(tag, 155, y_pos);
	tagText.shadow = new createjs.Shadow("#000000", 2, 2, 2);
	stage.addChild(tagText);
	//draw clan name
	t = new textFactory("Oswald", 22, "");
	let nameText = t.getText(name, 155, y_pos + 98);
	nameText.shadow = new createjs.Shadow("#000000", 2, 2, 2);
	stage.addChild(nameText);
	stage.update();
  }

  drawPlayerInfo(pl, y_pos) {
	let text_size = (30 * pl.length) - 12;
	let buffer_size = (240 - text_size) / 2;
	y_pos += buffer_size;
	let t = new textFactory("Oswald", 22, "");
	let t_p = new textFactory("Oswald", 16, "");
	let j = new imageFactory(this.stage);
	// let i = new imageFactory(this.stage);
	for (let i = 0; i < pl.length; i++) {
	  //Name
	  this.stage.addChild(t.getText(pl[i]["name"], 346, y_pos));
	  //Flag
	  let cn = pl[i]["country"].slice(1,3);
	  j.loadImage("static/images/flags/" + cn + ".png", 0, 0, 346 + 85, y_pos - 2, 0, cn);
	  //Score
	  this.stage.addChild(t.getText(pl[i]["score"], 346 + 149, y_pos));
	  //Placement
	  this.stage.addChild(t_p.getText(pl[i]["plcmt"], 346 + 199, y_pos + 5));
	  y_pos += 30;
	}
	this.stage.update();
  }

  drawScores() {
	let t = new textFactory("Tahoma", 96, "bold");
    let clan1 = t.getText(this.clans[0]["score"], 850 - 155, 55 + 28);
	clan1.shadow = new createjs.Shadow("#000000", 2, 2, 2);
	this.stage.addChild(clan1);
	let clan2 = t.getText(this.clans[1]["score"], 850 - 155, 312);
	clan2.shadow = new createjs.Shadow("#000000", 2, 2, 2);
	this.stage.addChild(clan2);
	t = new textFactory("Oswald", 22, "");
	let diff_num = this.clans[0]["score"] - this.clans[1]["score"];
	let diff = t.getText("±" + diff_num, 850 - 155, 240 - 9);
	diff.shadow = new createjs.Shadow("#000000", 2, 2, 2);
	this.stage.addChild(diff);
	t = new textFactory("Oswald", 18, "");
	if (this.clans[0]["penalty"] < 0) {
	  this.stage.addChild(t.getText(this.clans[0]["penalty"],
									850 - 155, 240 - 60));
	}
	if (this.clans[1]["penalty"] < 0) {
	  this.stage.addChild(t.getText(this.clans[1]["penalty"],
									850 - 155, 240 + 44));
	}
	let total = this.clans[0]["score"] + this.clans[1]["score"] + this.clans[0]["penalty"] + this.clans[1]["penalty"];
	if (total != 984) {
	  document.getElementById('warning').innerHTML = "Warning: Scores add to " + total + ". They should add to 984.";
	}
	else {
	  document.getElementById('warning').innerHTML = "";
	}
	this.stage.update();
  }
	
  //Draw ARC logo
  drawARCLogo(stage, style = "arc") {
	let filename;
	switch(style) {
	case "arc":
	  filename = "arc1_web.png"
	  break;
	case "sky":
	  filename = "arcsky_web.png"
	  break;
	case "terra":
	  filename = "arcterra_web.png"
	  break;
	}
	let i = new imageFactory(stage);
	i.loadImage("static/images/" + filename, 0, 0, 117, 210);
  }
}


main();
