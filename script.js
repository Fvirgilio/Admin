// script.js

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyD3NeE_fXUivRwXoz3c1NwyfnzRx1Xfmag",
    authDomain: "qrtrashy.firebaseapp.com",
    projectId: "qrtrashy",
    storageBucket: "qrtrashy.appspot.com",
    messagingSenderId: "986627738409",
    appId: "1:986627738409:web:03e8dee1c88ab1d6b9dd5f"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Elementos del DOM
const loginForm = document.getElementById('login-form');
const form = document.getElementById('form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginError = document.getElementById('login-error');
const scansSection = document.getElementById('scans-section');
const scansTableBody = document.querySelector('#scans-table tbody');

// Manejar el evento de envío del formulario de login
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    
    // Verificar credenciales (admin/admin)
    if (username === 'admin' && password === 'admin') {
        // Ocultar el formulario de login y mostrar la sección de scans
        loginForm.classList.add('hidden');
        scansSection.classList.remove('hidden');
        
        // Cargar los scans desde Firebase
        loadScans();
    } else {
        // Mostrar mensaje de error
        loginError.textContent = 'Credenciales inválidas. Inténtalo de nuevo.';
    }
});

// Función para cargar y mostrar los scans
function loadScans() {
    const scansRef = database.ref('scans');
    
    scansRef.once('value', (snapshot) => {
        const scansData = snapshot.val();
        let allScans = [];
        
        // Iterar sobre cada usuario en 'scans'
        for (const user in scansData) {
            if (scansData.hasOwnProperty(user)) {
                const userScans = scansData[user];
                
                // Iterar sobre cada scan del usuario
                for (const scanId in userScans) {
                    if (userScans.hasOwnProperty(scanId)) {
                        const scan = userScans[scanId];
                        allScans.push({
                            id: scan.id,
                            timestamp: scan.timestamp
                        });
                    }
                }
            }
        }
        
        // Ordenar los scans por timestamp descendente (más recientes primero)
        allScans.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        // Limpiar la tabla antes de insertar nuevos datos
        scansTableBody.innerHTML = '';
        
        // Insertar los scans en la tabla
        allScans.forEach(scan => {
            const row = document.createElement('tr');
            
            const idCell = document.createElement('td');
            idCell.textContent = scan.id; // ID lleno, por ejemplo, "12121212"
            
            const timestampCell = document.createElement('td');
            timestampCell.textContent = scan.timestamp;
            
            row.appendChild(idCell);
            row.appendChild(timestampCell);
            
            scansTableBody.appendChild(row);
        });
    }).catch((error) => {
        console.error('Error al cargar los scans:', error);
    });
}
