# Catálogo de Filmes

O conteúdo do projeto está na pasta `src`, contendo apenas os arquivos de HTML, CSS e Javascript.

A API utilizada foi a do OMDb.

### Para executar a aplicação

1. Primeiro crie uma chave gratuita da OMDb API em: https://www.omdbapi.com/apikey.aspx
2. Abra o arquivo `script.js` e substitua `YOUR_API_KEY` pela sua chave de API na variável
   ```javascript
   const API_KEY = 'YOUR_API_KEY';
   ```
3. Em seguida abra o arquivo `index.html` no navegador e já deve ser possível visualizar a interface
4. Digite o nome de um filme ou série no campo de busca (nomes em inglês trarão resultados mais precisos) e clique em "Buscar" ou pressione Enter
4. Clique em qualquer filme para ver seus detalhes

## Funcionalidades

- **Busca por filmes**: Campo de busca que permite pesquisar filmes por título
- **Listagem de filmes**: Exibe os resultados em um grid de resultados
- **Detalhes do filme**: Modal com informações mais detalhadas ao clicar em um filme
- **Tema escuro**: Possibilidade de alternar entre tema claro e escuro
- **Paginação**: Botões para navegar entre diferentes páginas de resultados

