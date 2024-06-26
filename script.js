function generateTable() {
    const rows = document.getElementById('rows').value;
    const cols = document.getElementById('cols').value;

    if (rows > 0 && cols > 0) {
        document.getElementById('input-section').style.display = 'none';

        let tableHTML = '<table>';
        tableHTML += '<tr><th></th>';
        for (let j = 0; j < cols; j++) {
            tableHTML += `<th>D${j+1}</th>`;
        }
        tableHTML += '<th>Supply</th></tr>';

        for (let i = 0; i < rows; i++) {
            tableHTML += `<tr><th>S${i+1}</th>`;
            for (let j = 0; j < cols; j++) {
                tableHTML += `<td><input type="number" id="cell-${i}-${j}" min="0"></td>`;
            }
            tableHTML += `<td><input type="number" id="supply-${i}" min="0"></td></tr>`;
        }

        tableHTML += '<tr><th>Demand</th>';
        for (let j = 0; j < cols; j++) {
            tableHTML += `<td><input type="number" id="demand-${j}" min="0"></td>`;
        }
        tableHTML += '<td></td></tr>';
        tableHTML += '</table>';

        document.getElementById('table-section').innerHTML = tableHTML;
        document.getElementById('method-section').style.display = 'block';
        document.getElementById('reset-button').style.display = 'block';
    } else {
        alert('Please enter valid number of rows and columns.');
    }
}

function solve() {
    const method = document.getElementById('method').value;
    const rows = parseInt(document.getElementById('rows').value);
    const cols = parseInt(document.getElementById('cols').value);

    const costMatrix = [];
    const supply = [];
    const demand = [];

    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < cols; j++) {
            row.push(parseInt(document.getElementById(`cell-${i}-${j}`).value));
        }
        costMatrix.push(row);
        supply.push(parseInt(document.getElementById(`supply-${i}`).value));
    }

    for (let j = 0; j < cols; j++) {
        demand.push(parseInt(document.getElementById(`demand-${j}`).value));
    }

    balanceProblem(costMatrix, supply, demand);

    let result = '';
    if (method === 'northWestCorner') {
        result = northWestCorner(costMatrix, supply, demand);
    } else if (method === 'leastCost') {
        result = leastCost(costMatrix, supply, demand);
    } else if (method === 'vogels') {
        result = vogelsApproximationMethod(costMatrix, supply, demand);
    }

    document.getElementById('result-section').innerHTML = `<h2>Result</h2><p>${result}</p>`;
}

function balanceProblem(costMatrix, supply, demand) {
    const totalSupply = supply.reduce((acc, val) => acc + val, 0);
    const totalDemand = demand.reduce((acc, val) => acc + val, 0);

    if (totalSupply > totalDemand) {
        // Add dummy column
        const dummyColumn = Array(supply.length).fill(0);
        for (let i = 0; i < costMatrix.length; i++) {
            costMatrix[i].push(0); // Cost for dummy column is 0
        }
        demand.push(totalSupply - totalDemand);
    } else if (totalDemand > totalSupply) {
        // Add dummy row
        const dummyRow = Array(demand.length).fill(0);
        costMatrix.push(dummyRow);
        supply.push(totalDemand - totalSupply);
    }
}

function northWestCorner(costMatrix, supply, demand) {
    let totalCost = 0;
    let i = 0, j = 0;
    let steps = '';
    while (i < supply.length && j < demand.length) {
        const minVal = Math.min(supply[i], demand[j]);
        totalCost += minVal * costMatrix[i][j];
        supply[i] -= minVal;
        demand[j] -= minVal;
        steps += `Allocate ${minVal} units from S${i+1} to D${j+1} at a cost of ${costMatrix[i][j]}. Remaining supply at S${i+1} is ${supply[i]} and remaining demand at D${j+1} is ${demand[j]}.<br><br>`;
        steps += `Matrix at this step:<br>${printMatrix(costMatrix, supply, demand)}<br>`;
        if (supply[i] === 0) i++;
        if (demand[j] === 0) j++;
    }
    return `Total Transportation Cost using NorthWest Corner Method: ${totalCost}<br><br><h2>Steps</h2>${steps}`;
}

function leastCost(costMatrix, supply, demand) {
    let totalCost = 0;
    const rows = supply.length;
    const cols = demand.length;
    let steps = '';
    while (true) {
        let minVal = Infinity;
        let minI = -1;
        let minJ = -1;

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (costMatrix[i][j] < minVal && supply[i] > 0 && demand[j] > 0) {
                    minVal = costMatrix[i][j];
                    minI = i;
                    minJ = j;
               }
            }
        }

        if (minVal === Infinity) break;

        const quantity = Math.min(supply[minI], demand[minJ]);
        totalCost += quantity * costMatrix[minI][minJ];
        supply[minI] -= quantity;
        demand[minJ] -= quantity;
        steps += `Allocate ${quantity} units from S${minI+1} to D${minJ+1} at a cost of ${costMatrix[minI][minJ]}. Remaining supply at S${minI+1} is ${supply[minI]} and remaining demand at D${minJ+1} is ${demand[minJ]}.<br><br>`;
        steps += `Matrix at this step:<br>${printMatrix(costMatrix, supply, demand)}<br>`;
    }

    return `Total Transportation Cost using Least Cost Method: ${totalCost}<br><br><h2>Steps</h2>${steps}`;
}

function vogelsApproximationMethod(costMatrix, supply, demand) {
    let totalCost = 0;
    let rows = supply.length;
    let cols = demand.length;
    let steps = '';

    while (rows > 0 && cols > 0) {
        const penalties = [];

        for (let i = 0; i < supply.length; i++) {
            if (supply[i] > 0) {
                let min1 = Infinity, min2 = Infinity;
                for (let j = 0; j < demand.length; j++) {
                    if (demand[j] > 0) {
                        if (costMatrix[i][j] < min1) {
                            min2 = min1;
                            min1 = costMatrix[i][j];
                        } else if (costMatrix[i][j] < min2) {
                            min2 = costMatrix[i][j];
                        }
                    }
                }
                penalties.push({ index: i, type: 'row', penalty: min2 - min1 });
            }
        }

        for (let j = 0; j < demand.length; j++) {
            if (demand[j] > 0) {
                let min1 = Infinity, min2 = Infinity;
                for (let i = 0; i < supply.length; i++) {
                    if (supply[i] > 0) {
                        if (costMatrix[i][j] < min1) {
                            min2 = min1;
                            min1 = costMatrix[i][j];
                        } else if (costMatrix[i][j] < min2) {
                            min2 = costMatrix[i][j];
                        }
                    }
                }
                penalties.push({ index: j, type: 'column', penalty: min2 - min1 });
            }
        }

        penalties.sort((a, b) => b.penalty - a.penalty);
        const highestPenalty = penalties[0];

        if (highestPenalty.type === 'row') {
            const i = highestPenalty.index;
            let minCost = Infinity;
            let minCol = -1;

            for (let j = 0; j < demand.length; j++) {
                if (demand[j] > 0 && costMatrix[i][j] < minCost) {
                    minCost = costMatrix[i][j];
                    minCol = j;
                }
            }

            const allocation = Math.min(supply[i], demand[minCol]);
            totalCost += allocation * minCost;
            supply[i] -= allocation;
            demand[minCol] -= allocation;

            steps += `Allocate ${allocation} units from S${i+1} to D${minCol+1} at a cost of ${minCost}. Remaining supply at S${i+1} is ${supply[i]} and remaining demand at D${minCol+1} is ${demand[minCol]}.<br><br>`;
            steps += `Matrix at this step:<br>${printMatrix(costMatrix, supply, demand)}<br>`;

            if (supply[i] === 0) {
                rows--;
            }
            if (demand[minCol] === 0) {
                cols--;
            }
        } else if (highestPenalty.type === 'column') {
            const j = highestPenalty.index;
            let minCost = Infinity;
            let minRow = -1;

            for (let i = 0; i < supply.length; i++) {
                if (supply[i] > 0 && costMatrix[i][j] < minCost) {
                    minCost = costMatrix[i][j];
                    minRow = i;
                }
            }

            const allocation = Math.min(supply[minRow], demand[j]);
            totalCost += allocation * minCost;
            supply[minRow] -= allocation;
            demand[j] -= allocation;

            steps += `Allocate ${allocation} units from S${minRow+1} to D${j+1} at a cost of ${minCost}. Remaining supply at S${minRow+1} is ${supply[minRow]} and remaining demand at D${j+1} is ${demand[j]}.<br><br>`;
            steps += `Matrix at this step:<br>${printMatrix(costMatrix, supply, demand)}<br>`;

            if (supply[minRow] === 0) {
                rows--;
            }
            if (demand[j] === 0) {
                cols--;
            }
        }
    }

    return `Total Transportation Cost using Vogel's Approximation Method: ${totalCost}<br><br><h2>Steps</h2>${steps}`;
}

function printMatrix(costMatrix, supply, demand) {
    let matrixHTML = '<table>';
    for (let i = 0; i < costMatrix.length; i++) {
        matrixHTML += '<tr>';
        for (let j = 0; j < costMatrix[i].length; j++) {
            matrixHTML += `<td>${costMatrix[i][j]}</td>`;
        }
        matrixHTML += `<td>${supply[i]}</td>`;
        matrixHTML += '</tr>';
    }
    matrixHTML += '<tr>';
    for (let j = 0; j < demand.length; j++) {
        matrixHTML += `<td>${demand[j]}</td>`;
    }
    matrixHTML += '</tr>';
    matrixHTML += '</table>';
    return matrixHTML;
}

function reset() {
    document.getElementById('input-section').style.display = 'block';
    document.getElementById('table-section').innerHTML = '';
    document.getElementById('method-section').style.display = 'none';
    document.getElementById('result-section').innerHTML = '';
    document.getElementById('reset-button').style.display = 'none';
}
