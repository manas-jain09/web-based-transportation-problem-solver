function submitDimensions() {
    const rows = document.getElementById('rows').value;
    const columns = document.getElementById('columns').value;

    if (rows <= 0 || columns <= 0) {
        alert("Please enter valid integer values for rows and columns.");
        return;
    }

    document.getElementById('input-section').style.display = 'none';

    const tableSection = document.getElementById('table-section');
    const costMatrixDiv = document.getElementById('cost-matrix');
    const supplySection = document.getElementById('supply-section');
    const demandSection = document.getElementById('demand-section');

    costMatrixDiv.innerHTML = '<h3>Enter cost matrix:</h3>';
    supplySection.innerHTML = '<h3>Enter supply:</h3>';
    demandSection.innerHTML = '<h3>Enter demand:</h3>';

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            const input = document.createElement('input');
            input.type = 'number';
            input.className = `cost cost-${i}-${j}`;
            input.style = 'width: 50px; display: inline-block; margin-right: 5px;';
            costMatrixDiv.appendChild(input);
        }
        costMatrixDiv.appendChild(document.createElement('br'));
    }

    for (let i = 0; i < rows; i++) {
        const input = document.createElement('input');
        input.type = 'number';
        input.className = `supply supply-${i}`;
        input.style = 'width: 50px; display: inline-block; margin-right: 5px;';
        supplySection.appendChild(input);
    }

    for (let i = 0; i < columns; i++) {
        const input = document.createElement('input');
        input.type = 'number';
        input.className = `demand demand-${i}`;
        input.style = 'width: 50px; display: inline-block; margin-right: 5px;';
        demandSection.appendChild(input);
    }

    tableSection.style.display = 'block';
}

function solve() {
    const rows = document.getElementById('rows').value;
    const columns = document.getElementById('columns').value;
    const method = document.getElementById('method').value;

    let costMatrix = [];
    let supply = [];
    let demand = [];

    for (let i = 0; i < rows; i++) {
        let row = [];
        for (let j = 0; j < columns; j++) {
            row.push(parseInt(document.querySelector(`.cost-${i}-${j}`).value));
        }
        costMatrix.push(row);
    }

    for (let i = 0; i < rows; i++) {
        supply.push(parseInt(document.querySelector(`.supply-${i}`).value));
    }

    for (let i = 0; i < columns; i++) {
        demand.push(parseInt(document.querySelector(`.demand-${i}`).value));
    }

    const result = transportationSolver(costMatrix, supply, demand, method);
    document.getElementById('result').innerText = `The minimum cost of transportation by ${method} is ${result}`;
    document.getElementById('result-section').style.display = 'block';
}

function transportationSolver(costMatrix, supply, demand, method) {
    balanceProblem(supply, demand, costMatrix);

    let allocation = [];
    for (let i = 0; i < supply.length; i++) {
        allocation.push(Array(demand.length).fill(0));
    }

    let totalCost = 0;

    if (method === "northwest") {
        let i = 0, j = 0;
        while (i < supply.length && j < demand.length) {
            let allocated = Math.min(supply[i], demand[j]);
            allocation[i][j] = allocated;
            supply[i] -= allocated;
            demand[j] -= allocated;
            totalCost += allocated * costMatrix[i][j];
            if (supply[i] === 0) i++;
            else j++;
        }
    } else if (method === "leastcost") {
        while (supply.some(v => v > 0) && demand.some(v => v > 0)) {
            let minCost = Infinity;
            let minCell = [0, 0];
            for (let i = 0; i < supply.length; i++) {
                for (let j = 0; j < demand.length; j++) {
                    if (supply[i] > 0 && demand[j] > 0 && costMatrix[i][j] < minCost) {
                        minCost = costMatrix[i][j];
                        minCell = [i, j];
                    }
                }
            }
            let [i, j] = minCell;
            let allocated = Math.min(supply[i], demand[j]);
            allocation[i][j] = allocated;
            supply[i] -= allocated;
            demand[j] -= allocated;
            totalCost += allocated * costMatrix[i][j];
        }
    } else if (method === "vogel") {
        // Implement Vogel's Approximation Method
    }

    return totalCost;
}

function balanceProblem(supply, demand, costMatrix) {
    let totalSupply = supply.reduce((a, b) => a + b, 0);
    let totalDemand = demand.reduce((a, b) => a + b, 0);

    if (totalSupply < totalDemand) {
        supply.push(totalDemand - totalSupply);
        costMatrix.push(Array(demand.length).fill(0));
    } else if (totalSupply > totalDemand) {
        for (let row of costMatrix) {
            row.push(0);
        }
        demand.push(totalSupply - totalDemand);
    }
}
