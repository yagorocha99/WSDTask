const readline = require('readline');

function calculateTotalTime(bottleSizes, tapForces, walkTimePerPerson) {
    if (!Array.isArray(bottleSizes)) {
        throw new Error("Invalid input: bottleSizes must be an array");
    }
    if (!Array.isArray(tapForces) || tapForces.length === 0) {
        throw new Error("Invalid input: tapForces must be a non-empty array");
    }

    let taps = new Array(tapForces.length).fill(0);
    let queueLength = bottleSizes.length;

    for (let i = 0; i < queueLength; i++) {
        let earliestTapIndex = taps.indexOf(Math.min(...taps));
        let fillTime = bottleSizes[i] / tapForces[earliestTapIndex];
        if (isNaN(fillTime)) {
            throw new Error(`Invalid bottle size`);
        }
        if (i >= tapForces.length) {
            taps[earliestTapIndex] += fillTime + walkTimePerPerson;
        } else {
            taps[earliestTapIndex] += fillTime;
        }
    }
    return Math.max(...taps);
}

function getInputsAndCalculate() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const askBottleSizes = () => {
        rl.question("Enter the bottle sizes in ml, separated by commas (e.g., 400,750,1000): ", (bottleSizesInput) => {
            let bottleSizes = bottleSizesInput.split(',').map(Number);

            const isValidBottleSize = bottleSizes.every(size => Number.isInteger(size) && size > 0);
            if (!isValidBottleSize) {
                console.error("Invalid input: All bottle sizes must be positive integers.");
                askBottleSizes();
                return;
            }

            askNumberOfTaps(bottleSizes);
        });
    };

    const askNumberOfTaps = (bottleSizes) => {
        rl.question("Enter the number of taps: ", (numberOfTapsInput) => {
            let numberOfTaps = parseInt(numberOfTapsInput);
            if (!Number.isInteger(numberOfTaps) || numberOfTaps <= 0 || numberOfTaps.toString() !== numberOfTapsInput.trim()) {
                console.error("Invalid input: The number of taps must be a positive integer.");
                askNumberOfTaps(bottleSizes);
                return;
            }

            askTapForces(bottleSizes, numberOfTaps);
        });
    };

    const askTapForces = (bottleSizes, numberOfTaps) => {
        rl.question(`Enter the forces of the taps in ml/sec, separated by commas (e.g., 100,50,300): `, (tapForcesInput) => {
            let tapForces = tapForcesInput.split(',').map(Number);

            const isValidTapForces = tapForces.length === numberOfTaps && tapForces.every(force => Number.isInteger(force) && force > 0);
            if (!isValidTapForces) {
                console.error("Invalid input: All tap forces must be positive integers and match the number of taps.");
                askTapForces(bottleSizes, numberOfTaps);
                return;
            }

            let walkTimePerPerson = 3;

            try {
                let totalTime = calculateTotalTime(bottleSizes, tapForces, walkTimePerPerson);
                console.log("Total time required for all people to fill their water bottles is: " + totalTime.toFixed(1) + " seconds.");
                rl.close();
            } catch (error) {
                console.error(error.message);
                rl.close();
            }
        });
    };

    askBottleSizes();
}

getInputsAndCalculate();
