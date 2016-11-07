// title.js
var title = cc.Layer.extend({
  ctor: function(){
    this._super();
    var size = cc.director.getWinSize();

    titlename = new cc.Sprite(res.title);
    titlename.setPosition(cc.p(size.width * 0.5, size.height * 0.5));
    var title_back_layer = cc.Layer.create();
    title_back_layer.addChild(titlename);
    this.addChild(title_back_layer);
    var label = cc.LabelTTF.create("Touch Start", "Arial", 60);
     label.setPosition(cc.p(size.width * 0.5, size.height * 0.2));
     label.setColor(cc.color(255, 255, 255, 128)); //色だよ！
     this.addChild(label, 1);

    // タップイベントリスナーを登録する
     cc.eventManager.addListener({
         event: cc.EventListener.TOUCH_ONE_BY_ONE,
         swallowTouches: true,
         onTouchBegan: this.onTouchBegan,
         onTouchMoved: this.onTouchMoved,
         onTouchEnded: this.onTouchEnded
     }, this);
     return true;
 },
 onTouchBegan: function(touch, event) {
   return true;
 },
 onTouchMoved: function(touch, event) {},
 onTouchEnded: function(touch, event) {
     //return true;
     cc.director.runScene(new gameScene());
  },
});



var titleSence = cc.Scene.extend({
  onEnter: function(){
    this._super();

    var sparkle = new sparkleLayer();
    this.addChild(sparkle);

    var titlelayer = new title();
    this.addChild(titlelayer);
  }
});
