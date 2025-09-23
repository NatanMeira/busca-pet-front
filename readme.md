# 🐕 Busca Pet - Sistema de Pets Perdidos

Sistema web para cadastro e busca de pets perdidos, desenvolvido para ajudar a reunir famílias com seus animais de estimação.

## 📋 Sobre o Projeto

O Busca Pet é uma aplicação frontend que permite aos usuários cadastrar pets perdidos e buscar por animais desaparecidos em sua região. O sistema oferece uma interface intuitiva e responsiva para facilitar o processo de reunião entre pets e suas famílias.

## ✨ Funcionalidades

- 📝 **Cadastro de Pets Perdidos**: Registre informações detalhadas sobre pets desaparecidos
- 🔍 **Sistema de Busca**: Filtre pets por nome, tipo, cidade e data de desaparecimento
- 📸 **Upload de Imagens**: Adicione fotos dos pets (suporte a base64)
- 📍 **Integração com CEP**: Preenchimento automático de endereço via API ViaCEP
- 📱 **Design Responsivo**: Interface adaptada para desktop, tablet e mobile
- 🔄 **Paginação**: Navegação eficiente entre resultados
- 🎨 **Notificações Toast**: Feedback visual para ações do usuário
- ✏️ **Edição e Visualização**: Modos completos para gerenciar registros

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica da aplicação
- **CSS3**: Estilização e layout responsivo
- **JavaScript ES6+**: Lógica da aplicação e interações
- **Bootstrap 5.3.7**: Framework CSS para componentes e responsividade
- **Font Awesome**: Ícones da interface
- **API ViaCEP**: Busca automática de endereços por CEP

## 🚀 Como Executar

### Pré-requisitos

- Navegador web moderno (Chrome, Firefox, Safari, Edge)

### Instalação

1. **Clone o repositório**

   ```bash
   git clone https://github.com/NatanMeira/busca-pet-front.git
   cd busca-pet-front
   ```

2. **Abra o arquivo principal**

   - Abra o arquivo `index.html` diretamente no navegador, ou

### Configuração da API

O sistema está configurado para se conectar com uma API backend em `http://localhost:5000/api`. Para funcionalidade completa:

1. Configure e execute o backend da aplicação
2. Verifique se a API está rodando na porta 5000
3. Ajuste a URL base em `js/api.js` se necessário

## 📁 Estrutura do Projeto

```
busca-pet-front/
├── index.html              # Página principal
├── readme.md               # Documentação do projeto
├── css/
│   └── style.css          # Estilos customizados
├── images/
│   └── logo.png           # Logo da aplicação
└── js/
    ├── api.js             # Cliente da API
    ├── script.js          # Script principal e controle de estado
    ├── service/
    │   └── pet.service.js # Serviços de API e transformação de dados
    └── ui/
        ├── filter.js      # Sistema de filtros
        ├── form.js        # Modais e formulários
        ├── pagination.js  # Controles de paginação
        ├── pets-cards.js  # Exibição de cards dos pets
        ├── toast.js       # Sistema de notificações
        └── utils.js       # Funções utilitárias
```

## 🎯 Como Usar

### Cadastrar um Pet Perdido

1. Clique no botão "Cadastrar Pet Perdido"
2. Preencha todas as informações obrigatórias:
   - Nome do pet
   - Tipo (Cachorro, Gato, Ave, Outro)
   - Idade (Filhote, Adulto, Idoso)
   - Porte (Pequeno, Médio, Grande)
   - Raça
   - Sexo
   - Informações de contato
   - Descrição
   - Data do desaparecimento
   - CEP (preenchimento automático do endereço)
   - Foto do pet
3. Clique em "Cadastrar"

### Buscar Pets

1. Use o formulário de filtros no topo da página
2. Filtre por:
   - Nome do pet
   - Tipo de animal
   - Cidade
   - Período de desaparecimento
3. Clique em "Aplicar Filtros"
4. Navegue pelos resultados usando a paginação

### Visualizar e Editar

- **Ver**: Visualize todos os detalhes do pet
- **Editar**: Modifique informações do registro
- **Remover**: Exclua registros (com confirmação)

## 🔧 Configurações

### Personalização da API

Edite o arquivo `js/api.js` para alterar a URL base da API:

```javascript
const BASE_URL = "http://localhost:5000/api"; // Altere conforme necessário
```

### Ajustes de Paginação

Modifique o número de itens por página em `js/script.js`:

```javascript
window.pageSize = 12; // Altere para o número desejado
```

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

💝 **Ajude a reunir famílias com seus pets!** 🐾
