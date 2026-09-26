let budget = Number(localStorage.getItem("budget")) || 0;
let expenses =
    JSON.parse(localStorage.getItem("expenses")) || [];
let currentFilter = "all";
const expenseForm = document.getElementById("ExpenseForm");
const budgetInput = document.getElementById("Budget");
const categoryInput = document.getElementById("category");
const amountInput = document.getElementById("amount");
const dateInput = document.getElementById("date");
const budgetElement = document.getElementById("budget");
const expenseElement = document.getElementById("expense");
const budgetLeftElement = document.getElementById("budgetLeft");
const transactionList = document.getElementById("transactionList");
const transactionCount = document.getElementById("transactionCount");
const today = new Date();
const year = today.getFullYear();

const month =  String(today.getMonth() + 1).padStart(2, "0");
const day =  String(today.getDate()).padStart(2, "0");

dateInput.value = `${year}-${month}-${day}`;

// ===============================
// CREATE CIRCULAR CHART
// ===============================
function createChart() {
    let chartBox = document.getElementById("budgetChartBox");

    if (!chartBox) {
        chartBox =  document.createElement("div");
        chartBox.id = "budgetChartBox";
        chartBox.innerHTML = `
            <div class="chart-title">
                <h3>Budget Overview</h3>
                <p>Budget & Expense</p>
            </div>
            <div class="circle-chart">
                <canvas
                    id="budgetChart"
                    width="220"
                    height="220">
                </canvas>
            </div>
        `;
        const leftSection = document.querySelector(".left-section");
        leftSection.prepend(chartBox);
    }
    drawChart();
}
// ===============================
// DRAW CIRCULAR CHART
// ===============================

function drawChart() {
    const canvas = document.getElementById("budgetChart");

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const totalBudget = budget;
    const totalExpense = expenses.reduce(
        (sum, item) => sum + Number(item.amount),
        0
    );

    const budgetLeft = Math.max(totalBudget - totalExpense, 0);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (totalBudget <= 0) {
        ctx.beginPath();
        ctx.moveTo(110, 110);
        ctx.arc(110, 110, 90, 0, Math.PI * 2);
        ctx.closePath();

        ctx.fillStyle = "#e5e7eb";
        ctx.fill();
        return;
    }

    const centerX = 110;
    const centerY = 110;
    const radius = 90;

    const budgetLeftPercent = budgetLeft / totalBudget;
    const expensePercent = Math.min(totalExpense / totalBudget, 1);

    let startAngle = -Math.PI / 2;

    if (budgetLeft > 0) {
        const budgetLeftAngle =
            Math.PI * 2 * budgetLeftPercent;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);

        ctx.arc(
            centerX,
            centerY,
            radius,
            startAngle,
            startAngle + budgetLeftAngle
        );

        ctx.closePath();

        ctx.fillStyle = "#4a86e8";
        ctx.fill();

        startAngle += budgetLeftAngle;
    }

    if (totalExpense > 0) {
        const expenseAngle =
            Math.PI * 2 * expensePercent;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);

        ctx.arc(
            centerX,
            centerY,
            radius,
            startAngle,
            startAngle + expenseAngle
        );

        ctx.closePath();

        ctx.fillStyle = "#ff5b4d";
        ctx.fill();
    }

    const chartBalance = document.getElementById("chartBalance");
    const chartBudget = document.getElementById("chartBudget");
    const chartExpense = document.getElementById("chartExpense");

    if (chartBalance) {
        chartBalance.innerText =
            `₹${budgetLeft.toLocaleString("en-IN")}`;
    }

    if (chartBudget) {
        chartBudget.innerText =
            `₹${totalBudget.toLocaleString("en-IN")}`;
    }

    if (chartExpense) {
        chartExpense.innerText =
            `₹${totalExpense.toLocaleString("en-IN")}`;
    }
}


// ===============================
// UPDATE CHART TEXT
// ===============================

function updateChartText(
    totalBudget,
    totalExpense,
    budgetLeft
) {

    const chartBudget =
        document.getElementById("chartBudget");

    const chartExpense =
        document.getElementById("chartExpense");

    const chartBalance =
        document.getElementById("chartBalance");


    if (chartBudget) {

        chartBudget.innerText =
            `₹${totalBudget.toLocaleString("en-IN")}`;

    }


    if (chartExpense) {

        chartExpense.innerText =
            `₹${totalExpense.toLocaleString("en-IN")}`;

    }


    if (chartBalance) {

        chartBalance.innerText =
            `₹${budgetLeft.toLocaleString("en-IN")}`;

    }

}

// ===============================
// FORM SUBMIT
// ===============================

expenseForm.addEventListener(
    "submit",
    function (e) {

        e.preventDefault();


        const submitButton =
            e.submitter;
        if (
            submitButton.innerText.trim()
            === "Add Budget"
        ) {

            const budgetValue =
                Number(budgetInput.value);


            if (
                !budgetValue ||
                budgetValue <= 0
            ) {

                alert(
                    "Please enter a valid budget."
                );

                return;
            }


            budget =
                budgetValue;

            localStorage.setItem(
                "budget",
                budget
            );


            budgetInput.value = "";


            updateDashboard();

            alert(
                "Budget added successfully!"
            );

            return;

        }
        if (
            submitButton.innerText.trim()
            === "Add Expense"
        ) {

            const category =
                categoryInput.value;


            const amount =
                Number(amountInput.value);


            const date =
                dateInput.value;

            if (
                !category ||
                category === "Salary"
            ) {

                alert(
                    "Please select a category."
                );

                return;
            }
            if (
                !amount ||
                amount <= 0
            ) {

                alert(
                    "Please enter a valid amount."
                );

                return;
            }


            if (!date) {

                alert(
                    "Please select a date."
                );

                return;
            }

            const totalExpense =
                expenses.reduce(
                    (total, item) =>
                        total + Number(item.amount),
                    0
                );


            const remainingBudget =
                budget - totalExpense;


            if (budget <= 0) {

                alert(
                    "Please add your budget first."
                );

                return;
            }


            if (amount > remainingBudget) {

                alert(
                    "Expense cannot be greater than your remaining budget."
                );

                return;
            }


            const expense = {

                id: Date.now(),

                category:
                    category,

                amount:
                    amount,

                date:
                    date,

                type:
                    "expense"

            };


       
            expenses.push(
                expense
            );


           localStorage.setItem(
                "expenses",
                JSON.stringify(expenses)
            );


            amountInput.value = "";


            categoryInput.value =
                "Salary";
            updateDashboard();

            renderTransactions();

        }

    }
);

// ===============================
// UPDATE DASHBOARD
// ===============================

function updateDashboard() {

    const totalExpense =
        expenses.reduce(
            (total, item) =>
                total + Number(item.amount),
            0
        );


    const budgetLeft =
        budget - totalExpense;


    budgetElement.innerText =
        `₹${budget.toLocaleString("en-IN")}`;

    expenseElement.innerText =
        `₹${totalExpense.toLocaleString("en-IN")}`;



    budgetLeftElement.innerText =
        `₹${Math.max(
            budgetLeft,
            0
        ).toLocaleString("en-IN")}`;



    transactionCount.innerText =
        expenses.length;

    drawChart();

}
// ===============================
// RENDER TRANSACTIONS
// ===============================

function renderTransactions() {

    transactionList.innerHTML =
        "";


    let filteredExpenses =
        expenses;

    if (
        filteredExpenses.length === 0
    ) {

        transactionList.innerHTML = `

            <div class="empty-state">

                <h3>
                    No transactions yet
                </h3>

                <p>
                    Add your first expense
                    to get started.
                </p>

            </div>

        `;

        return;
    }


    // ===========================
    // TRANSACTIONS
    // ===========================

    filteredExpenses
        .slice()
        .reverse()
        .forEach(
            function (item) {

                const transaction =
                    document.createElement(
                        "div"
                    );


                transaction.className =
                    "transaction-item";


                transaction.innerHTML = `

                    <div class="transaction-left">

                       


                        <div class="transaction-info">

                            <h4>
                                ${item.category}
                            </h4>

                            <p>
                                ${formatDate(
                    item.date
                )}
                            </p>

                        </div>

                    </div>


                    <div class="transaction-right">

                        <span class="transaction-amount expense">

                            - ₹${Number(
                    item.amount
                ).toLocaleString(
                    "en-IN"
                )}

                        </span>


                        <button
                            class="delete-btn"
                            onclick="deleteExpense(${item.id})"
                        >

                            <i class="fa-solid fa-trash"></i>

                        </button>

                    </div>

                `;


                transactionList.appendChild(
                    transaction
                );

            }
        );

}
// ===============================
// DELETE EXPENSE
// ===============================

function deleteExpense(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this expense?"
        );


    if (!confirmDelete) {

        return;

    }


    expenses =
        expenses.filter(
            item => item.id !== id
        );


   
    localStorage.setItem(
        "expenses",
        JSON.stringify(expenses)
    );


  
    updateDashboard();

    renderTransactions();

}
// ===============================
// FORMAT DATE
// ===============================

function formatDate(date) {

    const dateObject =
        new Date(date);


    return dateObject.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}

// ===============================
// INITIAL LOAD
// ===============================

createChart();

updateDashboard();

renderTransactions();
