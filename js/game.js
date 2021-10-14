const config = {
    type: Phaser.AUTO,
    width: 350,
    height: 700,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 9.8 },
            debug: true,
        }
    },
    scene: [Scene1]
};

new Phaser.Game(config);

/*
alto: 20cm
ancho: 10cm
*/


/*
modificar el ancho y alto
200
900

modificar los numeros en las funciones de membresia
*/