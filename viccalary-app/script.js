document.addEventListener('DOMContentLoaded', () => {
    const userData = {
        name: '',
        age: 19,
        weight: 62,
        weightUnit: 'kg',
        goal: 'Maintain weight',
        gender: 'Male',
    };

    const screens = {
        welcome: document.getElementById('welcome-screen'),
        name: document.getElementById('name-screen'),
        age: document.getElementById('age-screen'),
        weight: document.getElementById('weight-screen'),
        goal: document.getElementById('goal-screen'),
        gender: document.getElementById('gender-screen'),
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
        }
    };

    function updateUserUI() {
        const dashboardName = document.getElementById('dashboard-user-name');
        const profileName = document.getElementById('profile-user-name');

        if (dashboardName) {
            dashboardName.textContent = userData.name || 'User';
        }
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
            if (screenName === 'dashboard' || screenName === 'profile') {
                updateUserUI();
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
        buttons.gender.continue.addEventListener('click', () => showScreen('dashboard'));
    }
    if (buttons.gender.back) {
        buttons.gender.back.addEventListener('click', () => showScreen('goal'));
    }
    if (buttons.gender.skip) {
        buttons.gender.skip.addEventListener('click', () => showScreen('dashboard'));
    }

    // --- Onboarding Interactivity ---

    // Name Input
    const nameInput = document.getElementById('name-input');
    if (nameInput) {
        nameInput.addEventListener('input', (e) => {
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
    const weightUnitButtons = screens.weight.querySelectorAll('.unit-button');
    weightUnitButtons.forEach(button => {
        button.addEventListener('click', () => {
            weightUnitButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            userData.weightUnit = button.textContent.toLowerCase();
        });
    });

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
});
