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

async function buscarCEP(e) {
    const cep = e.target.value.replace(/\D/g, '');
    if (cep.length !== 8) return;

    try {
        const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await res.json();
        if (data.erro) throw Error();

        document.getElementById('rua').value = data.logradouro || '';
        document.getElementById('bairro').value = data.bairro || '';
        document.getElementById('cidade').value = data.localidade || '';
        document.getElementById('estado').value = data.uf || '';
    } catch {
        alert('CEP inválido.');
    }
}

function renderNecessidades(lista = necessidades) {
    if (!necessidadesContainer) return;
    const noResults = document.getElementById('noResults');
    if (!lista.length) {
        necessidadesContainer.innerHTML = '';
        if (noResults) noResults.style.display = 'block';
        return;
    }

    if (noResults) noResults.style.display = 'none';

    necessidadesContainer.innerHTML = lista.map(n => `
        <div class="necessidade-card">
            <div class="card-header">
                <div>
                    <h3>${n.titulo}</h3>
                    <p>${n.nomeInstituicao}</p>
                </div>
                <span>${n.tipoAjuda}</span>
            </div>
            <p>${n.descricao}</p>
            <div class="card-location"><i class="fas fa-map-marker-alt"></i> ${[n.bairro, n.cidade, n.estado].filter(Boolean).join(', ')}</div>
            <div class="card-contact">
                <div><i class="fas fa-envelope"></i> <a href="mailto:${n.email}">${n.email}</a></div>
                ${n.telefone ? `<div><i class="fas fa-phone"></i> <a href="tel:${n.telefone.replace(/\D/g, '')}">${n.telefone}</a></div>` : ''}
                <div><i class="fas fa-calendar"></i> ${n.dataCadastro}</div>
            </div>
        </div>`).join('');
}

function filterNecessidades() {
    const termo = searchInput.value.toLowerCase();
    const tipo = filterTipo.value;
    const filtradas = necessidades.filter(n =>
        (!termo || [n.titulo, n.descricao, n.nomeInstituicao].some(t => t.toLowerCase().includes(termo))) &&
        (!tipo || n.tipoAjuda === tipo)
    );
    renderNecessidades(filtradas);
}

function debounce(func, wait) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}