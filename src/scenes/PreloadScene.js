// Define e exporta a classe da cena de Pré-carregamento.
export default class PreloadScene extends Phaser.Scene {
  // O construtor define a chave única para esta cena.
  constructor() { super({ key: 'PreloadScene' }); }

  /**
   * O método preload é um método especial do Phaser.
   * Ele é executado primeiro e sua função é carregar todos os recursos (assets)
   * do jogo para a memória antes que o jogo comece.
   */
  preload() {

    // --- CARREGAMENTO DOS ARQUIVOS DE ÁUDIO ---
    // Cada arquivo de áudio é carregado com uma chave única para ser referenciado depois.
    this.load.audio('intro_music', '/assets/sounds/intro.mp3');
    this.load.audio('game_music', '/assets/sounds/soundtrack.mp3');
    this.load.audio('note_sound', '/assets/sounds/note-sound.mp3'); // Som de coleta da nota
    this.load.audio('game_over_sound', '/assets/sounds/over.mp3'); // Som de derrota
    this.load.audio('win_sound', '/assets/sounds/win.mp3'); // Som de vitória

    // --- CARREGAMENTO DOS ARQUIVOS DE IMAGEM ---
    this.load.image('bg-tile', '/assets/images/background.png');

    // Exibe um texto de "Carregando..." na tela enquanto os assets são baixados.
    const { width, height } = this.scale;
    this.add.text(width/2, height/2, 'Carregando...', {
      fontFamily: 'monospace', fontSize: 24, color: '#e2f3e4'
    }).setOrigin(0.5);

    // --- CARREGAMENTO DAS SPRITESHEETS ---
    // Spritesheets são imagens que contêm múltiplos frames de uma animação.
    // O Phaser as divide em frames com base na largura e altura especificadas.
    this.load.spritesheet('playerSheet', '/assets/images/spritesheets/player_spritesheet.png', {
      frameWidth: 129, // Largura de cada frame na spritesheet
      frameHeight: 129 // Altura de cada frame na spritesheet
    });

    this.load.spritesheet('enemySheet', '/assets/images/spritesheets/enemy_spritesheet.png', {
      frameWidth: 129,
      frameHeight: 129
    });

    // Carrega imagens estáticas adicionais.
    this.load.image('nota', '/assets/images/note.png'); // Carrega a imagem da nota
    this.load.image('cover', '/assets/images/cover.png'); // Carrega a imagem de capa para o menu
  }

  /**
   * O método create é chamado uma vez, após todos os assets no método preload()
   * terem sido completamente carregados.
   */
  create() {
    // --- CRIAÇÃO DAS ANIMAÇÕES GLOBAIS ---
    // As animações são criadas aqui para que possam ser usadas em qualquer cena do jogo.

    // Animação do jogador se movendo.
    this.anims.create({
      key: 'player_fly', // Chave única da animação
      frames: this.anims.generateFrameNumbers('playerSheet', { start: 0, end: 16 }), // Usa os frames 0 a 16 da spritesheet
      frameRate: 15, // Velocidade da animação (frames por segundo)
      repeat: -1 // -1 significa que a animação ficará em loop infinito
    });

    // Animação do jogador parado (idle).
    this.anims.create({
      key: 'player_idle',
      frames: this.anims.generateFrameNumbers('playerSheet', { start: 0, end: 3 }),
      frameRate: 4,
      repeat: -1
    });

    // Animação do inimigo se movendo.
    this.anims.create({
      key: 'enemy_fly',
      frames: this.anims.generateFrameNumbers('enemySheet', { start: 0, end: 16 }),
      frameRate: 5,
      repeat: -1
    });

    // Após carregar todos os assets e criar as animações,
    // o jogo pode finalmente começar, iniciando a cena do Menu.
    this.scene.start('MenuScene'); 
  }
}
