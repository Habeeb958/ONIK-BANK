function showSignupPage() {
    document.getElementById("signupPage").style.display = "block";
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("transactionsPage").style.display = "none";
    clearMessages();
}

// Show the Login Page
function showLoginPage() {
    document.getElementById("signupPage").style.display = "none";
    document.getElementById("loginPage").style.display = "block";
    document.getElementById("transactionsPage").style.display = "none";
    clearMessages();
}

// Show the Transactions Page
function showTransactionsPage() {
    document.getElementById("signupPage").style.display = "none";
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("transactionsPage").style.display = "block";
    clearMessages();
    loadTransactions(); // Fetch and display transactions
}

// Clear all messages
function clearMessages() {
    const signupMessageDiv = document.querySelector("#signupPage #message");
    const loginMessageDiv = document.querySelector("#loginPage #message");
    if (signupMessageDiv) signupMessageDiv.textContent = "";
    if (loginMessageDiv) loginMessageDiv.textContent = "";
}

// Handle Sign-Up Form Submission
document.getElementById("signUpForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const messageDiv = document.querySelector("#signupPage #message");
    messageDiv.textContent = ""; // Clear previous messages

    const formData = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        email: document.getElementById("email").value,
        phoneNumber: document.getElementById("phoneNumber").value,
        password: document.getElementById("password").value,
        confirmPassword: document.getElementById("confirmPassword").value
    };

    try {
        const response = await fetch("https://localhost:7056/api/Auth/RegisterUser", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok) {
            messageDiv.textContent = result.message || "Sign-up successful!";
            messageDiv.style.color = "darkgreen";
            e.target.reset(); // Clear form fields
        } else {
            messageDiv.textContent = result.message || "Sign-up failed. Please try again.";
            messageDiv.style.color = "red";
        }
    } catch (error) {
        messageDiv.textContent = "Failed to connect to the server. Please try again later.";
        messageDiv.style.color = "red";
    }
});


document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const messageDiv = document.querySelector("#loginPage #message") || document.createElement("div");
    messageDiv.textContent = "";
    messageDiv.style.color = ""; // Reset styles

    if (!document.querySelector("#loginPage #message")) {
        const form = document.getElementById("loginForm");
        form.parentNode.insertBefore(messageDiv, form);
    }

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (!email || !password) {
        messageDiv.textContent = "Please enter both email and password.";
        messageDiv.style.color = "red";
        return;
    }

    try {
        const response = await fetch("https://localhost:7056/api/Auth/Login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (!response.ok) {
            messageDiv.textContent = result.message || "Login failed. Please check your credentials.";
            messageDiv.style.color = "red";
        } else if (result.token) {
            localStorage.setItem("authToken", result.token); // Store token
            messageDiv.textContent = "Login successful!";
            messageDiv.style.color = "darkgreen";
            e.target.reset();
            setTimeout(() => showTransactionsPage(), 1000); // Navigate after showing success
        } else {
            messageDiv.textContent = "Unexpected server response.";
            messageDiv.style.color = "red";
        }
    } catch (error) {
        messageDiv.textContent = "Failed to connect to the server. Please try again later.";
        messageDiv.style.color = "red";
        console.error("Login Error:", error); // Log for debugging
    }
});


function logout() {
    const transactionsList = document.getElementById("transactionsList");
    const messageDiv = document.createElement("div");
    transactionsList.innerHTML = ""; // Clear transactions on logout
    transactionsList.appendChild(messageDiv);

    // Clear the token from localStorage
    localStorage.removeItem("authToken");

    // Display a logout confirmation message
    messageDiv.textContent = "You have been logged out successfully.";
    messageDiv.style.color = "darkgreen";

    // Reset the forms
    document.getElementById("signUpForm").reset(); // Clear the signup form fields
    document.getElementById("loginForm").reset(); // Clear the login form fields

    // Redirect to the signup page
    setTimeout(() => {
        showSignupPage(); // Show the signup page
        // Clear any lingering messages
        const loginMessage = document.querySelector("#loginPage #message");
        if (loginMessage) loginMessage.textContent = "";
        const signupMessage = document.querySelector("#signupPage #message");
        if (signupMessage) signupMessage.textContent = "";
    }, 1500); // Add a delay for the user to see the logout message
}



// Load Transactions
async function loadTransactions() {
    const transactionsList = document.getElementById("transactionsList");
    transactionsList.innerHTML = ""; // Clear previous transactions

    const token = localStorage.getItem("authToken");

    if (!token) {
        transactionsList.innerHTML = "<p>Please log in to view your transactions.</p>";
        return;
    }

    try {
        const response = await fetch("https://localhost:7056/api/Transactions", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` }
        });

        if (response.ok) {
            const transactions = await response.json();

            if (transactions.length === 0) {
                transactionsList.innerHTML = "<p>No transactions available.</p>";
            } else {
                const list = document.createElement("ul");
                transactions.forEach(transaction => {
                    const listItem = document.createElement("li");
                    listItem.textContent = `${transaction.date}: ${transaction.description} - $${transaction.amount}`;
                    list.appendChild(listItem);
                });
                transactionsList.appendChild(list);
            }
        } else {
            transactionsList.innerHTML = "<p>Failed to load transactions. Please try again later.</p>";
        }
    } catch (error) {
        transactionsList.innerHTML = "<p>Failed to connect to the server. Please try again later.</p>";
    }
}




















































































































