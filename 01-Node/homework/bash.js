const commands = require("./commands");

process.stdout.write("prompt > ");
// El evento stdin 'data' se dispara cuando el user escribe una línea
process.stdin.on("data", function (data) {
  var [cmd, ...arg] = data.toString().trim().split(" "); // remueve la nueva línea
  process.stdout.write("You typed: " + cmd);
  process.stdout.write("\nprompt > ");

  function write(data) {
    process.stdout.write(data);
    process.stdout.write("\nprompt > ");
  }

  if(commands.hasOwnProperty(cmd)) {
    commands[cmd](write, arg);
  } else {
    write("No encontramos el comando")
  }
});