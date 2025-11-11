// Elementos da interface
const serviceSelect = document.getElementById('serviceSelect');
const specialtySelect = document.getElementById('specialtySelect');
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const result = document.getElementById('result');
const metaValue = document.getElementById('metaValue');
const emptyMessage = document.getElementById('emptyMessage');
const backToService = document.getElementById('backToService');
const backToSpecialty = document.getElementById('backToSpecialty');

// Inicializar a aplicação
function initApp() {
    loadServices();
}

// Carregar serviços disponíveis
function loadServices() {
    const services = [...new Set(excelData.map(item => item.servico))];
    services.forEach(service => {
        const option = document.createElement('option');
        option.value = service;
        option.textContent = service;
        serviceSelect.appendChild(option);
    });
}

// Carregar especialidades baseadas no serviço selecionado
function loadSpecialties(service) {
    specialtySelect.innerHTML = '<option value="">Selecione uma especialidade</option>';
    
    const specialties = excelData
        .filter(item => item.servico === service)
        .map(item => item.especialidade);
    
    const uniqueSpecialties = [...new Set(specialties)];
    
    if (uniqueSpecialties.length === 0) {
        emptyMessage.style.display = 'block';
        step2.style.display = 'none';
        return;
    }
    
    emptyMessage.style.display = 'none';
    
    uniqueSpecialties.forEach(specialty => {
        const option = document.createElement('option');
        option.value = specialty;
        option.textContent = specialty;
        specialtySelect.appendChild(option);
    });
    
    step2.style.display = 'block';
}

// Mostrar meta selecionada
function showMeta(service, specialty) {
    const item = excelData.find(i => i.servico === service && i.especialidade === specialty);
    
    if (item && item.meta && item.meta.toString().trim() !== '') {
        metaValue.textContent = item.meta;
        result.style.display = 'block';
        step2.style.display = 'none';
    } else {
        emptyMessage.style.display = 'block';
        result.style.display = 'none';
    }
}

// Event Listeners
serviceSelect.addEventListener('change', function() {
    if (this.value) {
        loadSpecialties(this.value);
    } else {
        step2.style.display = 'none';
        result.style.display = 'none';
        emptyMessage.style.display = 'none';
    }
});

specialtySelect.addEventListener('change', function() {
    if (this.value) {
        showMeta(serviceSelect.value, this.value);
    } else {
        result.style.display = 'none';
        emptyMessage.style.display = 'none';
    }
});

backToService.addEventListener('click', function() {
    step2.style.display = 'none';
    result.style.display = 'none';
    emptyMessage.style.display = 'none';
    serviceSelect.value = '';
});

backToSpecialty.addEventListener('click', function() {
    result.style.display = 'none';
    emptyMessage.style.display = 'none';
    step2.style.display = 'block';
    specialtySelect.value = '';
});

// Inicializar a aplicação quando a página carregar
document.addEventListener('DOMContentLoaded', initApp);