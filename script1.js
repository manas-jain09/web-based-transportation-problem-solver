document.getElementById('calculator-tab').addEventListener('click', () => {
    document.getElementById('calculator-section').classList.add('active');
    document.getElementById('algorithm-section').classList.add('hidden');
    document.getElementById('calculator-tab').classList.add('active');
    document.getElementById('algorithm-tab').classList.remove('active');
});

document.getElementById('algorithm-tab').addEventListener('click', () => {
    document.getElementById('calculator-section').classList.remove('active');
    document.getElementById('algorithm-section').classList.remove('hidden');
    document.getElementById('calculator-tab').classList.remove('active');
    document.getElementById('algorithm-tab').classList.add('active');
});

document.getElementById('go-button').addEventListener('click', () => {
    const selectedAlgorithm = document.getElementById('algorithm-select').value;
    const algorithmTitle = document.getElementById('algorithm-title');
    const algorithmDescription = document.getElementById('algorithm-description');
    const algorithmFlowchart = document.getElementById('algorithm-flowchart');

    if (selectedAlgorithm === 'nw') {
        algorithmTitle.textContent = 'NorthWest Corner Method Algorithm';
        algorithmDescription.innerHTML = 
            "1. Start with the cell in the top-left corner (north-west corner) of the cost matrix.<br>" +
            "2. Allocate as much as possible to the selected cell and adjust the supply and demand.<br>" +
            "3. Move to the next cell to the right if the current column's demand is met, or move down if the current row's supply is exhausted.<br>" +
            "4. Repeat steps 2-3 until all supply and demand are met.";
        algorithmFlowchart.src = 'nw.png';
        algorithmFlowchart.alt = 'NorthWest Method Flowchart';
    } else if (selectedAlgorithm === 'lc') {
        algorithmTitle.textContent = 'Least Cost Method Algorithm';
        algorithmDescription.innerHTML = 
            "1. Identify the cell with the lowest cost in the cost matrix.<br>" +
            "2. Allocate as much as possible to the selected cell and adjust the supply and demand.<br>" +
            "3. Cross out the row or column that has been satisfied.<br>" +
            "4. Repeat steps 1-3 until all supply and demand are met.";
        algorithmFlowchart.src = 'lc.png';
        algorithmFlowchart.alt = 'Least Cost Method Flowchart';
    } else if (selectedAlgorithm === 'vam') {
        algorithmTitle.textContent = "Vogel's Approximation Method Algorithm";
        algorithmDescription.innerHTML = 
            "1. For each row and column, calculate the penalty cost (difference between the two lowest costs).<br>" +
            "2. Identify the row or column with the highest penalty cost.<br>" +
            "3. Allocate as much as possible to the cell with the lowest cost in the selected row or column and adjust the supply and demand.<br>" +
            "4. Cross out the row or column that has been satisfied and recalculate penalties.<br>" +
            "5. Repeat steps 1-4 until all supply and demand are met.";
        algorithmFlowchart.src = 'vam.png';
        algorithmFlowchart.alt = "Vogel's Approximation Method Flowchart";
    }
});
