const amountInput = document.getElementById('amount');
const categoryInput = document.getElementById('category');
const dateInput = document.getElementById('date');
const addExpenseBtn = document.getElementById('addExpenseBtn');

const expenseList = document.querySelector('#expenseList tbody');

const totalAmount = document.getElementById('totalAmount');
const expenseChart = document.getElementById('expenseChart').getContext('2d');

let expenses = [];
let editIndex = -1; // To track the index of the expense being edited

// Load expenses from local storage on page load
document.addEventListener('DOMContentLoaded', loadExpenses);

// Add or update expense on button click
addExpenseBtn.addEventListener('click', function () {
    const amount = amountInput.value;
    const category = categoryInput.value;
    const date = dateInput.value;

    if (amount && category && date) {
        const expense = {//create a obj called expense
            amount: parseFloat(amount),
            category,
            date
        };

        if (editIndex === -1) {
            // Add new expense
            expenses.push(expense);
        } else {
            // Update existing expense
            expenses[editIndex] = expense;
            editIndex = -1;
            addExpenseBtn.textContent = 'Add Expense'; // Reset button text
        }

        saveToLocalStorage(expenses);
        displayExpenses();
        updateTotal();
        updateChart();
        clearInputs();
    } else {
        alert('Please fill in all fields.');
    }
});



// Load expenses from local storage
function loadExpenses() {
    const savedExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
    expenses = savedExpenses;
    displayExpenses();
    updateTotal();
    updateChart();
}

// Display all expenses in the list
function displayExpenses() {
    expenseList.innerHTML = ''; // Clear previous list
    expenses.forEach((expense, index) => {
        const row = document.createElement('tr');
    row.innerHTML = `
             <td>${expense.category}</td><td> $${expense.amount.toFixed(2)}</td><td> ${expense.date} </td>
          <td>  <button onclick="editExpense(${index})">Edit</button>
            <button onclick="deleteExpense(${index})">Delete</button></td>
        `;
        expenseList.appendChild(row);
    });
}

// Edit an expense
function editExpense(index) {
    const expense = expenses[index];
    amountInput.value = expense.amount;
    categoryInput.value = expense.category;
    dateInput.value = expense.date;

    editIndex = index; // Set the current index to be edited
    addExpenseBtn.textContent = 'Update Expense'; // Change button text
}

// Delete an expense
function deleteExpense(index) {
    if (confirm('Are you sure you want to delete this expense?')) {
        expenses.splice(index, 1); // Remove the expense at the index
        saveToLocalStorage(expenses);
        displayExpenses();
        updateTotal();
        updateChart();
    }
}

// Clear form inputs after adding or editing an expense
function clearInputs() {
    amountInput.value = '';
    categoryInput.value = '';
    dateInput.value = '';
}

// Update total amount
function updateTotal() {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    totalAmount.textContent = `$${total.toFixed(2)}`;
}

// Save expenses to local storage
function saveToLocalStorage(expenses) {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}





// Update pie chart
function updateChart() {
    const categories = {};
    expenses.forEach(expense => {
        categories[expense.category] = (categories[expense.category] || 0) + expense.amount;
    });

    const chartData = {
        labels: Object.keys(categories),
        datasets: [{
            data: Object.values(categories),
            backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#28a745'],
        }]
    };

    // Destroy the previous chart before drawing a new one
    if (window.myChart) {
        window.myChart.destroy();
    }

    window.myChart = new Chart(expenseChart, {
        type: 'pie',
        data: chartData
    });
}
