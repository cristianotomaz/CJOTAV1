// Define e exporta a classe da cena de Menu.
export default class MenuScene extends Phaser.Scene {
  // O construtor define a chave única para esta cena.
  constructor() { super({ key: 'MenuScene' }); }

  /**
   * O método create é chamado uma vez, quando a cena é criada.
   * Configura a tela inicial do jogo.
   */
  create() {
    // Obtém a largura e a altura da tela para posicionar os elementos.
    const { width, height } = this.scale;

    // Adiciona a imagem de capa do jogo, centralizando-a na tela.
    this.add.image(width / 2, height / 2, 'cover');

    // Toca a música de introdução em loop e com volume ajustado.
    // Nota: Navegadores podem bloquear o áudio antes da primeira interação do usuário.
    this.sound.play('intro_music', { loop: true, volume: 0.5 });

   // Texto do título do jogo (atualmente comentado).
   /* this.add.text(width/2, height*0.35, 'Instituto do Terror', {
      fontFamily: 'monospace', fontSize: 36, color: '#e8f6f3'
    }).setOrigin(0.5);
*/
    // Adiciona o texto de instrução para o jogador começar o jogo.
    this.add.text(width/2, height*0.75, 'Pressione [ ENTER ] para começar', {
      fontFamily: 'monospace', fontSize: 18, color: '#d1f2eb'
    }).setOrigin(0.5).setPadding(10, 6, 10, 6).setBackgroundColor('#0e1a20');

    // Define uma função para iniciar o jogo.
    // Agrupar essa lógica em uma função evita repetição de código.
    const startGame = () => {
      console.log('[MenuScene] iniciando GameScene...');
      // Para a música do menu para não tocar junto com a música do jogo.
      this.sound.stopByKey('intro_music');
      // Inicia a cena do jogo, passando o nível 1 como dado inicial.
      this.scene.start('GameScene', { level: 1 });
    };

    // Configura um listener para a tecla ENTER.
    // 'true, true' garante que o evento seja capturado apenas uma vez.
    const enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER, true, true);
    enterKey.on('down', startGame);

    // Configura um listener para o primeiro clique do mouse ou toque na tela.
    // 'once' garante que a função 'startGame' seja chamada apenas na primeira vez.
    this.input.once('pointerdown', startGame);

    // Força o foco no elemento <canvas> do jogo.
    // Isso é importante para garantir que o jogo capture eventos de teclado
    // imediatamente, sem que o usuário precise clicar na tela primeiro.
    this.game.canvas.setAttribute('tabindex', '0');
    this.game.canvas.focus();
  }
}
