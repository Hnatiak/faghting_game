/* 
? КЛАСИ ШУКАЙ В ПАПЦІ js/classes.js

TODO: Basic Fighting Game Mechanics
    * Project Setup
    * Create Player and Enemy
    * Move Characters with Event Listeners
    * Attacks
    * Health Bar Interface
    * Game Timers and Game Over
*/


/* 
TODO: Sprites and Animations
    ! Background Sprite
    ! Shop Sprite With Animation
    ! Player Sprite (Samurai Mack)
    ! Enemy Sprite (Kenji)
    ! Interface Design and Animation
    ! Pushing Live
*/

// ==================================== Project Setup =====================================


const canvas = document.querySelector('canvas'); // Створюємо змінну 'canvas' та присвоюємо їй HTML елемент <canvas>, знайдений на сторінці за допомогою селектора 'canvas'
const c = canvas.getContext('2d'); // Створюємо змінну 'c' та отримуємо контекст 2D для малювання на канвасі

canvas.width = 1024; // Встановлюємо ширину канваса в 1024 пікселя
canvas.height = 512; // Встановлюємо висоту канваса в 576 пікселя

c.fillRect(0, 0, canvas.width, canvas.height); // Малюємо прямокутник з кутом від 0 до ширини канваса та висоти канваса (Малюємо заповнений прямокутник, який покриває весь канвас від (0, 0) до (1024, 576))

// ========================================================================================

// ============================== Create Player and Enemy =================================

const gravity = 0.7

// =============================== Background Sprite =========================================

const background = new Sprite({
   position: {
       x: 0,
       y: 0
   },
   imgSrc: './img/background_three.jpg'
})

// ========================================================================================

const player = new Fighter({
    position: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
    offset: { x: 0, y: 0 }
});

const enemy = new Fighter({
    position: { x: 400, y: 100 },
    velocity: { x: 0, y: 0 },
    color: 'blue',
    offset: { x: -50, y: 0 }
});

console.log(player)

// ============================= Move Characters with Event Listeners =====================
const keys = {
    a: { pressed: false },
    d: { pressed: false },
    w: { pressed: false },
    s: { pressed: false },
    // ! Enemy keys
    ArrowLeft: { pressed: false },
    ArrowRight: { pressed: false },
    ArrowUp: { pressed: false },
    ArrowDown: { pressed: false }
}

// ========================================================================================

// ================================ Attacks ===============================================

function rectangularCollision({ rectangle1, rectangle2 }) { // ! rectangle1 = player, rectangle2 = enemy
    return ( 
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x && 
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
}

// ========================================================================================

// ================================ Game Timers and Game Over ===============================

function determineWinner({ player, enemy, timerId }) {
    clearTimeout(timerId)
    document.querySelector('#displayText').style.display = 'flex'
    if(player.health === enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Tie'
    } else if(player.health > enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Player Won'
    } else if(player.health < enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Enemy Won'
    }
}


let timer = 60;
let timerId;

function decreaseTimer() {
    if(timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000)
        timer --;
        // ? console.log(timer)
        document.querySelector('#timer').innerHTML = timer

    }

    if(timer === 0) {
        determineWinner({ player, enemy, timerId: null })
    }
}

decreaseTimer()

// ========================================================================================


// Створюємо анімаційну лупу (Animation Loop)

function animate() {
    window.requestAnimationFrame(animate);
    // ? console.log('go')
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    // =============================== Background Sprite =========================================
    background.update();
    // ========================================================================================
    player.update();
    enemy.update();

    // ============================= Move Characters with Event Listeners =====================
    // ! Player movement
    player.velocity.x = 0
    if(keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
    } else if(keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
    }

    // ! Enemy movement
    enemy.velocity.x = 0
    if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
    } else if(keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5 
    }
    // ========================================================================================

    // ================================ Attacks ===============================================

    if(rectangularCollision({ rectangle1: player, rectangle2: enemy }) && player.isAttacking) {
        player.isAttacking = false
        // ============================== Health Bar Interface ====================================
        enemy.health -= 10
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'  // `${enemy.health}%`
        // ========================================================================================
        console.log('I hit enemy')
    }

    // ! Enemy attack
    
    if(rectangularCollision({ rectangle1: enemy, rectangle2: player }) && enemy.isAttacking) {
        enemy.isAttacking = false
        // ============================== Health Bar Interface ====================================
        player.health -= 10
        document.querySelector('#playerHealth').style.width = player.health + '%'  // `${player.health}%`
        // ========================================================================================
    }

    // ========================================================================================

    // ================================ Game Timers and Game Over ===============================

    if(player.health <= 0 || enemy.health <= 0) {
        determineWinner({ player, enemy, timerId: timerId })
    }
}

animate()

// ========================================================================================

// ============================= Move Characters with Event Listeners =====================

window.addEventListener('keydown', (event) => {
    if (timer === 0) return;

    if (player.health <= 0 || enemy.health <= 0) return;

    switch(event.key) {
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd';
            break
        case 'a':
            keys.a.pressed = true
            player.lastKey = 'a';
            break
        case 'w':
            player.velocity.y = -20
            lastKey = 'w'
            break
        case 's':
            keys.s.pressed = true
            player.velocity.y = 20
            break
        case ' ':
            player.attack()
            break
        case 'в':
            keys.d.pressed = true
            player.lastKey = 'd';
            break
        case 'ф':
            keys.a.pressed = true
            player.lastKey = 'a';
            break
        case 'ц':
            player.velocity.y = -20
            lastKey = 'w'
            break
        case 'і':
            keys.s.pressed = true
            player.velocity.y = 20
            break
    }

    // ! Enemy keys

    switch(event.key) {
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break
        case 'ArrowUp':
            enemy.velocity.y = -20
            enemy.lastKey = 'ArrowUp'
            break
        case 'ArrowDown':
            enemy.velocity.y = 20
            break
        case 'Enter':
            enemy.attack()
            break
    }

    console.log(event.key)
})

window.addEventListener('keyup', (event) => {
    switch(event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 'w':
            keys.w.pressed = false
            break
        case 's':
            keys.s.pressed = false
            break

        case 'в':
            keys.d.pressed = false
            break
        case 'ф':
            keys.a.pressed = false
            break
        case 'ц':
            keys.w.pressed = false
            break
        case 'і':
            keys.s.pressed = false
            break
    }

    // ! Enemy keys

    switch(event.key) {
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowUp':
            keys.ArrowUp.pressed = false
            break
        case 'ArrowDown':
            keys.ArrowDown.pressed = false
            break
    }

    console.log(event.key)
})

// ========================================================================================

// ================================ Attacks ===============================================

// ! Read the comments in the code 

// ========================================================================================

// ============================== Health Bar Interface ====================================

// ! let's go to index.html and style.css we have to add div with id = 'health' for our players

// ========================================================================================

// ================================ Game Timers and Game Over ===============================

// ! Read the comments in the code

// ========================================================================================