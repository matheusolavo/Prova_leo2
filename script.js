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