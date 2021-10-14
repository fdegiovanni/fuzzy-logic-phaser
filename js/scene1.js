class Scene1 extends Phaser.Scene {
    star = null;
    target = null;
    ventilador = -9.8;
    gravedad = 9.8;
    caos = 0;

    constructor() {
        super('scena');
        this.memberships = new Memberships();
    }

    preload(){
        this.load.image('tunel', './assets/tunel.png');
        this.load.image('star', './assets/star.png');
    }

    create(){
        this.add.image(175, 350, 'tunel');
        
        this.star = this.physics.add.sprite(175, 450, 'star');
        this.star.setBounce(0.2);
        this.star.setCollideWorldBounds(true);

        this.target = this.add.image(175, 350, 'star');
        this.target.setTint(0xff0000);

        this.time.addEvent(
            {
                delay: 200,
                callback: this.onTime,
                callbackScope: this,
                loop: true,
            }
        )
    }

    // update(){}

    getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }

    fuzzification(){
        const distancia = Phaser.Math.Distance.BetweenPoints(this.star, this.target);
        console.log('distancia', distancia);

        let centrado = this.memberships.triangle(distancia, -40, 0, 40);
        let cercaA = this.memberships.trapezoid(distancia, 20, 80, 120, 180);
        let normalA = this.memberships.trapezoid(distancia, 120, 160, 240, 280);
        let lejosA = this.memberships.grade(distancia, 240, 300);

        let cercaB = this.memberships.trapezoid(distancia, -180, -120, -80, -20);
        let normalB = this.memberships.trapezoid(distancia, -280, -240, -160, -120);
        let lejosB = this.memberships.gradeInverted(distancia, -300, -240);

        const numerador = centrado*9.8 + cercaA*4 + normalA*2 + lejosA*1 + cercaB*14 + normalB*15.5 + lejosB*18;
        const denominador = centrado+cercaA+normalA+lejosA+cercaB+normalB+lejosB;
        const ventilador = numerador/denominador;
        return ventilador;
    }

    onTime(){
        console.log(this.star);
        this.ventilador = this.fuzzification();
        console.log('ventilador', this.ventilador);
        this.caos = this.getRandomArbitrary(-5, 5);

        const starSpeed = this.star.body.velocity.y;
        console.log('velociad actual', starSpeed);

        const newSpeed = starSpeed + (this.gravedad - this.ventilador + this.caos) * 0.6;
        console.log('velociad nueva', newSpeed);

        this.star.setVelocity(0, -newSpeed);
    }

}

class Memberships {
    boolean(x, y) {
        let member = (x <= y) ? 0 : 1;
        return member;
    }

    booleanInverted(x, y) {
        let member = (x < y) ? 1 : 0;
        return member;
    }

    grade(x, y, z) {
        let member = 0;
        if (x <= y) {
            member = 0;
        } else {
            if(x > y && x < z){
                member = (x/(z-y))-(y/(z-y));
            }else{
                if(x>= z){
                    member = 1;
                }
            }
        }
        return member;
    }

    gradeInverted(x, y, z) {
        let member = 0;
        if (x <= y) {
            member = 1;
        } else {
            if(x > y && x < z){
                member = (x/(z-y))-(z/(z-y));
            }else{
                if(x>= z){
                    member = 0;
                }
            }
        }
        return member;
    }

    triangle(x, a, b, c){
        let member = 0;
        if(x <= a) {
            member = 0;
        }else{
            if (x > a && x <= b) {
                member = (x/(b-a)) - (a/(b-a));
            }else{
                if (x > b && x <= c) {
                    member = - (x/(c-b)) + (c/(c-b));
                } else {
                    if (x>c) {
                        member = 0;
                    }
                }
            }
        }
        return member;
    }

    trapezoid(x, a, b, c, d){
        let member = 0;
        if(x <= a) {
            member = 0;
        }else{
            if (x > a && x <= b) {
                member = (x/(b-a)) - (a/(b-a));
            }else{
                if (x > b && x <= c) {
                    member = 1;
                } else {
                    if (x>c && x <= d) {
                        member = - (x/(d-c)) + (d/(d-c))
                    } else {
                        if (x>d) {
                            member = 0;
                        }
                    }
                }
            }
        }
        return member;
    }

    operatorAND(a, b){
        return Math.min(a, b);
    }

    operatorOR(a, b){
        return Math.max(a, b);
    }

    operatorNOT(a){
        return 1-a;
    }
}