// Create some helpful classes

class Player {
  name = "";
  score = 0;
  penalty = 0;
  country = "";
  placement = "";

  clanParse(line) {
	line = line.split(' ').filter((item) => { return item != ""; });
	let len = line.length;
	this.country = line[len - 2].match(/\[.{2}\]/);
	this.name = line.slice(0, this.country ? len - 2 : len - 1).join(' ');
	if (this.name == "Gdin") this.name = "gdin"; //my name is lowercase lmao
	let scores = line[len - 1].split('+');
	if (scores[scores.length - 1].includes('-')) {
	  let last = scores[scores.length -1].split('-');
	  scores.pop();
	  scores.push(last[0]);
	  if (1 in last) this.penalty -= parseInt(last[1]);
	}
	let score = 0;
	scores.forEach((value) => { this.score += parseInt(value); });	
  }
}

class Clan {
  name = "";
  tag = "";	
  score = 0;
  penalty = 0;
  players = [];

  clanParse(line) {
	line = line.split('-');
	this.tag = line[0].trim();
	line.shift();
	this.name = line.join('-').trim();
  }

  addPlayer(p) {
	this.players.push(p);
	this.score += p.score;
	if (p.penalty) this.penalty += p.penalty;
  }

  //Debug
  printInfo() {
	console.log("Clan: " + this.tag + " - " + this.name);
	console.log("Players:");
	for (const p of this.players) {
	  console.log(p.name + " " + p.country + " " +  p.score
				  + " " + p.placement);
	}
	console.log("Clan Score: " + this.score);
	console.log("Clan Penalty: " + this.penalty);
  }
}

class Table {
  clans = [];

  addClan(c) {
	this.clans.push(c);
  }

  findPlacements() {
	let players = [];
	for(let c of this.clans) {
	  players.push.apply(players, c.players);
	}
	players.sort((a,b) => { return b.score - a.score; });
	if (players.length) players[0].placement = "1st";
	for(let i = 1; i < players.length; i++) {
	  let plcmt = "";
	  if (players[i].score == players[i-1].score) {
		players[i].placement = players[i-1].placement;
		continue;
	  }
	  if (i == 1) plcmt = "2nd";
	  else if (i == 2) plcmt = "3rd";
	  else plcmt = i + 1 + "th";
	  players[i].placement = plcmt;
	}
  }
  
  printInfo() {
	for (const c of this.clans) {
	  c.printInfo();
	  console.log('\n');
	}
  }
}
