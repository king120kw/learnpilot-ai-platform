document.addEventListener('DOMContentLoaded', () => {
    // --- State Management ---
    let currentUserData = null; // To hold the fetched profile data
    const onboardingData = {
        name: '',
        age: 19,
        weight: 62,
        weightUnit: 'kg',
        goal: 'Maintain weight',
        gender: 'Male',
        height: 175,
        heightUnit: 'cm',
        activityLevel: 'Sedentary',
        dietaryPreferences: [],
        allergies: '',
        sleepHours: 8,
        smoking: false,
        alcohol: false,
        budget: 0,
    };

    // --- DOM Elements ---
    const screens = {
        welcome: document.getElementById('welcome-screen'),
        signup: document.getElementById('signup-screen'),
        login: document.getElementById('login-screen'),
        name: document.getElementById('name-screen'),
        age: document.getElementById('age-screen'),
        weight: document.getElementById('weight-screen'),
        goal: document.getElementById('goal-screen'),
        gender: document.getElementById('gender-screen'),
        height: document.getElementById('height-screen'),
        activityLevel: document.getElementById('activity-level-screen'),
        dietaryPreferences: document.getElementById('dietary-preferences-screen'),
        lifestyleHabits: document.getElementById('lifestyle-habits-screen'),
        budget: document.getElementById('budget-screen'),
        finalOnboarding: document.getElementById('final-onboarding-screen'),
        dashboard: document.getElementById('dashboard-screen'),
        profile: document.getElementById('profile-screen'),
        editProfile: document.getElementById('edit-profile-screen'),
    };

    // --- API Helper ---
    async function apiCall(endpoint, method = 'GET', body = null) {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const token = localStorage.getItem('token');
        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        if (body) {
            options.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(`http://127.0.0.1:5000${endpoint}`, options);
            const data = await response.json();
            if (!response.ok) {
                alert(data.error || 'An API error occurred.');
                return null;
            }
            return data;
        } catch (error) {
            console.error('API call failed:', error);
            alert('Could not connect to the server.');
            return null;
        }
    }

    // --- UI Update Functions ---
    function calculateBMR(data) {
        const weightKg = data.weightUnit === 'lbs' ? data.weight / 2.20462 : parseFloat(data.weight);
        const heightCm = data.heightUnit === 'ft' ? data.height * 30.48 : parseFloat(data.height);
        let bmr = 10 * weightKg + 6.25 * heightCm - 5 * data.age;
        if (data.gender === 'Male') bmr += 5;
        else if (data.gender === 'Female') bmr -= 161;
        return bmr;
    }

    function calculateTDEE(data) {
        const bmr = calculateBMR(data);
        const activityMultipliers = { 'Sedentary': 1.2, 'Lightly Active': 1.375, 'Active': 1.55, 'Very Active': 1.725 };
        return bmr * (activityMultipliers[data.activityLevel] || 1.2);
    }

    function calculateMacros(data) {
        const tdee = calculateTDEE(data);
        let calories = tdee + ({ 'Lose weight': -500, 'Gain weight': 500, 'Maintain weight': 0 }[data.goal] || 0);
        return {
            calories: Math.round(calories),
            protein: Math.round((calories * 0.30) / 4),
            carbs: Math.round((calories * 0.40) / 4),
            fat: Math.round((calories * 0.30) / 9),
        };
    }

    function updateFinalOnboardingScreen() {
        const macros = calculateMacros(onboardingData);
        document.getElementById('calorie-target').textContent = macros.calories.toLocaleString();
        document.getElementById('protein-target').textContent = `${macros.protein}g`;
        document.getElementById('carb-target').textContent = `${macros.carbs}g`;
        document.getElementById('fat-target').textContent = `${macros.fat}g`;
    }

    async function updateDashboard() {
        const profileData = await apiCall('/user/profile');
        if (profileData) {
            const macros = calculateMacros(profileData);
            document.getElementById('dashboard-user-name').textContent = profileData.name || 'User';
            document.querySelector('#dashboard-screen .card-calorie-intake').textContent = `${macros.calories} Kcal`;
            document.querySelector('#dashboard-screen .card-protein').textContent = `${macros.protein}g`;
            document.querySelector('#dashboard-screen .card-fat').textContent = `${macros.fat}g`;
            document.querySelector('#dashboard-screen .card-carb').textContent = `${macros.carbs}g`;
            document.querySelector('#dashboard-screen .journey-target').textContent = macros.calories.toLocaleString();
            document.querySelector('#dashboard-screen .journey-remaining').textContent = macros.calories.toLocaleString();
        }
    }

    async function updateProfileScreen() {
        const profileData = await apiCall('/user/profile');
        if (profileData) {
            currentUserData = profileData;
            document.getElementById('profile-user-name').textContent = profileData.name || 'User';
            document.getElementById('profile-age').textContent = profileData.age || 'N/A';
            document.getElementById('profile-height').textContent = `${profileData.height || ''}${profileData.height_unit || ''}`;
            document.getElementById('profile-weight').textContent = `${profileData.weight || ''}${profileData.weight_unit || ''}`;
        }
    }

    function populateEditProfileForm() {
        if (currentUserData) {
            document.getElementById('edit-name').value = currentUserData.name || '';
            document.getElementById('edit-age').value = currentUserData.age || '';
            document.getElementById('edit-weight').value = currentUserData.weight || '';
            document.getElementById('edit-height').value = currentUserData.height || '';
            document.getElementById('edit-goal').value = currentUserData.goal || 'Maintain weight';
        }
    }

    function showScreen(screenName) {
        Object.values(screens).forEach(s => s.classList.add('hidden'));
        if (screens[screenName]) {
            screens[screenName].classList.remove('hidden');
            if (screenName === 'dashboard') updateDashboard();
            if (screenName === 'profile') updateProfileScreen();
            if (screenName === 'editProfile') populateEditProfileForm();
            if (screenName === 'finalOnboarding') updateFinalOnboardingScreen();
        }
    }

    // --- Event Listeners ---
    document.getElementById('welcome-signup-btn').addEventListener('click', () => showScreen('signup'));
    document.getElementById('welcome-login-btn').addEventListener('click', () => showScreen('login'));
    document.getElementById('signup-back-btn').addEventListener('click', () => showScreen('welcome'));
    document.getElementById('login-back-btn').addEventListener('click', () => showScreen('welcome'));
    document.getElementById('switch-to-login-btn').addEventListener('click', () => showScreen('login'));
    document.getElementById('switch-to-signup-btn').addEventListener('click', () => showScreen('signup'));
    document.getElementById('edit-profile-btn').addEventListener('click', () => showScreen('editProfile'));
    document.getElementById('edit-profile-back-btn').addEventListener('click', () => showScreen('profile'));

    document.getElementById('signup-submit-btn').addEventListener('click', async () => {
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const data = await apiCall('/auth/signup', 'POST', { email, password });
        if (data) {
            alert('Signup successful! Please log in.');
            showScreen('login');
        }
    });

    document.getElementById('login-submit-btn').addEventListener('click', async () => {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const data = await apiCall('/auth/login', 'POST', { email, password });
        if (data && data.token) {
            localStorage.setItem('token', data.token);
            const profileData = await apiCall('/user/profile');
            if (profileData && profileData.age) { // Check if profile is filled
                showScreen('dashboard');
            } else {
                showScreen('name');
            }
        }
    });

    document.getElementById('edit-profile-save-btn').addEventListener('click', async () => {
        const profileToUpdate = { ...currentUserData }; // Start with existing data
        profileToUpdate.name = document.getElementById('edit-name').value;
        profileToUpdate.age = parseInt(document.getElementById('edit-age').value, 10);
        profileToUpdate.weight = parseFloat(document.getElementById('edit-weight').value);
        profileToUpdate.height = parseFloat(document.getElementById('edit-height').value);
        profileToUpdate.goal = document.getElementById('edit-goal').value;

        const data = await apiCall('/user/profile', 'POST', profileToUpdate);
        if (data) {
            alert('Profile updated successfully!');
            showScreen('profile');
        }
    });

    document.getElementById('final-onboarding-finish-btn').addEventListener('click', async () => {
        const data = await apiCall('/user/profile', 'POST', onboardingData);
        if (data) showScreen('dashboard');
    });

    // Onboarding navigation
    document.getElementById('name-continue-btn').addEventListener('click', () => showScreen('age'));
    document.getElementById('name-back-btn').addEventListener('click', () => showScreen('login'));
    document.getElementById('age-continue-btn').addEventListener('click', () => showScreen('weight'));
    document.getElementById('age-back-btn').addEventListener('click', () => showScreen('name'));
    document.getElementById('weight-continue-btn').addEventListener('click', () => showScreen('goal'));
    document.getElementById('weight-back-btn').addEventListener('click', () => showScreen('age'));
    document.getElementById('goal-continue-btn').addEventListener('click', () => showScreen('gender'));
    document.getElementById('goal-back-btn').addEventListener('click', () => showScreen('weight'));
    document.getElementById('gender-continue-btn').addEventListener('click', () => showScreen('height'));
    document.getElementById('gender-back-btn').addEventListener('click', () => showScreen('goal'));
    document.getElementById('height-continue-btn').addEventListener('click', () => showScreen('activityLevel'));
    document.getElementById('height-back-btn').addEventListener('click', () => showScreen('gender'));
    document.getElementById('activity-level-continue-btn').addEventListener('click', () => showScreen('dietaryPreferences'));
    document.getElementById('activity-level-back-btn').addEventListener('click', () => showScreen('height'));
    document.getElementById('dietary-preferences-continue-btn').addEventListener('click', () => showScreen('lifestyleHabits'));
    document.getElementById('dietary-preferences-back-btn').addEventListener('click', () => showScreen('activityLevel'));
    document.getElementById('lifestyle-habits-continue-btn').addEventListener('click', () => showScreen('budget'));
    document.getElementById('lifestyle-habits-back-btn').addEventListener('click', () => showScreen('dietaryPreferences'));
    document.getElementById('budget-continue-btn').addEventListener('click', () => showScreen('finalOnboarding'));
    document.getElementById('budget-back-btn').addEventListener('click', () => showScreen('lifestyleHabits'));
    document.getElementById('final-onboarding-back-btn').addEventListener('click', () => showScreen('budget'));

    // Bottom navigation
    document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const label = item.querySelector('.nav-label').textContent.toLowerCase();
            const screenMap = { 'dashboard': 'dashboard', 'profile': 'profile' };
            if (screenMap[label]) showScreen(screenMap[label]);
        });
    });

    // Onboarding data binding
    document.getElementById('name-input').addEventListener('input', e => onboardingData.name = e.target.value);
    document.querySelector('#age-screen .age-options').addEventListener('click', e => {
        if (e.target.tagName === 'DIV' && !isNaN(parseInt(e.target.textContent))) {
            onboardingData.age = parseInt(e.target.textContent);
        }
    });
    document.getElementById('weight-input').addEventListener('input', e => onboardingData.weight = parseFloat(e.target.value));
    document.querySelectorAll('#weight-screen .unit-button').forEach(b => b.addEventListener('click', () => {
        onboardingData.weightUnit = b.textContent.toLowerCase();
    }));
    document.querySelectorAll('#goal-screen .goal-option').forEach(o => o.addEventListener('click', () => {
        onboardingData.goal = o.querySelector('.goal-text').textContent;
    }));
    document.querySelectorAll('#gender-screen .gender-option').forEach(o => o.addEventListener('click', () => {
        onboardingData.gender = o.querySelector('.gender-text').textContent;
    }));
    document.getElementById('height-input').addEventListener('input', e => onboardingData.height = parseFloat(e.target.value));
    document.querySelectorAll('#height-screen .unit-button').forEach(b => b.addEventListener('click', () => {
        onboardingData.heightUnit = b.textContent.toLowerCase();
    }));
    document.querySelectorAll('#activity-level-screen .goal-option').forEach(o => o.addEventListener('click', () => {
        onboardingData.activityLevel = o.querySelector('.goal-text').textContent;
    }));
    document.querySelectorAll('#dietary-preferences-screen .goal-option').forEach(o => o.addEventListener('click', () => {
        const preference = o.querySelector('.goal-text').textContent;
        if (o.classList.contains('selected')) {
            onboardingData.dietaryPreferences.push(preference);
        } else {
            onboardingData.dietaryPreferences = onboardingData.dietaryPreferences.filter(p => p !== preference);
        }
    }));
    document.getElementById('allergies-input').addEventListener('input', e => onboardingData.allergies = e.target.value);
    document.getElementById('sleep-hours-input').addEventListener('input', e => onboardingData.sleepHours = parseInt(e.target.value, 10));
    document.querySelectorAll('#lifestyle-habits-screen .goal-option').forEach(o => o.addEventListener('click', () => {
        const habit = o.querySelector('.goal-text').textContent;
        if (habit.includes('smoke')) onboardingData.smoking = o.classList.contains('selected');
        else if (habit.includes('alcohol')) onboardingData.alcohol = o.classList.contains('selected');
    }));
    document.getElementById('budget-input').addEventListener('input', e => onboardingData.budget = parseFloat(e.target.value));
});
