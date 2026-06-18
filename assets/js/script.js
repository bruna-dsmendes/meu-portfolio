const about = document.querySelector('#about');

const swiperWrapper = document.querySelector('.swiper-wrapper');

const formulario = document.querySelector('#formulario');

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

async function getAboutGithub() {
  try {

    const resposta = await fetch('https://api.github.com/users/bruna-dsmendes');
    const perfil = await resposta.json();

    about.innerHTML = '';

    about.innerHTML = `
            <figure class="about-image">
                <img src="${perfil.avatar_url}" alt="Foto do perfil - ${perfil.name}">
            </figure>

            <article class="about-content">
                <h2>Sobre mim</h2>
                <p> Olá! Sou Bruna, Desenvolvedora Java FullStack. </p>
                
                <p> Sempre acreditei que as melhores soluções de software nascem da junção entre uma arquitetura sólida
					de backend e uma experiência fluida e intuitiva de frontend. Movida pela curiosidade, busco
					constantemente novas perspectivas para solucionar problemas complexos. Essa vontade de explorar o
					incomum e testar novas tecnologias é o que me permite conquistar ótimos resultados e entregar
					sistemas eficientes que realmente se destacam. Se você procura alguém que une um olhar atento aos
					detalhes com foco em inovação e engenharia de software, está no lugar certo. Vamos criar algo
					incrível juntos? </p>

                <div class="about-buttons-data">
                    <div class="buttons-container">
                        <a href="${perfil.html_url}" target="_blank" class="botao">Ver GitHub</a>
                        <a href="https://docs.google.com/uc?export=download&id=1FtRm2YPmsp3WoCO77BZvBvbbIpCPZje8" target="_blank" class="botao-outline">Currículo</a>
                    </div>
                    
                    <div class="data-container">
                        <div class="data-item">
                            <span class="data-number">${perfil.followers}</span>
                            <span class="data-label">Seguidores</span>
                        </div>
                        <div class="data-item">
                            <span class="data-number">${perfil.public_repos}</span>
                            <span class="data-label">Repositórios</span>
                        </div>
                    </div>
                </div>
            </article>
        `;
  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error);
  }
}
getAboutGithub();

async function getProjectsGithub() {
  try {

    const resposta = await fetch('https://api.github.com/users/bruna-dsmendes/starred');

    const repositorios = await resposta.json();

    swiperWrapper.innerHTML = '';

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
    }

    repositorios.forEach(repositorio => {

      // Seleciona o nome da Linguagem padrão do repositório
      const linguagem = repositorio.language || 'GitHub'

      // Seleciona o logo da Linguagem padrão do repositório
      const logo = linguagens[linguagem] ?? linguagens['GitHub']

      // Constrói a URL que aponta para o logo da Linguagem padrão do repositório
      const urlLogo = `./assets/icons/languages/${logo}.svg`

      // Formata o nome do reposiório
      const nomeFormatado = repositorio.name
        .replace(/[-_]/g, ' ')
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .toUpperCase();

      // Função para truncar texto da descrição
      const truncar = (texto, limite) => texto.length > limite
        ? texto.substring(0, limite) + '...'
        : texto

      // Define a descrição do Repositório
      const descricao = repositorio.description
        ? truncar(repositorio.description, 100)
        : 'Projeto desenvolvido no GitHub'

      // tags
      const tags = repositorio.topics?.length > 0
        ? repositorio.topics.slice(0, 3).map(topic => `<span class="tag">${topic}</span>`).join('')
        : `<span class="tag">${linguagem}</span>`;

      // Cria o Botão Deploy
      const botaoDeploy = repositorio.homepage
        ? `<a href="${repositorio.homepage}" target="_blank" class="botao-outline botao-sm">Deploy</a>`
        : ''

      // Botões de ação
      const botoesAcao = `
                <div class="project-buttons">
                    <a href="${repositorio.html_url}" target="_blank" class="botao botao-sm">
                        GitHub
                    </a>
                    ${botaoDeploy}
                </div>
            `;

      swiperWrapper.innerHTML += `
                <div class="swiper-slide">
                    <article class="project-card">
                        <div class="project-image">
                            <img src="${urlLogo}" 
                                alt="Ícone ${linguagem}"
                                onerror="this.onerror=null; this.src='./assets/icons/languages/github.svg';">
                        </div>

                        <div class="project-content">
                            <h3>${nomeFormatado}</h3>
                            <p>${descricao}</p>
                            <div class="project-tags">${tags}</div>
                            ${botoesAcao}
                        </div>
                    </article>
                </div>
            `;
    });

    iniciarSwiper();

  } catch (error) {
    console.error('Erro ao buscar repositórios:', error);
  }
}

getProjectsGithub()

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

formulario.addEventListener('submit', function (event) {
  event.preventDefault();

  document.querySelectorAll('form span')
    .forEach(span => span.innerHTML = '');

  let isValid = true;

  const nome = document.querySelector('#nome');
  const erroNome = document.querySelector('#erro-nome');

  if (nome.value.trim().length < 3) {
    erroNome.innerHTML = 'O Nome deve ter no mínimo 3 caracteres.';
    if (isValid) nome.focus();
    isValid = false;
  }

  const email = document.querySelector('#email');
  const erroEmail = document.querySelector('#erro-email');

  if (!email.value.trim().match(emailRegex)) {
    erroEmail.innerHTML = 'Digite um e-mail válido.';
    if (isValid) email.focus();
    isValid = false;
  }

  const assunto = document.querySelector('#assunto');
  const erroAssunto = document.querySelector('#erro-assunto');

  if (assunto.value.trim().length < 5) {
    erroAssunto.innerHTML = 'O Assunto deve ter no mínimo 5 caracteres.';
    if (isValid) assunto.focus();
    isValid = false;
  }

  const mensagem = document.querySelector('#mensagem');
  const erroMensagem = document.querySelector('#erro-mensagem');

  if (mensagem.value.trim().length === 0) {
    erroMensagem.innerHTML = 'A mensagem não pode ser vazia.';
    if (isValid) mensagem.focus();
    isValid = false;
  }

  if (isValid) {
    const submitButton = formulario.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';

    formulario.submit();
  }
});