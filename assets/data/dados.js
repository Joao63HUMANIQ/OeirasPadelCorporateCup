/* ============================================================
   DADOS DO SITE · Oeiras Valley Padel Corporate Cup 2027
   Este é o único ficheiro a editar para publicar resultados,
   classificações, notícias, galeria e logos de parceiros.
   Guarde em UTF-8. Cada linha entre { } é um registo.
   ============================================================ */
window.OVPCC = {

  /* true = mostra os registos de exemplo abaixo com um aviso na página.
     Antes de publicar dados reais: apague os exemplos e ponha false. */
  exemplo: true,

  /* Para onde vai o botão "Ser parceiro" e os contactos gerais */
  email: 'geral@human-iq.pt',
  telefone: '+351 934 455 604',

  /* ---------- RESULTADOS ----------
     evento:    'Evento 1' | 'Evento 2' | 'Masters'
     categoria: 'Masculinos' | 'Mistos' | 'Femininos'
     nivel:     'Iniciante' | 'Intermédio' | 'Avançado'
     fase:      'Grupos' | 'Quadro A' | 'Quadro B'
     grupo:     nome do grupo (fase de grupos) ou da eliminatória (ex.: 'Meias-finais', 'Final')
     vencedor:  1 ou 2 */
  resultados: [
    { evento: 'Evento 1', categoria: 'Masculinos', nivel: 'Iniciante', fase: 'Grupos', grupo: 'Grupo A', dupla1: 'Dupla 1', empresa1: 'Empresa A', dupla2: 'Dupla 2', empresa2: 'Empresa B', resultado: '6-4', vencedor: 1 },
    { evento: 'Evento 1', categoria: 'Masculinos', nivel: 'Iniciante', fase: 'Grupos', grupo: 'Grupo A', dupla1: 'Dupla 3', empresa1: 'Empresa C', dupla2: 'Dupla 4', empresa2: 'Empresa D', resultado: '3-6', vencedor: 2 },
    { evento: 'Evento 1', categoria: 'Masculinos', nivel: 'Iniciante', fase: 'Grupos', grupo: 'Grupo A', dupla1: 'Dupla 1', empresa1: 'Empresa A', dupla2: 'Dupla 3', empresa2: 'Empresa C', resultado: '7-6', vencedor: 1 },
    { evento: 'Evento 1', categoria: 'Masculinos', nivel: 'Iniciante', fase: 'Grupos', grupo: 'Grupo B', dupla1: 'Dupla 5', empresa1: 'Empresa E', dupla2: 'Dupla 6', empresa2: 'Empresa F', resultado: '6-2', vencedor: 1 },
    { evento: 'Evento 1', categoria: 'Masculinos', nivel: 'Iniciante', fase: 'Grupos', grupo: 'Grupo B', dupla1: 'Dupla 7', empresa1: 'Empresa G', dupla2: 'Dupla 8', empresa2: 'Empresa H', resultado: '4-6', vencedor: 2 },
    { evento: 'Evento 1', categoria: 'Masculinos', nivel: 'Iniciante', fase: 'Quadro A', grupo: 'Meias-finais', dupla1: 'Dupla 1', empresa1: 'Empresa A', dupla2: 'Dupla 8', empresa2: 'Empresa H', resultado: '6-3', vencedor: 1 },
    { evento: 'Evento 1', categoria: 'Masculinos', nivel: 'Iniciante', fase: 'Quadro A', grupo: 'Meias-finais', dupla1: 'Dupla 5', empresa1: 'Empresa E', dupla2: 'Dupla 4', empresa2: 'Empresa D', resultado: '5-7', vencedor: 2 },
    { evento: 'Evento 1', categoria: 'Masculinos', nivel: 'Iniciante', fase: 'Quadro A', grupo: 'Final', dupla1: 'Dupla 1', empresa1: 'Empresa A', dupla2: 'Dupla 4', empresa2: 'Empresa D', resultado: '6-4 3-6 10-7', vencedor: 1 },
  ],

  /* ---------- CLASSIFICAÇÃO POR EMPRESA ----------
     quadro: 'Geral' (taça por empresas) ou 'Categoria Nível', ex.: 'Masculinos Iniciante'
     e1, e2, masters: pontos em cada momento. O total e a ordem são calculados pelo site. */
  classificacao: [
    { quadro: 'Geral', empresa: 'Empresa A', e1: 190, e2: 0, masters: 0 },
    { quadro: 'Geral', empresa: 'Empresa D', e1: 155, e2: 0, masters: 0 },
    { quadro: 'Geral', empresa: 'Empresa E', e1: 120, e2: 0, masters: 0 },
    { quadro: 'Geral', empresa: 'Empresa H', e1: 85, e2: 0, masters: 0 },
    { quadro: 'Masculinos Iniciante', empresa: 'Empresa A', e1: 106, e2: 0, masters: 0 },
    { quadro: 'Masculinos Iniciante', empresa: 'Empresa D', e1: 73, e2: 0, masters: 0 },
    { quadro: 'Masculinos Iniciante', empresa: 'Empresa E', e1: 53, e2: 0, masters: 0 },
    { quadro: 'Masculinos Iniciante', empresa: 'Empresa H', e1: 53, e2: 0, masters: 0 },
  ],

  /* ---------- NOTÍCIAS ----------
     Lista vazia = a página mostra 6 espaços reservados.
     { titulo: '', resumo: '', fonte: 'Nome do meio', data: '2027-03-08', url: 'https://...', imagem: 'assets/img/noticias/ficheiro.jpg' } */
  noticias: [],

  /* ---------- GALERIA ----------
     Lista vazia = a página mostra espaços reservados.
     tipo: 'foto' | 'video' | 'noticia'
     foto:    { tipo: 'foto', evento: 'Evento 1', legenda: '', src: 'assets/img/galeria/ficheiro.jpg' }
     video:   { tipo: 'video', evento: 'Evento 1', legenda: '', src: 'assets/img/galeria/capa.jpg', url: 'https://youtu.be/...' }
     noticia: { tipo: 'noticia', evento: 'Masters', legenda: '', src: 'assets/img/galeria/capa.jpg', url: 'https://...' } */
  galeria: [],

  /* ---------- PARCEIROS ----------
     Para preencher um espaço, junte um logo à lista "logos" do nível:
     { nome: 'Marca', src: 'assets/img/parceiros/marca.png', url: 'https://...' }
     "espacos" é o número de espaços desenhados na página. */
  parceiros: [
    { nivel: 'Naming Partner', vagas: '1 vaga', espacos: 1, logos: [] },
    { nivel: 'Segment Partners', vagas: '2 a 3 vagas', espacos: 3, logos: [] },
    { nivel: 'Competition Partners', vagas: '6 a 9 vagas', espacos: 6, logos: [] },
    { nivel: 'Activation Partners', vagas: 'aberto', espacos: 4, logos: [] },
    { nivel: 'Media Partners', vagas: '1 a 3 vagas', espacos: 3, logos: [] },
    { nivel: 'Service Partners', vagas: 'aberto', espacos: 4, logos: [] },
  ],
};
