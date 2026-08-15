const passwordInput = document.getElementById('password-input');
const toggleVisibilityBtn = document.getElementById('toggle-visibility');
const inputContainer = document.getElementById('input-container');
const strengthBar = document.getElementById('strength-bar');
const strengthText = document.getElementById('strength-text');
const charCount = document.getElementById('char-count');

// Requirements elements
const reqLowercase = document.getElementById('req-lowercase');
const reqUppercase = document.getElementById('req-uppercase');
const reqNumber = document.getElementById('req-number');
const reqSpecial = document.getElementById('req-special');

const timeToCrackSection = document.getElementById('time-to-crack-section');
const timeValue = document.getElementById('time-value');
const reviewSection = document.getElementById('review-section');
const reviewText = document.getElementById('review-text');

// Toggle Password Visibility
toggleVisibilityBtn.addEventListener('change', (e) => {
    const type = e.target.checked ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
});

passwordInput.addEventListener('input', (e) => {
    const password = e.target.value;
    charCount.textContent = password.length;
    
    if (password.length === 0) {
        resetUI();
        return;
    }

    // Requirements Check
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    reqLowercase.classList.toggle('active', hasLowercase);
    reqUppercase.classList.toggle('active', hasUppercase);
    reqNumber.classList.toggle('active', hasNumber);
    reqSpecial.classList.toggle('active', hasSpecial);

    // Evaluate strength and time to crack using zxcvbn
    const evaluation = zxcvbn(password);
    
    let color = '';
    let text = '';
    let review = '';

    switch (evaluation.score) {
        case 0:
            color = 'var(--color-very-weak)';
            text = 'Very Weak';
            review = 'This password is very easy to guess. Please use a stronger password.';
            break;
        case 1:
            color = 'var(--color-weak)';
            text = 'Weak';
            review = 'This password can be cracked easily. Try adding more characters and symbols.';
            break;
        case 2:
            color = 'var(--color-medium)';
            text = 'Medium';
            review = 'A decent password, but could still be improved by adding length or complexity.';
            break;
        case 3:
            color = 'var(--color-strong)';
            text = 'Strong';
            review = 'Good job! This is a strong password.';
            break;
        case 4:
            color = 'var(--color-very-strong)';
            text = 'Very Strong';
            review = 'Fantastic, using that password makes you as secure as Fort Knox.';
            break;
    }

    // Apply color
    inputContainer.style.borderColor = color;
    inputContainer.style.boxShadow = color ? `0 0 20px ${color}40` : '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
    strengthBar.style.backgroundColor = color;
    strengthText.textContent = text;

    // Time to crack
    timeToCrackSection.style.display = 'block';
    
    // Format the time to be more readable
    let displayTime = evaluation.crack_times_display.offline_slow_hashing_1e4_per_second;
    
    if (displayTime === 'centuries') {
        displayTime = 'millions of years'; 
    }
    
    timeValue.textContent = displayTime;

    // Review
    reviewSection.style.display = 'block';
    
    let finalReview = review;
    if (evaluation.feedback.warning) {
         finalReview = evaluation.feedback.warning + '. ' + review;
    }
    reviewText.textContent = finalReview;
});

function resetUI() {
    inputContainer.style.borderColor = 'var(--border-default)';
    inputContainer.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
    strengthBar.style.backgroundColor = 'transparent';
    strengthText.textContent = '';
    
    reqLowercase.classList.remove('active');
    reqUppercase.classList.remove('active');
    reqNumber.classList.remove('active');
    reqSpecial.classList.remove('active');

    timeToCrackSection.style.display = 'none';
    reviewSection.style.display = 'none';
}

// Initialize empty state
resetUI();
