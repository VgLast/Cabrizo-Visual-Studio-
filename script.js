/**
 * ============================================
 * CABRIZO VISUAL STUDIO - SCRIPT COMPLETO
 * Versão: 7.0 - CORRIGIDO E TESTADO
 * Todas as funções do admin funcionando
 * ============================================
 */

(function() {
    'use strict';

    // ============================================
    // CONFIGURAÇÕES DO FIREBASE
    // ============================================
    const FIREBASE_CONFIG = {
        apiKey: "AIzaSyAyWgfbjJcB2b9GIiHqgo1rSCnx6Gbs4SE",
        authDomain: "cabrizo-visual-studio.firebaseapp.com",
        projectId: "cabrizo-visual-studio",
        storageBucket: "cabrizo-visual-studio.firebasestorage.app",
        messagingSenderId: "547993522948",
        appId: "1:547993522948:web:5a7d72cad040db47617651"
    };

    // ============================================
    // DADOS INICIAIS
    // ============================================
    const DADOS_INICIAIS = {
        siteTitulo: "Cabrizo Visual Studio",
        siteDescricao: "Fotografia com arte, luz e emoção",
        
        logo: {
            tipo: "texto",
            texto: "Cabrizo <span>Visual Studio</span>",
            imagemUrl: ""
        },
        
        heroImages: [
            "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200",
            "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1200",
            "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200"
        ],
        
        sobre: {
            titulo: "Sobre Nós",
            texto: "Somos o Cabrizo Visual Studio, uma agência de fotografia profissional dedicada a capturar momentos únicos e especiais. Com mais de 10 anos de experiência, nossa equipe de fotógrafos talentosos está pronta para transformar suas memórias em arte através da luz e da emoção.",
            imagem: ""
        },
        
        portfolio: [
            {
                id: "foto_001",
                titulo: "Casamento na Praia",
                categoria: "Casamento",
                imagem: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
                descricao: "Momento especial capturado com emoção"
            },
            {
                id: "foto_002",
                titulo: "Moda Urbana",
                categoria: "Moda",
                imagem: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800",
                descricao: "Estilo e personalidade"
            },
            {
                id: "foto_003",
                titulo: "Evento Corporativo",
                categoria: "Corporativo",
                imagem: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800",
                descricao: "Profissionalismo em cada detalhe"
            }
        ],
        
        categorias: ["Casamento", "Moda", "Corporativo", "Ensaio", "Eventos"],
        
        servicos: [
            {
                id: "serv_001",
                titulo: "Ensaios Externos",
                descricao: "Sessões fotográficas em locações externas com luz natural.",
                icone: "fa-camera",
                preco: "A partir de R$ 500",
                destaque: true
            },
            {
                id: "serv_002",
                titulo: "Estúdio Profissional",
                descricao: "Estrutura completa com iluminação profissional.",
                icone: "fa-lightbulb",
                preco: "A partir de R$ 800",
                destaque: true
            },
            {
                id: "serv_003",
                titulo: "Eventos",
                descricao: "Cobertura completa de casamentos e eventos.",
                icone: "fa-calendar",
                preco: "Sob consulta",
                destaque: true
            }
        ],
        
        contato: {
            email: "acabrizo@gmail.com",
            telefone: "863816035",
            whatsapp: "863816035",
            endereco: "Beira, Mozambique",
            instagram: "angelo cabrizo",
            facebook: "angelo cabrizo",
            horario: "Seg - Sex: 9h às 18h, Sáb: 9h às 13h"
        },
        
        redesSociais: [
            { nome: "Instagram", url: "https://instagram.com/angelocabrizo", icone: "fa-instagram", ativo: true },
            { nome: "Facebook", url: "https://facebook.com/angelocabrizo", icone: "fa-facebook", ativo: true }
        ],
        
        rodape: {
            texto: "&copy; 2026 Cabrizo Visual Studio. Todos os direitos reservados.",
            mostrarRedesSociais: true,
            mostrarLinksRapidos: true
        },
        
        mensagens: []
    };

    // ============================================
    // VARIÁVEIS GLOBAIS
    // ============================================
    let db = null;
    let firebaseDisponivel = false;
    let siteData = JSON.parse(JSON.stringify(DADOS_INICIAIS));
    let currentImageIndex = 0;
    let unsubscribeMensagens = null;

    // ============================================
    // INICIALIZAÇÃO
    // ============================================
    function inicializar() {
        console.log('🚀 Inicializando aplicação...');
        inicializarFirebase();
        carregarDados();
        configurarEventListeners();
        verificarLogin();
        iniciarEfeitoDigitacao();
    }

    // ============================================
    // FIREBASE
    // ============================================
    function inicializarFirebase() {
        try {
            if (typeof firebase !== 'undefined' && !firebase.apps.length) {
                firebase.initializeApp(FIREBASE_CONFIG);
                db = firebase.firestore();
                firebaseDisponivel = true;
                console.log('✅ Firebase inicializado');
            }
        } catch (error) {
            console.warn('⚠️ Firebase não disponível');
        }
    }

    // ============================================
    // LOCALSTORAGE
    // ============================================
    function carregarDados() {
        try {
            const saved = localStorage.getItem('cabrizoData');
            if (saved) {
                const parsed = JSON.parse(saved);
                siteData = { ...DADOS_INICIAIS, ...parsed };
                
                // Garantir que arrays existam
                if (!siteData.portfolio) siteData.portfolio = [];
                if (!siteData.servicos) siteData.servicos = [];
                if (!siteData.redesSociais) siteData.redesSociais = [];
                if (!siteData.categorias) siteData.categorias = DADOS_INICIAIS.categorias;
                if (!siteData.mensagens) siteData.mensagens = [];
                if (!siteData.heroImages) siteData.heroImages = DADOS_INICIAIS.heroImages;
            } else {
                siteData = JSON.parse(JSON.stringify(DADOS_INICIAIS));
                salvarDados();
            }
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            siteData = JSON.parse(JSON.stringify(DADOS_INICIAIS));
        }
        
        atualizarInterface();
    }

    function salvarDados() {
        try {
            localStorage.setItem('cabrizoData', JSON.stringify(siteData));
        } catch (error) {
            console.error('Erro ao salvar dados:', error);
        }
    }

    // ============================================
    // UI - ATUALIZAÇÃO
    // ============================================
    function atualizarInterface() {
        atualizarTituloSite();
        atualizarLogo();
        initHeroSlideshow();
        renderizarFiltrosPortfolio();
        renderPortfolio();
        renderServicos();
        renderSobre();
        renderContato();
        renderRedesSociais();
        renderRodape();
    }

    function atualizarTituloSite() {
        document.title = siteData.siteTitulo + " - Fotografia Profissional";
        const descEl = document.getElementById('siteDescricaoDisplay');
        if (descEl) descEl.textContent = siteData.siteDescricao;
    }

    function atualizarLogo() {
        const logoContainer = document.getElementById('siteLogo');
        if (!logoContainer) return;
        
        if (siteData.logo.tipo === 'imagem' && siteData.logo.imagemUrl) {
            logoContainer.innerHTML = `<img src="${siteData.logo.imagemUrl}" alt="${siteData.siteTitulo}" style="height: 50px;">`;
        } else {
            logoContainer.innerHTML = `<h1>${siteData.logo.texto}</h1>`;
        }
    }

    function initHeroSlideshow() {
        const slideshow = document.getElementById('heroSlideshow');
        if (!slideshow) return;
        
        slideshow.innerHTML = '';
        const imagens = siteData.heroImages.length ? siteData.heroImages : DADOS_INICIAIS.heroImages;
        
        imagens.forEach((img, i) => {
            const slide = document.createElement('div');
            slide.className = 'slide';
            slide.style.backgroundImage = `url(${img})`;
            slide.style.animationDelay = `${i * 5}s`;
            slideshow.appendChild(slide);
        });
    }

    function renderizarFiltrosPortfolio() {
        const filtersContainer = document.getElementById('portfolioFilters');
        if (!filtersContainer) return;
        
        let html = '<button class="filter-btn active" data-filter="todos">Todos</button>';
        siteData.categorias.forEach(cat => {
            html += `<button class="filter-btn" data-filter="${cat}">${cat}</button>`;
        });
        
        filtersContainer.innerHTML = html;
        
        // Re-adicionar event listeners
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderPortfolio(btn.dataset.filter);
            });
        });
    }

    function renderPortfolio(categoria = 'todos') {
        const grid = document.getElementById('portfolioGrid');
        if (!grid) return;
        
        const items = categoria === 'todos' 
            ? siteData.portfolio 
            : siteData.portfolio.filter(item => item.categoria === categoria);
        
        if (!items.length) {
            grid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; padding: 2rem;">Nenhuma foto encontrada</p>';
            return;
        }
        
        grid.innerHTML = items.map(item => `
            <div class="portfolio-item" data-id="${item.id}">
                <img src="${item.imagem}" alt="${item.titulo}" loading="lazy">
                <div class="portfolio-overlay">
                    <h3>${item.titulo}</h3>
                    <p>${item.descricao || ''}</p>
                    <span class="portfolio-categoria">${item.categoria}</span>
                </div>
            </div>
        `).join('');
        
        document.querySelectorAll('.portfolio-item').forEach(item => {
            item.addEventListener('click', () => abrirLightbox(item.dataset.id));
        });
    }

    function renderServicos() {
        const grid = document.getElementById('servicosGrid');
        if (!grid) return;
        
        if (!siteData.servicos.length) {
            grid.innerHTML = '<p style="text-align: center;">Nenhum serviço cadastrado</p>';
            return;
        }
        
        grid.innerHTML = siteData.servicos.map(s => `
            <div class="servico-card ${s.destaque ? 'destaque' : ''}">
                <i class="fas ${s.icone}"></i>
                <h3>${s.titulo}</h3>
                <p>${s.descricao}</p>
                ${s.preco ? `<p class="servico-preco">${s.preco}</p>` : ''}
            </div>
        `).join('');
    }

    function renderSobre() {
        const el = document.getElementById('sobreTexto');
        const tituloEl = document.getElementById('sobreTituloDisplay');
        if (tituloEl) tituloEl.textContent = siteData.sobre.titulo;
        if (el) el.innerHTML = `<p>${siteData.sobre.texto}</p>`;
    }

    function renderContato() {
        const info = document.getElementById('contatoInfo');
        if (!info) return;
        
        // Formatar Instagram (remover espaços para URL)
        const instagramUser = siteData.contato.instagram.replace(/\s+/g, '');
        const facebookUser = siteData.contato.facebook.replace(/\s+/g, '');
        
        info.innerHTML = `
            <h3>Informações de Contato</h3>
            <p><i class="fas fa-envelope"></i> ${siteData.contato.email}</p>
            <p><i class="fas fa-phone"></i> ${siteData.contato.telefone}</p>
            <p><i class="fab fa-whatsapp"></i> <a href="https://wa.me/${siteData.contato.whatsapp}" target="_blank">WhatsApp</a></p>
            <p><i class="fas fa-map-marker-alt"></i> ${siteData.contato.endereco}</p>
            <p><i class="fab fa-instagram"></i> <a href="https://instagram.com/${instagramUser}" target="_blank">${siteData.contato.instagram}</a></p>
            <p><i class="fab fa-facebook"></i> <a href="https://facebook.com/${facebookUser}" target="_blank">${siteData.contato.facebook}</a></p>
        `;
    }
    
    
    function renderRedesSociais() {
        const links = document.getElementById('socialLinks');
        if (!links) return;
        
        const redesAtivas = siteData.redesSociais.filter(r => r.ativo && r.url);
        
        links.innerHTML = redesAtivas.map(r => `
            <a href="${r.url}" target="_blank" title="${r.nome}">
                <i class="fab ${r.icone}"></i>
            </a>
        `).join('');
    }

    function renderRodape() {
        const footerBottom = document.querySelector('.footer-bottom p');
        if (footerBottom) {
            footerBottom.innerHTML = siteData.rodape.texto;
        }
        
        const linksRapidos = document.getElementById('linksRapidosSection');
        if (linksRapidos) {
            linksRapidos.style.display = siteData.rodape.mostrarLinksRapidos ? 'block' : 'none';
        }
        
        const redesFooter = document.getElementById('redesSociaisFooter');
        
        if (redesFooter) {
            redesFooter.style.display = siteData.rodape.mostrarRedesSociais ? 'block' : 'none';
        }
    }

    // ============================================
    // LIGHTBOX
    // ============================================
    function abrirLightbox(itemId) {
        const index = siteData.portfolio.findIndex(p => p.id == itemId);
        if (index === -1) return;
        
        currentImageIndex = index;
        const item = siteData.portfolio[index];
        
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
                    <p>${item.descricao || ''}</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';
        
        lightbox.querySelector('.lightbox-close').addEventListener('click', fecharLightbox);
        lightbox.querySelector('.lightbox-prev').addEventListener('click', () => navegarLightbox(-1));
        lightbox.querySelector('.lightbox-next').addEventListener('click', () => navegarLightbox(1));
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) fecharLightbox();
        });
        
        document.addEventListener('keydown', handleLightboxKey);
    }

    function fecharLightbox() {
        const lightbox = document.querySelector('.lightbox.active');
        if (lightbox) {
            lightbox.remove();
            document.body.style.overflow = '';
            document.removeEventListener('keydown', handleLightboxKey);
        }
    }

    function navegarLightbox(dir) {
        currentImageIndex += dir;
        if (currentImageIndex < 0) currentImageIndex = siteData.portfolio.length - 1;
        if (currentImageIndex >= siteData.portfolio.length) currentImageIndex = 0;
        
        const item = siteData.portfolio[currentImageIndex];
        const lightbox = document.querySelector('.lightbox.active');
        if (!lightbox) return;
        
        const img = lightbox.querySelector('img');
        const caption = lightbox.querySelector('.lightbox-caption');
        
        img.src = item.imagem;
        img.alt = item.titulo;
        caption.innerHTML = `<h3>${item.titulo}</h3><p>${item.descricao || ''}</p>`;
    }

    function handleLightboxKey(e) {
        if (e.key === 'Escape') fecharLightbox();
        if (e.key === 'ArrowLeft') navegarLightbox(-1);
        if (e.key === 'ArrowRight') navegarLightbox(1);
    }

    // ============================================
    // EFEITO DE DIGITAÇÃO
    // ============================================
    const textos = ['Visual Studio', 'Fotografia', 'Arte & Luz', 'Momentos', 'Emoções'];
    let idxTexto = 0;
    let idxChar = 0;
    let deletando = false;

    function iniciarEfeitoDigitacao() {
        setTimeout(digitar, 1000);
    }

    function digitar() {
        const el = document.getElementById('typingEffect');
        if (!el) return;
        
        const atual = textos[idxTexto];
        
        if (deletando) {
            el.textContent = atual.substring(0, idxChar - 1);
            idxChar--;
        } else {
            el.textContent = atual.substring(0, idxChar + 1);
            idxChar++;
        }
        
        if (!deletando && idxChar === atual.length) {
            deletando = true;
            setTimeout(digitar, 2000);
        } else if (deletando && idxChar === 0) {
            deletando = false;
            idxTexto = (idxTexto + 1) % textos.length;
            setTimeout(digitar, 500);
        } else {
            setTimeout(digitar, deletando ? 50 : 100);
        }
    }

    // ============================================
    // EVENT LISTENERS
    // ============================================
    function configurarEventListeners() {
        // Menu mobile
        const mobileBtn = document.querySelector('.mobile-menu-btn');
        if (mobileBtn) {
            mobileBtn.addEventListener('click', () => {
                mobileBtn.classList.toggle('active');
                document.querySelector('.nav-menu')?.classList.toggle('active');
            });
        }

        // Scroll header
        window.addEventListener('scroll', () => {
            const header = document.querySelector('.site-header');
            if (header) {
                header.classList.toggle('scrolled', window.scrollY > 100);
            }
        });

        // Navegação suave
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                    document.querySelector('.mobile-menu-btn')?.classList.remove('active');
                    document.querySelector('.nav-menu')?.classList.remove('active');
                }
            });
        });

          // Navegação do admin
        document.querySelectorAll('.admin-nav li').forEach(item => {
            item.addEventListener('click', () => {
                document.querySelectorAll('.admin-nav li').forEach(li => li.classList.remove('active'));
                item.classList.add('active');
                
                document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
                const sectionId = item.dataset.section;
                const section = document.getElementById(sectionId);
                if (section) section.classList.add('active');
            });
        });

        // Login form
        document.getElementById('loginForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const user = document.getElementById('username')?.value;
            const pass = document.getElementById('password')?.value;
            
            if (user === 'admin' && pass === 'admin123') {
                sessionStorage.setItem('adminLoggedIn', 'true');
                document.getElementById('loginScreen').style.display = 'none';
                document.getElementById('adminDashboard').style.display = 'block';
                carregarAdmin();
                mostrarToast('Login realizado com sucesso!');
            } else {
                mostrarToast('Usuário ou senha incorretos!', 'error');
            }
        });

        // Formulário de contato
        document.getElementById('contatoForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const form = e.target;
            const novaMensagem = {
                id: Date.now().toString(),
                nome: form.nome.value,
                email: form.email.value,
                assunto: form.assunto.value || 'Sem assunto',
                mensagem: form.mensagem.value,
                data: new Date().toLocaleString('pt-BR'),
                lida: false
            };
            
            siteData.mensagens.unshift(novaMensagem);
            salvarDados();
            
            if (firebaseDisponivel && db) {
                try {
                    await db.collection('mensagens').add(novaMensagem);
                } catch (error) {
                    console.warn('Erro ao salvar no Firebase');
                }
            }
            
            mostrarToast('Mensagem enviada com sucesso!');
            form.reset();
        });

        // Preview de imagens
        document.getElementById('portfolioImagemUrl')?.addEventListener('input', previewPortfolio);
        document.getElementById('heroImagemUrl')?.addEventListener('input', previewHero);
    }

    function previewPortfolio(e) {
        const url = e.target.value;
        const preview = document.getElementById('portfolioPreview');
        if (!preview) return;
        
        if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
            preview.style.display = 'block';
            preview.innerHTML = `<img src="${url}" alt="Preview" style="max-width:100%; max-height:200px; border-radius:5px;" onerror="this.innerHTML='<small style=\'color:red\'>URL inválida</small>'">`;
        } else {
            preview.style.display = 'none';
            preview.innerHTML = '';
        }
    }

    function previewHero(e) {
        const url = e.target.value;
        const preview = document.getElementById('heroPreview');
        if (!preview) return;
        
        if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
            preview.style.display = 'block';
            preview.innerHTML = `<img src="${url}" alt="Preview" style="max-width:100%; max-height:200px; border-radius:5px;" onerror="this.innerHTML='<small style=\'color:red\'>URL inválida</small>'">`;
        } else {
            preview.style.display = 'none';
            preview.innerHTML = '';
        }
    }

    // ============================================
    // ADMIN - CARREGAR DADOS
    // ============================================
    function carregarAdmin() {
        // Dashboard
        document.getElementById('totalPortfolio').textContent = siteData.portfolio.length;
        document.getElementById('totalServicos').textContent = siteData.servicos.length;
        document.getElementById('totalMensagens').textContent = siteData.mensagens.length;

        // Últimas mensagens
        const ultimas = siteData.mensagens.slice(0, 5);
        document.getElementById('ultimasMensagens').innerHTML = ultimas.map(msg => `
            <div class="item-card">
                <div class="item-info">
                    <strong>${msg.nome}</strong> - ${msg.email}
                    <p>${msg.assunto}</p>
                    <small>${msg.data}</small>
                </div>
            </div>
        `).join('');

        // Configurações
        document.getElementById('siteTitulo').value = siteData.siteTitulo || '';
        document.getElementById('siteDescricao').value = siteData.siteDescricao || '';
        document.getElementById('logoTipo').value = siteData.logo.tipo || 'texto';
        document.getElementById('logoTexto').value = siteData.logo.texto || '';
        document.getElementById('logoImagemUrl').value = siteData.logo.imagemUrl || '';

        // Portfólio
        document.getElementById('portfolioList').innerHTML = siteData.portfolio.map(item => `
            <div class="item-card">
                <img src="${item.imagem}" alt="${item.titulo}" style="width:80px; height:60px; object-fit:cover;">
                <div class="item-info">
                    <strong>${item.titulo}</strong> - ${item.categoria}
                    <p>${item.descricao || ''}</p>
                </div>
                <div class="item-actions">
                    <button class="btn-delete" onclick="deletarPortfolio('${item.id}')"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `).join('');

        // Categorias
        document.getElementById('categoriasList').innerHTML = siteData.categorias.map((cat, i) => `
            <div class="item-card">
                <div class="item-info">${cat}</div>
                <div class="item-actions">
                    <button class="btn-delete" onclick="deletarCategoria(${i})"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `).join('');

        // Serviços
        document.getElementById('servicosList').innerHTML = siteData.servicos.map(item => `
            <div class="item-card">
                <div class="item-info">
                    <i class="fas ${item.icone}"></i> <strong>${item.titulo}</strong>
                    <p>${item.descricao}</p>
                    <p>${item.preco || ''}</p>
                    ${item.destaque ? '<span class="badge">Destaque</span>' : ''}
                </div>
                <div class="item-actions">
                    <button class="btn-delete" onclick="deletarServico('${item.id}')"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `).join('');

        // Sobre
        document.getElementById('sobreTitulo').value = siteData.sobre.titulo || '';
        document.getElementById('sobreTexto').value = siteData.sobre.texto || '';
        document.getElementById('sobreImagemUrl').value = siteData.sobre.imagem || '';

        // Contato
        document.getElementById('contatoEmail').value = siteData.contato.email || '';
        document.getElementById('contatoTelefone').value = siteData.contato.telefone || '';
        document.getElementById('contatoWhatsapp').value = siteData.contato.whatsapp || '';
        document.getElementById('contatoEndereco').value = siteData.contato.endereco || '';
        document.getElementById('contatoInstagram').value = siteData.contato.instagram || '';
        document.getElementById('contatoFacebook').value = siteData.contato.facebook || '';
        document.getElementById('contatoHorario').value = siteData.contato.horario || '';

        // Redes Sociais
        document.getElementById('redesList').innerHTML = siteData.redesSociais.map((item, i) => `
            <div class="item-card">
                <div class="item-info">
                    <i class="fab ${item.icone}"></i> ${item.nome}
                    <p>URL: ${item.url || 'Não definida'}</p>
                    <p>Status: ${item.ativo ? 'Ativo' : 'Inativo'}</p>
                </div>
                <div class="item-actions">
                    <button class="btn-delete" onclick="deletarRedeSocial(${i})"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `).join('');

        // Hero Images
        document.getElementById('heroList').innerHTML = siteData.heroImages.map((img, i) => `
            <div class="item-card">
                <img src="${img}" style="width:150px; height:80px; object-fit:cover;">
                <div class="item-actions">
                    <button class="btn-delete" onclick="deletarHeroImage(${i})"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `).join('');

        // Rodapé
        document.getElementById('rodapeTexto').value = siteData.rodape.texto || '';
        document.getElementById('rodapeRedesSociais').checked = siteData.rodape.mostrarRedesSociais;
        document.getElementById('rodapeLinksRapidos').checked = siteData.rodape.mostrarLinksRapidos;

        // Mensagens
        document.getElementById('mensagensList').innerHTML = siteData.mensagens.map(msg => `
            <div class="item-card">
                <div class="item-info">
                    <strong>${msg.nome}</strong> - ${msg.email}
                    <p><strong>Assunto:</strong> ${msg.assunto}</p>
                    <p>${msg.mensagem}</p>
                    <small>${msg.data}</small>
                </div>
                <div class="item-actions">
                    <button class="btn-delete" onclick="deletarMensagem('${msg.id}')"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `).join('');
    }

    // ============================================
    // FUNÇÕES AUXILIARES
    // ============================================
    function mostrarToast(msg, tipo = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${tipo}`;
        toast.textContent = msg;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    function verificarLogin() {
        if (sessionStorage.getItem('adminLoggedIn') === 'true') {
            window.showAdminLogin();
            document.getElementById('loginScreen').style.display = 'none';
            document.getElementById('adminDashboard').style.display = 'block';
            carregarAdmin();
        }
    }

    // ============================================
    // FUNÇÕES GLOBAIS (EXPOSTAS PARA O HTML)
    // ============================================
    window.showAdminLogin = function() {
        document.getElementById('sitePrincipal').style.display = 'none';
        document.querySelector('.site-header').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
    };

    window.hideAdminLogin = function() {
        document.getElementById('sitePrincipal').style.display = 'block';
        document.querySelector('.site-header').style.display = 'block';
        document.getElementById('adminPanel').style.display = 'none';
    };

    window.logout = function() {
        sessionStorage.removeItem('adminLoggedIn');
        window.location.reload();
    };

    window.openModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    // ============================================
    // CONFIGURAÇÕES
    // ============================================
    window.salvarConfiguracoes = function() {
        siteData.siteTitulo = document.getElementById('siteTitulo').value;
        siteData.siteDescricao = document.getElementById('siteDescricao').value;
        siteData.logo = {
            tipo: document.getElementById('logoTipo').value,
            texto: document.getElementById('logoTexto').value,
            imagemUrl: document.getElementById('logoImagemUrl').value
        };
        
        salvarDados();
        atualizarInterface();
        mostrarToast('Configurações salvas com sucesso!');
    };

    // ============================================
    // PORTFÓLIO
    // ============================================
    window.abrirModalNovaFoto = function() {
        document.getElementById('portfolioId').value = '';
        document.getElementById('portfolioTitulo').value = '';
        document.getElementById('portfolioImagemUrl').value = '';
        document.getElementById('portfolioDescricao').value = '';
        
        // Popular categorias no select
        const select = document.getElementById('portfolioCategoria');
        select.innerHTML = '';
        siteData.categorias.forEach(cat => {
            select.innerHTML += `<option value="${cat}">${cat}</option>`;
        });
        
        document.getElementById('portfolioPreview').style.display = 'none';
        document.getElementById('portfolioPreview').innerHTML = '';
        window.openModal('portfolioModal');
    };

    window.salvarFotoPorUrl = function() {
        const titulo = document.getElementById('portfolioTitulo').value.trim();
        const url = document.getElementById('portfolioImagemUrl').value.trim();
        const categoria = document.getElementById('portfolioCategoria').value;
        const descricao = document.getElementById('portfolioDescricao').value.trim();
        
        if (!titulo || !url) {
            alert('Preencha título e URL da imagem');
            return;
        }
        
        const novaFoto = {
            id: 'foto_' + Date.now(),
            titulo: titulo,
            categoria: categoria,
            imagem: url,
            descricao: descricao || ''
        };
        
        siteData.portfolio.push(novaFoto);
        salvarDados();
        
        window.closeModal('portfolioModal');
        carregarAdmin();
        renderPortfolio();
        renderizarFiltrosPortfolio();
        alert('Foto adicionada com sucesso!');
    };

    window.deletarPortfolio = function(id) {
        if (!confirm('Tem certeza que deseja excluir esta foto?')) return;
        
        siteData.portfolio = siteData.portfolio.filter(p => p.id !== id);
        salvarDados();
        carregarAdmin();
        renderPortfolio();
        renderizarFiltrosPortfolio();
        alert('Foto excluída com sucesso!');
    };

    // ============================================
    // CATEGORIAS
    // ============================================
    window.abrirModalNovaCategoria = function() {
        document.getElementById('novaCategoria').value = '';
        window.openModal('categoriaModal');
    };

    window.salvarNovaCategoria = function() {
        const novaCategoria = document.getElementById('novaCategoria').value.trim();
        if (!novaCategoria) {
            alert('Digite o nome da categoria');
            return;
        }
        
        if (siteData.categorias.includes(novaCategoria)) {
            alert('Categoria já existe');
            return;
        }
        
        siteData.categorias.push(novaCategoria);
        salvarDados();
        
        window.closeModal('categoriaModal');
        carregarAdmin();
        renderizarFiltrosPortfolio();
        mostrarToast('Categoria adicionada com sucesso!');
    };

    window.deletarCategoria = function(index) {
        if (!confirm('Tem certeza que deseja excluir esta categoria?')) return;
        
        const categoria = siteData.categorias[index];
        const fotosNaCategoria = siteData.portfolio.filter(p => p.categoria === categoria);
        
        if (fotosNaCategoria.length > 0) {
            alert(`Não é possível excluir: ${fotosNaCategoria.length} foto(s) usam esta categoria`);
            return;
        }
        
        siteData.categorias.splice(index, 1);
        salvarDados();
        carregarAdmin();
        renderizarFiltrosPortfolio();
        mostrarToast('Categoria excluída com sucesso!');
    };

    // ============================================
    // SERVIÇOS
    // ============================================
    window.abrirModalNovoServico = function() {
        document.getElementById('servicoId').value = '';
        document.getElementById('servicoTitulo').value = '';
        document.getElementById('servicoDescricao').value = '';
        document.getElementById('servicoPreco').value = '';
        document.getElementById('servicoIcone').value = 'fa-camera';
        document.getElementById('servicoDestaque').checked = false;
        window.openModal('servicoModal');
    };

    window.salvarNovoServico = function() {
        const titulo = document.getElementById('servicoTitulo').value.trim();
        const descricao = document.getElementById('servicoDescricao').value.trim();
        const icone = document.getElementById('servicoIcone').value;
        const preco = document.getElementById('servicoPreco').value.trim();
        const destaque = document.getElementById('servicoDestaque').checked;
        
        if (!titulo || !descricao) {
            alert('Preencha título e descrição');
            return;
        }
        
        const novoServico = {
            id: 'serv_' + Date.now(),
            titulo: titulo,
            descricao: descricao,
            icone: icone,
            preco: preco,
            destaque: destaque
        };
        
        siteData.servicos.push(novoServico);
        salvarDados();
        
        window.closeModal('servicoModal');
        carregarAdmin();
        renderServicos();
        alert('Serviço adicionado com sucesso!');
    };

    window.deletarServico = function(id) {
        if (!confirm('Tem certeza que deseja excluir este serviço?')) return;
        
        siteData.servicos = siteData.servicos.filter(s => s.id !== id);
        salvarDados();
        carregarAdmin();
        renderServicos();
        alert('Serviço excluído com sucesso!');
    };

    // ============================================
    // SOBRE
    // ============================================
    window.salvarSobre = function() {
        siteData.sobre = {
            titulo: document.getElementById('sobreTitulo').value,
            texto: document.getElementById('sobreTexto').value,
            imagem: document.getElementById('sobreImagemUrl').value
        };
        
        salvarDados();
        renderSobre();
        mostrarToast('Sobre atualizado com sucesso!');
    };

    // ============================================
    // CONTATO
    // ============================================
    window.salvarContato = function() {
        siteData.contato = {
            email: document.getElementById('contatoEmail').value,
            telefone: document.getElementById('contatoTelefone').value,
            whatsapp: document.getElementById('contatoWhatsapp').value,
            endereco: document.getElementById('contatoEndereco').value,
            instagram: document.getElementById('contatoInstagram').value,
            facebook: document.getElementById('contatoFacebook').value,
            horario: document.getElementById('contatoHorario').value
        };
        
        salvarDados();
        renderContato();
        mostrarToast('Contato atualizado com sucesso!');
    };

    // ============================================
    // REDES SOCIAIS
    // ============================================
    window.abrirModalNovaRedeSocial = function() {
        document.getElementById('redeSocialIndex').value = '';
        document.getElementById('redeSocialNome').value = '';
        document.getElementById('redeSocialUrl').value = '';
        document.getElementById('redeSocialIcone').value = 'fa-instagram';
        document.getElementById('redeSocialAtivo').checked = true;
        window.openModal('redeSocialModal');
    };

    window.salvarNovaRedeSocial = function() {
        const nome = document.getElementById('redeSocialNome').value.trim();
        const url = document.getElementById('redeSocialUrl').value.trim();
        const icone = document.getElementById('redeSocialIcone').value;
        const ativo = document.getElementById('redeSocialAtivo').checked;
        
        if (!nome) {
            alert('Preencha o nome da rede social');
            return;
        }
        
        const novaRede = {
            nome: nome,
            url: url,
            icone: icone,
            ativo: ativo
        };
        
        siteData.redesSociais.push(novaRede);
        salvarDados();
        
        window.closeModal('redeSocialModal');
        carregarAdmin();
        renderRedesSociais();
        renderRodape();
        mostrarToast('Rede social adicionada com sucesso!');
    };

    window.deletarRedeSocial = function(index) {
        if (!confirm('Tem certeza que deseja excluir esta rede social?')) return;
        
        siteData.redesSociais.splice(index, 1);
        salvarDados();
        carregarAdmin();
        renderRedesSociais();
        renderRodape();
        mostrarToast('Rede social excluída com sucesso!');
    };

    // ============================================
    // HERO IMAGES
    // ============================================
    window.abrirModalNovaHero = function() {
        document.getElementById('heroImagemUrl').value = '';
        document.getElementById('heroPreview').style.display = 'none';
        document.getElementById('heroPreview').innerHTML = '';
        window.openModal('heroModal');
    };

    window.salvarNovaHeroImage = function() {
        const url = document.getElementById('heroImagemUrl').value.trim();
        
        if (!url) {
            alert('Insira uma URL');
            return;
        }
        
        siteData.heroImages.push(url);
        salvarDados();
        
        window.closeModal('heroModal');
        carregarAdmin();
        initHeroSlideshow();
        alert('Imagem adicionada com sucesso!');
    };

    window.deletarHeroImage = function(index) {
        if (!confirm('Tem certeza que deseja excluir esta imagem?')) return;
        
        siteData.heroImages.splice(index, 1);
        salvarDados();
        carregarAdmin();
        initHeroSlideshow();
        alert('Imagem excluída com sucesso!');
    };

    // ============================================
    // RODAPÉ
    // ============================================
    window.salvarRodape = function() {
        siteData.rodape = {
            texto: document.getElementById('rodapeTexto').value,
            mostrarRedesSociais: document.getElementById('rodapeRedesSociais').checked,
            mostrarLinksRapidos: document.getElementById('rodapeLinksRapidos').checked
        };
        
        salvarDados();
        renderRodape();
        mostrarToast('Rodapé atualizado com sucesso!');
    };

    // ============================================
    // MENSAGENS
    // ============================================
    window.deletarMensagem = function(id) {
        if (!confirm('Tem certeza que deseja excluir esta mensagem?')) return;
        
        siteData.mensagens = siteData.mensagens.filter(m => m.id !== id);
        salvarDados();
        carregarAdmin();
        mostrarToast('Mensagem excluída com sucesso!');
    };

    // ============================================
    // INICIAR APLICAÇÃO
    // ============================================
    document.addEventListener('DOMContentLoaded', inicializar);

})();
