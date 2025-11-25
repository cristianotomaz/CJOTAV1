// Importa a biblioteca principal do Phaser.
import Phaser from 'phaser';
// Importa todas as classes de cena que criamos.
import PreloadScene from './scenes/PreloadScene.js';
import MenuScene from './scenes/MenuScene.js';
import GameScene from './scenes/GameScene.js';
import GameOverScene from './scenes/GameOverScene.js';

// O objeto 'config' contém todas as configurações principais do jogo Phaser.
const config = {
  // Phaser.AUTO tenta usar WebGL, mas volta para Canvas se o navegador não suportar.
  type: Phaser.AUTO,
  // 'parent' é o ID do elemento HTML onde o canvas do jogo será inserido.
  parent: 'game-container',
  // Define a largura e a altura da tela do jogo em pixels.
  width: 800,
  height: 480,
  // Configura o sistema de física do jogo.
  // 'arcade' é um motor de física mais simples e rápido, ideal para jogos 2D.
  // 'gravity: { y: 0 }' remove a gravidade global, já que nosso jogo é visto de cima.
  // 'debug: false' desativa a visualização das caixas de colisão. Mude para 'true' para depurar.
  physics: { default: 'arcade', arcade: { gravity: { y: 0 }, debug: false } },
  // 'scene' é um array que lista todas as cenas do jogo.
  // A ordem é importante: a primeira cena da lista (PreloadScene) será a primeira a ser iniciada.
  scene: [PreloadScene, MenuScene, GameScene, GameOverScene]
};

// Cria uma nova instância do jogo Phaser com as configurações definidas acima.
// Isso efetivamente inicia o jogo.
new Phaser.Game(config);
