# Projeto Portfólio Pessoal

---

<div align="center"> 
	<img src="https://img.shields.io/badge/HTML-5-orange?style=for-the-badge&logo=html5" alt="HTML Badge" /> 
	<img src="https://img.shields.io/badge/CSS-3-purple?style=for-the-badge&logo=css&logoColor=purple" alt="CSS Badge" /> 
	<img src="https://img.shields.io/badge/JavaScript-ES6+-yellow?style=for-the-badge&logo=javascript&logoColor=yellow" alt="JavaScript Badge" /> 
</div>

<br />

O **Projeto Portfólio Pessoal** é um **site profissional moderno**, desenvolvido com **HTML, CSS e JavaScript**, com o objetivo de apresentar informações sobre a pessoa desenvolvedora, seus projetos e formas de contato de maneira clara, interativa e responsiva.

O projeto consome dados dinâmicos da **API do GitHub**, permitindo que informações como perfil e repositórios sejam carregadas automaticamente, mantendo o conteúdo sempre atualizado.

------

## Funcionalidades

- Estrutura de páginas desenvolvida com **HTML semântico**
- Estilização moderna com **CSS**, utilizando:
  - Variáveis CSS
  - Animações
  - Layout responsivo (desktop, tablet e mobile)
- Integração com a **API do GitHub** para:
  - Exibição dinâmica das informações do perfil
  - Listagem automática dos repositórios
- Exibição dos projetos em **carrossel interativo** utilizando **Swiper.js**
- **Formulário de contato com validação no frontend**, garantindo o correto preenchimento dos campos
- Página dedicada de **confirmação de envio** do formulário
- Navegação fluida com menu fixo e rolagem suave
- Interface intuitiva e organizada, focada na experiência do usuário

------

## Estrutura do Projeto

```
portfolio/
│
├── index.html        # Página principal do portfólio
├── success.html      # Página de confirmação de envio do formulário
│
├── assets/
│   ├── css/
│   │   └── styles.css    # Estilos e responsividade
│   ├── js/
│   │   └── scripts.js   # Integração com GitHub, carrossel e validações
│   ├── img/             # Imagens e ilustrações
│   └── icons/           # Ícones das linguagens e redes sociais
│
└── README.md
```

------

## Tecnologias Utilizadas

- **HTML5**: Estruturação semântica do conteúdo
- **CSS3**: Estilização, layout responsivo e animações
- **JavaScript (ES6+)**: Interatividade, consumo de APIs e validações
- **Swiper.js**: Carrossel de projetos responsivo
- **Fom Submit:** Serviço de envio de e-mails via formulário HTML
- **GitHub API**: Fonte dinâmica de dados do perfil e repositórios

------

## Executando Localmente

Para executar o projeto em ambiente local, siga os passos abaixo.

### Pré-requisitos

- [Visual Studio Code](https://code.visualstudio.com/) (ou outro editor de sua preferência)
- Extensão **Live Server** instalada no VS Code

### Passos

1. Clone o repositório:

   ```bash
   git clone https://github.com/seu-usuario/seu-repositorio.git
   ```

2. Acesse a pasta do projeto:

   ```bash
   cd seu-repositorio
   ```

3. Abra o projeto no Visual Studio Code:

   ```bash
   code .
   ```

4. Abra o arquivo `index.html`, clique com o botão direito e selecione **"Open with Live Server"**.

O site será aberto no navegador e todas as alterações poderão ser visualizadas em tempo real.

------

## Deploy

Este site está disponível publicamente através do **GitHub Pages**. Você pode acessar a versão online pelo link abaixo:

🔗 https://seu-usuario.github.io/seu-repositorio

------

## Contribuições

Contribuições são bem-vindas. Caso tenha sugestões de melhorias, correções ou novas funcionalidades, sinta-se à vontade para abrir uma **issue** ou enviar um **pull request**.