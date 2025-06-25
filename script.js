let necessidades = [];
let necessidadesContainer, searchInput, filterTipo;

document.addEventListener('DOMContentLoaded', () => {
    necessidadesContainer = document.getElementById('necessidadesContainer');
    searchInput = document.getElementById('searchInput');
    filterTipo = document.getElementById('filterTipo');

    if (document.getElementById('cadastroForm')) {
        document.getElementById('cadastroForm').addEventListener('submit', handleFormSubmit);
        document.getElementById('cadastroForm').addEventListener('reset', e =>
            setTimeout(() => clearValidationClasses(e.target), 100)
        );
        document.getElementById('cep')?.addEventListener('blur', buscarCEP);
    }

    searchInput?.addEventListener('input', debounce(filterNecessidades, 300));
    filterTipo?.addEventListener('change', filterNecessidades);

    carregarDoLocalStorage();
    if (document.getElementById('visualizar')) renderNecessidades();
});

function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    if (!validateForm(form)) return alert('Preencha os campos corretamente.');

    submitBtn.disabled = true;
    setTimeout(() => {
        const fd = new FormData(form);
        const novaNecessidade = {
            id: Date.now(),
            nomeInstituicao: fd.get('nomeInstituicao'),
            tipoAjuda: fd.get('tipoAjuda'),
            titulo: fd.get('titulo'),
            descricao: fd.get('descricao'),
            cep: fd.get('cep'),
            rua: fd.get('rua'),
            bairro: fd.get('bairro'),
            cidade: fd.get('cidade'),
            estado: fd.get('estado'),
            email: fd.get('email'),
            telefone: fd.get('telefone'),
            dataCadastro: new Date().toLocaleDateString('pt-BR')
        };

        necessidades.push(novaNecessidade);
        salvarNoLocalStorage();

        form.reset();
        clearValidationClasses(form);
        alert('Necessidade cadastrada com sucesso!');
        window.location.href = 'visualizar.html';
    }, 1000);
}

function salvarNoLocalStorage() {
    localStorage.setItem('necessidades', JSON.stringify(necessidades));
}

function carregarDoLocalStorage() {
    const data = localStorage.getItem('necessidades');
    if (data) {
        necessidades = JSON.parse(data);
    }
}

function validateForm(form) {
    const requiredFields = form.querySelectorAll('input[required], select[required], textarea[required]');
    return [...requiredFields].every(f => f.value.trim() !== '');
}

function clearValidationClasses(form) {
    form.querySelectorAll('input, select, textarea').forEach(f => f.classList.remove('error', 'success'));
    form.querySelectorAll('.error-message').forEach(msg => msg.classList.remove('show'));
}