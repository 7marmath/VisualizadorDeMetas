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

// Variável global para armazenar os dados
let excelData = [];

// Inicializar a aplicação
function initApp() {
    loadExcelData();
}

// Carregar dados do arquivo Excel
function loadExcelData() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'data.xlsx', true);
    xhr.responseType = 'arraybuffer';
    
    xhr.onload = function(e) {
        if (xhr.status === 200) {
            try {
                const arrayBuffer = xhr.response;
                const workbook = XLSX.read(arrayBuffer, { type: 'array' });
                
                // Pega a primeira planilha
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                
                // Converte para JSON
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                
                // Filtra apenas linhas com meta preenchida e mapeia para o formato antigo
                excelData = jsonData
                    .filter(row => row.meta && row.meta.toString().trim() !== '')
                    .map(row => ({
                        especialidade: row['Especialidade/procedimento'],
                        servico: row['serviço'],
                        meta: row.meta
                    }));
                
                loadServices();
                
            } catch (error) {
                console.error('Erro ao processar o arquivo Excel:', error);
                emptyMessage.textContent = 'Erro ao carregar os dados. Verifique se o arquivo data.xlsx está na pasta.';
                emptyMessage.style.display = 'block';
            }
        } else {
            emptyMessage.textContent = 'Arquivo data.xlsx não encontrado. Coloque o arquivo na mesma pasta do site.';
            emptyMessage.style.display = 'block';
        }
    };
    
    xhr.onerror = function() {
        emptyMessage.textContent = 'Erro ao carregar o arquivo. Abra o site através de um servidor local.';
        emptyMessage.style.display = 'block';
    };
    
    xhr.send();
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