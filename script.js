/**
 * ============================================
 * CABRIZO VISUAL STUDIO - SCRIPT ULTIMATE
 * Versão: 8.0 - Premium com Efeitos Avançados
 * ============================================
 */
 
 // ============================================
// FUNÇÃO PARA CORRIGIR LINKS DO IMGUR
// ============================================

function corrigirLinkImgur(link) {
    if (!link || !link.includes('imgur.com')) return link;
    
    console.log('🔄 Corrigindo link do Imgur:', link);
    
    // Extrair o código da imagem usando regex
    const match = link.match(/\/([a-zA-Z0-9]{5,7})(?:\.|\/|$)/);
    
    if (match && match[1]) {
        const codigo = match[1];
        
        // Tentar diferentes extensões (jpg é a mais comum)
        const extensoes = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        
        // Retornar array com possíveis links para testar
        return extensoes.map(ext => `https://i.imgur.com/${codigo}${ext}`);
    }
    
    return [link]; // Retorna array com o link original
}

// ============================================
// FUNÇÃO PARA TESTAR MÚLTIPLOS LINKS
// ============================================

function testarLinksImgur(links) {
    if (!Array.isArray(links)) links = [links];
    
    for (const link of links) {
        const img = new Image();
        img.onload = () => {
            console.log('✅ Link funcionou:', link);
            return link; // Retorna o primeiro que funcionar
        };
        img.onerror = () => console.log('❌ Falhou:', link);
        img.src = link;
    }
}

// ============================================
// FUNÇÃO PRINCIPAL PARA USAR NO PORTFÓLIO
// ============================================

function processarLinkImgur(linkOriginal) {
    const linksParaTestar = corrigirLinkImgur(linkOriginal);
    
    // Criar uma Promise para testar os links
    return new Promise((resolve) => {
        let testados = 0;
        
        linksParaTestar.forEach(link => {
            const img = new Image();
            img.onload = () => {
                console.log('✅ Imgur funcionou com:', link);
                resolve(link);
            };
            img.onerror = () => {
                testados++;
                if (testados === linksParaTestar.length) {
                    console.warn('⚠️ Nenhum link do Imgur funcionou');
                    resolve(linkOriginal); // Fallback
                }
            };
            img.src = link;
        });
    });
}

// ============================================
// FUNÇÃO PARA ACEITAR QUALQUER LINK DE IMAGEM
// ============================================

function validarLinkImagem(link) {
    if (!link || typeof link !== 'string') {
        console.warn('⚠️ Link inválido ou vazio');
        return '';
    }
    
    // Limpar espaços extras
    link = link.trim();
    
    // Lista de domínios conhecidos de imagens
    const dominiosPermitidos = [
        'images.unsplash.com',
        'i.imgur.com',
        'imgur.com',
        'live.staticflickr.com',
        'farm1.staticflickr.com',
        'farm2.staticflickr.com',
        'farm3.staticflickr.com',
        'farm4.staticflickr.com',
        'farm5.staticflickr.com',
        'farm6.staticflickr.com',
        'pixabay.com',
        'cdn.pixabay.com',
        'pexels.com',
        'images.pexels.com',
        'i.ibb.co',
        'ibb.co',
        'postimg.cc',
        'i.postimg.cc',
        'images.unsplash.com',
        'plus.unsplash.com',
        'drive.google.com',
        'lh3.googleusercontent.com',
        'googleusercontent.com',
        'raw.githubusercontent.com',
        'github.com',
        'cloudflare-ipfs.com',
        'ipfs.io',
        'arweave.net',
        'i.redd.it',
        'preview.redd.it',
        'cdn.discordapp.com',
        'media.discordapp.net',
        'tenor.com',
        'media.tenor.com',
        'giphy.com',
        'media.giphy.com',
        'i.giphy.com',
        'i.ytimg.com',
        'yt3.ggpht.com',
        'blogger.googleusercontent.com',
        'bp.blogspot.com',
        '1.bp.blogspot.com',
        '2.bp.blogspot.com',
        '3.bp.blogspot.com',
        '4.bp.blogspot.com'
    ];
    
    // Verificar se é uma URL válida
    if (!link.startsWith('http://') && !link.startsWith('https://')) {
        // Se não tiver protocolo, adicionar https://
        link = 'https://' + link;
    }
    
    try {
        const url = new URL(link);
        const hostname = url.hostname.replace('www.', '');
        
        // Verificar se o domínio está na lista de permitidos
        const permitido = dominiosPermitidos.some(dominio => 
            hostname.includes(dominio) || dominio.includes(hostname)
        );
        
        if (!permitido) {
            console.warn(`⚠️ Domínio não verificado: ${hostname}. Tentando mesmo assim...`);
        }
        
        // Verificar extensões comuns de imagem
        const extensoesImagem = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico', '.tiff', '.tif'];
        const temExtensao = extensoesImagem.some(ext => link.toLowerCase().includes(ext));
        
        // Verificar padrões de serviços de imagem
        const padroesImagem = [
            '/photo/', '/photos/', '/image/', '/images/', '/img/', '/imagem/',
            'id=', '?id=', '&id=', 'file=', '?file=', '&file=',
            'unsplash.com/photo', 'imgur.com/', 'i.imgur.com',
            'googleusercontent', 'githubusercontent', 'raw.githubusercontent',
            'cloudfront.net', 'cloudinary.com', 'fbcdn.net',
            'cdninstagram.com', 'pinimg.com', 'staticflickr.com'
        ];
        
        const pareceImagem = padroesImagem.some(padrao => link.includes(padrao));
        
        if (!temExtensao && !pareceImagem) {
            console.warn('⚠️ Link pode não ser uma imagem:', link);
        }
        
        return link;
        
    } catch (error) {
        console.warn('⚠️ URL inválida:', link);
        return link; // Retorna mesmo assim, pode ser caminho local
    }
}

// ============================================
// FUNÇÃO PARA TESTAR SE A IMAGEM CARREGA
// ============================================

function testarImagem(link) {
    return new Promise((resolve) => {
        const img = new Image();
        
        img.onload = () => {
            console.log('✅ Imagem carregou:', link);
            resolve(true);
        };
        
        img.onerror = () => {
            console.warn('⚠️ Imagem NÃO carregou:', link);
            resolve(false);
        };
        
        img.src = link;
        
        // Timeout após 5 segundos
        setTimeout(() => {
            if (!img.complete) {
                console.warn('⚠️ Timeout ao carregar:', link);
                resolve(false);
            }
        }, 5000);
    });
}

// ============================================
// FUNÇÃO PARA VALIDAR E CORRIGIR LINKS COMUNS
// ============================================

function corrigirLinkImagem(link) {
    if (!link) return link;
    
    link = link.trim();
    
    // Corrigir links do Google Drive
    if (link.includes('drive.google.com') || link.includes('googleusercontent.com')) {
        // Extrair ID do Google Drive
        const match = link.match(/[-\w]{25,}/);
        if (match) {
            return `https://lh3.googleusercontent.com/d/${match[0]}`;
        }
    }
    
    // Corrigir links do Imgur
    if (link.includes('imgur.com') && !link.includes('i.imgur.com')) {
        const match = link.match(/([a-zA-Z0-9]{5,})/);
        if (match) {
            return `https://i.imgur.com/${match[0]}.jpg`;
        }
    }
    
    // Corrigir links do Unsplash
    if (link.includes('unsplash.com') && !link.includes('images.unsplash.com')) {
        const match = link.match(/photo-([a-zA-Z0-9-]+)/);
        if (match) {
            return `https://images.unsplash.com/photo-${match[1]}?w=800&fm=jpg`;
        }
    }
    
    // Corrigir links do Flickr
    if (link.includes('flickr.com') && !link.includes('staticflickr.com')) {
        // Padrão complexo, retorna original
        return link;
    }
    
    // Adicionar https se necessário
    if (!link.startsWith('http://') && !link.startsWith('https://') && !link.startsWith('/')) {
        link = 'https://' + link;
    }
    
    return link;
}

// ============================================
// FUNÇÃO PRINCIPAL PARA USAR NO SEU CÓDIGO
// ============================================

function processarLinkImagem(link, nomeImagem = '') {
    console.log(`🖼️ Processando imagem${nomeImagem ? ' ' + nomeImagem : ''}...`);
    
    // Corrigir link se possível
    const linkCorrigido = corrigirLinkImagem(link);
    
    // Validar link
    const linkValidado = validarLinkImagem(linkCorrigido);
    
    console.log(`📎 Link final:`, linkValidado);
    
    return linkValidado;
}

// ============================================
// EXEMPLO DE USO NO SEU PORTFÓLIO
// ============================================

// Use esta função para processar todas as imagens do portfólio
function processarPortfolio(portfolioItems) {
    return portfolioItems.map(item => {
        return {
            ...item,
            imagem: processarLinkImagem(item.imagem, item.titulo)
        };
    });
}

// ============================================
// EXEMPLO PRÁTICO
// ============================================

/*
const meusItens = [
    {
        id: 1,
        titulo: "Minha Foto",
        imagem: "https://drive.google.com/file/d/1rvblJKDrQaJ6FCVbVdzfAg9ywkiuC22y/view",
        descricao: "Descrição"
    }
];

const itensProcessados = processarPortfolio(meusItens);
console.log(itensProcessados);
*/

// ============================================
// FUNÇÃO PARA CARREGAR IMAGEM COM FALLBACK
// ============================================

function carregarImagemComFallback(elementoImg, linksAlternativos) {
    let index = 0;
    
    function tentarCarregar() {
        if (index >= linksAlternativos.length) {
            console.error('❌ Nenhuma imagem carregou');
            elementoImg.src = 'https://via.placeholder.com/800x600?text=Imagem+não+disponível';
            return;
        }
        
        const link = processarLinkImagem(linksAlternativos[index]);
        elementoImg.src = link;
        
        elementoImg.onload = () => {
            console.log('✅ Imagem carregada com sucesso:', link);
        };
        
        elementoImg.onerror = () => {
            console.warn('⚠️ Falha ao carregar, tentando próximo...');
            index++;
            tentarCarregar();
        };
    }
    
    tentarCarregar();
}

(function() {
    'use strict';

    // ============================================
    // DADOS DO SITE
    // ============================================
    const SITE_DATA = {
        // Informações de Contato
        contato: {
            email: "acabrizo@gmail.com",
            telefone: "863816035",
            whatsapp: "863816035",
            endereco: "Beira, Mozambique",
            instagram: "angelo cabrizo",
            facebook: "angelo cabrizo",
            horario: "Seg - Sex: 9h às 18h, Sáb: 9h às 13h"
        },

        // Redes Sociais
        redesSociais: [
            { nome: "Instagram", url: "https://instagram.com/angelocabrizo", icone: "fab fa-instagram" },
            { nome: "Facebook", url: "https://facebook.com/angelocabrizo", icone: "fab fa-facebook" },
            { nome: "WhatsApp", url: "https://wa.me/863816035", icone: "fab fa-whatsapp" }
        ],

        // Hero Images (30 imagens para variedade)
        heroImages: [
            "https://i.postimg.cc/KYPtStpm/ANG-7621.jpg?w=1920",
            "https://i.postimg.cc/3JMsBv02/ANG-3149.jpg?w=1920",
            "https://i.postimg.cc/bYR5QB8z/ANG-9751.jpg?w=1920",
            "https://i.postimg.cc/rsbZKv6P/ANG-0367.jpg?w=1920",
            "https://i.postimg.cc/7hD0X93J/ANG-7086.jpg?w=800&h=600",
            "https://i.postimg.cc/W4byYm7W/AFS-2023.jpg?w=800&h=600",
            "https://i.postimg.cc/8CXrLD5t/DSC-5773.jpg?w=2920",
            "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=1920",
            "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920",
            "https://i.postimg.cc/xTFDr4cF/ANG-9033.jpg?w=1920"
        ],

        // Portfólio (30 imagens)
        portfolio: [
            { id: 1, titulo: "Casamento na Praia", categoria: "casamento", imagem: "https://i.postimg.cc/SRZCLN8b/In-Shot-20260218-111558245.jpg?w=800", descricao: "Amor e emoção à beira-mar" },
            { id: 2, titulo: "Ensaio de Moda", categoria: "moda", imagem: "https://i.postimg.cc/63ZgNbJy/ANG-9157.jpg?w=800", descricao: "Estilo e sofisticação" },
            { id: 3, titulo: "Evento Corporativo", categoria: "corporativo", imagem: "https://i.postimg.cc/W4wksBgC/file_00000000f93071fdba15f10713d6f4af.jpg", descricao: "Profissionalismo em cada detalhe" },
            { id: 4, titulo: "Ensaio Gestante", categoria: "ensaio", imagem: "https://images.unsplash.com/photo-1544427920-c49ccfb85579?w=800", descricao: "A beleza da maternidade" },
            { id: 5, titulo: "Casamento no Campo", categoria: "casamento", imagem: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800", descricao: "Romance em meio à natureza" },
            { id: 6, titulo: "Book Profissional", categoria: "corporativo", imagem: "https://i.postimg.cc/y82kcpQS/IMG-20251120-WA0009.jpg", descricao: "Imagem profissional" },
            { id: 7, titulo: "Festa de Aniversário", categoria: "eventos", imagem: "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=800", descricao: "Momentos de alegria" },
            { id: 8, titulo: "Fotografia de Comida", categoria: "ensaio", imagem: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800", descricao: "Arte na gastronomia" },
            { id: 9, titulo: "Paisagem Natural", categoria: "ensaio", imagem: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800", descricao: "Belezas da natureza" },
            { id: 10, titulo: "Retrato Artístico", categoria: "ensaio", imagem: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800", descricao: "Expressões e emoções" },
            { id: 11, titulo: "Desfile de Moda", categoria: "moda", imagem: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800", descricao: "Passarela e estilo" },
            { id: 12, titulo: "Conferência", categoria: "corporativo", imagem: "https://i.postimg.cc/hGVFncY8/ANG-7622.jpg?w=800", descricao: "Eventos de negócios" }
        ],

        // Serviços
        servicos: [
            { id: 1, titulo: "Ensaios Externos", descricao: "Sessões em locações externas com luz natural", icone: "fa-camera", preco: "A partir de 50 MT" },
            { id: 2, titulo: "Estúdio Profissional", descricao: "Estrutura completa com iluminação profissional", icone: "fa-lightbulb", preco: "A partir de 100 MT" },
            { id: 3, titulo: "Eventos Sociais", descricao: "Cobertura completa de casamentos e festas", icone: "fa-calendar", preco: "Sob consulta" },
            { id: 4, titulo: "Ensaios Fashion", descricao: "Fotografia de moda e beleza", icone: "fa-star", preco: "A partir de 600 MT" },
            { id: 5, titulo: "Book Pessoal", descricao: "Ensaios personalizados", icone: "fa-heart", preco: "A partir de 400 MT" },
            { id: 6, titulo: "Produção de Vídeo", descricao: "Vídeos profissionais", icone: "fa-video", preco: "Sob consulta" }
        ],

        // Depoimentos
        testimonios: [
            { nome: "Ana Silva", foto: "https://randomuser.me/api/portraits/women/1.jpg", texto: "Profissionais incríveis! Capturaram cada momento do meu casamento com perfeição.", cargo: "Cliente" },
            { nome: "João Santos", foto: "https://randomuser.me/api/portraits/men/1.jpg", texto: "Equipe talentosa e criativa. Recomendo fortemente!", cargo: "Cliente" },
            { nome: "Maria Oliveira", foto: "https://randomuser.me/api/portraits/women/2.jpg", texto: "Fotos maravilhosas, superaram todas as expectativas.", cargo: "Cliente" }
        ]
    };

    // ============================================
    // VARIÁVEIS GLOBAIS
    // ============================================
    let currentImageIndex = 0;
    let portfolioItems = [];
    let currentPage = 1;
    const itemsPerPage = 6;

    // ============================================
    // INICIALIZAÇÃO
    // ============================================
    document.addEventListener('DOMContentLoaded', () => {
        initPreloader();
        initCursor();
        initHeader();
        initHeroSlider();
        initTypingEffect();
        initPortfolio();
        initServices();
        initGallery();
        initTestimonials();
        initCounters();
        initSmoothScroll();
        initBackToTop();
        initContactForm();
        initNewsletter();
        initScrollAnimations();
        initParallax();
    });

    // ============================================
    // PRELOADER
    // ============================================
    function initPreloader() {
        const preloader = document.querySelector('.preloader');
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('hide');
            }, 1000);
        });
    }

    // ============================================
    // CURSOR PERSONALIZADO
    // ============================================
    function initCursor() {
        const cursor = document.querySelector('.cursor');
        const follower = document.querySelector('.cursor-follower');

        document.addEventListener('mousemove', (e) => {
            cursor.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
            follower.style.transform = `translate(${e.clientX - 20}px, ${e.clientY - 20}px)`;
        });

        document.addEventListener('mousedown', () => {
            cursor.style.transform = 'scale(0.8)';
            follower.style.transform = 'scale(1.5)';
        });

        document.addEventListener('mouseup', () => {
            cursor.style.transform = 'scale(1)';
            follower.style.transform = 'scale(1)';
        });

        // Hover em elementos clicáveis
        const clickables = document.querySelectorAll('a, button, .btn, .portfolio-item, .gallery-item');
        clickables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(1.5)';
                follower.style.transform = 'scale(1.5)';
                follower.style.borderColor = 'var(--primary-300)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                follower.style.transform = 'scale(1)';
                follower.style.borderColor = 'var(--primary-100)';
            });
        });
    }

    // ============================================
    // HEADER SCROLL
    // ============================================
    function initHeader() {
        const header = document.querySelector('.header');
        const menuToggle = document.querySelector('.menu-toggle');
        const navMenu = document.querySelector('.nav-menu');

        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });

        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Fechar menu ao clicar em link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

        // ============================================
    // HERO SLIDER
    // ============================================
    function initHeroSlider() {
        const slider = document.getElementById('heroSlider');
        if (!slider) return;

        SITE_DATA.heroImages.forEach((img, index) => {
            const slide = document.createElement('div');
            slide.className = 'slide';
            slide.style.backgroundImage = `url(${img})`;
            slide.style.animationDelay = `${index * 5}s`;
            slider.appendChild(slide);
        });
    }

    // ============================================
    // EFEITO DE DIGITAÇÃO
    // ============================================
    function initTypingEffect() {
        const texts = ['Visual Studio', 'Arte & Luz', 'Momentos', 'Emoções', 'Criatividade'];
        const element = document.getElementById('typingEffect');
        if (!element) return;

        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function type() {
            const currentText = texts[textIndex];

            if (isDeleting) {
                element.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                element.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
            }

            if (!isDeleting && charIndex === currentText.length) {
                isDeleting = true;
                setTimeout(type, 2000);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                setTimeout(type, 500);
            } else {
                setTimeout(type, isDeleting ? 50 : 100);
            }
        }

        type();
    }

    // ============================================
    // PORTFÓLIO
    // ============================================
    function initPortfolio() {
        portfolioItems = [...SITE_DATA.portfolio];
        renderPortfolio();
        initPortfolioFilters();
        initLightbox();
    }

    function renderPortfolio(category = 'all') {
        const grid = document.getElementById('portfolioGrid');
        if (!grid) return;

        const filtered = category === 'all' 
            ? portfolioItems 
            : portfolioItems.filter(item => item.categoria === category);

        const itemsToShow = filtered.slice(0, currentPage * itemsPerPage);

        grid.innerHTML = itemsToShow.map(item => `
            <div class="portfolio-item" data-id="${item.id}">
                <img src="${item.imagem}" alt="${item.titulo}" loading="lazy">
                <div class="portfolio-overlay">
                    <h3>${item.titulo}</h3>
                    <p>${item.descricao}</p>
                </div>
            </div>
        `).join('');

        // Load More button
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            if (itemsToShow.length >= filtered.length) {
                loadMoreBtn.style.display = 'none';
            } else {
                loadMoreBtn.style.display = 'block';
            }
        }
    }

    function initPortfolioFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                currentPage = 1;
                renderPortfolio(btn.dataset.filter);
            });
        });

        // Load more
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                currentPage++;
                const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
                renderPortfolio(activeFilter);
            });
        }
    }

    // ============================================
    // LIGHTBOX
    // ============================================
    function initLightbox() {
        document.addEventListener('click', (e) => {
            const portfolioItem = e.target.closest('.portfolio-item');
            if (!portfolioItem) return;

            const id = portfolioItem.dataset.id;
            const item = portfolioItems.find(p => p.id == id);
            if (!item) return;

            openLightbox(item);
        });
    }

    function openLightbox(item) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox active';
        lightbox.innerHTML = `
            <span class="lightbox-close">&times;</span>
            <span class="lightbox-nav lightbox-prev"><i class="fas fa-chevron-left"></i></span>
            <span class="lightbox-nav lightbox-next"><i class="fas fa-chevron-right"></i></span>
            <div class="lightbox-content">
                <img src="${item.imagem}" alt="${item.titulo}">
                <div class="lightbox-caption">
                    <h3>${item.titulo}</h3>
                    <p>${item.descricao}</p>
                </div>
            </div>
        `;

        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';

        const close = lightbox.querySelector('.lightbox-close');
        const prev = lightbox.querySelector('.lightbox-prev');
        const next = lightbox.querySelector('.lightbox-next');

        close.addEventListener('click', () => {
            lightbox.remove();
            document.body.style.overflow = '';
        });

        prev.addEventListener('click', () => navigateLightbox(-1));
        next.addEventListener('click', () => navigateLightbox(1));

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.remove();
                document.body.style.overflow = '';
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                lightbox.remove();
                document.body.style.overflow = '';
            }
        });
    }

    function navigateLightbox(direction) {
        // Implementar navegação
    }

    // ============================================
    // SERVIÇOS
    // ============================================
    function initServices() {
        const grid = document.getElementById('servicesGrid');
        if (!grid) return;

        grid.innerHTML = SITE_DATA.servicos.map(servico => `
            <div class="service-card">
                <i class="fas ${servico.icone}"></i>
                <h3>${servico.titulo}</h3>
                <p>${servico.descricao}</p>
                <span class="service-price">${servico.preco}</span>
            </div>
        `).join('');
    }

    // ============================================
    // GALERIA
    // ============================================
    function initGallery() {
        const grid = document.getElementById('galleryGrid');
        if (!grid) return;

        // Usar mais imagens do portfólio para galeria
        const galleryImages = [...SITE_DATA.portfolio, ...SITE_DATA.portfolio.slice(0, 6)];

        grid.innerHTML = galleryImages.map(item => `
            <div class="gallery-item">
                <img src="${item.imagem}" alt="${item.titulo}" loading="lazy">
                <div class="gallery-overlay">
                    <h3>${item.titulo}</h3>
                </div>
            </div>
        `).join('');
    }

    // ============================================
    // DEPOIMENTOS
    // ============================================
    function initTestimonials() {
        const slider = document.getElementById('testimonialsSlider');
        if (!slider) return;

        slider.innerHTML = SITE_DATA.testimonios.map(test => `
            <div class="testimonial-card">
                <div class="testimonial-content">
                    <i class="fas fa-quote-left"></i>
                    <p>${test.texto}</p>
                </div>
                <div class="testimonial-author">
                    <img src="${test.foto}" alt="${test.nome}">
                    <div>
                        <h4>${test.nome}</h4>
                        <span>${test.cargo}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // ============================================
    // CONTADORES ANIMADOS
    // ============================================
    function initCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.dataset.count);
                    let count = 0;
                    
                    const updateCounter = () => {
                        if (count < target) {
                            count += Math.ceil(target / 50);
                            counter.textContent = count;
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target;
                        }
                    };
                    
                    updateCounter();
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    }

    // ============================================
    // SCROLL SUAVE
    // ============================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    // ============================================
    // BACK TO TOP
    // ============================================
    function initBackToTop() {
        const backToTop = document.querySelector('.back-to-top');

        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
}

     // ============================================
    // FORMULÁRIO DE CONTATO
    // ============================================
    function initContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simular envio
            showToast('Mensagem enviada com sucesso! Entraremos em contato em breve.');
            form.reset();
        });
    }

    // ============================================
    // NEWSLETTER
    // ============================================
    function initNewsletter() {
        const form = document.getElementById('newsletterForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Inscrição realizada com sucesso!');
            form.reset();
        });
    }

    // ============================================
    // TOAST
    // ============================================
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    // ============================================
    // ANIMAÇÕES NO SCROLL
    // ============================================
    function initScrollAnimations() {
        const elements = document.querySelectorAll('.service-card, .portfolio-item, .gallery-item, .about-image, .about-content');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease';
            observer.observe(el);
        });
    }

    // ============================================
    // EFEITO PARALLAX
    // ============================================
    function initParallax() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.hero');
            if (hero) {
                hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
            }
        });
    }
// ============================================
// EFEITO DE ASSINATURA REAL (ESCRITA À MÃO)
// ============================================

// Garantir que o DOM está carregado
document.addEventListener('DOMContentLoaded', function() {
    // Pequeno delay para garantir que tudo carregou
    setTimeout(initSignatureAnimation, 300);
});

function initSignatureAnimation() {
    const logoText = document.querySelector('.logo-text');
    if (!logoText) return;
    
    // Salvar o conteúdo original
    const textoCompleto = logoText.textContent;
    const primeiraPalavra = 'Cabrizo';
    const segundaPalavra = 'Visual Studio';
    
    // Limpar o conteúdo
    logoText.innerHTML = '';
    logoText.style.minHeight = '3.5rem'; // Evitar que o layout quebre
    logoText.style.display = 'inline-block';
    
    // Adicionar cursor piscante
    const cursor = document.createElement('span');
    cursor.className = 'signature-cursor';
    cursor.innerHTML = '|';
    cursor.style.cssText = `
        display: inline-block;
        animation: cursorBlink 0.8s infinite;
        color: gold;
        font-weight: 300;
        margin-left: 2px;
    `;
    
    // Adicionar estilo do cursor se não existir
    if (!document.querySelector('#signature-styles')) {
        const style = document.createElement('style');
        style.id = 'signature-styles';
        style.textContent = `
            @keyframes cursorBlink {
                0%, 50% { opacity: 1; }
                51%, 100% { opacity: 0; }
            }
            @keyframes signatureAppear {
                0% { 
                    opacity: 0;
                    transform: scale(0.8) rotate(-5deg);
                    filter: blur(5px);
                }
                50% {
                    opacity: 0.8;
                    transform: scale(1.1) rotate(2deg);
                }
                100% { 
                    opacity: 1;
                    transform: scale(1) rotate(0);
                    filter: blur(0);
                }
            }
            @keyframes floatSignature {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-3px); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Variáveis para o efeito
    let charIndex = 0;
    let isWriting = true;
    let currentText = '';
    const velocidade = 120; // Velocidade da escrita
    
    // Função principal de escrita
    function escreverAssinatura() {
        if (isWriting) {
            // Escrever "Cabrizo"
            if (charIndex < primeiraPalavra.length) {
                currentText += primeiraPalavra[charIndex];
                logoText.innerHTML = currentText;
                logoText.appendChild(cursor);
                charIndex++;
                setTimeout(escreverAssinatura, velocidade);
            } 
            else if (charIndex === primeiraPalavra.length) {
                // Adicionar espaço
                currentText += ' ';
                logoText.innerHTML = currentText;
                logoText.appendChild(cursor);
                charIndex++;
                setTimeout(escreverAssinatura, velocidade * 2);
            }
            else if (charIndex < primeiraPalavra.length + segundaPalavra.length + 1) {
                // Escrever "Visual Studio"
                const indexNaSegunda = charIndex - primeiraPalavra.length - 1;
                if (indexNaSegunda < segundaPalavra.length) {
                    currentText += segundaPalavra[indexNaSegunda];
                    logoText.innerHTML = currentText;
                    logoText.appendChild(cursor);
                    charIndex++;
                    setTimeout(escreverAssinatura, velocidade);
                } else {
                    // Terminou a escrita
                    isWriting = false;
                    
                    // Remover o cursor
                    if (cursor.parentNode) {
                        cursor.remove();
                    }
                    
                    // Aplicar animação de entrada ao texto completo
                    logoText.style.animation = 'signatureAppear 0.8s ease-out';
                    
                    // Criar o span para "Visual Studio" com animação de flutuação
                    const span = document.createElement('span');
                    span.textContent = segundaPalavra;
                    span.style.cssText = `
                        display: inline-block;
                        animation: floatSignature 3s ease-in-out infinite;
                        margin-left: 8px;
                        font-family: 'Cinzel', serif;
                        font-size: 1.6rem;
                        letter-spacing: 6px;
                        color: var(--platinum);
                        -webkit-text-fill-color: var(--platinum);
                    `;
                    
                    // Reconstruir com o span
                    logoText.innerHTML = `Cabrizo `;
                    logoText.appendChild(span);
                    
                    // Efeito de brilho final
                    logoText.style.textShadow = '0 0 30px gold';
                    setTimeout(() => {
                        logoText.style.textShadow = '0 0 15px rgba(255, 215, 0, 0.4)';
                    }, 500);
                }
            }
        }
    }
    
    // Iniciar a escrita
    escreverAssinatura();
    
    // Efeito de brilho no hover
    logoText.addEventListener('mouseenter', () => {
        logoText.style.transition = 'text-shadow 0.3s ease';
        logoText.style.textShadow = '0 0 30px gold, 0 0 60px #FFD700';
        
        // Dar um pequeno "pulo" no span
        const span = logoText.querySelector('span');
        if (span) {
            span.style.transform = 'scale(1.05)';
            span.style.transition = 'transform 0.3s ease';
        }
    });
    
    logoText.addEventListener('mouseleave', () => {
        logoText.style.textShadow = '0 0 15px rgba(255, 215, 0, 0.4)';
        
        const span = logoText.querySelector('span');
        if (span) {
            span.style.transform = 'scale(1)';
        }
    });
}

// ============================================
// EFEITO DE ASSINATURA EM 3D (OPCIONAL)
// ============================================
function add3DSignatureEffect() {
    const logo = document.querySelector('.logo');
    if (!logo) return;
    
    logo.addEventListener('mousemove', (e) => {
        const rect = logo.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        logo.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    logo.addEventListener('mouseleave', () => {
        logo.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
}



// ============================================
// INICIALIZAR EFEITOS ADICIONAIS
// ============================================
// Ativar efeito 3D (comente se não quiser)
// setTimeout(add3DSignatureEffect, 1000);

// Função para resetar se necessário
window.resetSignature = function() {
    const logoText = document.querySelector('.logo-text');
    if (logoText) {
        logoText.innerHTML = '';
        initSignatureAnimation();
    }
};

// ============================================
// WHATSAPP - FUNÇÃO GLOBAL (NÃO DEPENDE DE NADA)
// ============================================

// Criar função global que pode ser chamada diretamente do HTML
window.enviarWhatsApp = function() {
    console.log('✅ Função WhatsApp chamada');
    
    // SEU NÚMERO - ALTERE AQUI
    const telefone = '258863816035'; // Moçambique
    
    // Pegar valores
    const nome = document.getElementById('nome')?.value || '';
    const email = document.getElementById('email')?.value || '';
    const assunto = document.getElementById('assunto')?.value || 'Contato';
    const mensagem = document.getElementById('mensagem')?.value || '';
    
    // Validar
    if (!nome || !mensagem) {
        alert('Por favor, preencha seu nome e mensagem');
        return false;
    }
    
    // Criar texto
    const texto = `*Novo contato do site*%0A%0A👤 *Nome:* ${nome}%0A📧 *Email:* ${email}%0A📝 *Assunto:* ${assunto}%0A%0A💬 *Mensagem:*%0A${mensagem}`;
    
    // Abrir WhatsApp
    const link = `https://wa.me/${telefone}?text=${texto}`;
    window.open(link, '_blank');
    
    return false;
}

// Também manter o evento para quem usa addEventListener
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Sistema WhatsApp carregado');
    
    const form = document.getElementById('contactForm');
    if (form) {
        // Remover qualquer evento anterior
        form.onsubmit = null;
        
        // Adicionar nosso evento
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('✅ Form enviado via evento');
            return window.enviarWhatsApp();
        });
    }
});

// ============================================
// CARROSSEL 3D - VERSÃO FUNCIONAL
// ============================================
(function() {
    'use strict';
    
    // Função para inicializar o carrossel
    function initCarrossel() {
        console.log('🎬 Inicializando carrossel 3D...');
        
        const carrossel = document.querySelector('.carrossel');
        
        if (!carrossel) {
            console.warn('⏳ Carrossel não encontrado, tentando novamente...');
            setTimeout(initCarrossel, 500);
            return;
        }
        
        console.log('✅ Carrossel 3D encontrado e iniciado!');
        
        // Garantir que a animação está rodando
        carrossel.style.animation = 'girarCarrossel 25s linear infinite';
        
        // Pausar ao passar o mouse
        carrossel.addEventListener('mouseenter', function() {
            this.style.animationPlayState = 'paused';
        });
        
        // Continuar ao tirar o mouse
        carrossel.addEventListener('mouseleave', function() {
            this.style.animationPlayState = 'running';
        });
        
        // Para dispositivos touch (celular)
        carrossel.addEventListener('touchstart', function(e) {
            e.preventDefault();
            this.style.animationPlayState = 'paused';
        });
        
        carrossel.addEventListener('touchend', function() {
            this.style.animationPlayState = 'running';
        });
        
        // Pausar quando a página não está visível (economiza recursos)
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                carrossel.style.animationPlayState = 'paused';
            } else {
                carrossel.style.animationPlayState = 'running';
            }
        });
    }
    
    // Iniciar quando a página carregar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCarrossel);
    } else {
        initCarrossel();
    }
})();

// ============================================
// FUNÇÃO DE TESTE (opcional)
// ============================================
function testarCarrossel() {
    const carrossel = document.querySelector('.carrossel');
    const items = document.querySelectorAll('.carrossel-item');
    
    console.log('📊 TESTE DO CARROSSEL:');
    console.log('Carrossel:', carrossel ? '✅' : '❌');
    console.log('Número de imagens:', items.length);
    
    if (carrossel && items.length > 0) {
        console.log('✅ Carrossel pronto para uso!');
        return true;
    } else {
        console.log('❌ Carrossel com problemas');
        return false;
    }
}

// Chamar teste após 2 segundos
setTimeout(testarCarrossel, 2000);

})();
