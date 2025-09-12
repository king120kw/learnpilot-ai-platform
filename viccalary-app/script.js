document.addEventListener('DOMContentLoaded', () => {
    const userData = {
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
        macros: {
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
        }
    };

    const screens = {
        welcome: document.getElementById('welcome-screen'),
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
    };

    const buttons = {
        welcome: {
            start: document.getElementById('welcome-start-btn'),
        },
        name: {
            back: document.getElementById('name-back-btn'),
            continue: document.getElementById('name-continue-btn'),
        },
        age: {
            back: document.getElementById('age-back-btn'),
            continue: document.getElementById('age-continue-btn'),
            skip: document.getElementById('age-skip-btn'),
        },
        weight: {
            back: document.getElementById('weight-back-btn'),
            continue: document.getElementById('weight-continue-btn'),
            skip: document.getElementById('weight-skip-btn'),
        },
        goal: {
            back: document.getElementById('goal-back-btn'),
            continue: document.getElementById('goal-continue-btn'),
            skip: document.getElementById('goal-skip-btn'),
        },
        gender: {
            back: document.getElementById('gender-back-btn'),
            continue: document.getElementById('gender-continue-btn'),
            skip: document.getElementById('gender-skip-btn'),
        },
        height: {
            back: document.getElementById('height-back-btn'),
            continue: document.getElementById('height-continue-btn'),
            skip: document.getElementById('height-skip-btn'),
        },
        activityLevel: {
            back: document.getElementById('activity-level-back-btn'),
            continue: document.getElementById('activity-level-continue-btn'),
            skip: document.getElementById('activity-level-skip-btn'),
        },
        dietaryPreferences: {
            back: document.getElementById('dietary-preferences-back-btn'),
            continue: document.getElementById('dietary-preferences-continue-btn'),
            skip: document.getElementById('dietary-preferences-skip-btn'),
        },
        lifestyleHabits: {
            back: document.getElementById('lifestyle-habits-back-btn'),
            continue: document.getElementById('lifestyle-habits-continue-btn'),
            skip: document.getElementById('lifestyle-habits-skip-btn'),
        },
        budget: {
            back: document.getElementById('budget-back-btn'),
            continue: document.getElementById('budget-continue-btn'),
            skip: document.getElementById('budget-skip-btn'),
        },
        finalOnboarding: {
            back: document.getElementById('final-onboarding-back-btn'),
            finish: document.getElementById('final-onboarding-finish-btn'),
        }
    };

    function calculateBMR() {
        const weightKg = userData.weightUnit === 'lbs' ? userData.weight / 2.20462 : parseFloat(userData.weight);
        const heightCm = userData.heightUnit === 'ft' ? userData.height * 30.48 : parseFloat(userData.height);
        let bmr = 10 * weightKg + 6.25 * heightCm - 5 * userData.age;
        if (userData.gender === 'Male') {
            bmr += 5;
        } else if (userData.gender === 'Female') {
            bmr -= 161;
        }
        return bmr;
    }

    function calculateTDEE() {
        const bmr = calculateBMR();
        const activityMultipliers = {
            'Sedentary': 1.2,
            'Lightly Active': 1.375,
            'Active': 1.55,
            'Very Active': 1.725,
        };
        const multiplier = activityMultipliers[userData.activityLevel] || 1.2;
        return bmr * multiplier;
    }

    function calculateMacros() {
        const tdee = calculateTDEE();
        let calories = tdee;

        const goalAdjustments = {
            'Lose weight': -500,
            'Gain weight': 500,
            'Maintain weight': 0,
        };
        calories += goalAdjustments[userData.goal] || 0;

        // Protein: 4 kcal/g, Carbs: 4 kcal/g, Fat: 9 kcal/g
        const proteinGrams = (calories * 0.30) / 4; // 30% from protein
        const carbGrams = (calories * 0.40) / 4;    // 40% from carbs
        const fatGrams = (calories * 0.30) / 9;     // 30% from fat

        userData.macros = {
            calories: Math.round(calories),
            protein: Math.round(proteinGrams),
            carbs: Math.round(carbGrams),
            fat: Math.round(fatGrams),
        };
        return userData.macros;
    }

    function updateFinalOnboardingScreen() {
        const { calories, protein, carbs, fat } = calculateMacros();
        document.getElementById('calorie-target').textContent = calories.toLocaleString();
        document.getElementById('protein-target').textContent = `${protein}g`;
        document.getElementById('carb-target').textContent = `${carbs}g`;
        document.getElementById('fat-target').textContent = `${fat}g`;
    }

    function updateDashboard() {
        // Update Name
        const dashboardName = document.getElementById('dashboard-user-name');
        if (dashboardName) {
            console.log('Updating dashboard with name:', userData.name);
            dashboardName.textContent = userData.name || 'User';
        }

        // Update main calorie card
        const calorieIntake = document.querySelector('#dashboard-screen .card-calorie-intake');
        if(calorieIntake) {
            calorieIntake.textContent = `${userData.macros.calories} Kcal`;
        }
        const proteinIntake = document.querySelector('#dashboard-screen .card-protein');
        if(proteinIntake) {
            proteinIntake.textContent = `${userData.macros.protein}g`;
        }
        const fatIntake = document.querySelector('#dashboard-screen .card-fat');
        if(fatIntake) {
            fatIntake.textContent = `${userData.macros.fat}g`;
        }
        const carbIntake = document.querySelector('#dashboard-screen .card-carb');
        if(carbIntake) {
            carbIntake.textContent = `${userData.macros.carbs}g`;
        }

        // Update "Track your diet journey" card
        const journeyTarget = document.querySelector('#dashboard-screen .journey-target');
        if(journeyTarget) {
            journeyTarget.textContent = userData.macros.calories.toLocaleString();
        }
        // Assuming consumed is 0 to start
        const journeyRemaining = document.querySelector('#dashboard-screen .journey-remaining');
        if(journeyRemaining) {
            journeyRemaining.textContent = userData.macros.calories.toLocaleString();
        }
    }


    function updateUserUI() {
        const profileName = document.getElementById('profile-user-name');
        if (profileName) {
            profileName.textContent = userData.name || 'User';
        }
    }

    function showScreen(screenName) {
        Object.values(screens).forEach(screen => {
            if (screen) {
                screen.classList.add('hidden');
            }
        });
        if (screens[screenName]) {
            screens[screenName].classList.remove('hidden');
            if (screenName === 'dashboard') {
                updateDashboard();
                updateUserUI(); // for profile
            }
            if (screenName === 'profile') {
                updateUserUI();
            }
            if (screenName === 'finalOnboarding') {
                updateFinalOnboardingScreen();
            }
        }
    }

    // --- Navigation Logic ---
    if (buttons.welcome.start) {
        buttons.welcome.start.addEventListener('click', () => showScreen('name'));
    }
    if (buttons.name.continue) {
        buttons.name.continue.addEventListener('click', () => showScreen('age'));
    }
    if (buttons.name.back) {
        buttons.name.back.addEventListener('click', () => showScreen('welcome'));
    }
    if (buttons.age.continue) {
        buttons.age.continue.addEventListener('click', () => showScreen('weight'));
    }
    if (buttons.age.back) {
        buttons.age.back.addEventListener('click', () => showScreen('name'));
    }
    if (buttons.age.skip) {
        buttons.age.skip.addEventListener('click', () => showScreen('dashboard'));
    }
    if (buttons.weight.continue) {
        buttons.weight.continue.addEventListener('click', () => showScreen('goal'));
    }
    if (buttons.weight.back) {
        buttons.weight.back.addEventListener('click', () => showScreen('age'));
    }
    if (buttons.weight.skip) {
        buttons.weight.skip.addEventListener('click', () => showScreen('dashboard'));
    }
    if (buttons.goal.continue) {
        buttons.goal.continue.addEventListener('click', () => showScreen('gender'));
    }
    if (buttons.goal.back) {
        buttons.goal.back.addEventListener('click', () => showScreen('weight'));
    }
    if (buttons.goal.skip) {
        buttons.goal.skip.addEventListener('click', () => showScreen('dashboard'));
    }
    if (buttons.gender.continue) {
        buttons.gender.continue.addEventListener('click', () => showScreen('height'));
    }
    if (buttons.gender.back) {
        buttons.gender.back.addEventListener('click', () => showScreen('goal'));
    }
    if (buttons.gender.skip) {
        buttons.gender.skip.addEventListener('click', () => showScreen('dashboard'));
    }
    if (buttons.height.continue) {
        buttons.height.continue.addEventListener('click', () => showScreen('activityLevel'));
    }
    if (buttons.height.back) {
        buttons.height.back.addEventListener('click', () => showScreen('gender'));
    }
    if (buttons.height.skip) {
        buttons.height.skip.addEventListener('click', () => showScreen('dashboard'));
    }
    if (buttons.activityLevel.continue) {
        buttons.activityLevel.continue.addEventListener('click', () => showScreen('dietaryPreferences'));
    }
    if (buttons.activityLevel.back) {
        buttons.activityLevel.back.addEventListener('click', () => showScreen('height'));
    }
    if (buttons.activityLevel.skip) {
        buttons.activityLevel.skip.addEventListener('click', () => showScreen('dashboard'));
    }
    if (buttons.dietaryPreferences.continue) {
        buttons.dietaryPreferences.continue.addEventListener('click', () => showScreen('lifestyleHabits'));
    }
    if (buttons.dietaryPreferences.back) {
        buttons.dietaryPreferences.back.addEventListener('click', () => showScreen('activityLevel'));
    }
    if (buttons.dietaryPreferences.skip) {
        buttons.dietaryPreferences.skip.addEventListener('click', () => showScreen('dashboard'));
    }
    if (buttons.lifestyleHabits.continue) {
        buttons.lifestyleHabits.continue.addEventListener('click', () => showScreen('budget'));
    }
    if (buttons.lifestyleHabits.back) {
        buttons.lifestyleHabits.back.addEventListener('click', () => showScreen('dietaryPreferences'));
    }
    if (buttons.lifestyleHabits.skip) {
        buttons.lifestyleHabits.skip.addEventListener('click', () => showScreen('dashboard'));
    }
    if (buttons.budget.continue) {
        buttons.budget.continue.addEventListener('click', () => showScreen('finalOnboarding'));
    }
    if (buttons.budget.back) {
        buttons.budget.back.addEventListener('click', () => showScreen('lifestyleHabits'));
    }
    if (buttons.budget.skip) {
        buttons.budget.skip.addEventListener('click', () => showScreen('dashboard'));
    }
    if (buttons.finalOnboarding.finish) {
        buttons.finalOnboarding.finish.addEventListener('click', () => showScreen('dashboard'));
    }
    if (buttons.finalOnboarding.back) {
        buttons.finalOnboarding.back.addEventListener('click', () => showScreen('budget'));
    }


    // --- Onboarding Interactivity ---

    // Name Input
    const nameInput = document.getElementById('name-input');
    if (nameInput) {
        nameInput.addEventListener('input', (e) => {
            console.log('Name input captured:', e.target.value);
            userData.name = e.target.value;
        });
    }

    // Age Selection
    const ageDisplay = screens.age.querySelector('.age-display');
    const ageOptionsContainer = screens.age.querySelector('.age-options');
    const ageOptions = Array.from(ageOptionsContainer.children);

    function updateAgeOptions() {
        const currentAgeIndex = ageOptions.findIndex(option => parseInt(option.textContent) === userData.age);

        ageOptions.forEach((option, index) => {
            option.style.fontWeight = 'normal';
            option.style.color = '#666';
        });

        if (currentAgeIndex !== -1) {
            ageOptions[currentAgeIndex].style.fontWeight = '600';
            ageOptions[currentAgeIndex].style.color = '#1a1a1a';
        }

        ageDisplay.textContent = userData.age;
    }

    ageOptionsContainer.addEventListener('click', (e) => {
        if (e.target.tagName === 'DIV' && !isNaN(parseInt(e.target.textContent))) {
            userData.age = parseInt(e.target.textContent);
            updateAgeOptions();
        }
    });

    updateAgeOptions();


    // Weight Selection
    const weightInput = document.getElementById('weight-input');
    const weightUnitButtons = screens.weight.querySelectorAll('.unit-button');
    const weightUnitDisplay = screens.weight.querySelector('.weight-unit-display');

    function updateWeightDisplay() {
        weightUnitDisplay.textContent = userData.weightUnit;
    }

    if (weightInput) {
        weightInput.addEventListener('input', (e) => {
            userData.weight = e.target.value;
        });
    }

    weightUnitButtons.forEach(button => {
        button.addEventListener('click', () => {
            weightUnitButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            userData.weightUnit = button.textContent.toLowerCase();
            updateWeightDisplay();
        });
    });

    updateWeightDisplay();


    // Goal Selection
    const goalOptions = screens.goal.querySelectorAll('.goal-option');
    goalOptions.forEach(option => {
        option.addEventListener('click', () => {
            goalOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            userData.goal = option.querySelector('.goal-text').textContent;
        });
    });

    // Gender Selection
    const genderOptions = screens.gender.querySelectorAll('.gender-option');
    genderOptions.forEach(option => {
        option.addEventListener('click', () => {
            genderOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            userData.gender = option.querySelector('.gender-text').textContent;
        });
    });

    // Height Selection
    const heightInput = document.getElementById('height-input');
    const heightUnitButtons = screens.height.querySelectorAll('.unit-button');
    const heightUnitDisplay = screens.height.querySelector('.height-unit-display');

    function updateHeightDisplay() {
        if (heightUnitDisplay) {
            heightUnitDisplay.textContent = userData.heightUnit;
        }
    }

    if (heightInput) {
        heightInput.addEventListener('input', (e) => {
            userData.height = e.target.value;
        });
    }

    heightUnitButtons.forEach(button => {
        button.addEventListener('click', () => {
            heightUnitButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            userData.heightUnit = button.textContent.toLowerCase();
            updateHeightDisplay();
        });
    });

    updateHeightDisplay();

    // Activity Level Selection
    const activityLevelOptions = screens.activityLevel.querySelectorAll('.goal-option');
    activityLevelOptions.forEach(option => {
        option.addEventListener('click', () => {
            activityLevelOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            userData.activityLevel = option.querySelector('.goal-text').textContent;
        });
    });

    // Dietary Preferences
    const dietaryPreferencesOptions = screens.dietaryPreferences.querySelectorAll('.goal-option');
    const allergiesInput = document.getElementById('allergies-input');

    dietaryPreferencesOptions.forEach(option => {
        option.addEventListener('click', () => {
            option.classList.toggle('selected');
            const preference = option.querySelector('.goal-text').textContent;
            if (option.classList.contains('selected')) {
                userData.dietaryPreferences.push(preference);
            } else {
                userData.dietaryPreferences = userData.dietaryPreferences.filter(p => p !== preference);
            }
        });
    });

    if(allergiesInput) {
        allergiesInput.addEventListener('input', (e) => {
            userData.allergies = e.target.value;
        });
    }

    // Lifestyle Habits
    const sleepHoursInput = document.getElementById('sleep-hours-input');
    const lifestyleHabitsOptions = screens.lifestyleHabits.querySelectorAll('.goal-option');

    if (sleepHoursInput) {
        sleepHoursInput.addEventListener('input', (e) => {
            userData.sleepHours = e.target.value;
        });
    }

    lifestyleHabitsOptions.forEach(option => {
        option.addEventListener('click', () => {
            option.classList.toggle('selected');
            const habit = option.querySelector('.goal-text').textContent;
            if (habit.includes('smoke')) {
                userData.smoking = option.classList.contains('selected');
            } else if (habit.includes('alcohol')) {
                userData.alcohol = option.classList.contains('selected');
            }
        });
    });

    // Budget
    const budgetInput = document.getElementById('budget-input');
    if (budgetInput) {
        budgetInput.addEventListener('input', (e) => {
            userData.budget = e.target.value;
        });
    }
});
