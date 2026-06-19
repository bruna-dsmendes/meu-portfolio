/**
 * ====================================================
 * PORTFÓLIO DA BRU — Script Principal Otimizado
 * Segurança: Cache, Sanitização, Validação
 * Performance: Otimização de DOM, Redução de Requisições
 * ====================================================
 */

// ====================================================
// CONFIGURAÇÕES E CONSTANTES
// ====================================================
const CONFIG = {
  GITHUB_USER: 'bruna-dsmendes',
  CACHE_DURATION: 24 * 60 * 60 * 1000, // 24 horas em ms
  API_TIMEOUT: 5000, // 5 segundos
};

const CACHE_KEYS = {
  PROFILE: 'github_profile_cache',
  PROJECTS: 'github_projects_cache',
};

// ====================================================
// UTILITÁRIOS DE CACHE
// ====================================================
const CacheManager = {
  get(key) {
    try {
      const cached = localStorage.getItem(key);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      const isExpired = Date.now() - timestamp > CONFIG.CACHE_DURATION;

      if (isExpired) {
        localStorage.removeItem(key);
        return null;
      }

      return data;
    } catch (error) {
      console.warn(`Erro ao acessar cache (${key}):`, error);
      return null;
    }
  },

  set(key, data) {
    try {
      const cacheData = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(key, JSON.stringify(cacheData));
    } catch (error) {
      console.warn(`Erro ao salvar cache (${key}):`, error);
    }
  },

  clear(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn(`Erro ao limpar cache (${key}):`, error);
    }
  },
};

// ====================================================
// UTILITÁRIOS DE SANITIZAÇÃO
// ====================================================
const Sanitizer = {
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  sanitizeHtml(html) {
    if (!html) return '';

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    const scripts = tempDiv.querySelectorAll('script, style, iframe');
    scripts.forEach(script => script.remove());

    const allElements = tempDiv.querySelectorAll('*');
    allElements.forEach(element => {
      Array.from(element.attributes).forEach(attr => {
        if (attr.name.startsWith('on')) {
          element.removeAttribute(attr.name);
        }
      });
    });

    return tempDiv.innerHTML;
  },

  validateUrl(url) {
    if (!url) return null;
    try {
      const urlObj = new URL(url);
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return null;
      }
      return url;
    } catch {
      return null;
    }
  },
};

// ====================================================
// UTILITÁRIOS DE REQUISIÇÃO COM TIMEOUT
// ====================================================
const ApiClient = {
  async fetchWithTimeout(url, timeout = CONFIG.API_TIMEOUT) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  },
};

// ====================================================
// VALIDAÇÃO DE FORMULÁRIO
// ====================================================
const FormValidator = {
  emailRegex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,

  validateNome(nome) {
    const trimmed = nome.trim();
    if (trimmed.length < 3) {
      return { isValid: false, message: 'O nome deve ter no mínimo 3 caracteres.' };
    }
    return { isValid: true, message: '' };
  },

  validateEmail(email) {
    const trimmed = email.trim();
    if (!trimmed.match(this.emailRegex)) {
      return { isValid: false, message: 'Digite um e-mail válido.' };
    }
    return { isValid: true, message: '' };
  },

  validateAssunto(assunto) {
    const trimmed = assunto.trim();
    if (trimmed.length < 5) {
      return { isValid: false, message: 'O assunto deve ter no mínimo 5 caracteres.' };
    }
    return { isValid: true, message: '' };
  },

  validateMensagem(mensagem) {
    const trimmed = mensagem.trim();
    if (trimmed.length === 0) {
      return { isValid: false, message: 'A mensagem não pode ser vazia.' };
    }
    return { isValid: true, message: '' };
  },
};

// ====================================================
// RENDERIZAÇÃO DE CONTEÚDO
// ====================================================
const Renderer = {
  renderAbout(perfil) {
    const about = document.querySelector('#about');
    if (!about) return;

    const avatarUrl = Sanitizer.validateUrl(perfil.avatar_url);
    const githubUrl = Sanitizer.validateUrl(perfil.html_url);

    const html = `
      <figure class="about-image">
        <img src="${avatarUrl || ''}" alt="Foto do perfil - ${Sanitizer.escapeHtml(perfil.name || 'Bruna Mendes')}" loading="lazy">
      </figure>

      <article class="about-content">
        <h2>Sobre mim</h2>
        <p>Olá! Sou Bruna, Desenvolvedora Java FullStack.</p>
        
        <p>Sempre acreditei que as melhores soluções de software nascem da junção entre uma arquitetura sólida
          de backend e uma experiência fluida e intuitiva de frontend. Movida pela curiosidade, busco
          constantemente novas perspectivas para solucionar problemas complexos. Essa vontade de explorar o
          incomum e testar novas tecnologias é o que me permite conquistar ótimos resultados e entregar
          sistemas eficientes que realmente se destacam. Se você procura alguém que une um olhar atento aos
          detalhes com foco em inovação e engenharia de software, está no lugar certo. Vamos criar algo
          incrível juntos?</p>

        <div class="about-buttons-data">
          <div class="buttons-container">
            <a href="${githubUrl || '#'}" target="_blank" rel="noopener noreferrer" class="botao">Ver GitHub</a>
            <a href="https://drive.google.com/file/d/1FtRm2YPmsp3WoCO77BZvBvbbIpCPZje8/preview" target="_blank" rel="noopener noreferrer" class="botao-outline">Currículo</a>
          </div>
          <div class="data-container">
            <div class="data-item">
              <span class="data-number">${perfil.followers || 0}</span>
              <span class="data-label">Seguidores</span>
            </div>
            <div class="data-item">
              <span class="data-number">${perfil.public_repos || 0}</span>
              <span class="data-label">Repositórios</span>
            </div>
          </div>
        </div>
      </article>
    `;

    about.innerHTML = html;
  },

  renderProjectCard(repositorio, linguagens) {
    const linguagem = repositorio.language || 'GitHub';
    const logo = linguagens[linguagem] ?? linguagens['GitHub'];
    const urlLogo = `./assets/icons/languages/${logo}.svg`;

    const nomeFormatado = repositorio.name
      .replace(/[-_]/g, ' ')
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .toUpperCase();

    const descricao = repositorio.description
      ? this.truncateText(repositorio.description, 100)
      : 'Projeto desenvolvido no GitHub';

    const tags = repositorio.topics?.length > 0
      ? repositorio.topics.slice(0, 3).map(topic => `<span class="tag">${Sanitizer.escapeHtml(topic)}</span>`).join('')
      : `<span class="tag">${Sanitizer.escapeHtml(linguagem)}</span>`;

    const botaoDeploy = repositorio.homepage && Sanitizer.validateUrl(repositorio.homepage)
      ? `<a href="${repositorio.homepage}" target="_blank" rel="noopener noreferrer" class="botao-outline botao-sm">Deploy</a>`
      : '';

    const githubUrl = Sanitizer.validateUrl(repositorio.html_url) || '#';

    return `
      <div class="swiper-slide">
        <article class="project-card">
          <div class="project-image">
            <img src="${urlLogo}" 
              alt="Ícone ${Sanitizer.escapeHtml(linguagem)}"
              loading="lazy"
              onerror="this.onerror=null; this.src='./assets/icons/languages/github.svg';">
          </div>

          <div class="project-content">
            <h3>${Sanitizer.escapeHtml(nomeFormatado)}</h3>
            <p>${Sanitizer.escapeHtml(descricao)}</p>
            <div class="project-tags">${tags}</div>
            <div class="project-buttons">
              <a href="${githubUrl}" target="_blank" rel="noopener noreferrer" class="botao botao-sm">
                GitHub
              </a>
              ${botaoDeploy}
            </div>
          </div>
        </article>
      </div>
    `;
  },

  truncateText(texto, limite) {
    return texto.length > limite ? texto.substring(0, limite) + '...' : texto;
  },
};

// ====================================================
// FUNÇÕES PRINCIPAIS
// ====================================================

async function getAboutGithub() {
  try {
    let perfil = CacheManager.get(CACHE_KEYS.PROFILE);

    if (!perfil) {
      const url = `https://api.github.com/users/${CONFIG.GITHUB_USER}`;
      perfil = await ApiClient.fetchWithTimeout(url);
      CacheManager.set(CACHE_KEYS.PROFILE, perfil);
    }

    Renderer.renderAbout(perfil);
  } catch (error) {
    console.error('Erro ao buscar dados do perfil:', error);
    const about = document.querySelector('#about');
    if (about) {
      about.innerHTML = `
        <figure class="about-image">
          <img src="assets/img/eu-color.svg" alt="Foto do perfil - Bruna Mendes">
        </figure>
        <article class="about-content">
          <h2>Sobre mim</h2>
          <p>Olá! Sou Bruna, Desenvolvedora Java FullStack.</p>
          <p>Sempre acreditei que as melhores soluções de software nascem da junção entre uma arquitetura sólida
            de backend e uma experiência fluida e intuitiva de frontend. Vamos criar algo incrível juntos?</p>
          <div class="about-buttons-data">
            <div class="buttons-container">
              <a href="https://github.com/bruna-dsmendes" target="_blank" rel="noopener noreferrer" class="botao">Ver GitHub</a>
              <a href="https://drive.google.com/file/d/1FtRm2YPmsp3WoCO77BZvBvbbIpCPZje8/preview" target="_blank" rel="noopener noreferrer" class="botao-outline">Currículo</a>
            </div>
          </div>
        </article>
      `;
    }
  }
}

async function getProjectsGithub() {
  try {
    const swiperWrapper = document.querySelector('.swiper-wrapper');
    if (!swiperWrapper) return;

    let repositorios = CacheManager.get(CACHE_KEYS.PROJECTS);

    if (!repositorios) {
      const url = `https://api.github.com/users/${CONFIG.GITHUB_USER}/starred`;
      repositorios = await ApiClient.fetchWithTimeout(url);
      CacheManager.set(CACHE_KEYS.PROJECTS, repositorios);
    }

    const linguagens = {
      'JavaScript': 'javascript',
      'TypeScript': 'typescript',
      'Python': 'python',
      'Java': 'java',
      'HTML': 'html',
      'CSS': 'css',
      'PHP': 'php',
      'C#': 'csharp',
      'Go': 'go',
      'Kotlin': 'kotlin',
      'Swift': 'swift',
      'C': 'c',
      'C++': 'c_plus',
      'GitHub': 'github',
    };

    let projectsHtml = '';
    repositorios.forEach(repositorio => {
      projectsHtml += Renderer.renderProjectCard(repositorio, linguagens);
    });

    swiperWrapper.innerHTML = projectsHtml;

    // Aguarda um pouco para garantir que o DOM foi atualizado
    setTimeout(() => {
      iniciarSwiper();
    }, 100);
  } catch (error) {
    console.error('Erro ao buscar repositórios:', error);
  }
}

function iniciarSwiper() {
  new Swiper('.projects-swiper', {
    slidesPerView: 1,
    slidesPerGroup: 1,
    spaceBetween: 24,
    centeredSlides: false,
    loop: true,
    watchOverflow: true,

    breakpoints: {
      0: {
        slidesPerView: 1,
        slidesPerGroup: 1,
        spaceBetween: 40,
        centeredSlides: false
      },
      769: {
        slidesPerView: 2,
        slidesPerGroup: 2,
        spaceBetween: 40,
        centeredSlides: false
      },
      1025: {
        slidesPerView: 3,
        slidesPerGroup: 3,
        spaceBetween: 54,
        centeredSlides: false
      }
    },

    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },

    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      dynamicBullets: true,
    },

    autoplay: {
      delay: 5000,
      pauseOnMouseEnter: true,
      disableOnInteraction: false,
    },

    grabCursor: true,
    slidesOffsetBefore: 0,
    slidesOffsetAfter: 0,
  });
}

function setupFormValidation() {
  const formulario = document.querySelector('#formulario');
  if (!formulario) return;

  formulario.addEventListener('submit', function (event) {
    event.preventDefault();

    document.querySelectorAll('form span').forEach(span => {
      span.innerHTML = '';
    });

    let isValid = true;
    const errors = {};

    const nome = document.querySelector('#nome');
    const validacaoNome = FormValidator.validateNome(nome.value);
    if (!validacaoNome.isValid) {
      errors['erro-nome'] = validacaoNome.message;
      if (isValid) nome.focus();
      isValid = false;
    }

    const email = document.querySelector('#email');
    const validacaoEmail = FormValidator.validateEmail(email.value);
    if (!validacaoEmail.isValid) {
      errors['erro-email'] = validacaoEmail.message;
      if (isValid) email.focus();
      isValid = false;
    }

    const assunto = document.querySelector('#assunto');
    const validacaoAssunto = FormValidator.validateAssunto(assunto.value);
    if (!validacaoAssunto.isValid) {
      errors['erro-assunto'] = validacaoAssunto.message;
      if (isValid) assunto.focus();
      isValid = false;
    }

    const mensagem = document.querySelector('#mensagem');
    const validacaoMensagem = FormValidator.validateMensagem(mensagem.value);
    if (!validacaoMensagem.isValid) {
      errors['erro-mensagem'] = validacaoMensagem.message;
      if (isValid) mensagem.focus();
      isValid = false;
    }

    Object.entries(errors).forEach(([key, message]) => {
      const errorElement = document.querySelector(`#${key}`);
      if (errorElement) {
        errorElement.innerHTML = message;
      }
    });

    if (isValid) {
      const submitButton = formulario.querySelector('button[type="submit"]');
      submitButton.disabled = true;
      submitButton.textContent = 'Enviando...';
      formulario.submit();
    }
  });
}

// ====================================================
// INICIALIZAÇÃO
// ====================================================
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function () {
    getAboutGithub();
    getProjectsGithub();
    setupFormValidation();
  });
} else {
  // Se o DOM já foi carregado (script carregado após)
  getAboutGithub();
  getProjectsGithub();
  setupFormValidation();
}
