document.addEventListener('DOMContentLoaded', function() {
    // Data structure
    let links = JSON.parse(localStorage.getItem('cyberlinks')) || [
        {
            id: 1,
            name: 'Google',
            url: 'https://google.com',
            category: 'search',
            icon: 'ri-google-fill',
            description: 'Công cụ tìm kiếm phổ biến nhất thế giới'
        },
        {
            id: 2,
            name: 'Facebook',
            url: 'https://facebook.com',
            category: 'social',
            icon: 'ri-facebook-fill',
            description: 'Mạng xã hội lớn nhất thế giới'
        },
        {
            id: 3,
            name: 'YouTube',
            url: 'https://youtube.com',
            category: 'entertainment',
            icon: 'ri-youtube-fill',
            description: 'Nền tảng chia sẻ video trực tuyến'
        },
        {
            id: 4,
            name: 'GitHub',
            url: 'https://github.com',
            category: 'work',
            icon: 'ri-github-fill',
            description: 'Nền tảng lưu trữ mã nguồn'
        },
        {
            id: 5,
            name: 'Netflix',
            url: 'https://netflix.com',
            category: 'entertainment',
            icon: 'ri-netflix-fill',
            description: 'Dịch vụ xem phim và chương trình truyền hình trực tuyến'
        },
        {
            id: 6,
            name: 'Spotify',
            url: 'https://spotify.com',
            category: 'entertainment',
            icon: 'ri-spotify-fill',
            description: 'Dịch vụ phát nhạc trực tuyến'
        }
    ];
    
    let categories = JSON.parse(localStorage.getItem('cyberlinks_categories')) || [
        { id: 'all', name: 'Tất cả' },
        { id: 'work', name: 'Công việc' },
        { id: 'entertainment', name: 'Giải trí' },
        { id: 'study', name: 'Học tập' },
        { id: 'social', name: 'Mạng xã hội' },
        { id: 'news', name: 'Tin tức' }
    ];
    
    let currentCategory = 'all';
    let currentLinkId = null;
    
    // DOM Elements
    const linksContainer = document.getElementById('links-container');
    const emptyState = document.getElementById('empty-state');
    const categoriesContainer = document.getElementById('categories-container');
    const linkModal = document.getElementById('link-modal');
    const categoryModal = document.getElementById('category-modal');
    const deleteModal = document.getElementById('delete-modal');
    const linkForm = document.getElementById('link-form');
    const categoryForm = document.getElementById('category-form');
    
    // Buttons
    const addLinkBtn = document.getElementById('add-link-btn');
    const addLinkMobileBtn = document.getElementById('add-link-mobile-btn');
    const addFirstLinkBtn = document.getElementById('add-first-link-btn');
    const addCategoryBtn = document.getElementById('add-category-btn');
    const cancelLinkBtn = document.getElementById('cancel-link-btn');
    const cancelCategoryBtn = document.getElementById('cancel-category-btn');
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    
    // Form inputs
    const linkIdInput = document.getElementById('link-id');
    const linkNameInput = document.getElementById('link-name');
    const linkUrlInput = document.getElementById('link-url');
    const linkCategoryInput = document.getElementById('link-category');
    const linkIconInput = document.getElementById('link-icon');
    const linkDescriptionInput = document.getElementById('link-description');
    const categoryNameInput = document.getElementById('category-name');
    const modalTitle = document.getElementById('modal-title');
    
    // Search inputs
    const searchDesktop = document.getElementById('search-desktop');
    const searchMobile = document.getElementById('search-mobile');
    
    // Initialize
    function init() {
        renderLinks();
        renderCategories();
        setupEventListeners();
    }
    
    // Render links
    function renderLinks(searchTerm = '') {
        linksContainer.innerHTML = '';
        
        let filteredLinks = links;
        
        // Filter by category
        if (currentCategory !== 'all') {
            filteredLinks = filteredLinks.filter(link => link.category === currentCategory);
        }
        
        // Filter by search term
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filteredLinks = filteredLinks.filter(link => 
                link.name.toLowerCase().includes(term) || 
                link.url.toLowerCase().includes(term) ||
                (link.description && link.description.toLowerCase().includes(term))
            );
        }
        
        // Show empty state if no links
        if (filteredLinks.length === 0) {
            if (links.length === 0) {
                emptyState.classList.remove('hidden');
            } else {
                linksContainer.innerHTML = `
                    <div class="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center py-16">
                        <div class="w-16 h-16 flex items-center justify-center text-primary mb-4">
                            <i class="ri-search-line ri-2x"></i>
                        </div>
                        <h3 class="text-lg font-medium mb-2">Không tìm thấy kết quả</h3>
                        <p class="text-gray-500 text-center max-w-md">
                            Không có liên kết nào phù hợp với tìm kiếm của bạn. Hãy thử tìm kiếm khác hoặc thêm liên kết mới.
                        </p>
                    </div>
                `;
            }
            return;
        }
        
        emptyState.classList.add('hidden');
        
        // Render each link
        filteredLinks.forEach(link => {
            const linkCard = document.createElement('div');
            linkCard.className = 'cyber-card rounded-lg p-4 flex flex-col';
            linkCard.innerHTML = `
                <div class="flex items-start justify-between mb-3">
                    <div class="flex items-center">
                        <div class="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-lg mr-3">
                            <i class="${link.icon || 'ri-link-m'} ri-lg text-primary"></i>
                        </div>
                        <div>
                            <h3 class="font-medium">${link.name}</h3>
                            <p class="text-xs text-gray-500">${extractDomain(link.url)}</p>
                        </div>
                    </div>
                    <div class="flex space-x-1">
                        <button class="edit-link-btn w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100" data-id="${link.id}">
                            <i class="ri-edit-line text-gray-500"></i>
                        </button>
                        <button class="delete-link-btn w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100" data-id="${link.id}">
                            <i class="ri-delete-bin-line text-gray-500"></i>
                        </button>
                    </div>
                </div>
                ${link.description ? `<p class="text-sm text-gray-600 mb-3">${link.description}</p>` : ''}
                <a href="${link.url}" target="_blank" class="mt-auto cyber-button !rounded-button bg-white border border-primary/30 text-gray-700 px-4 py-2 text-sm font-medium flex items-center justify-center">
                    <div class="w-4 h-4 flex items-center justify-center mr-2">
                        <i class="ri-external-link-line"></i>
                    </div>
                    <span>Truy cập</span>
                </a>
            `;
            linksContainer.appendChild(linkCard);
        });
        
        // Add event listeners to edit and delete buttons
        document.querySelectorAll('.edit-link-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'));
                editLink(id);
            });
        });
        
        document.querySelectorAll('.delete-link-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'));
                showDeleteModal(id);
            });
        });
    }
    
    // Render categories
    function renderCategories() {
        // Update category select in form
        linkCategoryInput.innerHTML = '<option value="">Chọn danh mục</option>';
        categories.forEach(category => {
            if (category.id !== 'all') {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                linkCategoryInput.appendChild(option);
            }
        });
        
        // Update category tabs
        categoriesContainer.innerHTML = '';
        categories.forEach(category => {
            const categoryTab = document.createElement('button');
            categoryTab.className = `category-tab whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium ${category.id === currentCategory ? 'active' : ''}`;
            categoryTab.textContent = category.name;
            categoryTab.addEventListener('click', () => {
                document.querySelectorAll('.category-tab').forEach(tab => tab.classList.remove('active'));
                categoryTab.classList.add('active');
                currentCategory = category.id;
                renderLinks();
            });
            categoriesContainer.appendChild(categoryTab);
        });
        
        // Add "Add Category" button
        const addCategoryButton = document.createElement('button');
        addCategoryButton.id = 'add-category-btn';
        addCategoryButton.className = 'cyber-button !rounded-button whitespace-nowrap px-3 py-2 rounded-full text-sm font-medium border border-primary/50 bg-white flex items-center';
        addCategoryButton.innerHTML = `
            <div class="w-4 h-4 flex items-center justify-center mr-1">
                <i class="ri-add-line"></i>
            </div>
            <span>Thêm danh mục</span>
        `;
        addCategoryButton.addEventListener('click', showCategoryModal);
        categoriesContainer.appendChild(addCategoryButton);
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Add link buttons
        addLinkBtn.addEventListener('click', showLinkModal);
        addLinkMobileBtn.addEventListener('click', showLinkModal);
        addFirstLinkBtn.addEventListener('click', showLinkModal);
        
        // Cancel buttons
        cancelLinkBtn.addEventListener('click', hideLinkModal);
        cancelCategoryBtn.addEventListener('click', hideCategoryModal);
        cancelDeleteBtn.addEventListener('click', hideDeleteModal);
        
        // Form submissions
        linkForm.addEventListener('submit', handleLinkFormSubmit);
        categoryForm.addEventListener('submit', handleCategoryFormSubmit);
        
        // Delete confirmation
        confirmDeleteBtn.addEventListener('click', deleteLink);
        
        // Search functionality
        searchDesktop.addEventListener('input', handleSearch);
        searchMobile.addEventListener('input', handleSearch);
    }
    
    // Show link modal
    function showLinkModal() {
        // Reset form
        linkForm.reset();
        linkIdInput.value = '';
        modalTitle.textContent = 'Thêm liên kết mới';
        
        // Show modal
        linkModal.classList.remove('hidden');
    }
    
    // Hide link modal
    function hideLinkModal() {
        linkModal.classList.add('hidden');
    }
    
    // Show category modal
    function showCategoryModal() {
        // Reset form
        categoryForm.reset();
        
        // Show modal
        categoryModal.classList.remove('hidden');
    }
    
    // Hide category modal
    function hideCategoryModal() {
        categoryModal.classList.add('hidden');
    }
    
    // Show delete modal
    function showDeleteModal(id) {
        currentLinkId = id;
        deleteModal.classList.remove('hidden');
    }
    
    // Hide delete modal
    function hideDeleteModal() {
        deleteModal.classList.add('hidden');
        currentLinkId = null;
    }
    
    // Edit link
    function editLink(id) {
        const link = links.find(link => link.id === id);
        if (!link) return;
        
        // Fill form
        linkIdInput.value = link.id;
        linkNameInput.value = link.name;
        linkUrlInput.value = link.url;
        linkCategoryInput.value = link.category || '';
        linkIconInput.value = link.icon || '';
        linkDescriptionInput.value = link.description || '';
        
        // Update modal title
        modalTitle.textContent = 'Chỉnh sửa liên kết';
        
        // Show modal
        linkModal.classList.remove('hidden');
    }
    
    // Delete link
    function deleteLink() {
        if (!currentLinkId) return;
        
        links = links.filter(link => link.id !== currentLinkId);
        saveLinks();
        renderLinks();
        hideDeleteModal();
    }
    
    // Handle link form submit
    function handleLinkFormSubmit(e) {
        e.preventDefault();
        
        const id = linkIdInput.value ? parseInt(linkIdInput.value) : Date.now();
        const name = linkNameInput.value;
        const url = formatUrl(linkUrlInput.value);
        const category = linkCategoryInput.value;
        const icon = linkIconInput.value;
        const description = linkDescriptionInput.value;
        
        if (linkIdInput.value) {
            // Update existing link
            const index = links.findIndex(link => link.id === parseInt(linkIdInput.value));
            if (index !== -1) {
                links[index] = { id, name, url, category, icon, description };
            }
        } else {
            // Add new link
            links.push({ id, name, url, category, icon, description });
        }
        
        saveLinks();
        renderLinks();
        hideLinkModal();
    }
    
    // Handle category form submit
    function handleCategoryFormSubmit(e) {
        e.preventDefault();
        
        const name = categoryNameInput.value;
        const id = name.toLowerCase().replace(/\s+/g, '-');
        
        // Check if category already exists
        if (categories.some(category => category.id === id)) {
            alert('Danh mục này đã tồn tại!');
            return;
        }
        
        categories.push({ id, name });
        saveCategories();
        renderCategories();
        hideCategoryModal();
    }
    
    // Handle search
    function handleSearch(e) {
        const searchTerm = e.target.value;
        
        // Sync search inputs
        if (e.target === searchDesktop) {
            searchMobile.value = searchTerm;
        } else {
            searchDesktop.value = searchTerm;
        }
        
        renderLinks(searchTerm);
    }
    
    // Save links to localStorage
    function saveLinks() {
        localStorage.setItem('cyberlinks', JSON.stringify(links));
    }
    
    // Save categories to localStorage
    function saveCategories() {
        localStorage.setItem('cyberlinks_categories', JSON.stringify(categories));
    }
    
    // Helper: Extract domain from URL
    function extractDomain(url) {
        try {
            const domain = new URL(url).hostname;
            return domain.replace(/^www\./, '');
        } catch (e) {
            return url;
        }
    }
    
    // Helper: Format URL (add https:// if missing)
    function formatUrl(url) {
        if (!url.match(/^https?:\/\//i)) {
            return 'https://' + url;
        }
        return url;
    }
    
    // Initialize the app
    init();
});