// Define e exporta a classe da cena de Fim de Jogo.
export default class GameOverScene extends Phaser.Scene {
  // O construtor define a chave única para esta cena.
  constructor() { super({ key: 'GameOverScene' }); }

  /**
   * O método init é chamado quando a cena é iniciada.
   * Ele recebe dados da cena anterior (neste caso, a GameScene).
   * @param {object} data - Objeto contendo dados como sucesso, pontuação e nível.
   */
  init(data) {
    // Armazena se o jogador venceu (true) ou perdeu (false).
    this.success = data.success;
    // Armazena a pontuação final, com 0 como valor padrão.
    this.score = data.score || 0;
    // Armazena o nível em que o jogo terminou, com 1 como valor padrão.
    this.level = data.level || 1;
  }

  /**
   * O método create é chamado uma vez, quando a cena é criada.
   * É aqui que todos os objetos da cena (textos, imagens, etc.) são configurados.
   */
  create() {
    // Obtém a largura e a altura da tela do jogo para posicionar os elementos.
    const { width, height } = this.scale;

    // Adiciona a imagem de fundo, centralizando-a na tela.
    this.add.image(width / 2, height / 2, 'bg-tile');

    // Adiciona o texto principal, que muda dependendo se o jogador venceu ou perdeu.
    this.add.text(width/2, height*0.35, this.success ? 'Você sobreviveu!' : ' Game Over!', {
      fontFamily: 'monospace', fontSize: 36, color: '#f5eef8'
    }).setOrigin(0.5);

    // Adiciona o texto que exibe a pontuação final do jogador.
    this.add.text(width/2, height*0.50, `Pontuação: ${this.score}`, {
      fontFamily: 'monospace', fontSize: 22, color: '#d6eaf8'
    }).setOrigin(0.5);

    // Adiciona o texto de instrução para o jogador reiniciar o jogo.
    this.add.text(width/2, height*0.70, '[ ENTER ] para jogar novamente', {
      fontFamily: 'monospace', fontSize: 18, color: '#d1f2eb'
    }).setOrigin(0.5).setPadding(10, 6, 10, 6).setBackgroundColor('#0e1a20');

    // Configura um listener para a tecla ENTER. Quando pressionada, reinicia o jogo voltando para o Menu.
    this.input.keyboard.once('keydown-ENTER', () => this.scene.start('MenuScene'));
    // Configura um listener para clique do mouse ou toque na tela para também voltar ao Menu.
    this.input.once('pointerdown', () => this.scene.start('MenuScene'));
  }
}
