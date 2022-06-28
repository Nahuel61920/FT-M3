const fs = require('fs');
const request = require('request');

function pwd (write) {
    write(process.cwd())
}

function data (write) {
    write(Date())
}

function ls (write) {
    fs.readdir(".", function (error, files){
        if(error) {
            return error
        } else {
            write(files.join("\n"))
        }
    })
}

function echo(write, arg) {
    write(arg.join(" "))
}

function cat (write, arg) {
    if (arg.length === 0){
        write("No se especifico ningun archivo")
    } else {
        fs.readFile(arg[0], "utf8", function (error, data) {
            if(error){
                return error
            } else {
                write(data.toString())
            }
        })
    }
}

function head (write, arg){
    if (arg.length === 0){
        write("No se especifico ningun archivo")
    } else {
        fs.readFile(arg[0], "utf8", function (error, data) {
            if(error){
                return error
            } else {
                write(data.split("\n").slice(0, 10).join("\n"))
            }
        })
    }
}

function tail (write, arg) {
    if (arg.length === 0){
        write("No se especifico ningun archivo")
    } else {
        fs.readFile(arg[0], "utf8", function (error, data) {
            if(error){
                return error
            } else {
                
                write(data.split("\n").slice(data.split("\n").length - 5, data.split("\n").length).join("\n"))
            }
        })
    }
}

function curl (write, arg) {
    if (arg.length === 0){
        write("No se especifico ningun archivo")
    } else {
        request(arg[0], function (error, _response, body) {
            if(error){
                return error
            } else {
                write(body)
            }
        })
    }
}



module.exports = {
    data,
    pwd,
    ls,
    echo,
    cat,
    head,
    tail,
    curl
}