// SIGNUP SCRIPT
document.getElementById('signupForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission

    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    // Retrieve all users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Check if the email is already taken
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        alert('Email is already registered. Please use a different email.');
        return;
    }

    // Create new user object with unique data
    const newUser = {
        name,
        email,
        password,
        cart: [], // Initialize empty cart for the user
        orderHistory: [] // Initialize empty order history
    };

    // Add the new user to the users array
    users.push(newUser);

    // Save the updated users array to localStorage
    localStorage.setItem('users', JSON.stringify(users));

    alert('Account created successfully! Please log in.');
    window.location.href = 'login.html'; // Redirect to login page
});

// LOGIN SCRIPT
document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Retrieve all users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Find matching user
    const matchingUser = users.find(user => user.email === email && user.password === password);

    if (matchingUser) {
        // Save logged-in user details to localStorage
        localStorage.setItem('currentUser', JSON.stringify(matchingUser));
        localStorage.setItem('isLoggedIn', 'true'); // Set login status
        alert(`Welcome, ${matchingUser.name}!`);
        window.location.href = 'index.html'; // Redirect to homepage
    } else {
        alert('Invalid email or password. Please try again.');
    }
});

// CONFIRM ORDER FUNCTION
function confirmOrder() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
        alert('Please log in before placing an order.');
        window.location.href = 'login.html'; // Redirect to login page
        return;
    }

    // Retrieve current user and cart data
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const cart = currentUser.cart;

    if (!cart || cart.length === 0) {
        alert("Your cart is empty. Please add items before proceeding.");
        return;
    }

    // Process the order
    const orderTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const newOrder = {
        id: currentUser.orderHistory.length + 1,
        items: cart,
        total: orderTotal,
        date: new Date().toLocaleString()
    };

    // Update user's order history
    currentUser.orderHistory.push(newOrder);

    // Clear the user's cart
    currentUser.cart = [];

    // Save updated user data back to localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(user => user.email === currentUser.email);
    if (userIndex !== -1) {
        users[userIndex] = currentUser; // Update the specific user
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(currentUser)); // Update current user session
    }

    alert(`Order placed successfully! Your total is ₱${orderTotal}.`);
    window.location.href = 'thank-you.html'; // Redirect to thank you page
}

// CHECKOUT FUNCTION
function proceedToCheckout() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
        alert('Please log in before proceeding to checkout.');
        window.location.href = 'login.html'; // Redirect to login page
        return;
    }

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const cart = currentUser.cart;

    if (!cart || cart.length === 0) {
        alert("Your cart is empty. Please add items to proceed.");
        return;
    }

    window.location.href = 'checkout.html'; // Redirect to the checkout page
}

// LOGOUT FUNCTION
function logout() {
    if (confirm("Are you sure you want to log out?")) {
        localStorage.removeItem('currentUser'); // Remove the current user session
        localStorage.setItem('isLoggedIn', 'false'); // Reset login status
        alert("You have logged out successfully.");
        window.location.href = 'login.html'; // Redirect to login page
    }
}

// ADD ITEM TO CART FUNCTION (Optional)
function addToCart(item) {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
        alert('Please log in to add items to your cart.');
        window.location.href = 'login.html';
        return;
    }

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const cart = currentUser.cart;

    // Add item to the user's cart
    cart.push(item);

    // Save updated user data back to localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(user => user.email === currentUser.email);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(currentUser)); // Update session
    }

    alert(`${item.name} added to cart successfully!`);
}
