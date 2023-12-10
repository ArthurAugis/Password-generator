function getSavedPasswords() {
    var savedPasswords = localStorage.getItem('passwords');
    if (savedPasswords) {
        return JSON.parse(savedPasswords);
    } else {
        return [];
    }
}

function savePasswords(passwords) {
    localStorage.setItem('passwords', JSON.stringify(passwords));
}

function addPasswordToList(password) {
    var passwordList = document.getElementById('passwordList');
    var li = document.createElement('li');
    li.className = 'password-container';

    var passwordText = document.createElement('span');
    passwordText.textContent = password.password;

    var timestamp = document.createElement('span');
    timestamp.textContent = password.timestamp;

    var copyButton = document.createElement('button');
    copyButton.textContent = 'Copier';
    copyButton.addEventListener('click', function() {
        copyPassword(password.password);
    });

    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'Supprimer';
    deleteButton.addEventListener('click', function() {
        deletePassword(password.timestamp);
    });

    li.appendChild(passwordText);
    li.appendChild(timestamp);
    li.appendChild(copyButton);
    li.appendChild(deleteButton);

    passwordList.appendChild(li);
}

function updatePasswordList() {
    var savedPasswords = getSavedPasswords();
    var passwordList = document.getElementById('passwordList');
    passwordList.innerHTML = '';

    savedPasswords.forEach(function(password) {
        addPasswordToList(password);
    });
}

function generatePassword() {
    var length = document.getElementById('length').value;
    if(length < 8) { length = 8; }
    var includeSpecialChars = document.getElementById('specialChars').checked;
    var includeNumbers = document.getElementById('numbers').checked;

    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var specialChars = '!@#$%^&*()_+~`|}{[]\:;?><,./-=';
    var numbers = '0123456789';

    var password = '';

    password += getRandomChar(chars);
    if (includeSpecialChars) {
        chars = chars + specialChars;
    }
    if (includeNumbers) {
        chars = chars + numbers;
    }

    while (password.length < length) {
        password += getRandomChar(chars);
    }

    var passwordObj = {
        password: shuffleString(password),
        timestamp: new Date().toLocaleString()
    };

    var savedPasswords = getSavedPasswords();
    savedPasswords.push(passwordObj);
    savePasswords(savedPasswords);
    addPasswordToList(passwordObj);
}

function copyPassword(password) {
    navigator.clipboard.writeText(password)
        .then(function() {
            alert('Mot de passe copié dans le presse-papiers!');
        })
        .catch(function(error) {
            console.error('Erreur lors de la copie du mot de passe:', error);
        });
}

function deletePassword(timestamp) {
    var savedPasswords = getSavedPasswords();
    var updatedPasswords = savedPasswords.filter(function(password) {
        return password.timestamp !== timestamp;
    });
    savePasswords(updatedPasswords);
    updatePasswordList();
}
function getRandomChar(charString) {
    var randomIndex = Math.floor(Math.random() * charString.length);
    return charString.charAt(randomIndex);
}

function shuffleString(string) {
    var array = string.split('');
    var currentIndex = array.length;
    var temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array.join('');
}

updatePasswordList();
