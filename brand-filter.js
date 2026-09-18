(function () {
  const section = document.querySelector('.perks-brand-section');
  const sourceBrands = window.SUBTV_BRANDS;
  if (!section || !Array.isArray(sourceBrands)) return;

  const brands = sourceBrands.slice().sort((a, b) => {
    const discountDifference = parseFloat(b.discount) - parseFloat(a.discount);
    return discountDifference || a.name.localeCompare(b.name);
  });

  const buttons = Array.from(section.querySelectorAll('[data-brand-filter]'));
  const grid = section.querySelector('[data-brand-grid]');
  const pagination = section.querySelector('[data-brand-pagination]');
  const resultCount = section.querySelector('[data-brand-count]');
  const pageSize = 10;
  let activeFilter = ['all'];
  let currentPage = 1;

  const categoryLabels = {
    supermarket: 'Groceries',
    'food-and-drink': 'Food & drink',
    fashion: 'Fashion',
    electronics: 'Tech & home',
    home: 'Tech & home',
    'department-store': 'Tech & home',
    'travel-and-leisure': 'Travel',
    beauty: 'Beauty',
    gaming: 'Gaming',
    sports: 'Sports',
    music: 'Music',
    'tv-and-movies': 'Entertainment'
  };

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function primaryCategory(categories) {
    const category = categories.find((item) => categoryLabels[item]);
    return categoryLabels[category] || 'More perks';
  }

  function filteredBrands() {
    if (activeFilter.includes('all')) return brands;
    return brands.filter((brand) => activeFilter.some((category) => brand.categories.includes(category)));
  }

  function brandCard(brand) {
    const name = escapeHtml(brand.name);
    const logo = escapeHtml(brand.logo);
    return '<article class="brand-tile">' +
      '<span class="save">SAVE UP TO ' + escapeHtml(brand.discount) + '</span>' +
      '<div class="brand-offer"><img class="brand-tile-logo" src="' + logo + '" alt="' + name + '" loading="lazy" decoding="async">' +
      '<span class="brand-category">' + escapeHtml(primaryCategory(brand.categories)) + '</span></div>' +
      '</article>';
  }

  function renderPagination(totalPages) {
    if (totalPages <= 1) {
      pagination.innerHTML = '';
      pagination.hidden = true;
      return;
    }

    const pageButtons = [];
    for (let page = 1; page <= totalPages; page += 1) {
      if (page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1) {
        pageButtons.push('<button type="button" data-brand-page="' + page + '"' +
          (page === currentPage ? ' class="active" aria-current="page"' : '') + '>' + page + '</button>');
      } else if (pageButtons[pageButtons.length - 1] !== '<span aria-hidden="true">…</span>') {
        pageButtons.push('<span aria-hidden="true">…</span>');
      }
    }

    pagination.hidden = false;
    pagination.innerHTML = '<button type="button" data-brand-page="prev"' + (currentPage === 1 ? ' disabled' : '') + '>Previous</button>' +
      pageButtons.join('') +
      '<button type="button" data-brand-page="next"' + (currentPage === totalPages ? ' disabled' : '') + '>Next</button>';
  }

  function render() {
    const matches = filteredBrands();
    const totalPages = Math.max(1, Math.ceil(matches.length / pageSize));
    currentPage = Math.min(currentPage, totalPages);
    const start = (currentPage - 1) * pageSize;
    const visible = matches.slice(start, start + pageSize);

    grid.innerHTML = visible.map(brandCard).join('');
    resultCount.textContent = matches.length + (matches.length === 1 ? ' brand' : ' brands');
    renderPagination(totalPages);
  }

  buttons.forEach((button) => {
    button.addEventListener('click', function () {
      activeFilter = button.dataset.brandFilter.split(',');
      currentPage = 1;
      buttons.forEach((item) => {
        const active = item === button;
        item.classList.toggle('active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      render();
    });
  });

  pagination.addEventListener('click', function (event) {
    const button = event.target.closest('[data-brand-page]');
    if (!button || button.disabled) return;
    const matches = filteredBrands();
    const totalPages = Math.max(1, Math.ceil(matches.length / pageSize));
    const requested = button.dataset.brandPage;
    if (requested === 'prev') currentPage = Math.max(1, currentPage - 1);
    else if (requested === 'next') currentPage = Math.min(totalPages, currentPage + 1);
    else currentPage = Number(requested);
    render();
    section.querySelector('.brand-filter-tabs').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  render();
})();
