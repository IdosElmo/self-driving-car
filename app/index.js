const carCanvas = document.getElementById("gameCanvas");
carCanvas.width = 300;

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 500;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width/2,carCanvas.width*0.9);

async function execute(timestamp) {
    if (!start)
        start = timestamp;

    let dones = [];

    for(let i=0;i<traffic.length;i++){
        traffic[i].update(road.borders,[]);
    }
    for(let i=0;i<cars.length;i++){
        dones[i] = cars[i].update(road.borders,traffic);
    }

    bestCar = cars.find(
        c=>c.y==Math.min(
            ...cars.map(c=>c.y)
        ));

    carCanvas.height=window.innerHeight;
    networkCanvas.height=window.innerHeight;

    carCtx.save();
    carCtx.translate(0,-bestCar.y+carCanvas.height*0.7);

    road.draw(carCtx);
    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(carCtx);
    }
    carCtx.globalAlpha=0.2;
    for(let i=0;i<cars.length;i++){
        cars[i].draw(carCtx);
    }
    carCtx.globalAlpha=1;
    bestCar.draw(carCtx,true);

    carCtx.restore();

    networkCtx.lineDashOffset=-timestamp/50;
    Visualizer.drawNetwork(networkCtx, bestCar.brain);
    
    const progress = timestamp - start;
    console.log(dones.every(element => element === true))
    if (dones.every(element => element === true) || progress > 10000) {
        for(let i=0;i<cars.length;i++){
            NeuralNetwork.mutate(cars[i].brain, 1)
        }
        console.log("Mutating!");
        cancelAnimationFrame(gameRequest);
        location.reload()
    } else {
        gameRequest = requestAnimationFrame(execute);
    }
}

function save(){
    localStorage.setItem("bestBrain",
        JSON.stringify(bestCar.brain));
}

function discard(){
    localStorage.removeItem("bestBrain");
}

function load() {
    if(localStorage.getItem("bestBrain")){
        for(let i=0;i<cars.length;i++){
            cars[i].brain=JSON.parse(
                localStorage.getItem("bestBrain"));
            if(i!=0){
                NeuralNetwork.mutate(cars[i].brain,0.1);
            }
        }
    }
}

function generateCars(N){
    const cars=[];
    for(let i=1;i<=N;i++){
        cars.push(new Car(road.getLaneCenter(1),100,30,50,"AI"));
    }
    return cars;
}

const train = async () => {
    

    await execute()
}


const N = 2;
const cars = generateCars(N);


const traffic=[
    new Car(road.getLaneCenter(1),-100,30,50,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(0),-300,30,50,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(2),-300,30,50,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(0),-500,30,50,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(1),-500,30,50,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(1),-700,30,50,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(2),-700,30,50,"DUMMY",2,getRandomColor()),
];
let start = null;
train()