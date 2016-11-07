var size;
//1:地面　2:ブロック　3:プレイヤ　4:ゾンビ 5:こうもり
var level = [
   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
   [0, 0, 0, 0, 0, 0, 0, 5, 0, 0],
   [0, 0, 0, 0, 0, 0, 0, 2, 2, 2],
   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
   [0, 0, 0, 2, 2, 2, 0, 0, 0, 0],
   [0, 0, 0, 0, 3, 0, 0, 0, 4, 0],
   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];
var tileSize = 96;
var playerPosition; //マップ内のプレイやの位置(ｘ、ｙ)を保持する
var playerSprite; //プレイヤーのスプライト
var leftBtn; //左ボタン
var rightBtn; //右ボタン
var jumpBtn; //ジャンプ
var winSize;
var curtain;
var score = 0;

var gameScene = cc.Scene.extend({
   onEnter: function() {
      this._super();

      winSize = cc.director.getWinSize();

      var background = new backgroundLayer();
      this.addChild(background);
      var level = new levelLayer();
      this.addChild(level);
      var player = new playerLayer();
      this.addChild(player);
      var enemys = new enemyLayer();
      this.addChild(enemys);
      var enemys2 = new enemy2Layer();
      this.addChild(enemys2);
      var enemys3 = new enemy3Layer();
      this.addChild(enemys3);

      var panels = new panelsLayer();
      this.addChild(panels);
      var coin = new coinLayer();
      this.addChild(coin);

      var sparkle = new sparkleLayer();
      this.addChild(sparkle);
    }
});


var backgroundLayer = cc.Layer.extend({
   ctor: function() {
      this._super();

      var backgroundSprite = cc.Sprite.create(res.background_b);
      var size = backgroundSprite.getContentSize();
      //console.log(size);
      this.addChild(backgroundSprite);
      //console.log(winSize.width,winSize.height);
      backgroundSprite.setPosition(winSize.width / 2, winSize.height / 2);
      //背景画像を画面の大きさに合わせるためのScaling処理
      backgroundSprite.setScale(winSize.width / size.width, winSize.height / size.height);

      var bg_light_shafts = cc.Sprite.create(res.background_l_s);
      var size = bg_light_shafts.getContentSize();
      this.addChild(bg_light_shafts);
      bg_light_shafts.setPosition(winSize.width / 2, winSize.height / 2);
      bg_light_shafts.setScale(winSize.width / size.width, winSize.height / size.height);
/*      //120秒の間に50回点滅させる
      var tenmetsu = cc.Blink.create(120,50);
      bg_light_shafts.runAction(cc.Sequence.create(tenmetsu));
*/
    /*  // フェードアウトさせ・・・・たい
      var fadeout = cc.FadeOut.create(3);
      bg_light_shafts.sprite.runAction(cc.Sequence.create(fadeout));
*/

      // カーテン
      curtain = cc.Sprite.create(res.curtain);
      this.addChild(curtain);
      curtain.setPosition(winSize.width / 10, winSize.height / 1.89);
      curtain.setScale(1.1);
      curtain.setScale(winSize.width / size.width, winSize.height / size.height);
   var curtain1 = cc.Sprite.create(res.curtain);
      this.addChild(curtain1);
      curtain1.setPosition(winSize.width / 1.1, winSize.height / 1.89);
      curtain1.setFlippedX(true);
      curtain1.setScale(1.1);
      curtain1.setScale(winSize.width / size.width, winSize.height / size.height);


   }

});
var levelLayer = cc.Layer.extend({
   ctor: function() {
      this._super();
      var size = cc.director.getWinSize();
      for (i = 0; i < 7; i++) {　　　　　　
         for (j = 0; j < 10; j++) {
            switch (level[i][j]) {
               case 1:
                  var groundSprite = cc.Sprite.create(res.background_f);
                  groundSprite.setPosition(winSize.width / 2, winSize.height / 5);
                  this.addChild(groundSprite);
                  break;
               case 2:
                  var blockSprite = cc.Sprite.create(res.block);
                  blockSprite.setPosition(tileSize / 2 + tileSize * j, 96 * (7 - i) - tileSize / 2);
                  this.addChild(blockSprite);
                  break;
            }
         }
      }
   }
});


var player;
var playerLayer = cc.Layer.extend({
   ctor: function() {
      this._super();
      player = new Player();
      this.addChild(player);
      //ショッピングカートを操作するレイヤー

      //左ボタン
      leftBtn = cc.Sprite.create(res.leftbutton_png);
      this.addChild(leftBtn, 0);
      leftBtn.setPosition(60, 40);
      leftBtn.setOpacity(128);
      leftBtn.setTag(1);
      //右ボタン
      rightBtn = cc.Sprite.create(res.rightbutton_png);
      this.addChild(rightBtn, 0);
      rightBtn.setPosition(150, 40);
      rightBtn.setOpacity(128);
      rightBtn.setTag(2);

      //ジャンプボタン
      jumpBtn = cc.Sprite.create(res.rightbutton_png);
      jumpBtn.setRotation(-90);
      this.addChild(jumpBtn, 0);
      jumpBtn.setPosition(winSize.width - 60, 40);
      jumpBtn.setOpacity(128);
      jumpBtn.setTag(3);


      cc.eventManager.addListener(listener, leftBtn);
      cc.eventManager.addListener(listener.clone(), rightBtn);
      cc.eventManager.addListener(listener.clone(), jumpBtn);

      cc.eventManager.addListener(keylistener, this);

   }

});


var Player = cc.Sprite.extend({
   ctor: function() {
      this._super();
      this.workingFlag = false;
      this.xSpeed = 0;
      this.ySpeed = 0;
      this.jumpFlag = false;
      for (i = 0; i < 7; i++) {　　　　　　
         for (j = 0; j < 10; j++) {
            if (level[i][j] == 3) {
               this.setPosition(tileSize / 2 + tileSize * j, 96 * (7 - i) - tileSize / 2);
               playerPosition = {
                  x: j,
                  y: i
               };
            }
         }
      }
      //this.schedule(this.working,0.08);
/*
        // 2.　SpriteFrame　を利用しての歩行アニメーション
          //スプライトフレームを格納する配列
          var animationframe = [];
          //スプライトフレームを作成
          var frame1 = new cc.SpriteFrame(res.sir, cc.rect(0, 0, 96, 96));
          var frame2 = new cc.SpriteFrame(res.sir, cc.rect(0, 0, 96, 96));
          //スプライトフレームを配列に登録
          animationframe.push(frame1);
          animationframe.push(frame2);
          //スプライトフレームの配列を連続再生するアニメーションの定義
          var animation = new cc.Animation(animationframe, 0.08);
          //永久ループのアクションを定義
          var action = new cc.RepeatForever(new cc.animate(animation));
          //実行
          this.runAction(action);
*/
      /*
          //３．テクスチャーからスプライトフレームを切り出す方法
              //スプライトフレームを格納する配列
              var texture = cc.textureCache.addImage(res.player_sheet);
              //スプライトフレームを作成
              var frame1 = new cc.SpriteFrame.createWithTexture(texture, cc.rect(0, 0, 96, 96));
              var frame2 = new cc.SpriteFrame.createWithTexture(texture, cc.rect(96, 0, 96, 96));
              //スプライトフレームを配列に登録
              var animationframe = [];
              animationframe.push(frame1);
              animationframe.push(frame2);
              //スプライトフレームの配列を連続再生するアニメーションの定義
              var animation = new cc.Animation(animationframe, 0.08);
              //永久ループのアクションを定義
              var action = new cc.RepeatForever(new cc.animate(animation));
              //実行
              this.runAction(action);
      */


      // スプライトシートをキャッシュに登録
      cc.spriteFrameCache.addSpriteFrames(res.sir_pl, res.sir_awesome_frames);

      // スプライトフレームを取得 player01,player02はplistの中で定義されいいる
      var frame1 = cc.spriteFrameCache.getSpriteFrame("player01");
      var frame2 = cc.spriteFrameCache.getSpriteFrame("player02");
      var frame3 = cc.spriteFrameCache.getSpriteFrame("player03");
      var frame4 = cc.spriteFrameCache.getSpriteFrame("player04");

      //スプライトフレームを配列に登録
      var animationframe = [];
      animationframe.push(frame1);
      animationframe.push(frame2);
      animationframe.push(frame3);
      animationframe.push(frame4);
      //スプライトフレームの配列を連続再生するアニメーションの定義
      var animation = new cc.Animation(animationframe, 0.08);
      //永久ループのアクションを定義
      var action = new cc.RepeatForever(new cc.animate(animation));
      //実行
      this.initWithFile(res.player_sheet);
      this.runAction(action);

      this.scheduleUpdate();

   },


   //移動のため
   update: function(dt) {
      console.log(this.jumpFlag, this.ySpeed);

      if (this.xSpeed > 0) { //スピードが正の値（右方向移動）
         //　向きを判定させる
         this.setFlippedX(false);
      }
      if (this.xSpeed < 0) { //スピードが負の値（左方向移動）
         this.setFlippedX(true);
      }
      //プレイヤーを降下させる処理　ジャンプボタンが押されてないときで、プレイヤが空中にある場合
      if (this.jumpFlag == false) {
         if (this.getPosition().y < tileSize * 1.6) this.ySpeed = 0;
         else this.ySpeed = this.ySpeed - 0.5;

      }
      //位置を更新する
      this.setPosition(this.getPosition().x + this.xSpeed, this.getPosition().y + this.ySpeed);

   }

});
var panelsLayer = cc.Layer.extend({
  ctor: function() {
     this._super();

     panel = cc.Sprite.create(res.ui_panels);
     var size = panel.getContentSize();
     this.addChild(panel);
     panel.setPosition(winSize.width / 2, winSize.height / 1.05);
     panel.setScale(0.65);

/*    s_coin = cc.LabelTTF.create(score ,"Stencil Std","20",cc.TEXT_ALIGNMENT_CENTER);
    s_coin.setScale(3);
    var size = s_coin.getContentSize()
    this.addChild(s_coin);
    s_coin.setPosition(cc.p(size.width / 2, size.height / 2));
    */
   }
});

//タッチリスナーの実装
var listener = cc.EventListener.create({
   event: cc.EventListener.TOUCH_ONE_BY_ONE,
   // swallowTouches: true,

   onTouchBegan: function(touch, event) {
      var target = event.getCurrentTarget();
      var location = target.convertToNodeSpace(touch.getLocation());
      var spriteSize = target.getContentSize();
      var spriteRect = cc.rect(0, 0, spriteSize.width, spriteSize.height);
      //タッチした場所が、スプライトの内部に収まっていたら
      if (cc.rectContainsPoint(spriteRect, location)) {
         console.log(target.getTag() + "Btnがタッチされました");

         //タッチしたスプライトが左ボタンだったら
         if (target.getTag()　 == 1) {
            player.xSpeed = -2.5;
            leftBtn.setOpacity(255);
            rightBtn.setOpacity(128);
         } else {
            //タッチしたスプライトが右ボタンだったら
            if (target.getTag()　 == 2) {
               player.xSpeed = 2.5;
               rightBtn.setOpacity(255);
               leftBtn.setOpacity(128);
            }
         }
         //タッチしたスプライトがジャンプボタンだったら
         if (target.getTag()　 == 3) {
            if (player.jumpFlag == false && player.ySpeed == 0) player.ySpeed = 9;
            player.jumpFlag = true;
            jumpBtn.setOpacity(255);
         }
      }
      return true;
   },
   //タッチを止めたときは、移動スピードを0にする
   onTouchEnded: function(touch, event) {
      player.jumpFlag = false;
      player.xSpeed = 0;
      //player.ySpeed = 0;
      leftBtn.setOpacity(128);
      rightBtn.setOpacity(128);
      jumpBtn.setOpacity(128);
   }

});

//キーボードリスナーの実装
var keylistener = cc.EventListener.create({
   event: cc.EventListener.KEYBOARD,
   // swallowTouches: true,

   onKeyPressed: function(keyCode, event) {
      if (keyCode == 65) { // a-Keyで左に移動
         player.xSpeed = -2.5;
         leftBtn.setOpacity(255);
         rightBtn.setOpacity(128);
      }
      if (keyCode == 68) { // d-Keyで左に移動
         player.xSpeed = 2.5;
         rightBtn.setOpacity(255);
         leftBtn.setOpacity(128);
      }
      if (keyCode == 32 || keycode == 38) { // スペースキーか上矢印キーでジャンプ
         if (player.jumpFlag == false && player.ySpeed == 0) player.ySpeed = 9;
         player.jumpFlag = true;
         jumpBtn.setOpacity(255);
      }
      return true;
   },
   onKeyReleased: function(keyCode, event) {
      player.jumpFlag = false;
      player.xSpeed = 0;
      //player.ySpeed = 0;
      leftBtn.setOpacity(128);
      rightBtn.setOpacity(128);
      jumpBtn.setOpacity(128);
   },

});
