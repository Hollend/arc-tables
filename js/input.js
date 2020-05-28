//Functions for extracting input

function isEmptyOrSpaces(str) {
  return str === null || str.match(/^ *$/) !== null;
}

//Check if clan vs. line format
function isClanFormat(data) {
  for(const line of data) {
	//Skip over whitespace
	if(isEmptyOrSpaces(line)) continue;
	return !line.trim().match(/(.*)[ ]+([0-9+|-]+)$/);
  }
}

//Parse in clan mode
function clanParse(data) {
  let table = new Table();
  let clanMode = true;
  let curClan = null;
  for (let line of data) {
	if (clanMode) {
	  if (isEmptyOrSpaces(line)) continue;
	  curClan = new Clan();
	  curClan.clanParse(line);
	  clanMode = false;
	}
	else if (isEmptyOrSpaces(line)) {
	  clanMode = true;
	  table.addClan(curClan);
	}
	else {
	  let player = new Player();
	  player.clanParse(line);
	  curClan.addPlayer(player);
	}
  }
  table.findPlacements();
  return table;
}


function lineParse() {
}


// My testing grounds

data = `
73 - Beans of The Vine
Gdin 56+12
Jati [fr] 56+12

Se
Seergio [es] 87+11
Ruri [jp] 31+45+30-10
`;

data = data.split('\n');
let t = clanParse(data);
t.printInfo();
// line = "gdin lmao   [ca]   23+5";
// line = line.split(' ').filter((item) => { return item != ""; });
// console.log(line);
