// auth.js - Authentication handling
const Auth = {
    // Check if user is logged in
    isLoggedIn: function() {
        return localStorage.getItem('isLoggedIn') === 'true';
    },
    
    // Login function
    login: function(email, remember = false) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        
        if (remember) {
            // Set long-term storage
            localStorage.setItem('rememberMe', 'true');
        }
    },
    
    // Logout function
    logout: function() {
        localStorage.removeItem('isLoggedIn');
        
        if (localStorage.getItem('rememberMe') !== 'true') {
            localStorage.removeItem('userEmail');
        }
    },
    
    // Get current user
    getCurrentUser: function() {
        return localStorage.getItem('userEmail');
    },
    
    // Check authentication on page load
    init: function() {
        // For protected pages, redirect to login if not authenticated
        const protectedPages = ['dashboard.html'];
        const currentPage = window.location.pathname.split('/').pop();
        
        if (protectedPages.includes(currentPage) && !this.isLoggedIn()) {
            window.location.href = 'login.html';
        }
        
        // Update UI based on auth status
        this.updateAuthUI();
    },
    
    // Update UI elements based on authentication status
    updateAuthUI: function() {
        const loginButtons = document.querySelectorAll('a[href="login.html"]');
        const logoutButtons = document.querySelectorAll('a[href="#logout"]');
        
        if (this.isLoggedIn()) {
            // User is logged in
            loginButtons.forEach(button => {
                button.textContent = 'Dashboard';
                button.href = 'dashboard.html';
            });
            
            // Show logout buttons
            logoutButtons.forEach(button => {
                button.style.display = 'inline-block';
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.logout();
                    window.location.reload();
                });
            });
        } else {
            // User is not logged in
            logoutButtons.forEach(button => {
                button.style.display = 'none';
            });
        }
    }
};

// Initialize auth when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    Auth.init();
});