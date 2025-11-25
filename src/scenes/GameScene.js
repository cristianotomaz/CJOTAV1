// Define e exporta a classe da cena principal do jogo.
export default class GameScene extends Phaser.Scene {
  // O construtor define a chave da cena e algumas propriedades iniciais.
  constructor() {
    super({ key: 'GameScene' }); // chave da cena
    this.playerSpeed = 180; // velocidade do player
    this.enemySpeed = 70; // velocidade dos inimigos
    this.levelTime = 60; // tempo do nível em segundos
  }

  // O método init recebe dados da cena anterior (MenuScene ou a própria GameScene em caso de próximo nível).
  init(data) { this.level = data.level || 1; }

  /**
   * O método create é chamado uma vez para configurar a cena do jogo.
   */
  create() {
    // Toca a música de fundo do jogo em loop com volume ajustado.
    this.sound.play('game_music', { loop: true, volume: 0.4 });

    // --- CONFIGURAÇÃO DO CENÁRIO E UI ---
    const { width, height } = this.scale;
    // Cria um 'tileSprite' para o fundo. Este tipo de sprite permite que a textura se repita e role.
    this.bg = this.add.tileSprite(0, 0, width, height, 'bg-tile').setOrigin(0);

    // Inicializa as variáveis de estado do jogo.
    this.score = 0;
    this.timeLeft = this.levelTime;
    // Adiciona os textos de pontuação e tempo na tela.
    this.scoreText = this.add.text(12, 10, 'Notas: 0', { fontFamily: 'monospace', fontSize: 18, color: '#c8f7c5' });
    this.timeText = this.add.text(width - 12, 10, `Tempo: ${this.timeLeft}`, { fontFamily: 'monospace', fontSize: 18, color: '#f9e79f' }).setOrigin(1, 0);

  // --- CRIAÇÃO DO JOGADOR ---
  // Cria o sprite do jogador no centro da tela e ativa a física para ele.
  this.player = this.physics.add.sprite(width * 0.5, height * 0.5, 'playerSheet', 0);
  // Impede que o jogador saia dos limites da tela.
  this.player.setCollideWorldBounds(true);
  // Ajusta a "hitbox" (área de colisão) do jogador para ser mais precisa.
  this.player.body.setSize(90, 120);
  this.player.body.setOffset(35, 10);

    // --- CRIAÇÃO DAS NOTAS (COLETÁVEIS) ---
    // Cria um grupo de física para agrupar todas as notas.
    this.notes = this.physics.add.group();
    // O número de notas aumenta a cada nível.
    const notesCount = 8 + this.level * 2;
    for (let i = 0; i < notesCount; i++) {
      // Gera uma posição aleatória para cada nota.
      const x = Phaser.Math.Between(40, width - 40);
      const y = Phaser.Math.Between(60, height - 40);
      const note = this.notes.create(x, y, 'nota');
      
      // Ajusta a área de colisão da nota.
      note.body.setSize(50, 50);
      // Torna a nota "imóvel" para que ela não seja empurrada pelo jogador.
      note.setImmovable(true);
    }

    // --- CRIAÇÃO DOS INIMIGOS ---
    this.enemies = this.physics.add.group();
    // O número de inimigos aumenta com o nível, até um máximo.
    const enemyCount = 2 + Math.min(5, this.level);
    for (let i = 0; i < enemyCount; i++) {
      // Lógica para evitar que inimigos apareçam muito perto do jogador no início.
      const safeZoneRadius = 200; // Distância mínima do centro
      const centerX = width / 2;
      const centerY = height / 2;
      let x, y;
      // Gera posições aleatórias até encontrar uma que esteja fora da "zona segura".
      do {
        x = Phaser.Math.Between(20, width - 20);
        y = Phaser.Math.Between(40, height - 20);
      } while (Phaser.Math.Distance.Between(centerX, centerY, x, y) < safeZoneRadius);

      // Cria o inimigo na posição segura e inicia sua animação.
      const e = this.enemies.create(x, y, 'enemySheet');
      e.play('enemy_fly');
      
      // Ajusta a área de colisão do inimigo.
      e.body.setSize(60, 130);
      e.body.setOffset(35,0);

      // Define o comportamento físico do inimigo.
      // setBounce(1) faz com que ele ricocheteie com 100% da energia.
      // setCollideWorldBounds(true) faz com que ele colida com as bordas da tela.
      e.setBounce(1, 1).setCollideWorldBounds(true);
      // Define uma velocidade inicial aleatória para o inimigo.
      e.setVelocity(
        Phaser.Math.Between(-this.enemySpeed, this.enemySpeed),
        Phaser.Math.Between(-this.enemySpeed, this.enemySpeed)
      );
    }

    // --- CONFIGURAÇÃO DAS COLISÕES ---
    // 'overlap' detecta quando dois objetos se sobrepõem, mas não causa uma colisão física.
    this.physics.add.overlap(this.player, this.notes, this.handleCollectNote, null, this);
    // 'collider' faz com que os objetos colidam e reajam fisicamente.
    this.physics.add.collider(this.enemies, this.enemies);
    this.physics.add.collider(this.enemies, this.player, this.handleHitPlayer, null, this);

    // --- CONFIGURAÇÃO DOS CONTROLES ---
    // Cria objetos para monitorar as teclas de seta e WASD.
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });

    // --- CRONÔMETRO DO JOGO ---
    // Cria um evento de tempo que se repete a cada 1000ms (1 segundo).
    this.time.addEvent({
      delay: 1000, loop: true, callback: () => {
        this.timeLeft--; // Decrementa o tempo restante.
        this.timeText.setText('Tempo: ' + this.timeLeft); // Atualiza o texto na tela.
        if (this.timeLeft <= 0) this.endLevel(false); // Se o tempo acabar, o jogador perde.
      }
    });
  }

  // Função chamada quando o jogador toca em uma nota.
  handleCollectNote = (_player, note) => {
    this.sound.play('note_sound', { volume: 0.7 }); // Toca o som da nota
    note.destroy(); // Remove a nota da cena.
    this.score += 10; // Aumenta a pontuação.
    this.scoreText.setText('Notas: ' + this.score); // Atualiza o texto da pontuação.
    // Se o número de notas ativas for 0, o jogador venceu.
    if (this.notes.countActive(true) === 0) this.endLevel(true);
  }

  // Função chamada quando o jogador é atingido por um inimigo.
  handleHitPlayer = () => { this.endLevel(false); }

  // Função central para terminar o nível, seja por vitória ou derrota.
  endLevel(success) {
    this.sound.stopByKey('game_music'); // Para a música do jogo
    if (success) {
      this.sound.play('win_sound');
    } else {
      this.sound.play('game_over_sound');
    }
    // Pausa o motor de física para congelar tudo na tela.
    this.physics.world.pause();
    // Inicia a cena de Game Over, passando os dados da partida.
    this.scene.start('GameOverScene', { success, score: this.score, level: this.level });
  }

  /**
   * O método update é chamado continuamente em cada frame do jogo.
   * É usado para verificar inputs e atualizar o estado dos objetos.
   */
  update() {
    // Move a posição da textura do fundo para criar o efeito de rolagem.
    this.bg.tilePositionX += 3;
    const speed = this.playerSpeed;
    let vx = 0, vy = 0;

    // Verifica as teclas de movimento e define a velocidade do jogador.
    if (this.cursors.left.isDown || this.wasd.left.isDown) vx = -speed;
    else if (this.cursors.right.isDown || this.wasd.right.isDown) vx = speed;

    if (this.cursors.up.isDown || this.wasd.up.isDown) vy = -speed;
    else if (this.cursors.down.isDown || this.wasd.down.isDown) vy = speed;

    // Aplica a velocidade calculada ao corpo físico do jogador.
    this.player.setVelocity(vx, vy);

    // Controla qual animação do jogador deve ser tocada.
    if (vx !== 0 || vy !== 0) {
      this.player.anims.play('player_fly', true);
    } else {
      this.player.anims.play('player_idle', true);
    }

    // Vira o sprite do jogador horizontalmente para que ele "olhe" na direção do movimento.
    if (vx < 0) {
      this.player.setFlipX(true);
    } else if (vx > 0) {
      this.player.setFlipX(false);
    }
  }
}
